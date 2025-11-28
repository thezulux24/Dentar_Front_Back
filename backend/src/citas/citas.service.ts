import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { DateHelper } from 'src/common/utils/date.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindCitasByPacienteDto } from './dto/find-citas-paciente.dto';
import { PAGINATION_MAX_PAGE_SIZE } from 'src/common/config/constants';
import { buildResponse } from 'src/common/utils/response.util';
import { renamePagination } from 'src/common/utils/rename-pagination.util';
import { FindCitasDto } from './dto/find-citas.dto';
import { UpdateCitaPacienteDto } from './dto/update-cita-paciente.dto';

@Injectable()
export class CitasService {
  constructor(private prisma: PrismaService) {}

  async create(createCitaDto: CreateCitaDto) {
    // return 'This action adds a new cita';

    const fecha = DateHelper.toUTCFromDateAndTime(createCitaDto.fecha_cita, "00:00");

    const horaInicio = DateHelper.toUTCFromDateAndTime(createCitaDto.fecha_cita, createCitaDto.hora_inicio_cita);
    const horaFin = DateHelper.toUTCFromDateAndTime(createCitaDto.fecha_cita, createCitaDto.hora_fin_cita);

    // 1. validar existencia de paciente (si está presentes)
    if (createCitaDto.id_paciente) {
      const paciente = await this.prisma.pacientes.findUnique({
        where: { id_usuario: createCitaDto.id_paciente },
        select: { id_usuario: true },
      });

      if (!paciente) {
        throw new NotFoundException('El paciente no existe');
      }
    } else {
      throw new BadRequestException('El id del paciente es obligatorio');
    }

    // 2. validar existencia de odontólogo (si está presentes)
    if (createCitaDto.id_odontologo) {
      const odontologo = await this.prisma.odontologos.findUnique({
        where: { id_usuario: createCitaDto.id_odontologo },
        select: { id_usuario: true },
      });
      if (!odontologo) {
        throw new ConflictException('El odontรณlogo no existe');
      }
    } 
    // else {
    //   throw new BadRequestException('El id del odontólogo es obligatorio');
    // }

    // 3. validar existencia de auxiliar (si está presentes)
    if (createCitaDto.id_auxiliar) {
      const auxiliar = await this.prisma.auxiliares.findUnique({
        where: { id_usuario: createCitaDto.id_auxiliar },  
        select: { id_usuario: true },
      });
      if (!auxiliar) {
        throw new ConflictException('El auxiliar no existe');
      } 
    }

    // 4. Validar que la hora de fin sea mayor que la de inicio
    if (horaFin <= horaInicio) {
      throw new BadRequestException('La hora de fin debe ser mayor que la hora de inicio');
    }

    // 5. Validar que la cita no se programe en el pasado
    const ahora = DateHelper.nowUTC();

    // Normalizar a "inicio de cita UTC"
    const hoyUTC = new Date(Date.UTC(
      ahora.getUTCFullYear(),
      ahora.getUTCMonth(),
      ahora.getUTCDate()
    ));

    const fechaUTC = new Date(Date.UTC(
      fecha.getUTCFullYear(),
      fecha.getUTCMonth(),
      fecha.getUTCDate()
    ));

    if (fechaUTC < hoyUTC) {
      throw new BadRequestException('La fecha de la cita no puede ser en el pasado');
    }
    if (fecha.toDateString() === ahora.toDateString() && horaInicio <= ahora) {
      throw new BadRequestException('La hora de inicio de la cita no puede ser en el pasado');
    }

    // 6. Validar solapamiento para el odonntólogo (si está presente)
    if (createCitaDto.id_odontologo) {
      const citaSolapadaDoctor = await this.prisma.citas.findFirst({
        select: { id_cita: true },
        where: {
          id_odontologo: createCitaDto.id_odontologo,
          fecha_cita: fecha,
          OR: [
            // Doctor: Nueva cita comienza durante una existente
            { hora_inicio_cita: { lt: horaFin }, hora_fin_cita: { gt: horaInicio } }
          ]
        }
      });

      if (citaSolapadaDoctor) {
        throw new ConflictException('El doctor ya tiene una cita programada en este horario');
      }
    }

    // 7. Validar solapamiento para el paciente (si está presente)
    if (createCitaDto.id_paciente) {
      const citaSolapadaPaciente = await this.prisma.citas.findFirst({
        select: { id_cita: true },
        where: {
          id_paciente: createCitaDto.id_paciente,
          fecha_cita: fecha,
          OR: [
            // Paciente: Nueva cita comienza durante una existente
            { hora_inicio_cita: { lt: horaFin }, hora_fin_cita: { gt: horaInicio } }
          ]
        }
      });

      if (citaSolapadaPaciente) {
        throw new ConflictException('El paciente ya tiene una cita programada en este horario');
      }
    }

    // 8. Obtener id del parámetro "Pendiente" dentro del tipo "estado_de_cita"
    const parametroRol = await this.prisma.parametros.findFirst({
      where: {
        nombre: 'Pendiente',
        tipos_parametros: {
          nombre: 'estado_de_cita',
        },
      }
    });

    if (!parametroRol) {
      throw new Error('No se encontró el parámetro de estado de cita para "Pendiente"');
    }

    // 8. Crear cita
    const cita = await this.prisma.citas.create({
      data: {
        id_paciente: createCitaDto.id_paciente,
        id_odontologo: createCitaDto.id_odontologo,
        id_auxiliar: createCitaDto.id_auxiliar,
        fecha_cita: fecha,
        hora_inicio_cita: horaInicio,
        hora_fin_cita: horaFin,
        motivo: createCitaDto.motivo,
        observaciones: createCitaDto.observaciones,
        id_parametro_estado_cita: parametroRol.id_parametro
      },
    });

    return buildResponse(true, 'Cita creada exitosamente', { id_cita: cita.id_cita });
  }

  async findAll(query: FindCitasDto) {
    const {
      fecha_inicio,
      fecha_fin,
      id_odontologo,
      id_paciente,
      id_auxiliar,
      id_tratamiento,
      id_parametro_estado_cita,
      pagina = 1,
      cantidad_por_pagina = 10,
    } = query;

    const pageSize = Math.min(cantidad_por_pagina, PAGINATION_MAX_PAGE_SIZE);
    const skip = (pagina - 1) * pageSize;

    const whereClause: any = {
      eliminado: -1,
    };

    if (id_odontologo) {
      whereClause.id_odontologo = id_odontologo;
    }

    if (id_paciente) {
      whereClause.id_paciente = id_paciente;
    }

    if (id_auxiliar) {
      whereClause.id_auxiliar = id_auxiliar;
    }

    if (id_tratamiento) {
      whereClause.id_tratamiento = id_tratamiento;
    }

    if (id_parametro_estado_cita) {
      whereClause.id_parametro_estado_cita = id_parametro_estado_cita;
    }

    if (fecha_inicio && fecha_fin) {
      const fechaInicio = DateHelper.toUTCFromISO(fecha_inicio);
      const fechaFin = DateHelper.toUTCFromISO(fecha_fin);

      if (fechaFin <= fechaInicio) {
        throw new BadRequestException('La fecha de fin debe ser mayor que la fecha de inicio');
      }

      whereClause.AND = [
        { hora_inicio_cita: { gte: fechaInicio.toISOString() } },
        { hora_fin_cita: { lte: fechaFin.toISOString() } },
      ];
    }

    const [citas, total] = await this.prisma.$transaction([
      this.prisma.citas.findMany({
        where: whereClause,
        select: {
          id_cita: true,
          fecha_cita: true,
          hora_inicio_cita: true,
          hora_fin_cita: true,
          motivo: true,
          observaciones: true,
          id_parametro_estado_cita: true,
          odontologos: {
            select: {
              usuarios: {
                select: {
                  id_usuario: true,
                  nombres: true,
                  apellidos: true,
                  avatar_url: true
                },
              },
            },
          },
          pacientes: {
            select: {
              usuarios: {
                select: {
                  id_usuario: true,
                  nombres: true,
                  apellidos: true,
                  avatar_url: true,
                  telefono: true,
                },
              },
            },
          },
          tratamientos_usuarios:{
            select: {
              id_tratamiento: true,
              tratamiento:{
                  select:{
                    id_tratamiento: true,
                    nombre_tratamiento:true
                }
              }
            }
          },
          estado: {
            select: { nombre: true },
          },
        },
        skip: skip,
        take: pageSize,
        orderBy: {
          hora_inicio_cita: 'asc',
        },
      }),
      this.prisma.citas.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      citas: citas.map(c => {
        const doctor = c.odontologos?.usuarios;
        const nombreDoctor = doctor ? `${doctor.nombres} ${doctor.apellidos}` : 'No asignado';
        const paciente = c.pacientes?.usuarios;
        const nombrePaciente = paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'No asignado';
        const nombreTratamiento = c.tratamientos_usuarios?.tratamiento?.nombre_tratamiento ? c.tratamientos_usuarios?.tratamiento?.nombre_tratamiento : null;

        return {
          id_cita: c.id_cita,
          id_paciente: paciente?.id_usuario,
          id_doctor: doctor?.id_usuario,
          nombre_doctor: nombreDoctor,
          avatar_doctor: doctor?.avatar_url,
          nombre_paciente: nombrePaciente,
          avatar_paciente: paciente?.avatar_url,
          telefono_paciente: paciente?.telefono,
          nombre_tratamiento: nombreTratamiento,
          fecha: c.fecha_cita ? DateHelper.toTimezone(c.fecha_cita).toISODate() : null,
          hora_inicio: c.hora_inicio_cita ? DateHelper.toTimezone(c.hora_inicio_cita).toFormat('HH:mm:ss') : null,
          hora_fin: c.hora_fin_cita ? DateHelper.toTimezone(c.hora_fin_cita).toFormat('HH:mm:ss') : null,
          motivo: c.motivo,
          observaciones: c.observaciones,
          estado: c.estado?.nombre,
          id_parametro_estado_cita: c.id_parametro_estado_cita,
        };
      }),
      ...renamePagination({
        total,
        totalPages,
        pageSize,
        currentPage: pagina,
      }),
    };
  }

  async findAllByPaciente(id_paciente: number, query: FindCitasByPacienteDto) {
    const { fecha_inicio, fecha_fin, pagina = 1, cantidad_por_pagina = 10 } = query;

    const fechaInicio = DateHelper.toUTCFromISO(fecha_inicio);
    const fechaFin = DateHelper.toUTCFromISO(fecha_fin);

    if (fechaFin <= fechaInicio) {
      throw new BadRequestException('La fecha de fin debe ser mayor que la fecha de inicio');
    }

    const pageSize = Math.min(cantidad_por_pagina, PAGINATION_MAX_PAGE_SIZE);
    const skip = (pagina - 1) * pageSize;

    const whereClause = {
      id_paciente: String(id_paciente),
      // citas que inician o terminan dentro del rango
      AND: [
        {
          hora_inicio_cita: { gte: fechaInicio.toISOString() },
        },
        {
          hora_fin_cita: { lte: fechaFin.toISOString() },
        },
        { eliminado: -1}
      ],
    };

    const [citas, total] = await this.prisma.$transaction([
      this.prisma.citas.findMany({
        where: whereClause,
        select: {
          id_cita: true,
          fecha_cita: true,
          hora_inicio_cita: true,
          hora_fin_cita: true,
          motivo: true,
          observaciones:true,
          id_parametro_estado_cita: true,
          odontologos: {
            select: {
              usuarios: {
                select: {
                  nombres: true,
                  apellidos: true,
                  avatar_url: true
                }
              },
            },
          },
          tratamientos_usuarios:{
            select: {
              id_tratamiento: true,
              tratamiento:{
                  select:{
                    id_tratamiento: true,
                    nombre_tratamiento:true
                }
              }
            }
          },
          estado: {
            select: { nombre: true }
          }
        },
        skip: skip,
        take: pageSize,
        orderBy: {
          hora_inicio_cita: 'asc',
        },
      }),
      this.prisma.citas.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      citas: citas.map(c => {
        const doctor = c.odontologos?.usuarios;
        const nombreDoctor = doctor ? `${doctor.nombres} ${doctor.apellidos}` : 'No asignado';
        const nombreTratamiento = c.tratamientos_usuarios?.tratamiento?.nombre_tratamiento ? c.tratamientos_usuarios?.tratamiento?.nombre_tratamiento : null;

        return {
          id_cita: c.id_cita,
          nombre_doctor: nombreDoctor,
          nombre_tratamiento: nombreTratamiento,
          avatar_doctor: doctor?.avatar_url,
          fecha: c.fecha_cita ? DateHelper.toTimezone(c.fecha_cita).toISODate() : null,
          hora_inicio: c.hora_inicio_cita ? DateHelper.toTimezone(c.hora_inicio_cita).toFormat('HH:mm:ss') : null,
          hora_fin: c.hora_fin_cita ? DateHelper.toTimezone(c.hora_fin_cita).toFormat('HH:mm:ss') : null,
          motivo: c.motivo,
          observaciones: c.observaciones,
          estado: c.estado?.nombre,
          id_parametro_estado_cita: c.id_parametro_estado_cita,
        }
      }),
       ...renamePagination({
        total,
        totalPages,
        pageSize,
        currentPage: pagina,
      }),
    };
  }

  async findOne(id_cita: string) {
    const cita = await this.prisma.citas.findUnique({
      where: { id_cita },
      select: {
        id_cita: true,
        fecha_cita: true,
        hora_inicio_cita: true,
        hora_fin_cita: true,
        motivo: true,
        observaciones: true,
        pacientes: {
          select: {
            usuarios: {
              select: {
                nombres: true,
                apellidos: true,
                avatar_url: true
              }
            },
          },
        },
        odontologos: {
          select: {
            usuarios: {
              select: {
                nombres: true,
                apellidos: true,
                avatar_url: true
              }
            },
          },
        },
        tratamientos_usuarios:{
            select: {
              id_tratamiento: true,
              tratamiento:{
                  select:{
                    id_tratamiento: true,
                    nombre_tratamiento:true
                }
              }
            }
          },
        estado: {
          select: { nombre: true }
        }
      }
    });

    if (!cita) {
      throw new NotFoundException('La cita no existe');
    }

    const doctor = cita.odontologos?.usuarios;
    const nombreDoctor = doctor ? `${doctor.nombres} ${doctor.apellidos}` : 'No asignado';

    const paciente = cita.pacientes?.usuarios;
    const nombrePaciente = paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'No asignado';

    const nombreTratamiento = cita.tratamientos_usuarios?.tratamiento?.nombre_tratamiento ? cita.tratamientos_usuarios?.tratamiento?.nombre_tratamiento : null;

    const data = {
      id_cita: cita.id_cita,
      nombre_doctor: nombreDoctor,
      avatar_doctor: doctor?.avatar_url,
      nombrePaciente: nombrePaciente,
      avatar_paciente: paciente?.avatar_url,
      nombre_tratamiento: nombreTratamiento,
      fecha: cita.fecha_cita ? DateHelper.toTimezone(cita.fecha_cita).toISODate() : null,
      hora_inicio: cita.hora_inicio_cita ? DateHelper.toTimezone(cita.hora_inicio_cita).toFormat('HH:mm:ss') : null,
      hora_fin: cita.hora_fin_cita ? DateHelper.toTimezone(cita.hora_fin_cita).toFormat('HH:mm:ss') : null,
      motivo: cita.motivo,
      observaciones: cita.observaciones,
      estado: cita.estado?.nombre
    }


    return buildResponse(
      true,
      'Cita encontrada exitosamente',
      data
    );
  }

  async update(id_cita: string, updateCitaDto: UpdateCitaDto) {
    const citaExistente = await this.prisma.citas.findUnique({
      where: { id_cita },
    });

    if (!citaExistente) {
      throw new NotFoundException('La cita no existe');
    }

    const dataToUpdate: any = {};

    // Validar existencia del paciente si se envía
    if (updateCitaDto.id_paciente && updateCitaDto.id_paciente !== citaExistente.id_paciente) {
      const paciente = await this.prisma.pacientes.findUnique({
        select: { id_usuario: true },
        where: { id_usuario: updateCitaDto.id_paciente },
      });
      if (!paciente) {
        throw new NotFoundException('El paciente no existe');
      }
      dataToUpdate.id_paciente = updateCitaDto.id_paciente;
    }

    // Validar existencia del odonólogo si se envía
    if (updateCitaDto.id_odontologo && updateCitaDto.id_odontologo !== citaExistente.id_odontologo) {
      const odontologo = await this.prisma.odontologos.findUnique({
        select: { id_usuario: true },
        where: { id_usuario: updateCitaDto.id_odontologo },
      });
      if (!odontologo) {
        throw new NotFoundException('El odontólogo no existe');
      }
      dataToUpdate.id_odontologo = updateCitaDto.id_odontologo;
    }

    // Validar existencia del auxiliar si se envía
    if (updateCitaDto.id_auxiliar && updateCitaDto.id_auxiliar !== citaExistente.id_auxiliar) {
      const auxiliar = await this.prisma.auxiliares.findUnique({
        select: { id_usuario: true },
        where: { id_usuario: updateCitaDto.id_auxiliar },
      });
      if (!auxiliar) {
        throw new NotFoundException('El auxiliar no existe');
      }
      dataToUpdate.id_auxiliar = updateCitaDto.id_auxiliar;
    }

    // Validar existencia del fechas si se envían
    const fecha = updateCitaDto.fecha_cita ? 
      DateHelper.toUTCFromDateAndTime(updateCitaDto.fecha_cita, "00:00")
      : 
      citaExistente.fecha_cita

    let horaInicio = citaExistente.hora_inicio_cita
    let horaFin = citaExistente.hora_fin_cita
    
    // Validar y crear hora de inicio
    if (fecha && updateCitaDto.hora_inicio_cita){
      horaInicio = DateHelper.toUTCFromDateAndTime(fecha.toISOString().split('T')[0], updateCitaDto.hora_inicio_cita);
    }

    // Validar y crear hora de fin
    if (fecha && updateCitaDto.hora_fin_cita) {
      horaFin = DateHelper.toUTCFromDateAndTime(fecha.toISOString().split('T')[0], updateCitaDto.hora_fin_cita);
    }

    if( fecha && horaInicio && horaFin ) {
      // Validar que la hora de fin sea mayor que la de inicio
      if (horaInicio && horaFin && horaFin <= horaInicio) {
        throw new BadRequestException('La hora de fin debe ser mayor que la hora de inicio');
      }

      // Validar que la cita no se programe en el pasado
      const ahora = DateHelper.nowUTC();

      // Normalizar a "inicio de dรญa UTC"
      const hoyUTC = new Date(Date.UTC(
        ahora.getUTCFullYear(),
        ahora.getUTCMonth(),
        ahora.getUTCDate()
      ));

      const fechaUTC = new Date(Date.UTC(
        fecha.getUTCFullYear(),
        fecha.getUTCMonth(),
        fecha.getUTCDate()
      ));

      if (fechaUTC < hoyUTC) {
        throw new BadRequestException('La fecha de la cita no puede ser en el pasado');
      }
      if (fecha.toDateString() === ahora.toDateString() && horaInicio <= ahora) {
        throw new BadRequestException('La hora de inicio de la cita no puede ser en el pasado');
      }

      // Asignar fechas para actualizar
      dataToUpdate.fecha_cita = fecha;
      dataToUpdate.hora_inicio_cita = horaInicio;
      dataToUpdate.hora_fin_cita = horaFin;
    }

    const idOdontologo = dataToUpdate.id_odontologo || citaExistente.id_odontologo;
    const idPaciente = dataToUpdate.id_paciente || citaExistente.id_paciente;

    // Validar solapamiento para el odonntólogo (si está presente)
    if (idOdontologo && horaInicio && horaFin) {
      const citaSolapadaDoctor = await this.prisma.citas.findFirst({
        select: { id_cita: true },
        where: {
          id_odontologo: idOdontologo,
          fecha_cita: fecha,
          id_cita: { not: id_cita },
          OR: [{ hora_inicio_cita: { lt: horaFin }, hora_fin_cita: { gt: horaInicio } }],
        },
      });

      if (citaSolapadaDoctor) {
        throw new ConflictException('El doctor ya tiene una cita programada en este horario');
      }
    }
    
    // Validar solapamiento para el paciente (si está presente)
    if (idPaciente && horaInicio && horaFin) {
      const citaSolapadaPaciente = await this.prisma.citas.findFirst({
        select: { id_cita: true },
        where: {
          id_paciente: idPaciente,
          fecha_cita: fecha,
          id_cita: { not: id_cita },
          OR: [{ hora_inicio_cita: { lt: horaFin }, hora_fin_cita: { gt: horaInicio } }],
        },
      });

      if (citaSolapadaPaciente) {
        throw new ConflictException('El paciente ya tiene una cita programada en este horario');
      }
    }

    if (updateCitaDto.motivo) {
      dataToUpdate.motivo = updateCitaDto.motivo;
    }
    if (updateCitaDto.observaciones) {
      dataToUpdate.observaciones = updateCitaDto.observaciones;
    }

    // Validar parametro de estado de cita
    if (updateCitaDto.id_parametro_estado_cita) {
      const parametroEstadoCita = await this.prisma.parametros.findFirst({
        select: { id_parametro: true }, 
        where: {
          id_parametro: updateCitaDto.id_parametro_estado_cita,
          tipos_parametros: {
            nombre: 'estado_de_cita',
          },
        }
      });

      if (!parametroEstadoCita) {
        throw new NotFoundException('No se encontró el parámetro de estado de cita');
      }
      dataToUpdate.id_parametro_estado_cita = updateCitaDto.id_parametro_estado_cita;
    }

    // Se agrega fecha de actualización
    dataToUpdate.fecha_actualizacion = DateHelper.nowUTC();

    // Actualizar cita
    await this.prisma.citas.update({
      where: { id_cita },
      data: dataToUpdate,
    });

    return buildResponse(
      true, 
      'Cita actualizada exitosamente', 
      { id_cita: id_cita }
    );
  }

  async updateByPaciente(id_cita: string, id_paciente: string, updateCitaDto: UpdateCitaPacienteDto) {

    // Validar existencia de la cita y su pertenencia al paciente
    const citaExistente = await this.prisma.citas.findUnique({
      select: { 
        id_cita: true,
        fecha_cita: true,
        hora_inicio_cita: true,
        hora_fin_cita: true,
        id_odontologo: true,
        id_paciente: true,
        estado: {
          select: { nombre: true }
        }
      },
      where: { 
        id_cita,
        id_paciente
      },
    });


    if (!citaExistente) {
      throw new NotFoundException('La cita no existe');
    }

    // Validar que la cita no esté cancelada
    if (citaExistente.estado?.nombre == "Cancelada") {
      throw new NotFoundException('La cita ya ha sido cancelada');
    }

    const dataToUpdate: any = {};

    // Validar existencia del fechas si se envían
    const fecha = updateCitaDto.fecha_cita ? 
      DateHelper.toUTCFromDateAndTime(updateCitaDto.fecha_cita, "00:00")
      : 
      citaExistente.fecha_cita

    let horaInicio = citaExistente.hora_inicio_cita
    let horaFin = citaExistente.hora_fin_cita
    
    // Validar y crear hora de inicio
    if (fecha && updateCitaDto.hora_inicio_cita){
      horaInicio = DateHelper.toUTCFromDateAndTime(fecha.toISOString().split('T')[0], updateCitaDto.hora_inicio_cita);
    }

    // Validar y crear hora de fin
    if (fecha && updateCitaDto.hora_fin_cita) {
      horaFin = DateHelper.toUTCFromDateAndTime(fecha.toISOString().split('T')[0], updateCitaDto.hora_fin_cita);
    }

    if( fecha && horaInicio && horaFin ) {
      // Validar que la hora de fin sea mayor que la de inicio
      if (horaInicio && horaFin && horaFin <= horaInicio) {
        throw new BadRequestException('La hora de fin debe ser mayor que la hora de inicio');
      }

      // Validar que la cita no se programe en el pasado
      const ahora = DateHelper.nowUTC();

      // Normalizar a "inicio de dรญa UTC"
      const hoyUTC = new Date(Date.UTC(
        ahora.getUTCFullYear(),
        ahora.getUTCMonth(),
        ahora.getUTCDate()
      ));

      const fechaUTC = new Date(Date.UTC(
        fecha.getUTCFullYear(),
        fecha.getUTCMonth(),
        fecha.getUTCDate()
      ));

      if (fechaUTC < hoyUTC) {
        throw new BadRequestException('La fecha de la cita no puede ser en el pasado');
      }
      if (fecha.toDateString() === ahora.toDateString() && horaInicio <= ahora) {
        throw new BadRequestException('La hora de inicio de la cita no puede ser en el pasado');
      }

      // Asignar fechas para actualizar
      dataToUpdate.fecha_cita = fecha;
      dataToUpdate.hora_inicio_cita = horaInicio;
      dataToUpdate.hora_fin_cita = horaFin;
    }

    const idOdontologo = dataToUpdate.id_odontologo || citaExistente.id_odontologo;
    const idPaciente = dataToUpdate.id_paciente || citaExistente.id_paciente;

    // Validar solapamiento para el odonntólogo (si está presente)
    if (idOdontologo && horaInicio && horaFin) {
      const citaSolapadaDoctor = await this.prisma.citas.findFirst({
        select: { id_cita: true },
        where: {
          id_odontologo: idOdontologo,
          fecha_cita: fecha,
          id_cita: { not: id_cita },
          OR: [{ hora_inicio_cita: { lt: horaFin }, hora_fin_cita: { gt: horaInicio } }],
        },
      });

      if (citaSolapadaDoctor) {
        throw new ConflictException('El doctor ya tiene una cita programada en este horario');
      }
    }
    
    // Validar solapamiento para el paciente (si está presente)
    if (idPaciente && horaInicio && horaFin) {
      const citaSolapadaPaciente = await this.prisma.citas.findFirst({
        select: { id_cita: true },
        where: {
          id_paciente: idPaciente,
          fecha_cita: fecha,
          id_cita: { not: id_cita },
          OR: [{ hora_inicio_cita: { lt: horaFin }, hora_fin_cita: { gt: horaInicio } }],
        },
      });

      if (citaSolapadaPaciente) {
        throw new ConflictException('El paciente ya tiene una cita programada en este horario');
      }
    }

    if (updateCitaDto.motivo) {
      dataToUpdate.motivo = updateCitaDto.motivo;
    }
    if (updateCitaDto.observaciones) {
      dataToUpdate.observaciones = updateCitaDto.observaciones;
    }

    // Se agrega fecha de actualización
    dataToUpdate.fecha_actualizacion = DateHelper.nowUTC();

    // Actualizar cita
    await this.prisma.citas.update({
      where: { id_cita },
      data: dataToUpdate,
    });

    return buildResponse(
      true, 
      'Cita actualizada exitosamente', 
      { id_cita: id_cita }
    );
  }

  async cancel(id_cita: string) {

    // Validar existencia de la cita y s pertenencia al paciente
    const citaExistente = await this.prisma.citas.findUnique({
      select: { 
        id_cita: true,
        estado: {
          select: { nombre: true }
        }
      },
      where: { 
        id_cita
      },
    });

    if (!citaExistente) {
      throw new NotFoundException('La cita no existe en los registros del paciente');
    }

    // Validar que la cita no esté cancelada
    if (citaExistente.estado?.nombre == "Cancelada") {
      throw new NotFoundException('La cita ya ha sido cancelada');
    }

    const dataToUpdate: any = {};

    // 8. Obtener id del parámetro "Cancelada" dentro del tipo "estado_de_cita"
    const parametroEstadoCita = await this.prisma.parametros.findFirst({
      select: {id_parametro: true},
      where: {
        nombre: 'Cancelada',
        tipos_parametros: {
          nombre: 'estado_de_cita',
        },
      }
    });

    if (!parametroEstadoCita) {
      throw new Error('No se encontró el parámetro de estado de cita para "Cancelada"');
    }

    // Se agrega el parámetro de Cancelado
    dataToUpdate.id_parametro_estado_cita = parametroEstadoCita.id_parametro;

    // Se agrega fecha de actualización
    dataToUpdate.fecha_actualizacion = DateHelper.nowUTC();

    // Actualizar cita
    await this.prisma.citas.update({
      where: { id_cita },
      data: dataToUpdate,
    });

    return buildResponse(
      true, 
      'Cita cancelada exitosamente', 
      { id_cita: id_cita }
    );
  }

  async cancelByPaciente(id_cita: string, id_paciente: string) {

    // Validar existencia de la cita y s pertenencia al paciente
    const citaExistente = await this.prisma.citas.findUnique({
      select: { 
        id_cita: true,
        estado: {
          select: { nombre: true }
        }
      },
      where: { 
        id_cita,
        id_paciente
      },
    });

    if (!citaExistente) {
      throw new NotFoundException('La cita no existe en los registros del paciente');
    }

    // Validar que la cita no esté cancelada
    if (citaExistente.estado?.nombre == "Cancelada") {
      throw new NotFoundException('La cita ya ha sido cancelada');
    }

    const dataToUpdate: any = {};

    // 8. Obtener id del parámetro "Cancelada" dentro del tipo "estado_de_cita"
    const parametroEstadoCita = await this.prisma.parametros.findFirst({
      select: {id_parametro: true},
      where: {
        nombre: 'Cancelada',
        tipos_parametros: {
          nombre: 'estado_de_cita',
        },
      }
    });

    if (!parametroEstadoCita) {
      throw new Error('No se encontró el parámetro de estado de cita para "Cancelada"');
    }

    // Se agrega el parámetro de Cancelado
    dataToUpdate.id_parametro_estado_cita = parametroEstadoCita.id_parametro;

    // Se agrega fecha de actualización
    dataToUpdate.fecha_actualizacion = DateHelper.nowUTC();

    // Actualizar cita
    await this.prisma.citas.update({
      where: { id_cita },
      data: dataToUpdate,
    });

    return buildResponse(
      true, 
      'Cita cancelada exitosamente', 
      { id_cita: id_cita }
    );
  }

  remove(id: number) {
    return `This action removes a #${id} cita`;
  }
}

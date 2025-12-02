import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { FindFacturacionDto } from './dto/find-facturacion.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class FacturacionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtener resumen general de facturación
   */
  async obtenerResumen() {
    // Obtener el parámetro de estado "Completada"
    const estadoCompletada = await this.prisma.parametros.findFirst({
      where: {
        nombre: 'Completada',
        eliminado: -1,
      },
    });

    if (!estadoCompletada) {
      throw new NotFoundException('No se encontró el parámetro de estado "Completada"');
    }

    // Total facturado de citas completadas
    const totalFacturadoCitasResult = await this.prisma.citas.aggregate({
      where: {
        eliminado: -1,
        precio_consulta: { not: null },
        id_parametro_estado_cita: estadoCompletada.id_parametro,
      },
      _sum: {
        precio_consulta: true,
      },
    });

    // Total facturado de tratamientos finalizados
    const tratamientosCompletados = await this.prisma.tratamientos_usuarios.findMany({
      where: {
        eliminado: -1,
        parametros: {
          nombre: 'Finalizado',
          eliminado: -1,
        },
      },
      select: {
        tratamiento: {
          select: {
            precio_estimado: true,
          },
        },
      },
    });

    const totalFacturadoTratamientos = tratamientosCompletados.reduce(
      (sum, tu) => sum + parseFloat(tu.tratamiento.precio_estimado?.toString() || '0'),
      0,
    );

    // Total pagado (suma de todos los pagos)
    const totalPagadoResult = await this.prisma.pagos.aggregate({
      where: {
        eliminado: -1,
      },
      _sum: {
        monto: true,
      },
    });

    const totalFacturadoCitas = totalFacturadoCitasResult._sum.precio_consulta || new Decimal(0);
    const totalFacturado = new Decimal(totalFacturadoCitas).plus(totalFacturadoTratamientos);
    const totalPagado = totalPagadoResult._sum.monto || new Decimal(0);
    const totalPendiente = new Decimal(totalFacturado).minus(totalPagado);

    return {
      totalFacturado: parseFloat(totalFacturado.toString()),
      totalPagado: parseFloat(totalPagado.toString()),
      totalPendiente: parseFloat(totalPendiente.toString()),
    };
  }

  /**
   * Obtener lista de pacientes con información de facturación
   */
  async obtenerPacientesConFacturacion(findDto: FindFacturacionDto) {
    const { busqueda, pagina = 1, limite = 10 } = findDto;

    // Obtener el parámetro de estado "Completada"
    const estadoCompletada = await this.prisma.parametros.findFirst({
      where: {
        nombre: 'Completada',
        eliminado: -1,
      },
    });

    if (!estadoCompletada) {
      throw new NotFoundException('No se encontró el parámetro de estado "Completada"');
    }

    // Construir filtro de búsqueda para usuarios
    const whereClauseUsuario: any = {
      eliminado: -1,
      pacientes: { isNot: null },
    };

    if (busqueda) {
      whereClauseUsuario.OR = [
        { nombres: { contains: busqueda, mode: 'insensitive' } },
        { apellidos: { contains: busqueda, mode: 'insensitive' } },
        { identificacion: { contains: busqueda, mode: 'insensitive' } },
      ];
    }

    // Primero obtenemos todos los usuarios que cumplen el filtro base
    // y luego filtramos los que tienen citas o tratamientos
    const todosUsuarios = await this.prisma.usuarios.findMany({
      where: whereClauseUsuario,
      select: {
        id_usuario: true,
        nombres: true,
        apellidos: true,
        identificacion: true,
        pacientes: {
          select: {
            id_usuario: true,
            citas: {
              where: {
                eliminado: -1,
                precio_consulta: { not: null },
                id_parametro_estado_cita: estadoCompletada.id_parametro,
              },
              select: {
                id_cita: true,
                precio_consulta: true,
                fecha_cita: true,
                pagos: {
                  where: {
                    eliminado: -1,
                  },
                  select: {
                    monto: true,
                  },
                },
              },
              orderBy: {
                fecha_cita: 'desc',
              },
            },
          },
        },
        tratamientos: {
          where: {
            eliminado: -1,
            parametros: {
              nombre: 'Finalizado',
              eliminado: -1,
            },
          },
          select: {
            id_tratamiento_usuario: true,
            fecha_creacion: true,
            tratamiento: {
              select: {
                precio_estimado: true,
              },
            },
            pagos: {
              where: {
                eliminado: -1,
              },
              select: {
                monto: true,
              },
            },
          },
          orderBy: {
            fecha_creacion: 'desc',
          },
        },
      },
      orderBy: {
        apellidos: 'asc',
      },
    });

    // Filtrar usuarios que tengan al menos una cita o tratamiento
    const usuariosConServicios = todosUsuarios.filter(
      (u) => u.pacientes && (u.pacientes.citas.length > 0 || u.tratamientos.length > 0),
    );

    const total = usuariosConServicios.length;

    // Aplicar paginación DESPUÉS del filtro
    const skip = (pagina - 1) * limite;
    const usuariosPaginados = usuariosConServicios.slice(skip, skip + limite);

    // Calcular facturación por paciente
    const pacientesConFacturacion = usuariosPaginados.map((usuario) => {
      const citas = usuario.pacientes!.citas;
      const tratamientos = usuario.tratamientos;
        
        const totalFacturadoCitas = citas.reduce(
          (sum, cita) => sum + parseFloat(cita.precio_consulta?.toString() || '0'),
          0,
        );

        const totalFacturadoTratamientos = tratamientos.reduce(
          (sum, tu) => sum + parseFloat(tu.tratamiento.precio_estimado?.toString() || '0'),
          0,
        );

        const totalFacturado = totalFacturadoCitas + totalFacturadoTratamientos;

        const totalPagado = citas.reduce(
          (sum, cita) =>
            sum +
            cita.pagos.reduce(
              (pagoSum, pago) => pagoSum + parseFloat(pago.monto?.toString() || '0'),
              0,
            ),
          0,
        ) + tratamientos.reduce(
          (sum, tu) =>
            sum +
            tu.pagos.reduce(
              (pagoSum, pago) => pagoSum + parseFloat(pago.monto?.toString() || '0'),
              0,
            ),
          0,
        );

        const saldoPendiente = totalFacturado - totalPagado;
        const ultimaConsulta = citas[0]?.fecha_cita || tratamientos[0]?.fecha_creacion || null;

        return {
          id_paciente: usuario.id_usuario,
          nombre: `${usuario.nombres} ${usuario.apellidos}`,
          identificacion: usuario.identificacion,
          ultimaConsulta,
          totalFacturado,
          totalPagado,
          saldoPendiente,
        };
    });

    return {
      data: pacientesConFacturacion,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  /**
   * Obtener detalle de facturación de un paciente específico
   */
  async obtenerDetalleFacturacionPaciente(id_paciente: string) {
    // Obtener el parámetro de estado "Completada"
    const estadoCompletada = await this.prisma.parametros.findFirst({
      where: {
        nombre: 'Completada',
        eliminado: -1,
      },
    });

    if (!estadoCompletada) {
      throw new NotFoundException('No se encontró el parámetro de estado "Completada"');
    }

    const usuario = await this.prisma.usuarios.findUnique({
      where: {
        id_usuario: id_paciente,
        eliminado: -1,
      },
      select: {
        id_usuario: true,
        nombres: true,
        apellidos: true,
        identificacion: true,
        email_: true,
        telefono: true,
        pacientes: {
          select: {
            citas: {
              where: {
                eliminado: -1,
                precio_consulta: { not: null },
                id_parametro_estado_cita: estadoCompletada.id_parametro,
              },
              select: {
                id_cita: true,
                fecha_cita: true,
                precio_consulta: true,
                motivo: true,
                observaciones: true,
                odontologos: {
                  select: {
                    usuarios: {
                      select: {
                        nombres: true,
                        apellidos: true,
                      },
                    },
                  },
                },
                estado: {
                  select: {
                    id_parametro: true,
                    nombre: true,
                  },
                },
                pagos: {
                  where: {
                    eliminado: -1,
                  },
                  select: {
                    id_pago: true,
                    monto: true,
                    fecha_pago: true,
                    observaciones: true,
                    parametros_pagos_id_parametro_metodo_pagoToparametros: {
                      select: {
                        id_parametro: true,
                        nombre: true,
                      },
                    },
                    parametros_pagos_id_parametro_estado_pagoToparametros: {
                      select: {
                        id_parametro: true,
                        nombre: true,
                      },
                    },
                  },
                  orderBy: {
                    fecha_pago: 'desc',
                  },
                },
              },
              orderBy: {
                fecha_cita: 'desc',
              },
            },
          },
        },
        tratamientos: {
          where: {
            eliminado: -1,
            parametros: {
              nombre: 'Finalizado',
              eliminado: -1,
            },
          },
          select: {
            id_tratamiento_usuario: true,
            fecha_creacion: true,
            fecha_actualizacion: true,
            tratamiento: {
              select: {
                id_tratamiento: true,
                nombre_tratamiento: true,
                descripcion: true,
                precio_estimado: true,
              },
            },
            parametros: {
              select: {
                nombre: true,
              },
            },
            pagos: {
              where: {
                eliminado: -1,
              },
              select: {
                id_pago: true,
                monto: true,
                fecha_pago: true,
                observaciones: true,
                parametros_pagos_id_parametro_metodo_pagoToparametros: {
                  select: {
                    id_parametro: true,
                    nombre: true,
                  },
                },
                parametros_pagos_id_parametro_estado_pagoToparametros: {
                  select: {
                    id_parametro: true,
                    nombre: true,
                  },
                },
              },
              orderBy: {
                fecha_pago: 'desc',
              },
            },
          },
          orderBy: {
            fecha_creacion: 'desc',
          },
        },
      },
    });

    if (!usuario || !usuario.pacientes) {
      throw new NotFoundException(`Paciente con ID ${id_paciente} no encontrado`);
    }

    const citas = usuario.pacientes.citas;
    const tratamientos = usuario.tratamientos;

    // Calcular totales
    const totalFacturadoCitas = citas.reduce(
      (sum, cita) => sum + parseFloat(cita.precio_consulta?.toString() || '0'),
      0,
    );

    const totalFacturadoTratamientos = tratamientos.reduce(
      (sum, tu) => sum + parseFloat(tu.tratamiento.precio_estimado?.toString() || '0'),
      0,
    );

    const totalFacturado = totalFacturadoCitas + totalFacturadoTratamientos;

    const totalPagado = citas.reduce(
      (sum, cita) =>
        sum +
        cita.pagos.reduce((pagoSum, pago) => pagoSum + parseFloat(pago.monto?.toString() || '0'), 0),
      0,
    ) + tratamientos.reduce(
      (sum, tu) =>
        sum +
        tu.pagos.reduce((pagoSum, pago) => pagoSum + parseFloat(pago.monto?.toString() || '0'), 0),
      0,
    );

    const saldoPendiente = totalFacturado - totalPagado;

    // Formatear citas
    const citasFormateadas = citas.map((cita) => {
      const montoCita = parseFloat(cita.precio_consulta?.toString() || '0');
      const pagadoCita = cita.pagos.reduce(
        (sum, pago) => sum + parseFloat(pago.monto?.toString() || '0'),
        0,
      );

      return {
        id_cita: cita.id_cita,
        tipo: 'cita',
        fecha: cita.fecha_cita,
        motivo: cita.motivo,
        observaciones: cita.observaciones,
        odontologo: cita.odontologos
          ? `${cita.odontologos.usuarios.nombres} ${cita.odontologos.usuarios.apellidos}`
          : 'N/A',
        estado: cita.estado?.nombre || 'N/A',
        monto: montoCita,
        pagado: pagadoCita,
        saldo: montoCita - pagadoCita,
        pagos: cita.pagos.map((pago) => ({
          id_pago: pago.id_pago,
          monto: parseFloat(pago.monto?.toString() || '0'),
          fecha: pago.fecha_pago,
          metodo: pago.parametros_pagos_id_parametro_metodo_pagoToparametros?.nombre || 'N/A',
          estado: pago.parametros_pagos_id_parametro_estado_pagoToparametros?.nombre || 'N/A',
          observaciones: pago.observaciones,
        })),
      };
    });

    // Formatear tratamientos
    const tratamientosFormateados = tratamientos.map((tu) => {
      const montoTratamiento = parseFloat(tu.tratamiento.precio_estimado?.toString() || '0');
      const pagadoTratamiento = tu.pagos.reduce(
        (sum, pago) => sum + parseFloat(pago.monto?.toString() || '0'),
        0,
      );

      return {
        id_tratamiento_usuario: tu.id_tratamiento_usuario,
        tipo: 'tratamiento',
        fecha: tu.fecha_actualizacion || tu.fecha_creacion,
        motivo: tu.tratamiento.nombre_tratamiento,
        observaciones: tu.tratamiento.descripcion,
        odontologo: 'N/A',
        estado: tu.parametros?.nombre || 'Finalizado',
        monto: montoTratamiento,
        pagado: pagadoTratamiento,
        saldo: montoTratamiento - pagadoTratamiento,
        pagos: tu.pagos.map((pago) => ({
          id_pago: pago.id_pago,
          monto: parseFloat(pago.monto?.toString() || '0'),
          fecha: pago.fecha_pago,
          metodo: pago.parametros_pagos_id_parametro_metodo_pagoToparametros?.nombre || 'N/A',
          estado: pago.parametros_pagos_id_parametro_estado_pagoToparametros?.nombre || 'N/A',
          observaciones: pago.observaciones,
        })),
      };
    });

    // Combinar citas y tratamientos, ordenar por fecha
    const servicios = [...citasFormateadas, ...tratamientosFormateados].sort((a, b) => {
      const fechaA = a.fecha ? new Date(a.fecha).getTime() : 0;
      const fechaB = b.fecha ? new Date(b.fecha).getTime() : 0;
      return fechaB - fechaA;
    });

    return {
      paciente: {
        id_paciente: usuario.id_usuario,
        nombre: `${usuario.nombres} ${usuario.apellidos}`,
        identificacion: usuario.identificacion,
        email: usuario.email_,
        telefono: usuario.telefono,
      },
      resumen: {
        totalFacturado,
        totalPagado,
        saldoPendiente,
      },
      citas: citasFormateadas,
      tratamientos: tratamientosFormateados,
      servicios,
    };
  }

  /**
   * Registrar un nuevo pago
   */
  async registrarPago(createPagoDto: CreatePagoDto) {
    const { id_cita, id_paciente, monto, id_parametro_metodo_pago, id_parametro_estado_pago, observaciones } = createPagoDto;

    // Validar que la cita existe y pertenece al paciente
    const cita = await this.prisma.citas.findUnique({
      where: {
        id_cita,
        eliminado: -1,
      },
      include: {
        pagos: {
          where: {
            eliminado: -1,
          },
        },
      },
    });

    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id_cita} no encontrada`);
    }

    if (cita.id_paciente !== id_paciente) {
      throw new BadRequestException('La cita no pertenece al paciente especificado');
    }

    if (!cita.precio_consulta) {
      throw new BadRequestException('La cita no tiene un precio establecido');
    }

    // Calcular cuánto se ha pagado de esta cita
    const totalPagado = cita.pagos.reduce(
      (sum, pago) => sum + parseFloat(pago.monto?.toString() || '0'),
      0,
    );

    const precioConsulta = parseFloat(cita.precio_consulta.toString());
    const nuevoTotal = totalPagado + monto;

    if (nuevoTotal > precioConsulta) {
      throw new BadRequestException(
        `El monto excede el saldo pendiente. Saldo: ${precioConsulta - totalPagado}, Monto ingresado: ${monto}`,
      );
    }

    // Crear el pago
    const pago = await this.prisma.pagos.create({
      data: {
        id_cita,
        id_paciente,
        monto: new Decimal(monto),
        id_parametro_metodo_pago,
        id_parametro_estado_pago,
        observaciones,
        fecha_pago: new Date(),
        eliminado: -1,
      },
      include: {
        parametros_pagos_id_parametro_metodo_pagoToparametros: {
          select: {
            nombre: true,
          },
        },
        parametros_pagos_id_parametro_estado_pagoToparametros: {
          select: {
            nombre: true,
          },
        },
        citas: {
          select: {
            fecha_cita: true,
            motivo: true,
          },
        },
      },
    });

    return {
      id_pago: pago.id_pago,
      monto: parseFloat(pago.monto?.toString() || '0'),
      fecha_pago: pago.fecha_pago,
      metodo_pago: pago.parametros_pagos_id_parametro_metodo_pagoToparametros?.nombre,
      estado_pago: pago.parametros_pagos_id_parametro_estado_pagoToparametros?.nombre,
      observaciones: pago.observaciones,
      cita: {
        id_cita: pago.id_cita,
        fecha: pago.citas?.fecha_cita,
        motivo: pago.citas?.motivo,
      },
      saldo_restante: precioConsulta - nuevoTotal,
    };
  }
}

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

    // Total facturado (suma de todas las citas completadas con precio_consulta)
    const totalFacturadoResult = await this.prisma.citas.aggregate({
      where: {
        eliminado: -1,
        precio_consulta: { not: null },
        id_parametro_estado_cita: estadoCompletada.id_parametro,
      },
      _sum: {
        precio_consulta: true,
      },
    });

    // Total pagado (suma de todos los pagos)
    const totalPagadoResult = await this.prisma.pagos.aggregate({
      where: {
        eliminado: -1,
      },
      _sum: {
        monto: true,
      },
    });

    const totalFacturado = totalFacturadoResult._sum.precio_consulta || new Decimal(0);
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

    // Obtener total de registros
    const total = await this.prisma.usuarios.count({
      where: {
        ...whereClauseUsuario,
        pacientes: {
          citas: {
            some: {
              eliminado: -1,
              precio_consulta: { not: null },
              id_parametro_estado_cita: estadoCompletada.id_parametro,
            },
          },
        },
      },
    });

    // Obtener pacientes con paginación
    const usuarios = await this.prisma.usuarios.findMany({
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
      },
      skip: (pagina - 1) * limite,
      take: limite,
      orderBy: {
        apellidos: 'asc',
      },
    });

    // Calcular facturación por paciente
    const pacientesConFacturacion = usuarios
      .filter((u) => u.pacientes && u.pacientes.citas.length > 0)
      .map((usuario) => {
        const citas = usuario.pacientes!.citas;
        
        const totalFacturado = citas.reduce(
          (sum, cita) => sum + parseFloat(cita.precio_consulta?.toString() || '0'),
          0,
        );

        const totalPagado = citas.reduce(
          (sum, cita) =>
            sum +
            cita.pagos.reduce(
              (pagoSum, pago) => pagoSum + parseFloat(pago.monto?.toString() || '0'),
              0,
            ),
          0,
        );

        const saldoPendiente = totalFacturado - totalPagado;
        const ultimaConsulta = citas[0]?.fecha_cita || null;

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
      },
    });

    if (!usuario || !usuario.pacientes) {
      throw new NotFoundException(`Paciente con ID ${id_paciente} no encontrado`);
    }

    const citas = usuario.pacientes.citas;

    // Calcular totales
    const totalFacturado = citas.reduce(
      (sum, cita) => sum + parseFloat(cita.precio_consulta?.toString() || '0'),
      0,
    );

    const totalPagado = citas.reduce(
      (sum, cita) =>
        sum +
        cita.pagos.reduce((pagoSum, pago) => pagoSum + parseFloat(pago.monto?.toString() || '0'), 0),
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

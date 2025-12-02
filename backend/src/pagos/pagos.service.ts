import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagoPacienteDto } from './dto/create-pago-paciente.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PagosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtener citas completadas pendientes de pago del paciente autenticado
   */
  async obtenerCitasPendientesPago(id_paciente: string) {
    // Obtener citas completadas del paciente
    const citas = await this.prisma.citas.findMany({
      where: {
        id_paciente,
        eliminado: -1,
        precio_consulta: { not: null },
        estado: {
          nombre: 'Completada',
          eliminado: -1,
        },
      },
      select: {
        id_cita: true,
        fecha_cita: true,
        motivo: true,
        precio_consulta: true,
        tratamientos_usuarios: {
          select: {
            tratamiento: {
              select: {
                nombre_tratamiento: true,
              },
            },
          },
        },
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
    });

    // Obtener tratamientos finalizados del paciente
    const tratamientos = await this.prisma.tratamientos_usuarios.findMany({
      where: {
        id_usuario: id_paciente,
        eliminado: -1,
        parametros: {
          nombre: 'Finalizado',
          eliminado: -1,
        },
      },
      select: {
        id_tratamiento_usuario: true,
        fecha_actualizacion: true,
        fecha_creacion: true,
        tratamiento: {
          select: {
            nombre_tratamiento: true,
            precio_estimado: true,
            descripcion: true,
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
    });

    // Calcular saldo pendiente de cada cita
    const citasConSaldo = citas.map((cita) => {
      const precioCita = parseFloat(cita.precio_consulta?.toString() || '0');
      const totalPagado = cita.pagos.reduce(
        (sum, pago) => sum + parseFloat(pago.monto?.toString() || '0'),
        0,
      );
      const saldoPendiente = precioCita - totalPagado;

      return {
        id: cita.id_cita,
        tipo: 'cita',
        fecha_cita: cita.fecha_cita,
        motivo: cita.motivo,
        nombre_tratamiento: cita.tratamientos_usuarios?.tratamiento?.nombre_tratamiento || 'Consulta general',
        odontologo: cita.odontologos
          ? `Dr(a). ${cita.odontologos.usuarios.nombres} ${cita.odontologos.usuarios.apellidos}`
          : 'No asignado',
        monto: precioCita,
        pagado: totalPagado,
        saldo_pendiente: saldoPendiente,
      };
    });

    // Formatear tratamientos (los tratamientos no tienen pagos asociados directamente)
    const tratamientosFormateados = tratamientos.map((tu) => {
      const precioTratamiento = parseFloat(tu.tratamiento.precio_estimado?.toString() || '0');
      const totalPagado = tu.pagos.reduce(
        (sum, pago) => sum + parseFloat(pago.monto?.toString() || '0'),
        0,
      );
      const saldoPendiente = precioTratamiento - totalPagado;

      return {
        id: tu.id_tratamiento_usuario,
        tipo: 'tratamiento',
        fecha_cita: tu.fecha_actualizacion || tu.fecha_creacion,
        motivo: tu.tratamiento.nombre_tratamiento || 'Tratamiento',
        nombre_tratamiento: tu.tratamiento.nombre_tratamiento || 'Tratamiento',
        descripcion: tu.tratamiento.descripcion,
        odontologo: 'N/A',
        monto: precioTratamiento,
        pagado: totalPagado,
        saldo_pendiente: saldoPendiente,
      };
    }).filter((t) => t.saldo_pendiente > 0); // Filtrar solo tratamientos con saldo pendiente

    // Filtrar solo las citas con saldo pendiente
    const citasPendientes = citasConSaldo.filter((c) => c.saldo_pendiente > 0);

    // Combinar citas y tratamientos
    const serviciosPendientes = [...citasPendientes, ...tratamientosFormateados];

    return {
      citas: citasPendientes,
      tratamientos: tratamientosFormateados,
      servicios: serviciosPendientes,
      total_pendiente: serviciosPendientes.reduce((sum, s) => sum + s.saldo_pendiente, 0),
    };
  }

  /**
   * Registrar pago desde el módulo del paciente
   */
  async registrarPagoPaciente(id_paciente: string, createPagoDto: CreatePagoPacienteDto) {
    const { citas, tratamientos, id_parametro_metodo_pago, observaciones } = createPagoDto;

    if ((!citas || citas.length === 0) && (!tratamientos || tratamientos.length === 0)) {
      throw new BadRequestException('Debe seleccionar al menos un servicio para pagar');
    }

    // Obtener el parámetro de estado "Pagado"
    const estadoPagado = await this.prisma.parametros.findFirst({
      where: {
        nombre: 'Pagado',
        eliminado: -1,
      },
    });

    if (!estadoPagado) {
      throw new NotFoundException('No se encontró el parámetro de estado "Pagado"');
    }

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

    // Validar citas si hay alguna
    let citasValidadas: any[] = [];
    if (citas && citas.length > 0) {
      citasValidadas = await this.prisma.citas.findMany({
        where: {
          id_cita: { in: citas },
          id_paciente,
          eliminado: -1,
          id_parametro_estado_cita: estadoCompletada.id_parametro,
          precio_consulta: { not: null },
        },
        include: {
          pagos: {
            where: {
              eliminado: -1,
            },
          },
        },
      });

      if (citasValidadas.length !== citas.length) {
        throw new BadRequestException('Algunas citas no son válidas o no pertenecen al paciente');
      }
    }

    // Validar tratamientos si hay alguno
    let tratamientosValidados: any[] = [];
    const estadoFinalizado = await this.prisma.parametros.findFirst({
      where: {
        nombre: 'Finalizado',
        eliminado: -1,
      },
    });

    if (tratamientos && tratamientos.length > 0) {
      if (!estadoFinalizado) {
        throw new NotFoundException('No se encontró el parámetro de estado "Finalizado"');
      }

      tratamientosValidados = await this.prisma.tratamientos_usuarios.findMany({
        where: {
          id_tratamiento_usuario: { in: tratamientos },
          id_usuario: id_paciente,
          eliminado: -1,
          id_parametro_estado_tratamiento: estadoFinalizado.id_parametro,
        },
        include: {
          tratamiento: {
            select: {
              nombre_tratamiento: true,
              precio_estimado: true,
            },
          },
        },
      });

      if (tratamientosValidados.length !== tratamientos.length) {
        throw new BadRequestException('Algunos tratamientos no son válidos o no pertenecen al paciente');
      }
    }

    // Crear los pagos en una transacción
    const pagosCreados: Array<{
      id_pago: string;
      id_cita: string;
      monto: number;
      fecha_pago: Date;
      metodo_pago: string;
      cita: {
        fecha_cita: Date;
        motivo: string | null;
        tratamiento: string | null;
      };
    }> = [];
    let totalPagado = 0;

    for (const cita of citasValidadas) {
      const precioCita = parseFloat(cita.precio_consulta?.toString() || '0');
      
      if (precioCita === 0) {
        throw new BadRequestException(`La cita ${cita.id_cita} no tiene un precio establecido`);
      }
      const totalPagadoCita = cita.pagos.reduce(
        (sum, pago) => sum + parseFloat(pago.monto?.toString() || '0'),
        0,
      );
      const saldoPendiente = precioCita - totalPagadoCita;

      if (saldoPendiente <= 0) {
        throw new BadRequestException(`La cita ${cita.id_cita} ya está completamente pagada`);
      }

      // Crear el pago por el saldo pendiente de esta cita
      const pago = await this.prisma.pagos.create({
        data: {
          id_cita: cita.id_cita,
          id_paciente,
          monto: new Decimal(saldoPendiente),
          id_parametro_metodo_pago,
          id_parametro_estado_pago: estadoPagado.id_parametro,
          observaciones: observaciones || `Pago realizado por paciente`,
          fecha_pago: new Date(),
          eliminado: -1,
        },
        include: {
          parametros_pagos_id_parametro_metodo_pagoToparametros: {
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

      totalPagado += saldoPendiente;
      pagosCreados.push({
        id_pago: pago.id_pago,
        id_cita: pago.id_cita || '',
        monto: parseFloat(pago.monto?.toString() || '0'),
        fecha_pago: pago.fecha_pago || new Date(),
        metodo_pago: pago.parametros_pagos_id_parametro_metodo_pagoToparametros?.nombre || '',
        cita: {
          fecha_cita: pago.citas?.fecha_cita || new Date(),
          motivo: pago.citas?.motivo || null,
          tratamiento: null,
        },
      });
    }

    // Procesar pagos de tratamientos
    for (const tratamiento of tratamientosValidados) {
      const precioTratamiento = parseFloat(tratamiento.tratamiento.precio_estimado?.toString() || '0');
      
      if (precioTratamiento === 0) {
        throw new BadRequestException(`El tratamiento ${tratamiento.id_tratamiento_usuario} no tiene un precio establecido`);
      }

      // Crear el pago por el tratamiento completo
      const pago = await this.prisma.pagos.create({
        data: {
          id_tratamiento_usuario: tratamiento.id_tratamiento_usuario,
          id_paciente,
          monto: new Decimal(precioTratamiento),
          id_parametro_metodo_pago,
          id_parametro_estado_pago: estadoPagado.id_parametro,
          observaciones: observaciones || `Pago de tratamiento: ${tratamiento.tratamiento.nombre_tratamiento}`,
          fecha_pago: new Date(),
          eliminado: -1,
        },
        include: {
          parametros_pagos_id_parametro_metodo_pagoToparametros: {
            select: {
              nombre: true,
            },
          },
          tratamientos_usuarios: {
            select: {
              tratamiento: {
                select: {
                  nombre_tratamiento: true,
                },
              },
            },
          },
        },
      });

      totalPagado += precioTratamiento;
      pagosCreados.push({
        id_pago: pago.id_pago,
        id_cita: '',
        monto: parseFloat(pago.monto?.toString() || '0'),
        fecha_pago: pago.fecha_pago || new Date(),
        metodo_pago: pago.parametros_pagos_id_parametro_metodo_pagoToparametros?.nombre || '',
        cita: {
          fecha_cita: tratamiento.fecha_actualizacion || tratamiento.fecha_creacion || new Date(),
          motivo: pago.tratamientos_usuarios?.tratamiento?.nombre_tratamiento || 'Tratamiento',
          tratamiento: pago.tratamientos_usuarios?.tratamiento?.nombre_tratamiento || null,
        },
      });
    }

    return {
      mensaje: 'Pagos registrados exitosamente',
      pagos: pagosCreados,
      total_pagado: totalPagado,
      cantidad_citas: citasValidadas.length,
      cantidad_tratamientos: tratamientosValidados.length,
      cantidad_total: pagosCreados.length,
    };
  }

  /**
   * Obtener historial de pagos del paciente
   */
  async obtenerHistorialPagos(id_paciente: string) {
    const pagos = await this.prisma.pagos.findMany({
      where: {
        id_paciente,
        eliminado: -1,
      },
      select: {
        id_pago: true,
        monto: true,
        fecha_pago: true,
        observaciones: true,
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
            tratamientos_usuarios: {
              select: {
                tratamiento: {
                  select: {
                    nombre_tratamiento: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        fecha_pago: 'desc',
      },
    });

    const pagosFormateados = pagos.map((pago) => ({
      id_pago: pago.id_pago,
      monto: parseFloat(pago.monto?.toString() || '0'),
      fecha_pago: pago.fecha_pago,
      metodo_pago: pago.parametros_pagos_id_parametro_metodo_pagoToparametros?.nombre || 'N/A',
      estado: pago.parametros_pagos_id_parametro_estado_pagoToparametros?.nombre || 'N/A',
      observaciones: pago.observaciones,
      cita: {
        fecha: pago.citas?.fecha_cita,
        motivo: pago.citas?.motivo,
        tratamiento: pago.citas?.tratamientos_usuarios?.tratamiento?.nombre_tratamiento || 'Consulta general',
      },
    }));

    const totalPagado = pagosFormateados.reduce((sum, p) => sum + p.monto, 0);

    return {
      pagos: pagosFormateados,
      total_pagado: totalPagado,
      cantidad_pagos: pagosFormateados.length,
    };
  }

  /**
   * Obtener métodos de pago disponibles
   */
  async obtenerMetodosPago() {
    const metodos = await this.prisma.parametros.findMany({
      where: {
        tipos_parametros: {
          nombre: 'metodo_de_pago',
        },
        eliminado: -1,
      },
      select: {
        id_parametro: true,
        nombre: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });

    return metodos;
  }
}

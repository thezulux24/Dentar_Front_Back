import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMensajeSoporteDto } from './dto/create-mensaje-soporte.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class SoporteService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crear un nuevo ticket de soporte con mensaje inicial
   */
  async createTicket(userId: string, createTicketDto: CreateTicketDto) {
    try {
      // Generar asunto automático si no se proporciona
      const asunto = createTicketDto.asunto || 
        `Consulta de soporte - ${new Date().toLocaleDateString('es-CO')}`;

      // Crear ticket y mensaje inicial en una transacción
      const ticket = await this.prisma.$transaction(async (tx) => {
        // Crear el ticket
        const nuevoTicket = await tx.tickets_soporte.create({
          data: {
            id_usuario: userId,
            asunto,
            estado: 'abierto',
            prioridad: 'media',
          },
        });

        // Crear mensaje de bienvenida del bot
        const mensajeBienvenida = `¡Hola! 👋 Bienvenido al soporte técnico de DentAR.

Puedo ayudarte con los siguientes temas:

🔐 **Contraseña** - Recuperación y cambio de contraseña
📅 **Cita** - Agendar, consultar o cancelar citas
🦷 **Tratamiento** - Información sobre tratamientos
💰 **Pago** - Consultas sobre pagos y facturas
📋 **Diagnóstico** - Ver historial de diagnósticos
👤 **Perfil** - Actualizar información personal
🕐 **Horario** - Consultar horarios disponibles
❌ **Error** - Reportar problemas técnicos

También puedes escribir **"ayuda"** en cualquier momento para ver este menú nuevamente.

¿En qué puedo ayudarte hoy?`;

        await tx.mensajes_soporte.create({
          data: {
            id_ticket: nuevoTicket.id_ticket,
            id_usuario: null,
            contenido: mensajeBienvenida,
            es_bot: true,
            leido: false,
          },
        });

        // Crear el mensaje inicial del usuario
        await tx.mensajes_soporte.create({
          data: {
            id_ticket: nuevoTicket.id_ticket,
            id_usuario: userId,
            contenido: createTicketDto.contenido_inicial,
            es_bot: false,
            leido: false,
          },
        });

        // Buscar respuesta automática al mensaje del usuario
        const respuestaBot = await this.buscarRespuestaAutomatica(
          createTicketDto.contenido_inicial,
          tx
        );

        // Si hay respuesta automática, crearla
        if (respuestaBot) {
          await tx.mensajes_soporte.create({
            data: {
              id_ticket: nuevoTicket.id_ticket,
              id_usuario: null, // null porque es bot
              contenido: respuestaBot,
              es_bot: true,
              leido: false,
            },
          });
        }

        return nuevoTicket;
      });

      // Obtener el ticket completo con mensajes
      return this.findOne(ticket.id_ticket, userId);
    } catch (error) {
      throw new BadRequestException('Error al crear el ticket de soporte');
    }
  }

  /**
   * Agregar un mensaje a un ticket existente
   */
  async addMensaje(
    ticketId: string,
    userId: string,
    createMensajeDto: CreateMensajeSoporteDto,
  ) {
    // Verificar que el ticket existe y pertenece al usuario
    const ticket = await this.prisma.tickets_soporte.findFirst({
      where: {
        id_ticket: ticketId,
        id_usuario: userId,
        eliminado: -1,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }

    if (ticket.estado === 'cerrado') {
      throw new BadRequestException('No se pueden agregar mensajes a un ticket cerrado');
    }

    try {
      // Crear mensaje del usuario y respuesta automática en transacción
      await this.prisma.$transaction(async (tx) => {
        // Crear mensaje del usuario
        await tx.mensajes_soporte.create({
          data: {
            id_ticket: ticketId,
            id_usuario: userId,
            contenido: createMensajeDto.contenido,
            es_bot: false,
            leido: false,
          },
        });

        // Buscar respuesta automática
        const respuestaBot = await this.buscarRespuestaAutomatica(
          createMensajeDto.contenido,
          tx
        );

        // Si hay respuesta automática, crearla
        if (respuestaBot) {
          await tx.mensajes_soporte.create({
            data: {
              id_ticket: ticketId,
              id_usuario: null,
              contenido: respuestaBot,
              es_bot: true,
              leido: false,
            },
          });
        }

        // Actualizar estado del ticket a "en_proceso" si está cerrado
        if (ticket.estado === 'cerrado') {
          await tx.tickets_soporte.update({
            where: { id_ticket: ticketId },
            data: { 
              estado: 'en_proceso',
              fecha_actualizacion: new Date(),
            },
          });
        }
      });

      return this.findOne(ticketId, userId);
    } catch (error) {
      throw new BadRequestException('Error al agregar el mensaje');
    }
  }

  /**
   * Obtener todos los tickets del usuario
   */
  async findAll(userId: string) {
    const tickets = await this.prisma.tickets_soporte.findMany({
      where: {
        id_usuario: userId,
        eliminado: -1,
      },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombres: true,
            apellidos: true,
            email_: true,
          },
        },
        mensajes: {
          where: { eliminado: -1 },
          orderBy: { fecha_creacion: 'asc' },
          select: {
            id_mensaje_soporte: true,
            contenido: true,
            es_bot: true,
            leido: true,
            fecha_creacion: true,
            usuario: {
              select: {
                nombres: true,
                apellidos: true,
              },
            },
          },
        },
      },
      orderBy: { fecha_creacion: 'desc' },
    });

    return {
      success: true,
      data: tickets.map((ticket) => ({
        ...ticket,
        total_mensajes: ticket.mensajes.length,
        ultimo_mensaje: ticket.mensajes[ticket.mensajes.length - 1],
        mensajes_no_leidos: ticket.mensajes.filter((m) => !m.leido && m.es_bot).length,
      })),
    };
  }

  /**
   * Obtener un ticket específico con todos sus mensajes
   */
  async findOne(ticketId: string, userId: string) {
    const ticket = await this.prisma.tickets_soporte.findFirst({
      where: {
        id_ticket: ticketId,
        id_usuario: userId,
        eliminado: -1,
      },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombres: true,
            apellidos: true,
            email_: true,
            avatar_url: true,
          },
        },
        mensajes: {
          where: { eliminado: -1 },
          orderBy: { fecha_creacion: 'asc' },
          select: {
            id_mensaje_soporte: true,
            contenido: true,
            es_bot: true,
            leido: true,
            fecha_creacion: true,
            usuario: {
              select: {
                nombres: true,
                apellidos: true,
                avatar_url: true,
              },
            },
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }

    return {
      success: true,
      data: ticket,
    };
  }

  /**
   * Actualizar un ticket (cambiar estado o prioridad)
   */
  async update(ticketId: string, userId: string, updateTicketDto: UpdateTicketDto) {
    // Verificar que el ticket existe y pertenece al usuario
    const ticket = await this.prisma.tickets_soporte.findFirst({
      where: {
        id_ticket: ticketId,
        id_usuario: userId,
        eliminado: -1,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }

    try {
      const dataToUpdate: any = {
        fecha_actualizacion: new Date(),
      };

      if (updateTicketDto.estado) {
        dataToUpdate.estado = updateTicketDto.estado;
        if (updateTicketDto.estado === 'cerrado') {
          dataToUpdate.fecha_cierre = new Date();
        }
      }

      if (updateTicketDto.prioridad) {
        dataToUpdate.prioridad = updateTicketDto.prioridad;
      }

      await this.prisma.tickets_soporte.update({
        where: { id_ticket: ticketId },
        data: dataToUpdate,
      });

      return this.findOne(ticketId, userId);
    } catch (error) {
      throw new BadRequestException('Error al actualizar el ticket');
    }
  }

  /**
   * Marcar mensajes como leídos
   */
  async markAsRead(ticketId: string, userId: string) {
    // Verificar que el ticket existe y pertenece al usuario
    const ticket = await this.prisma.tickets_soporte.findFirst({
      where: {
        id_ticket: ticketId,
        id_usuario: userId,
        eliminado: -1,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }

    await this.prisma.mensajes_soporte.updateMany({
      where: {
        id_ticket: ticketId,
        leido: false,
        es_bot: true, // Solo marcar mensajes del bot como leídos
      },
      data: {
        leido: true,
        fecha_actualizacion: new Date(),
      },
    });

    return { success: true, message: 'Mensajes marcados como leídos' };
  }

  /**
   * Buscar respuesta automática basada en palabras clave
   */
  private async buscarRespuestaAutomatica(
    mensaje: string,
    tx?: any,
  ): Promise<string | null> {
    const prismaClient = tx || this.prisma;
    
    // Normalizar el mensaje (minúsculas, sin acentos)
    const mensajeNormalizado = this.normalizarTexto(mensaje);

    // Obtener todas las respuestas activas ordenadas por prioridad
    const respuestas = await prismaClient.respuestas_automaticas.findMany({
      where: {
        activo: true,
        eliminado: -1,
      },
      orderBy: { prioridad: 'desc' },
    });

    // Buscar coincidencias
    for (const respuesta of respuestas) {
      const palabraClaveNormalizada = this.normalizarTexto(respuesta.palabra_clave || '');
      
      if (mensajeNormalizado.includes(palabraClaveNormalizada)) {
        return respuesta.respuesta;
      }
    }

    // Respuesta por defecto si no hay coincidencias
    return '¡Gracias por tu mensaje! Un miembro de nuestro equipo revisará tu consulta y te responderá pronto. Si necesitas ayuda inmediata, puedes contactarnos por WhatsApp.';
  }

  /**
   * Normalizar texto para comparación (minúsculas, sin acentos)
   */
  private normalizarTexto(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}

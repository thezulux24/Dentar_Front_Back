import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SoporteService } from './soporte.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMensajeSoporteDto } from './dto/create-mensaje-soporte.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { RolesGuard } from '../common/roles/roles.guard';
import { Roles } from '../common/roles/roles.decorator';
import { Role } from '../common/roles/roles.enum';

@Controller('soporte')
@ApiTags('Soporte')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class SoporteController {
  constructor(private readonly soporteService: SoporteService) {}

  @Roles(Role.Paciente, Role.Odontologo, Role.Auxiliar, Role.Admin)
  @Post('tickets')
  @ApiOperation({ summary: 'Crear un nuevo ticket de soporte con mensaje inicial' })
  createTicket(@Request() req, @Body() createTicketDto: CreateTicketDto) {
    return this.soporteService.createTicket(req.user.id, createTicketDto);
  }

  @Roles(Role.Paciente, Role.Odontologo, Role.Auxiliar, Role.Admin)
  @Post('tickets/:id/mensajes')
  @ApiOperation({ summary: 'Agregar un mensaje a un ticket existente' })
  addMensaje(
    @Request() req,
    @Param('id') ticketId: string,
    @Body() createMensajeDto: CreateMensajeSoporteDto,
  ) {
    return this.soporteService.addMensaje(ticketId, req.user.id, createMensajeDto);
  }

  @Roles(Role.Paciente, Role.Odontologo, Role.Auxiliar, Role.Admin)
  @Get('tickets')
  @ApiOperation({ summary: 'Obtener todos los tickets del usuario autenticado' })
  findAll(@Request() req) {
    return this.soporteService.findAll(req.user.id);
  }

  @Roles(Role.Paciente, Role.Odontologo, Role.Auxiliar, Role.Admin)
  @Get('tickets/:id')
  @ApiOperation({ summary: 'Obtener un ticket específico con todos sus mensajes' })
  findOne(@Request() req, @Param('id') ticketId: string) {
    return this.soporteService.findOne(ticketId, req.user.id);
  }

  @Roles(Role.Paciente, Role.Odontologo, Role.Auxiliar, Role.Admin)
  @Patch('tickets/:id')
  @ApiOperation({ summary: 'Actualizar estado o prioridad de un ticket' })
  update(
    @Request() req,
    @Param('id') ticketId: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.soporteService.update(ticketId, req.user.id, updateTicketDto);
  }

  @Roles(Role.Paciente, Role.Odontologo, Role.Auxiliar, Role.Admin)
  @Patch('tickets/:id/leer')
  @ApiOperation({ summary: 'Marcar mensajes del bot como leídos' })
  markAsRead(@Request() req, @Param('id') ticketId: string) {
    return this.soporteService.markAsRead(ticketId, req.user.id);
  }
}

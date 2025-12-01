import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoPacienteDto } from './dto/create-pago-paciente.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/roles/roles.guard';
import { Roles } from '../common/roles/roles.decorator';
import { Role } from '../common/roles/roles.enum';
import { buildResponse } from '../common/utils/response.util';

@Controller('pagos')
@UseGuards(AuthGuard, RolesGuard)
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Get('mis-citas-pendientes')
  @Roles(Role.Paciente)
  async obtenerCitasPendientes(@Request() req) {
    const id_paciente = req.user.id;
    const resultado = await this.pagosService.obtenerCitasPendientesPago(id_paciente);
    return buildResponse(true, 'Citas pendientes obtenidas exitosamente', resultado);
  }

  @Post('registrar')
  @Roles(Role.Paciente)
  async registrarPago(@Request() req, @Body() createPagoDto: CreatePagoPacienteDto) {
    const id_paciente = req.user.id;
    const resultado = await this.pagosService.registrarPagoPaciente(id_paciente, createPagoDto);
    return buildResponse(true, resultado.mensaje, resultado);
  }

  @Get('mis-pagos')
  @Roles(Role.Paciente)
  async obtenerHistorial(@Request() req) {
    const id_paciente = req.user.id;
    const resultado = await this.pagosService.obtenerHistorialPagos(id_paciente);
    return buildResponse(true, 'Historial de pagos obtenido exitosamente', resultado);
  }

  @Get('metodos-pago')
  @Roles(Role.Paciente, Role.Auxiliar, Role.Admin)
  async obtenerMetodosPago() {
    const metodos = await this.pagosService.obtenerMetodosPago();
    return buildResponse(true, 'Métodos de pago obtenidos exitosamente', metodos);
  }
}

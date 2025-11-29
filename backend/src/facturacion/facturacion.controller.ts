import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FacturacionService } from './facturacion.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { FindFacturacionDto } from './dto/find-facturacion.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/roles/roles.guard';
import { Roles } from '../common/roles/roles.decorator';
import { Role } from '../common/roles/roles.enum';

@Controller('facturacion')
@UseGuards(AuthGuard, RolesGuard)
export class FacturacionController {
  constructor(private readonly facturacionService: FacturacionService) {}

  /**
   * GET /facturacion/resumen
   * Obtener resumen general de facturación (totales)
   */
  @Get('resumen')
  @Roles(Role.Auxiliar, Role.Admin)
  async obtenerResumen() {
    return this.facturacionService.obtenerResumen();
  }

  /**
   * GET /facturacion/pacientes
   * Obtener lista de pacientes con su información de facturación
   */
  @Get('pacientes')
  @Roles(Role.Auxiliar, Role.Admin)
  async obtenerPacientesConFacturacion(@Query() findDto: FindFacturacionDto) {
    return this.facturacionService.obtenerPacientesConFacturacion(findDto);
  }

  /**
   * GET /facturacion/paciente/:id
   * Obtener detalle completo de facturación de un paciente
   */
  @Get('paciente/:id')
  @Roles(Role.Auxiliar, Role.Admin)
  async obtenerDetalleFacturacionPaciente(@Param('id') id: string) {
    return this.facturacionService.obtenerDetalleFacturacionPaciente(id);
  }

  /**
   * POST /facturacion/registrar-pago
   * Registrar un nuevo pago
   */
  @Post('registrar-pago')
  @Roles(Role.Auxiliar, Role.Admin)
  async registrarPago(@Body() createPagoDto: CreatePagoDto) {
    return this.facturacionService.registrarPago(createPagoDto);
  }
}

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiagnosticoDto } from './dto/create-diagnostico.dto';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';
import { DateHelper } from 'src/common/utils/date.helper';
import { buildResponse } from 'src/common/utils/response.util';
// import { DiagnosticoResponseDto } from './dto/diagnostico-response.dto';
import {
  InformacionPersonalDto,
  InformacionAcudienteDto,
  HistorialMedicoDto,
  InformacionTratamientoDto,
  AnamnesisDto,
  ExamenFisicoDto,
  OdontogramaDto,
  OdontogramaDenticionDto,
  PlanTratamientoDto,
  ResumenDto,
} from './dto/create-diagnostico.dto';

@Injectable()
export class DiagnosticosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createDiagnosticoDto: CreateDiagnosticoDto) {
    const {
      informacion_personal,
      informacion_acudiente,
      historial_medico,
      informacion_tratamiento,
      anamnesis,
      examen_fisico,
      odontograma,
      odontograma_denticion,
      plan_tratamiento,
      resumen,
      id_odontologo,
      id_cita,
    } = createDiagnosticoDto;

    return this.prisma.$transaction(async (prisma) => {
      // 1. Buscar paciente existente
      const existingUser = await prisma.usuarios.findFirst({
        where: {
          OR: [
            { email_: informacion_personal.email },
            { identificacion: informacion_personal.documento },
          ],
        },
        include: {
          pacientes: true,
        },
      });

      const fecha_actual = DateHelper.nowUTC();

      if (!existingUser || !existingUser.pacientes) {
        throw new NotFoundException('Paciente no encontrado');
      }

      const existingDentist = await prisma.odontologos.findFirst({
        select: { id_usuario: true },
        where: {
          id_usuario: id_odontologo,
        },
      });

      if (id_odontologo && !existingDentist) {
        throw new NotFoundException('Odontólogo no encontrado');
      }

      const pacienteId = existingUser.id_usuario;

      // Actualizar usuario y paciente existentes
      await prisma.usuarios.update({
        where: { id_usuario: pacienteId },
        data: {
          nombres: informacion_personal.nombres,
          apellidos: informacion_personal.apellidos,
          email_: informacion_personal.email,
          identificacion: informacion_personal.documento,
          direccion: informacion_personal.direccion,
          fecha_actualizacion: fecha_actual,
        },
      });

      await prisma.pacientes.update({
        where: { id_usuario: pacienteId },
        data: {
          fecha_nacimiento: informacion_personal.fecha_nacimiento,
          barrio: informacion_personal.barrio,
          ocupacion: informacion_personal.ocupacion,
          eps: informacion_tratamiento?.eps,
          informacion_acudiente: informacion_acudiente
            ? instanceToPlain(informacion_acudiente)
            : Prisma.JsonNull,
          condiciones_medicas_previas: historial_medico?.condiciones_previas,
          medicamentos_actuales: historial_medico?.medicamentos_actuales,
          fecha_actualizacion: fecha_actual,
        },
      });

      // 2. Buscar o crear/actualizar diagnóstico
      let existingDiagnostico = await prisma.diagnosticos.findFirst({
        where: {
          id_paciente: pacienteId,
          eliminado: -1, // Consider only non-eliminated diagnoses
        },
      });

      const diagnosticoData = {
        id_paciente: pacienteId,
        id_odontologo: id_odontologo,
        id_cita: id_cita,
        fecha_diagnostico: fecha_actual,
        historial_medico: historial_medico
          ? instanceToPlain(historial_medico)
          : Prisma.JsonNull,
        informacion_tratamiento: informacion_tratamiento
          ? instanceToPlain(informacion_tratamiento)
          : Prisma.JsonNull,
        anamnesis: anamnesis ? instanceToPlain(anamnesis) : Prisma.JsonNull,
        examen_fisico: examen_fisico
          ? instanceToPlain(examen_fisico)
          : Prisma.JsonNull,
        odontograma: odontograma ? instanceToPlain(odontograma) : Prisma.JsonNull,
        odontograma_denticion: odontograma_denticion
          ? instanceToPlain(odontograma_denticion)
          : Prisma.JsonNull,
        plan_tratamiento: plan_tratamiento
          ? instanceToPlain(plan_tratamiento)
          : Prisma.JsonNull,
        notas_medico: resumen?.notas_medico,
      };

      let resultDiagnostico;
      if (existingDiagnostico) {
        // Actualizar diagnóstico existente
        resultDiagnostico = await prisma.diagnosticos.update({
          where: { id_diagnostico: existingDiagnostico.id_diagnostico },
          data: {
            ...diagnosticoData,
            fecha_actualizacion: fecha_actual,
          },
        });
      } else {
        // Crear nuevo diagnóstico
        resultDiagnostico = await prisma.diagnosticos.create({
          data: {
            ...diagnosticoData,
            fecha_creacion: fecha_actual,
          },
        });
      }

      return buildResponse(true, 'Diagnóstico guardado exitosamente', {
        id_diagnostico: resultDiagnostico.id_diagnostico,
        id_paciente: resultDiagnostico.id_paciente,
      });
    });
  }

  async findOneByUserId(id_usuario: string) {

    // Validar existencia del paciente
    const paciente = await this.prisma.pacientes.findFirst({
      select: { id_usuario: true },
      where: { id_usuario: id_usuario },
    });

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }

    const latestDiagnosis = await this.prisma.diagnosticos.findFirst({
      where: {
        id_paciente: id_usuario,
        eliminado: -1,
      },
      orderBy: {
        fecha_actualizacion: 'desc',
      },
      include: {
        pacientes: {
          include: {
            usuarios: true,
          },
        },
      },
    });

    if (!latestDiagnosis) {
      throw new NotFoundException(
        `No se encontró un diagnóstico para el paciente con ID ${id_usuario}`,
      );
    }

    if (!latestDiagnosis.pacientes || !latestDiagnosis.pacientes.usuarios) {
      throw new NotFoundException(
        `Datos de paciente o usuario incompletos para el diagnóstico con ID ${latestDiagnosis.id_diagnostico}`,
      );
    }

    const { pacientes, ...diagnosticoFields } = latestDiagnosis;
    const { usuarios, ...pacienteFields } = pacientes;

    const informacionPersonal: InformacionPersonalDto = {
      nombres: usuarios.nombres ?? '',
      apellidos: usuarios.apellidos ?? '',
      fecha_nacimiento: pacienteFields.fecha_nacimiento,
      email: usuarios.email_ ?? '',
      documento: usuarios.identificacion ?? '',
      direccion: usuarios.direccion ?? '',
      barrio: pacienteFields.barrio ?? '',
      ocupacion: pacienteFields.ocupacion ?? '',
    };

    const informacionAcudiente: InformacionAcudienteDto | undefined =
      pacienteFields.informacion_acudiente
        ? (instanceToPlain(pacienteFields.informacion_acudiente) as InformacionAcudienteDto)
        : undefined;

    const historialMedico: HistorialMedicoDto | undefined =
      diagnosticoFields.historial_medico
        ? (instanceToPlain(diagnosticoFields.historial_medico) as HistorialMedicoDto)
        : undefined;

    const informacionTratamiento: InformacionTratamientoDto | undefined =
      diagnosticoFields.informacion_tratamiento
        ? (instanceToPlain(diagnosticoFields.informacion_tratamiento) as InformacionTratamientoDto)
        : undefined;

    const anamnesis: AnamnesisDto | undefined = diagnosticoFields.anamnesis
      ? (instanceToPlain(diagnosticoFields.anamnesis) as AnamnesisDto)
      : undefined;

    const examenFisico: ExamenFisicoDto | undefined =
      diagnosticoFields.examen_fisico
        ? (instanceToPlain(diagnosticoFields.examen_fisico) as ExamenFisicoDto)
        : undefined;

    const odontograma: OdontogramaDto | undefined = diagnosticoFields.odontograma
      ? (instanceToPlain(diagnosticoFields.odontograma) as OdontogramaDto)
      : undefined;

    const odontogramaDenticion: OdontogramaDenticionDto | undefined =
      diagnosticoFields.odontograma_denticion
        ? (instanceToPlain(diagnosticoFields.odontograma_denticion) as OdontogramaDenticionDto)
        : undefined;

    const planTratamiento: PlanTratamientoDto | undefined =
      diagnosticoFields.plan_tratamiento
        ? (instanceToPlain(diagnosticoFields.plan_tratamiento) as PlanTratamientoDto)
        : undefined;

    const resumen: ResumenDto = {
      notas_medico: diagnosticoFields.notas_medico ?? '',
    };

    return {
      id_diagnostico: diagnosticoFields.id_diagnostico,
      fecha_diagnostico: latestDiagnosis.fecha_diagnostico, // Use original Date object
      informacion_personal: informacionPersonal,
      informacion_acudiente: informacionAcudiente,
      historial_medico: historialMedico,
      informacion_tratamiento: informacionTratamiento,
      anamnesis: anamnesis,
      examen_fisico: examenFisico,
      odontograma: odontograma,
      odontograma_denticion: odontogramaDenticion,
      plan_tratamiento: planTratamiento,
      resumen: resumen,
      
      foto_de_perfil: usuarios.avatar_url ?? '',
    };
  }
}

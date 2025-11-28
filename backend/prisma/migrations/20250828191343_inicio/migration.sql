CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "public"."auxiliares" (
    "id_usuario" UUID NOT NULL,
    "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "eliminado" INTEGER DEFAULT -1,
    "fecha_eliminacion" TIMESTAMPTZ(6),
    "id_parametro_tipo_auxiliar" UUID,

    CONSTRAINT "auxiliares_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "public"."citas" (
    "id_cita" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "eliminado" INTEGER DEFAULT -1,
    "fecha_eliminacion" TIMESTAMPTZ(6),
    "id_paciente" UUID,
    "id_odontologo" UUID,
    "id_auxiliar" UUID,
    "fecha_cita" DATE,
    "hora_inicio_cita" TIME(6),
    "hora_fin_cita" TIME(6),
    "id_parametro_estado_cita" UUID,
    "motivo" TEXT,
    "observaciones" TEXT,
    "id_tratamiento" UUID,

    CONSTRAINT "citas_pkey" PRIMARY KEY ("id_cita")
);

-- CreateTable
CREATE TABLE "public"."diagnosticos" (
    "id_diagnostico" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "eliminado" INTEGER DEFAULT -1,
    "fecha_eliminacion" TIMESTAMPTZ(6),
    "id_paciente" UUID,
    "id_odontologo" UUID,
    "id_cita" UUID,
    "fecha_diagnostico" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT,
    "recomendaciones" JSON,
    "archivos_adjuntos" JSON,

    CONSTRAINT "diagnosticos_pkey" PRIMARY KEY ("id_diagnostico")
);

-- CreateTable
CREATE TABLE "public"."historial_clinico" (
    "id_historial" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "eliminado" INTEGER DEFAULT -1,
    "fecha_eliminacion" TIMESTAMPTZ(6),
    "id_paciente" UUID,
    "descripcion" TEXT,
    "antecedentes" JSON,
    "alergias" JSON,
    "medicamentos" JSON,

    CONSTRAINT "historial_clinico_pkey" PRIMARY KEY ("id_historial")
);

-- CreateTable
CREATE TABLE "public"."mensajes" (
    "id_mensaje" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "eliminado" INTEGER DEFAULT -1,
    "fecha_eliminacion" TIMESTAMPTZ(6),
    "id_remitente" UUID,
    "id_receptor" UUID,
    "id_parametro_estado_mensaje" UUID,
    "contenido" TEXT,
    "fecha_envio" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensajes_pkey" PRIMARY KEY ("id_mensaje")
);

-- CreateTable
CREATE TABLE "public"."odontologos" (
    "id_usuario" UUID NOT NULL,
    "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "eliminado" INTEGER DEFAULT -1,
    "fecha_eliminacion" TIMESTAMPTZ(6),
    "especialidad" VARCHAR(100),
    "horario_trabajo" JSON,
    "firma_digital" VARCHAR(255),

    CONSTRAINT "odontologos_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "public"."pacientes" (
    "id_usuario" UUID NOT NULL,
    "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "eliminado" INTEGER DEFAULT -1,
    "fecha_eliminacion" TIMESTAMPTZ(6),
    "fecha_nacimiento" DATE,
    "direccion" TEXT,
    "configuracion_paciente" JSON,
    "fecha_registro" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "public"."pagos" (
    "id_pago" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "eliminado" INTEGER DEFAULT -1,
    "fecha_eliminacion" TIMESTAMPTZ(6),
    "id_cita" UUID,
    "monto" DECIMAL,
    "id_parametro_metodo_pago" UUID,
    "id_parametro_estado_pago" UUID,
    "fecha_pago" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "public"."parametros" (
    "id_parametro" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "eliminado" INTEGER DEFAULT -1,
    "fecha_eliminacion" TIMESTAMPTZ(6),
    "id_tipo_parametro" UUID,
    "nombre" VARCHAR(100),
    "descripcion" TEXT,

    CONSTRAINT "parametros_pkey" PRIMARY KEY ("id_parametro")
);

-- CreateTable
CREATE TABLE "public"."tipos_parametros" (
    "id_tipo_parametro" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "eliminado" INTEGER DEFAULT -1,
    "fecha_eliminacion" TIMESTAMPTZ(6),
    "nombre" VARCHAR(100),
    "descripcion" TEXT,

    CONSTRAINT "tipos_parametros_pkey" PRIMARY KEY ("id_tipo_parametro")
);

-- CreateTable
CREATE TABLE "public"."tratamientos" (
    "id_tratamiento" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "eliminado" INTEGER DEFAULT -1,
    "fecha_eliminacion" TIMESTAMPTZ(6),
    "nombre_tratamiento" VARCHAR(100),
    "descripcion" TEXT,
    "precio_estimado" DECIMAL,
    "duracion" INTEGER,
    "ar_model_url" VARCHAR(255),
    "id_parametro_estado_tratamiento" UUID,

    CONSTRAINT "tratamientos_pkey" PRIMARY KEY ("id_tratamiento")
);

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id_usuario" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "eliminado" INTEGER DEFAULT -1,
    "fecha_eliminacion" TIMESTAMPTZ(6),
    "id_parametro_rol" UUID,
    "nombres" VARCHAR(100),
    "apellidos" VARCHAR(100),
    "email " VARCHAR(100),
    "telefono" VARCHAR(50),
    "usuario" VARCHAR(100),
    "clave" VARCHAR(100),
    "avatar_url" VARCHAR(255),
    "identificacion" VARCHAR,
    "fecha_de_nacimiento" TIMESTAMP(6),
    "informacion_personal" VARCHAR,
    "direccion" VARCHAR,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email ");

-- AddForeignKey
ALTER TABLE "public"."auxiliares" ADD CONSTRAINT "auxiliares_id_parametro_tipo_auxiliar_fkey" FOREIGN KEY ("id_parametro_tipo_auxiliar") REFERENCES "public"."parametros"("id_parametro") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."auxiliares" ADD CONSTRAINT "auxiliares_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."citas" ADD CONSTRAINT "citas_id_auxiliar_fkey" FOREIGN KEY ("id_auxiliar") REFERENCES "public"."auxiliares"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."citas" ADD CONSTRAINT "citas_id_odontologo_fkey" FOREIGN KEY ("id_odontologo") REFERENCES "public"."odontologos"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."citas" ADD CONSTRAINT "citas_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "public"."pacientes"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."citas" ADD CONSTRAINT "citas_id_parametro_estado_cita_fkey" FOREIGN KEY ("id_parametro_estado_cita") REFERENCES "public"."parametros"("id_parametro") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."citas" ADD CONSTRAINT "citas_id_tratamiento_fkey" FOREIGN KEY ("id_tratamiento") REFERENCES "public"."tratamientos"("id_tratamiento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."diagnosticos" ADD CONSTRAINT "diagnosticos_id_cita_fkey" FOREIGN KEY ("id_cita") REFERENCES "public"."citas"("id_cita") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."diagnosticos" ADD CONSTRAINT "diagnosticos_id_odontologo_fkey" FOREIGN KEY ("id_odontologo") REFERENCES "public"."odontologos"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."diagnosticos" ADD CONSTRAINT "diagnosticos_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "public"."pacientes"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."historial_clinico" ADD CONSTRAINT "historial_clinico_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "public"."pacientes"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mensajes" ADD CONSTRAINT "mensajes_id_parametro_estado_mensaje_fkey" FOREIGN KEY ("id_parametro_estado_mensaje") REFERENCES "public"."parametros"("id_parametro") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mensajes" ADD CONSTRAINT "mensajes_id_receptor_fkey" FOREIGN KEY ("id_receptor") REFERENCES "public"."usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mensajes" ADD CONSTRAINT "mensajes_id_remitente_fkey" FOREIGN KEY ("id_remitente") REFERENCES "public"."usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."odontologos" ADD CONSTRAINT "odontologos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."pacientes" ADD CONSTRAINT "pacientes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."pagos" ADD CONSTRAINT "pagos_id_cita_fkey" FOREIGN KEY ("id_cita") REFERENCES "public"."citas"("id_cita") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."pagos" ADD CONSTRAINT "pagos_id_parametro_estado_pago_fkey" FOREIGN KEY ("id_parametro_estado_pago") REFERENCES "public"."parametros"("id_parametro") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."pagos" ADD CONSTRAINT "pagos_id_parametro_metodo_pago_fkey" FOREIGN KEY ("id_parametro_metodo_pago") REFERENCES "public"."parametros"("id_parametro") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."parametros" ADD CONSTRAINT "parametros_id_tipo_parametro_fkey" FOREIGN KEY ("id_tipo_parametro") REFERENCES "public"."tipos_parametros"("id_tipo_parametro") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tratamientos" ADD CONSTRAINT "tratamientos_id_parametro_estado_tratamiento_fkey" FOREIGN KEY ("id_parametro_estado_tratamiento") REFERENCES "public"."parametros"("id_parametro") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_id_parametro_rol_fkey" FOREIGN KEY ("id_parametro_rol") REFERENCES "public"."parametros"("id_parametro") ON DELETE NO ACTION ON UPDATE NO ACTION;


-- Inserción de tipos de parámetros
INSERT INTO tipos_parametros (nombre, descripcion)
VALUES 
  ('rol_de_usuario', 'Define los distintos roles del sistema'),
  ('tipo_de_auxiliar', 'Clasificación de los auxiliares'),
  ('estado_de_cita', 'Estados posibles de una cita'),
  ('estado_de_tratamiento', 'Fases o estado actual del tratamiento'),
  ('metodo_de_pago', 'Método utilizado para realizar un pago'),
  ('estado_de_pago', 'Situación de un pago realizado'),
  ('estado_de_mensaje', 'Control del estado del mensaje en el sistema');

-- Parámetros: Rol de Usuario
INSERT INTO parametros (id_tipo_parametro, nombre, descripcion)
VALUES
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'rol_de_usuario'), 'Paciente', 'Usuario que recibe atención odontológica'),
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'rol_de_usuario'), 'Odontólogo', 'Profesional de la salud dental'),
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'rol_de_usuario'), 'Auxiliar', 'Personal asistente o administrativo');

-- Parámetros: Tipo de Auxiliar
INSERT INTO parametros (id_tipo_parametro, nombre, descripcion)
VALUES
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'tipo_de_auxiliar'), 'Asistente', 'Asistente clínico del odontólogo'),
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'tipo_de_auxiliar'), 'Recepcionista', 'Encargado de la atención y citas');

-- Parámetros: Estado de Cita
INSERT INTO parametros (id_tipo_parametro, nombre, descripcion)
VALUES
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'estado_de_cita'), 'Pendiente', 'Cita programada pero no confirmada'),
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'estado_de_cita'), 'Confirmada', 'Cita confirmada por el consultorio'),
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'estado_de_cita'), 'Cancelada', 'Cita cancelada'),
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'estado_de_cita'), 'Completada', 'Cita atendida correctamente');

-- Parámetros: Estado de Tratamiento
INSERT INTO parametros (id_tipo_parametro, nombre, descripcion)
VALUES
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'estado_de_tratamiento'), 'Planeado', 'Tratamiento no iniciado'),
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'estado_de_tratamiento'), 'En progreso', 'Tratamiento actualmente en curso'),
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'estado_de_tratamiento'), 'Finalizado', 'Tratamiento terminado');

-- Parámetros: Método de Pago
INSERT INTO parametros (id_tipo_parametro, nombre, descripcion)
VALUES
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'metodo_de_pago'), 'Efectivo', 'Pago en efectivo'),
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'metodo_de_pago'), 'Tarjeta', 'Pago con tarjeta de crédito o débito'),
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'metodo_de_pago'), 'Transferencia', 'Pago mediante transferencia'),
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'metodo_de_pago'), 'Financiado', 'Pago por cuotas');

-- Parámetros: Estado de Pago
INSERT INTO parametros (id_tipo_parametro, nombre, descripcion)
VALUES
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'estado_de_pago'), 'Pendiente', 'Pago no realizado aún'),
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'estado_de_pago'), 'Pagado', 'Pago recibido'),
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'estado_de_pago'), 'Anulado', 'Pago cancelado');

-- Parámetros: Estado de Mensaje
INSERT INTO parametros (id_tipo_parametro, nombre, descripcion)
VALUES
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'estado_de_mensaje'), 'Enviado', 'Mensaje enviado pero no recibido'),
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'estado_de_mensaje'), 'Recibido', 'Mensaje recibido por el receptor'),
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'estado_de_mensaje'), 'Leído', 'Mensaje leído por el receptor');

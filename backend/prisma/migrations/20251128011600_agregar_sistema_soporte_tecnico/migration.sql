-- CreateTable
CREATE TABLE IF NOT EXISTS "tickets_soporte" (
    "id_ticket" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "eliminado" INTEGER DEFAULT -1,
    "fecha_eliminacion" TIMESTAMPTZ(6),
    "id_usuario" UUID,
    "asunto" VARCHAR(200),
    "estado" VARCHAR(50) DEFAULT 'abierto',
    "prioridad" VARCHAR(50) DEFAULT 'media',
    "fecha_cierre" TIMESTAMPTZ(6),
    CONSTRAINT "tickets_soporte_pkey" PRIMARY KEY ("id_ticket")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "mensajes_soporte" (
    "id_mensaje_soporte" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "eliminado" INTEGER DEFAULT -1,
    "fecha_eliminacion" TIMESTAMPTZ(6),
    "id_ticket" UUID,
    "id_usuario" UUID,
    "contenido" TEXT,
    "es_bot" BOOLEAN DEFAULT false,
    "leido" BOOLEAN DEFAULT false,
    CONSTRAINT "mensajes_soporte_pkey" PRIMARY KEY ("id_mensaje_soporte")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "respuestas_automaticas" (
    "id_respuesta" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "eliminado" INTEGER DEFAULT -1,
    "fecha_eliminacion" TIMESTAMPTZ(6),
    "palabra_clave" VARCHAR(100),
    "respuesta" TEXT,
    "activo" BOOLEAN DEFAULT true,
    "prioridad" INTEGER DEFAULT 0,
    CONSTRAINT "respuestas_automaticas_pkey" PRIMARY KEY ("id_respuesta")
);

-- AddForeignKey
ALTER TABLE "tickets_soporte" ADD CONSTRAINT "tickets_soporte_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mensajes_soporte" ADD CONSTRAINT "mensajes_soporte_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "tickets_soporte"("id_ticket") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mensajes_soporte" ADD CONSTRAINT "mensajes_soporte_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Insert respuestas automáticas predeterminadas
INSERT INTO "respuestas_automaticas" (palabra_clave, respuesta, prioridad, activo) VALUES
('hola', '¡Hola! 👋 Bienvenido al soporte técnico de DentAR. ¿En qué puedo ayudarte hoy?', 10, true),
('cita', 'Para agendar o consultar tus citas, puedes ir a la sección de "Citas" en el menú principal. Si necesitas cancelar o reprogramar, también puedes hacerlo desde allí. ¿Necesitas ayuda con algo específico?', 8, true),
('tratamiento', 'Puedes ver todos tus tratamientos disponibles en la sección "Tratamientos". Cada tratamiento incluye descripción, precio estimado y duración. ¿Te gustaría saber más sobre algún tratamiento en particular?', 8, true),
('pago', 'Para consultar o realizar pagos, visita la sección de "Pagos" en tu perfil. Aceptamos múltiples métodos de pago. Si tienes problemas con un pago, por favor proporciona más detalles.', 7, true),
('diagnostico', 'Tu historial de diagnósticos está disponible en la sección "Diagnósticos". Solo tu odontólogo puede agregar o modificar diagnósticos. ¿Necesitas más información?', 7, true),
('perfil', 'Puedes actualizar tu información personal en la sección "Configuración" o "Mi Perfil". Allí puedes cambiar tu contraseña, teléfono, dirección y más.', 6, true),
('contraseña', 'Para cambiar tu contraseña, ve a "Configuración" → "Seguridad" → "Cambiar contraseña". Si olvidaste tu contraseña, usa la opción "Recuperar contraseña" en la página de inicio de sesión.', 9, true),
('error', 'Lamento que estés experimentando problemas técnicos. Por favor, intenta: 1) Recargar la página, 2) Cerrar sesión e iniciar nuevamente, 3) Limpiar caché del navegador. Si el problema persiste, describe el error con más detalle.', 8, true),
('horario', 'Nuestro horario de atención es de Lunes a Viernes de 8:00 AM a 6:00 PM, y Sábados de 9:00 AM a 2:00 PM. Para emergencias, consulta la sección "Contacto".', 6, true),
('gracias', '¡De nada! 😊 Estoy aquí para ayudarte. Si tienes más preguntas, no dudes en escribir.', 5, true),
('ayuda', 'Estoy aquí para ayudarte con: 📅 Citas, 🦷 Tratamientos, 💳 Pagos, 👤 Perfil, 🔒 Contraseñas, y más. ¿Qué necesitas?', 10, true);

-- CreateTable
CREATE TABLE "public"."tickets_soporte" (
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
CREATE TABLE "public"."mensajes_soporte" (
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
CREATE TABLE "public"."respuestas_automaticas" (
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
ALTER TABLE "public"."tickets_soporte" ADD CONSTRAINT "tickets_soporte_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mensajes_soporte" ADD CONSTRAINT "mensajes_soporte_id_ticket_fkey" FOREIGN KEY ("id_ticket") REFERENCES "public"."tickets_soporte"("id_ticket") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mensajes_soporte" ADD CONSTRAINT "mensajes_soporte_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

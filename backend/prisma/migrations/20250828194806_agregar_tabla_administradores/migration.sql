-- CreateTable
CREATE TABLE "public"."administradores" (
    "id_usuario" UUID NOT NULL,
    "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "eliminado" INTEGER DEFAULT -1,
    "fecha_eliminacion" TIMESTAMPTZ(6),
    "id_parametro_tipo_admin" UUID,

    CONSTRAINT "administradores_pkey" PRIMARY KEY ("id_usuario")
);

-- AddForeignKey
ALTER TABLE "public"."administradores" ADD CONSTRAINT "administradores_id_parametro_tipo_admin_fkey" FOREIGN KEY ("id_parametro_tipo_admin") REFERENCES "public"."parametros"("id_parametro") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."administradores" ADD CONSTRAINT "administradores_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;



-- Inserción de tipo de parámetro "tipo_de_administrador"
INSERT INTO tipos_parametros (nombre, descripcion)
VALUES 
  ('tipo_de_administrador', 'Clasificación de los administradores del sistema');

-- Insertar Parámetros: Tipo de Adminsitrador
INSERT INTO parametros (id_tipo_parametro, nombre, descripcion)
VALUES
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'tipo_de_administrador'), 'Superadmin', 'Administrador con todos los privilegios'),
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'tipo_de_administrador'), 'General', 'Administrador con privilegios generales');

-- Insertar Parámetros: Rol de Usuario Administrador
INSERT INTO parametros (id_tipo_parametro, nombre, descripcion)
VALUES
  ((SELECT id_tipo_parametro FROM tipos_parametros WHERE nombre = 'rol_de_usuario'), 'Administrador', 'Administrador del sistema')
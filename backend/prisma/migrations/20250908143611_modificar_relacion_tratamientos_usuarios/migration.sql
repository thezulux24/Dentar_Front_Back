/*
  Warnings:

  - You are about to drop the column `id_tratamiento` on the `citas` table. All the data in the column will be lost.
  - You are about to drop the column `id_parametro_estado_tratamiento` on the `tratamientos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."citas" DROP CONSTRAINT "citas_id_tratamiento_fkey";

-- DropForeignKey
ALTER TABLE "public"."tratamientos" DROP CONSTRAINT "tratamientos_id_parametro_estado_tratamiento_fkey";

-- AlterTable
ALTER TABLE "public"."citas" DROP COLUMN "id_tratamiento",
ADD COLUMN     "id_tratamiento_usuario" UUID;

-- AlterTable
ALTER TABLE "public"."tratamientos" DROP COLUMN "id_parametro_estado_tratamiento",
ADD COLUMN     "imagen_url" VARCHAR(255);

-- CreateTable
CREATE TABLE "public"."tratamientos_usuarios" (
    "id_tratamiento_usuario" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "id_usuario" UUID NOT NULL,
    "id_tratamiento" UUID NOT NULL,
    "fecha_creacion" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    "eliminado" INTEGER DEFAULT -1,
    "fecha_eliminacion" TIMESTAMPTZ(6),
    "id_parametro_estado_tratamiento" UUID,

    CONSTRAINT "tratamientos_usuarios_pkey" PRIMARY KEY ("id_tratamiento_usuario")
);

-- AddForeignKey
ALTER TABLE "public"."citas" ADD CONSTRAINT "citas_id_tratamiento_usuario_fkey" FOREIGN KEY ("id_tratamiento_usuario") REFERENCES "public"."tratamientos_usuarios"("id_tratamiento_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tratamientos_usuarios" ADD CONSTRAINT "tratamientos_usuarios_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tratamientos_usuarios" ADD CONSTRAINT "tratamientos_usuarios_id_tratamiento_fkey" FOREIGN KEY ("id_tratamiento") REFERENCES "public"."tratamientos"("id_tratamiento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tratamientos_usuarios" ADD CONSTRAINT "tratamientos_usuarios_id_parametro_estado_tratamiento_fkey" FOREIGN KEY ("id_parametro_estado_tratamiento") REFERENCES "public"."parametros"("id_parametro") ON DELETE NO ACTION ON UPDATE NO ACTION;

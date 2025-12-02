-- AlterTable
ALTER TABLE "public"."pagos" ADD COLUMN     "id_tratamiento_usuario" UUID;

-- AddForeignKey
ALTER TABLE "public"."pagos" ADD CONSTRAINT "pagos_id_tratamiento_usuario_fkey" FOREIGN KEY ("id_tratamiento_usuario") REFERENCES "public"."tratamientos_usuarios"("id_tratamiento_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

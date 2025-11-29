-- AlterTable
ALTER TABLE "public"."pagos" ADD COLUMN     "id_paciente" UUID,
ADD COLUMN     "observaciones" TEXT;

-- AddForeignKey
ALTER TABLE "public"."pagos" ADD CONSTRAINT "pagos_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "public"."pacientes"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

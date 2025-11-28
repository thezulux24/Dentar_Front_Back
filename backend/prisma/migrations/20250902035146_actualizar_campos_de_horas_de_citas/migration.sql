/*
  Warnings:

  - The `hora_inicio_cita` column on the `citas` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hora_fin_cita` column on the `citas` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."citas" ALTER COLUMN "fecha_cita" SET DATA TYPE TIMESTAMPTZ(6),
DROP COLUMN "hora_inicio_cita",
ADD COLUMN     "hora_inicio_cita" TIMESTAMPTZ(6),
DROP COLUMN "hora_fin_cita",
ADD COLUMN     "hora_fin_cita" TIMESTAMPTZ(6);

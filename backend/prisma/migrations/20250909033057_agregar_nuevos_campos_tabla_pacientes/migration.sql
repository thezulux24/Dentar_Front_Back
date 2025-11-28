/*
  Warnings:

  - You are about to drop the column `direccion` on the `pacientes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."pacientes" DROP COLUMN "direccion",
ADD COLUMN     "alergias" TEXT,
ADD COLUMN     "tolerante_anestesia" TEXT,
ADD COLUMN     "tratamientos_previos" TEXT;

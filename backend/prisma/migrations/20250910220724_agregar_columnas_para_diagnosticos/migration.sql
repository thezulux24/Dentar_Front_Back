-- AlterTable
ALTER TABLE "public"."diagnosticos" ADD COLUMN     "anamnesis" JSON,
ADD COLUMN     "examen_fisico" JSON,
ADD COLUMN     "historial_medico" JSON,
ADD COLUMN     "informacion_tratamiento" JSON,
ADD COLUMN     "notas_medico" TEXT,
ADD COLUMN     "odontograma" JSON,
ADD COLUMN     "odontograma_denticion" JSON,
ADD COLUMN     "plan_tratamiento" JSON;

-- AlterTable
ALTER TABLE "public"."pacientes" ADD COLUMN     "barrio" TEXT,
ADD COLUMN     "condiciones_medicas_previas" TEXT,
ADD COLUMN     "eps" TEXT,
ADD COLUMN     "informacion_acudiente" JSON,
ADD COLUMN     "medicamentos_actuales" TEXT,
ADD COLUMN     "ocupacion" TEXT;

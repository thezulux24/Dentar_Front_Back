import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de tratamientos...');

  const tratamientos = [
    {
      nombre_tratamiento: 'Blanqueamiento Dental',
      descripcion: 'Procedimiento estético que utiliza agentes blanqueadores para reducir manchas y aclarar el tono de los dientes.',
      precio_estimado: 150000,
      duracion: 60,
      imagen_url: 'https://doctororal.com/assets/img/about.jpg',
      ar_model_url: '/filters/whitening',
    },
    {
      nombre_tratamiento: 'Ortodoncia',
      descripcion: 'Tratamiento para corregir la posición de los dientes y mejorar la mordida mediante brackets o alineadores transparentes.',
      precio_estimado: 2500000,
      duracion: 120,
      imagen_url: 'https://doctororal.com/assets/img/about.jpg',
      ar_model_url: '/filters/ortodoncy',
    },
    {
      nombre_tratamiento: 'Implantes Dentales',
      descripcion: 'Solución permanente para reemplazar dientes perdidos, proporcionando una apariencia y función similar a los dientes naturales.',
      precio_estimado: 3500000,
      duracion: 90,
      imagen_url: 'https://doctororal.com/assets/img/about.jpg',
      ar_model_url: '/filters/protesis',
    },
    {
      nombre_tratamiento: 'Limpieza Dental',
      descripcion: 'Consiste en la eliminación de placa y sarro acumulados en los dientes y debajo de las encías.',
      precio_estimado: 80000,
      duracion: 45,
      imagen_url: 'https://doctororal.com/assets/img/about.jpg',
      ar_model_url: '',
    },
    {
      nombre_tratamiento: 'Endodoncia',
      descripcion: 'Este tratamiento se realiza cuando el tejido pulpar del diente se ve afectado por una infección o lesión.',
      precio_estimado: 350000,
      duracion: 90,
      imagen_url: 'https://doctororal.com/assets/img/about.jpg',
      ar_model_url: '',
    },
    {
      nombre_tratamiento: 'Carillas Dentales',
      descripcion: 'Finas láminas de porcelana o composite que corrigen manchas, fracturas o desalineaciones dentales.',
      precio_estimado: 450000,
      duracion: 120,
      imagen_url: 'https://doctororal.com/assets/img/about.jpg',
      ar_model_url: '',
    },
    {
      nombre_tratamiento: 'Incrustaciones Dentales',
      descripcion: 'Restauración dental que repara cavidades amplias o daños en la superficie masticatoria.',
      precio_estimado: 300000,
      duracion: 60,
      imagen_url: 'https://doctororal.com/assets/img/about.jpg',
      ar_model_url: '',
    },
    {
      nombre_tratamiento: 'Brackets Linguales',
      descripcion: 'Ortodoncia que utiliza brackets en la cara interna de los dientes, lo que hace que sean prácticamente invisibles.',
      precio_estimado: 3000000,
      duracion: 120,
      imagen_url: 'https://doctororal.com/assets/img/about.jpg',
      ar_model_url: '',
    },
    {
      nombre_tratamiento: 'Injerto Óseo',
      descripcion: 'Procedimiento que estimula el crecimiento óseo en áreas con pérdida ósea, preparándolas para implantes dentales.',
      precio_estimado: 800000,
      duracion: 90,
      imagen_url: 'https://doctororal.com/assets/img/about.jpg',
      ar_model_url: '',
    },
    {
      nombre_tratamiento: 'Extracción Dental',
      descripcion: 'Procedimiento para remover dientes dañados, infectados o que causan problemas de espacio.',
      precio_estimado: 100000,
      duracion: 30,
      imagen_url: 'https://doctororal.com/assets/img/about.jpg',
      ar_model_url: '',
    },
    {
      nombre_tratamiento: 'Corona Dental',
      descripcion: 'Funda que cubre completamente un diente dañado para protegerlo y restaurar su forma y función.',
      precio_estimado: 600000,
      duracion: 90,
      imagen_url: 'https://doctororal.com/assets/img/about.jpg',
      ar_model_url: '',
    },
    {
      nombre_tratamiento: 'Puente Dental',
      descripcion: 'Prótesis fija que reemplaza uno o más dientes perdidos, anclándose a los dientes adyacentes.',
      precio_estimado: 1200000,
      duracion: 120,
      imagen_url: 'https://doctororal.com/assets/img/about.jpg',
      ar_model_url: '',
    },
  ];

  for (const tratamiento of tratamientos) {
    // Verificar si ya existe
    const existente = await prisma.tratamientos.findFirst({
      where: {
        nombre_tratamiento: tratamiento.nombre_tratamiento,
        eliminado: -1,
      },
    });

    if (!existente) {
      await prisma.tratamientos.create({
        data: tratamiento,
      });
      console.log(`✅ Creado: ${tratamiento.nombre_tratamiento}`);
    } else {
      console.log(`⏭️  Ya existe: ${tratamiento.nombre_tratamiento}`);
    }
  }

  console.log('🎉 Seed de tratamientos completado!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

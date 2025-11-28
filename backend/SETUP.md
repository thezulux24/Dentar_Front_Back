# Guía de Configuración del Backend - DentAR

## Requisitos previos

- Node.js v18 o superior
- PostgreSQL 15 o superior
- Docker Desktop (opcional, recomendado para desarrollo)

---

## Configuración de PostgreSQL

### Opción 1: Con Docker (Recomendado)

#### Instalar Docker Desktop
1. Descarga Docker Desktop desde https://www.docker.com/products/docker-desktop/
2. Instala y reinicia tu computadora si es necesario
3. Abre Docker Desktop y espera a que inicie completamente

#### Crear contenedor PostgreSQL

```powershell
docker run --name dentar-postgres `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=1087423755 `
  -e POSTGRES_DB=icesi_dentar `
  -p 5432:5432 `
  -d postgres:15
```

#### Crear extensión uuid-ossp

```powershell
docker exec -it dentar-postgres psql -U postgres -d icesi_dentar
```

Dentro de psql:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\q
```

#### Comandos útiles de Docker

```powershell
# Ver contenedores corriendo
docker ps

# Detener el contenedor (los datos persisten)
docker stop dentar-postgres

# Iniciar el contenedor
docker start dentar-postgres

# Ver logs
docker logs dentar-postgres

# Eliminar contenedor completamente (borra datos)
docker rm -f dentar-postgres
```

### Opción 2: PostgreSQL nativo en Windows

#### Instalación
1. Descarga PostgreSQL desde https://www.postgresql.org/download/windows/
2. Durante la instalación configura:
   - Puerto: 5432
   - Usuario: postgres
   - Contraseña: 1087423755

#### Verificar servicio

```powershell
# Ver estado del servicio
Get-Service postgresql*

# Iniciar servicio si está detenido
Start-Service postgresql-x64-15
```

#### Crear base de datos

```powershell
psql -U postgres -h localhost
```

Dentro de psql:
```sql
CREATE DATABASE icesi_dentar;
\c icesi_dentar
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\q
```

---

## Configuración del proyecto

### 1. Instalar dependencias

```powershell
cd C:\projects\Dentar_Front_Back\backend
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.sample` a `.env`:

```powershell
Copy-Item .env.sample .env
```

El archivo `.env` debe contener:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:1087423755@localhost:5432/icesi_dentar?schema=public"
JWT_SECRET="super_secret_jwt_key_change_me"
NODE_ENV=development
```

Nota: El archivo `.env` está en `.gitignore` y no debe subirse al repositorio.

### 3. Generar cliente Prisma

```powershell
npx prisma generate
```

Este comando genera el cliente TypeScript de Prisma basado en el schema definido en `prisma/schema.prisma`.

---

## Gestión de la base de datos con Prisma

### Migraciones disponibles

El proyecto incluye las siguientes migraciones en `prisma/migrations/`:

1. `20250828191343_inicio` - Creación inicial de todas las tablas
2. `20250828194806_agregar_tabla_administradores` - Tabla administradores
3. `20250902035146_actualizar_campos_de_horas_de_citas` - Actualización de citas
4. `20250908143611_modificar_relacion_tratamientos_usuarios` - Relación tratamientos
5. `20250909033057_agregar_nuevos_campos_tabla_pacientes` - Campos en pacientes
6. `20250910020615_agregar_columna_sede_en_odontologos` - Columna sede
7. `20250910220724_agregar_columnas_para_diagnosticos` - Columnas diagnósticos

### Aplicar migraciones

#### Para producción o aplicar migraciones existentes:

```powershell
npx prisma migrate deploy
```

#### Para desarrollo (aplica y permite crear nuevas migraciones):

```powershell
npx prisma migrate dev
```

### Comandos útiles de Prisma

```powershell
# Ver estado de las migraciones
npx prisma migrate status

# Resetear base de datos completamente (BORRA TODOS LOS DATOS)
npx prisma migrate reset

# Abrir Prisma Studio (interfaz visual para ver/editar datos)
npx prisma studio
# Se abre en http://localhost:5555

# Verificar conexión a la base de datos
npx prisma db pull
```

### Datos iniciales (Seeds)

La primera migración (`20250828191343_inicio`) incluye datos iniciales:

**Tipos de parámetros (7 registros):**
- rol_de_usuario
- tipo_de_auxiliar
- estado_de_cita
- estado_de_tratamiento
- metodo_de_pago
- estado_de_pago
- estado_de_mensaje

**Parámetros (~30 registros):**
- Roles: Paciente, Odontólogo, Auxiliar
- Estados de cita: Pendiente, Confirmada, Cancelada, Completada
- Métodos de pago: Efectivo, Tarjeta, Transferencia, Financiado
- Y otros parámetros del sistema

---

## Iniciar el servidor

### Modo desarrollo (con hot reload)

```powershell
npm run start:dev
```

### Modo normal

```powershell
npm run start
```

### Modo producción

```powershell
npm run build
npm run start:prod
```

### Verificar que funciona

- API: http://localhost:3000
- Documentación Swagger: http://localhost:3000/docs

---

## Estructura de la base de datos

### Tablas principales

- `usuarios` - Tabla base de usuarios
- `pacientes` - Información de pacientes
- `odontologos` - Información de odontólogos
- `auxiliares` - Información de auxiliares
- `administradores` - Información de administradores
- `citas` - Citas médicas
- `diagnosticos` - Diagnósticos médicos
- `tratamientos` - Tratamientos disponibles
- `pagos` - Registros de pagos
- `mensajes` - Sistema de mensajería
- `parametros` - Parámetros del sistema
- `tipos_parametros` - Tipos de parámetros
- `historial_clinico` - Historial clínico de pacientes

### Schema Prisma

El schema completo está en `prisma/schema.prisma`. Incluye:
- Definición de todas las tablas y campos
- Relaciones entre tablas
- Índices y constraints
- Configuración de generador y datasource

---

## Troubleshooting

### Error: "Environment variable not found: DATABASE_URL"

Solución:
1. Verifica que existe el archivo `.env` en `backend/`
2. Confirma que contiene la línea `DATABASE_URL="..."`
3. Reinicia el servidor

### Error: "Can't reach database server"

Solución:
1. Verifica que PostgreSQL está corriendo:
   - Docker: `docker ps`
   - Windows: `Get-Service postgresql*`
2. Prueba la conexión: `psql -h localhost -U postgres -d icesi_dentar`

### Error: "Database does not exist"

Solución:
```powershell
psql -U postgres -h localhost
CREATE DATABASE icesi_dentar;
\q
```

### Error: "Extension uuid-ossp does not exist"

Solución con Docker:
```powershell
docker exec -it dentar-postgres psql -U postgres -d icesi_dentar
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\q
```

Solución sin Docker:
```powershell
psql -U postgres -d icesi_dentar
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\q
```

### Error de compilación TypeScript con Prisma

Solución:
```powershell
npx prisma generate
npm run build
```

### Problemas con migraciones pendientes

Solución:
```powershell
# Ver estado
npx prisma migrate status

# Aplicar pendientes
npx prisma migrate deploy
```

---

## Backup y restauración

### Crear backup

```powershell
# Con Docker
docker exec dentar-postgres pg_dump -U postgres icesi_dentar > backup.sql

# Sin Docker
pg_dump -U postgres -h localhost icesi_dentar > backup.sql
```

### Restaurar desde backup

```powershell
# Con Docker
Get-Content backup.sql | docker exec -i dentar-postgres psql -U postgres -d icesi_dentar

# Sin Docker
psql -U postgres -h localhost -d icesi_dentar < backup.sql
```

---

## Solicitar acceso a bases de datos del equipo

### Para entornos de staging/producción

Contacta al Tech Lead o DevOps y solicita:

1. DATABASE_URL del ambiente correspondiente
   - Host/IP del servidor PostgreSQL
   - Puerto
   - Nombre de la base de datos
   - Usuario y contraseña
   - Configuración SSL si aplica

2. JWT_SECRET del ambiente

3. Otras variables de entorno necesarias

4. Información sobre:
   - Acceso VPN o whitelist de IPs
   - Proceso para aplicar migraciones
   - Documentación de deployment

### Importante

- NUNCA apliques migraciones directamente en producción
- Coordina cambios en el schema con el equipo
- Usa `npx prisma migrate deploy` en producción (nunca `dev`)
- Documenta todos los cambios en pull requests

---

## Checklist de setup completo

- [ ] PostgreSQL instalado y corriendo
- [ ] Archivo `.env` configurado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Cliente Prisma generado (`npx prisma generate`)
- [ ] Migraciones aplicadas (`npx prisma migrate deploy`)
- [ ] Servidor inicia sin errores (`npm run start:dev`)
- [ ] Swagger accesible en http://localhost:3000/docs
- [ ] Prisma Studio funciona (`npx prisma studio`)

---

Fecha de última actualización: 27 de noviembre de 2025

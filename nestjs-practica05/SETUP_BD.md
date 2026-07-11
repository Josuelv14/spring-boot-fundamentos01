# 🚀 Guía Rápida: Levantando el Servidor

## Opción 1: Docker Compose (RECOMENDADO)

### Requisitos
- Docker Desktop instalado en Windows
- El archivo `docker-compose.yml` en la raíz del proyecto

### Pasos

#### 1️⃣ Levantar PostgreSQL con Docker
```powershell
docker-compose up -d
```

**Qué hace esto:**
- Descarga la imagen de PostgreSQL 15 (si no la tienes)
- Crea un contenedor llamado `nestjs-practica05-db`
- Expone PostgreSQL en `localhost:5432`
- Configura credenciales: usuario `postgres`, password `1234`

**Verificar que el contenedor está corriendo:**
```powershell
docker-compose ps
```

Deberías ver algo como:
```
NAME                      COMMAND                 STATUS
nestjs-practica05-db      "docker-entrypoint..."  Up (healthy)
```

#### 2️⃣ Instalar dependencias
```powershell
npm install
# o si usas pnpm:
pnpm install
```

#### 3️⃣ Iniciar el servidor de desarrollo
```powershell
npm run start:dev
```

Deberías ver en la consola:
```
[Nest] 12345  - 01/01/2024, 10:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 01/01/2024, 10:00:00 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized...
✓ Application successfully started on http://localhost:3000
```

---

## Opción 2: PostgreSQL Nativo en Windows

Si prefieres instalar PostgreSQL nativamente:

1. Descarga desde: https://www.postgresql.org/download/windows/
2. Durante la instalación, establece:
   - Usuario: `postgres`
   - Password: `1234`
   - Puerto: `5432`

3. Verifica que el servicio está corriendo en `Services` (services.msc)

---

## ⚙️ Configuración de Conexión

El proyecto está configurado en `src/app.module.ts`:
```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'postgres',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
})
```

**Si necesitas cambiar credenciales**, edita este archivo directamente.

---

## 🧪 Verificar Conexión

### Opción 1: Mediante la API
```powershell
curl http://localhost:3000/users
```

Deberías recibir: `[]` (array vacío) o un error 200

### Opción 2: Mediante Docker
```powershell
docker exec -it nestjs-practica05-db psql -U postgres -d postgres -c "SELECT 1"
```

Deberías ver:
```
 ?column?
----------
        1
(1 row)
```

---

## 🛑 Detener PostgreSQL

### Con Docker Compose
```powershell
# Pausar (conserva datos)
docker-compose stop

# Eliminar contenedor (conserva datos en volumen)
docker-compose down

# Eliminar todo incluida la BD
docker-compose down -v
```

---

## 🆘 Solución de Problemas

### "Error: bind: address already in use :5432"
PostgreSQL ya está ejecutándose en otro lugar.

**Solución:**
```powershell
# Listar todos los contenedores
docker ps -a

# Detener el contenedor conflictivo
docker stop <container_id>

# O cambiar el puerto en docker-compose.yml:
# ports:
#   - "5433:5432"  # Usa el puerto 5433 en host
```

### "Unable to connect to the database. Retrying..."
El contenedor aún no está listo.

**Solución:**
```powershell
# Esperar a que el contenedor esté healthy
docker-compose ps

# Ver logs del contenedor
docker-compose logs postgres
```

### "database postgres does not exist"
La base de datos no se creó automáticamente.

**Solución - crear manualmente:**
```powershell
docker exec -it nestjs-practica05-db psql -U postgres -c "CREATE DATABASE practica05;"
```

Luego actualiza `app.module.ts`:
```typescript
database: 'practica05',  // en lugar de 'postgres'
```

---

## 📊 Herramientas Útiles

### Acceder a PostgreSQL directamente
```powershell
# Conexión interactiva (psql)
docker exec -it nestjs-practica05-db psql -U postgres

# Una vez dentro:
# \l                    (listar bases de datos)
# \dt                   (listar tablas)
# SELECT * FROM users;  (consulta de prueba)
# \q                    (salir)
```

### Visualizar BD con GUI
Instala DBeaver Community (gratuito):
- Descarga: https://dbeaver.io/download/
- Conexión: host=localhost, puerto=5432, usuario=postgres, password=1234

---

## ✅ Checklist de Inicio

- [ ] Docker Desktop está instalado y ejecutándose
- [ ] `docker-compose.yml` existe en la raíz del proyecto
- [ ] `npm install` ya se ejecutó
- [ ] PostgreSQL está corriendo: `docker-compose ps` muestra "healthy"
- [ ] Servidor inició sin errores: `npm run start:dev`
- [ ] API responde: `curl http://localhost:3000/users`

---

**Si todo está bien, ¡deberías poder probar los endpoints ahora! 🎉**

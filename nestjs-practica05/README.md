# NestJS Práctica 5 - CRUD API with TypeORM + PostgreSQL

Aplicación NestJS con TypeORM y PostgreSQL para gestión de usuarios y productos con arquitectura layered (controllers → services → repository → entity).

## Requisitos

- **Node.js** 18+
- **npm** o **pnpm**
- **PostgreSQL 16** (via Docker)
- **Docker**

## Setup

### 1. Crear contenedor PostgreSQL

```bash
docker run -d \
  --name postgres-dev \
  -e POSTGRES_USER=ups \
  -e POSTGRES_PASSWORD=ups123 \
  -p 5432:5432 \
  postgres:16
```

### 2. Crear base de datos

```bash
docker exec postgres-dev psql -U ups -d postgres -c "CREATE DATABASE devdb_nest;"
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Ejecutar la aplicación

```bash
npm run start:dev
```

La aplicación se levantará en `http://localhost:3000`

## Estructura del Proyecto

```
src/
├── main.ts
├── app.module.ts
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── dtos/
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   │   ├── partial-update-user.dto.ts
│   │   └── user-response.dto.ts
│   ├── mappers/
│   │   └── user.mapper.ts
│   └── models/
│       └── user.model.ts
├── products/
│   ├── products.controller.ts
│   ├── products.service.ts
│   ├── products.module.ts
│   ├── entities/
│   │   └── product.entity.ts
│   ├── dtos/
│   │   ├── create-product.dto.ts
│   │   ├── update-product.dto.ts
│   │   ├── partial-update-product.dto.ts
│   │   └── product-response.dto.ts
│   ├── mappers/
│   │   └── product.mapper.ts
│   └── models/
│       └── product.model.ts
```

## API Endpoints

### Users

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Obtener todos los usuarios (no eliminados) |
| GET | `/api/users/:id` | Obtener usuario por ID |
| POST | `/api/users` | Crear nuevo usuario |
| PUT | `/api/users/:id` | Actualizar usuario completo |
| PATCH | `/api/users/:id` | Actualizar usuario parcial |
| DELETE | `/api/users/:id` | Eliminar usuario (soft delete) |

### Products

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Obtener todos los productos (no eliminados) |
| GET | `/api/products/:id` | Obtener producto por ID |
| POST | `/api/products` | Crear nuevo producto |
| PUT | `/api/products/:id` | Actualizar producto completo |
| PATCH | `/api/products/:id` | Actualizar producto parcial |
| DELETE | `/api/products/:id` | Eliminar producto (soft delete) |

## Ejemplos de Uso

### Crear usuario

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "passwordHash": "hashed_password_here"
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "createdAt": "2026-06-24T09:36:45Z",
  "updatedAt": "2026-06-24T09:36:45Z"
}
```

### Obtener todos los usuarios

```bash
curl http://localhost:3000/api/users
```

### Crear producto

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 1299.99,
    "stock": 5
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "name": "Laptop",
  "price": 1299.99,
  "stock": 5,
  "createdAt": "2026-06-24T09:36:45Z",
  "updatedAt": "2026-06-24T09:36:45Z"
}
```

### Actualizar producto (PUT - completo)

```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Dell",
    "price": 1499.99,
    "stock": 3
  }'
```

### Actualizar producto parcialmente (PATCH)

```bash
curl -X PATCH http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 1399.99}'
```

### Eliminar producto

```bash
curl -X DELETE http://localhost:3000/api/products/1
```

## Características

✅ **CRUD Completo** - Create, Read, Update, Partial Update, Delete  
✅ **Soft Delete** - Registros marcados como eliminados en DB  
✅ **DTOs** - Data Transfer Objects para validación  
✅ **Mappers** - Conversión entre Entity ↔ Model ↔ DTO  
✅ **Services** - Lógica de negocio centralizada  
✅ **TypeORM** - ORM con sincronización automática de esquema  
✅ **Error Handling** - Manejo de excepciones (404 Not Found)  

## Verificación

Cuando la app inicie, deberías ver:

```
[Nest] 14740  - 24/06/2026, 9:36:45 a. m.     LOG [NestFactory] Starting Nest application...
...
query: CREATE TABLE "users" ...
query: CREATE TABLE "products" ...
[Nest] 14740  - 24/06/2026, 9:36:45 a. m.     LOG [NestApplication] Nest application successfully started +1ms
NestJS app listening on http://localhost:3000
```

Si ves esto, **todo está funcionando correctamente** ✅

## Troubleshooting

### Error: `ECONNREFUSED 127.0.0.1:5432`

El contenedor PostgreSQL no está corriendo. Ejecuta:

```bash
docker run -d --name postgres-dev -e POSTGRES_USER=ups -e POSTGRES_PASSWORD=ups123 -p 5432:5432 postgres:16
```

### Error: `database "devdb_nest" does not exist`

Crea la base de datos:

```bash
docker exec postgres-dev psql -U ups -d postgres -c "CREATE DATABASE devdb_nest;"
```

### Ver logs de PostgreSQL

```bash
docker logs postgres-dev
```

### Conectar a PostgreSQL interactivamente

```bash
docker exec -it postgres-dev psql -U ups -d devdb_nest
```


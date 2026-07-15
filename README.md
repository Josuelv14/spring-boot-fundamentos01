# Práctica 14 - Spring Boot: Preparación y despliegue de APIs

## Objetivo

Documentar la preparación y validación de la API Spring Boot del proyecto, incluyendo:
- despliegue local con Docker Compose,
- verificación de health checks con Spring Boot Actuator,
- registro y autenticación de usuarios con JWT,
- validación de acceso protegido a los endpoints de métricas.

## Requisitos previos

- Java 17
- Docker Desktop instalado y ejecutándose
- Git
- Postman o Insomnia

## Ejecutar el proyecto

### Opción 1: Docker Compose

```bash
docker compose up -d --build
```

### Verificar que la API esté levantada

```bash
curl http://localhost:8080/actuator/health
```

Respuesta esperada:

```json
{
  "status": "UP"
}
```

## Endpoints a probar

### 1) Health check público

- Método: GET
- URL: http://localhost:8080/actuator/health

### 2) Registro de usuario

- Método: POST
- URL: http://localhost:8080/auth/register

Body JSON:

```json
{
  "name": "Admin User",
  "email": "admin@ups.edu.ec",
  "password": "Admin123"
}
```

Respuesta esperada:
- Código HTTP 201 Created
- JSON con el token JWT en el campo correspondiente

### 3) Login

- Método: POST
- URL: http://localhost:8080/auth/login

Body JSON:

```json
{
  "email": "admin@ups.edu.ec",
  "password": "Admin123"
}
```

### 4) Metrics protegidos con JWT

- Método: GET
- URL: http://localhost:8080/actuator/metrics
- Header:
  - Authorization: Bearer <token>

Respuesta esperada:
- Código HTTP 200 OK
- JSON con las métricas disponibles

## Evidencia para la práctica

### Paso 1 - Health check

Captura requerida:
- Endpoint: http://localhost:8080/actuator/health
- Resultado esperado: "status": "UP"

![Paso 1 - Health Check Exitoso con Actuator](cap14%20p1.png)

### Paso 2 - Registro del usuario y recepción del token

Captura requerida:
- Endpoint: http://localhost:8080/auth/register
- Resultado esperado: respuesta 201 y token JWT

![Paso 2 - Registro de Usuario Exitoso y Generación de Token JWT](cap14%20p3.jpg)

### Paso 3 - Actuator Metrics con token

Captura requerida:
- Endpoint: http://localhost:8080/actuator/metrics
- Header Authorization con Bearer token
- Resultado esperado: 200 OK

![Paso 3 - Validación de Acceso Autorizado al Endpoint Protegido de Métricas](cap14%20p2.jpg)

## Estructura del proyecto relevante

- security/controllers/AuthController
- security/dtos/LoginRequestDto
- security/dtos/RegisterRequestDto
- security/filters/JwtAuthenticationFilter
- security/services/AuthService

## Notas importantes

- La contraseña debe cumplir con la validación actual:
  - mínimo 8 caracteres,
  - al menos una mayúscula,
  - una minúscula,
  - un número.
- Si el contenedor de PostgreSQL no genera tablas al inicio, revisar el modo de JPA en la configuración de producción.

## Comandos útiles

```bash
# Ver logs de la API
docker compose logs -f api

# Ver logs de PostgreSQL
docker compose logs -f postgres

# Detener los servicios
docker compose down
```

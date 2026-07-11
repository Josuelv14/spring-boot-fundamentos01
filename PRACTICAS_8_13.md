# Prácticas 8 a 13

## 📝 Resumen de Entradas para el README

### 📂 Práctica 8: Relaciones ManyToOne, Foreign Keys y Consultas Relacionales

- **Evidencias Gráficas (Capturas):**
  1. Estructura o descripción de la tabla `products` en PostgreSQL (`\d products`), evidenciando las columnas `user_id` y `category_id` como claves foráneas.
  2. Respuesta en Bruno/Postman de la **creación de un producto (POST)** mostrando los objetos anidados completos de `owner` y `categories` y campos de fecha.
  3. Consulta de productos por categoría (`GET /api/products/category/1`).

- **Pregunta a Responder:**
  - *¿Cómo se relaciona ProductEntity con UserEntity y CategoryEntity usando @ManyToOne y @JoinColumn?*

- **Respuesta sugerida:**
  - `@ManyToOne` indica que múltiples registros de productos pertenecen a un solo usuario o categoría.
  - `@JoinColumn` define físicamente el nombre de la columna de la clave foránea (`user_id`, `category_id`) en la tabla `products` de la base de datos, mapeando la relación relacional en objetos.

1. Descripción de la tabla products en PostgreSQL:
![Estructura Tabla Products](nestjs-practica05/anexos/cap1%20p8.png)

2. Creación de producto con relaciones anidadas:
![Crear Producto](nestjs-practica05/anexos/cap2%20p8.png)

3. Consulta de productos por categoría:
![Productos por Categoría](nestjs-practica05/anexos/cap3%20p8.png)
---

### 📂 Práctica 9: Request Parameters, Consultas Relacionadas y Filtrado con JPA (ManyToMany)

- **Evidencias Gráficas (Capturas):**
  1. Respuesta JSON de la creación de un producto asociado a **varias categorías** (Arreglo `categoryIds: [1, 2, 3]`).
  2. Consulta con filtros por usuario (`GET /api/users/1/products?name=laptop&minPrice=500`).
  3. Consulta con filtros por categoría (`GET /api/categories/2/products?userId=1`).

- **Preguntas a Responder:**
  - *¿Por qué se usa ProductService y ProductRepository para consultar productos aunque el endpoint esté bajo la semántica de /users o /categories?*
  - *¿Qué cambió al pasar de Product N ──── 1 Category a Product N ──── N Category?*

- **Respuesta sugerida:**
  - Se usa el repositorio y servicio de productos porque el recurso final que se extrae y procesa de la BD es la entidad `Product`.
  - Cambiar a `ManyToMany` eliminó la columna `category_id` directa e implementó una tabla intermedia (`product_categories`) con llaves compuestas, requiriendo consultas con `JOIN` y `DISTINCT` para evitar registros duplicados.

1. Respuesta JSON de la creación de un producto asociado a varias categorías:
![Crear Producto ManyToMany](nestjs-practica05/anexos/cap1%20p9.png)

2. Consulta con filtros por usuario:
![Filtros por Usuario](nestjs-practica05/anexos/cap2%20p9.png)

3. Consulta con filtros por categoría:
![Filtros por Categoría](nestjs-practica05/anexos/cap3%20p9.png)

---

### 📂 Práctica 10: Paginación de Productos con Page, Slice y Pageable

- **Evidencias Gráficas (Capturas):**
  1. Respuesta exitosa de `GET /api/products/page`, evidenciando los metadatos completos (`content`, `totalElements`, `totalPages`, etc.).
  2. Respuesta exitosa de `GET /api/products/slice`, evidenciando la ausencia de `totalElements` y `totalPages` (solo `hasNext`).
  3. Captura de error `400 Bad Request` al enviar parámetros de paginación inválidos (`page=-1&size=0`).
  4. Consultas paginadas desde el contexto de categorías (`GET /api/categories/2/products/page` y `/slice`).

- **Preguntas a Responder:**
  - *¿Cuál es la diferencia entre Page y Slice?*
  - *¿Por qué la paginación debe aplicarse en el repositorio y no después de traer todos los datos en memoria?*

- **Respuesta sugerida:**
  - `Page` calcula el total de páginas y registros mediante una consulta `COUNT` adicional (ideal para tablas con numeración).
  - `Slice` solo averigua si hay una página siguiente trayendo un registro extra (`LIMIT + 1`), siendo más ligero (ideal para scroll infinito).
  - Debe aplicarse en el repositorio mediante SQL (`LIMIT` y `OFFSET`) para evitar saturar la memoria RAM del servidor cargando miles de registros innecesarios.

1. Respuesta exitosa usando Page:
![Paginación con Page](nestjs-practica05/anexos/cap1%20p10.png)

2. Respuesta exitosa usando Slice:
![Paginación con Slice](nestjs-practica05/anexos/cap2%20p10.png)

3. Error por parámetros inválidos (400 Bad Request):
![Error Parámetros Paginación](nestjs-practica05/anexos/error%201%20p7.png)

---

### 📂 Práctica 11: Autenticación JWT, Autorización por Roles y Protección de Endpoints

- **Evidencias Gráficas (Capturas):**
  1. Registro de usuario exitoso (`POST /auth/register`) con status `201 Created`, mostrando el token y el `ROLE_USER` asignado por defecto.
  2. Login exitoso (`POST /auth/login`) con status `200 OK`, devolviendo el JWT y los datos del usuario.
  3. Bloqueo de endpoint protegido (`GET /api/products/page`) devolviendo un `401 Unauthorized` por no enviar el token.
  4. Acceso exitoso al mismo endpoint protegido enviando el Header `Authorization: Bearer <token>`.

1. Registro de usuario exitoso (POST /auth/register):
![Registro Exitoso](nestjs-practica05/anexos/cap1%20p11.png)

2. Login exitoso (POST /auth/login):
![Login Exitoso](nestjs-practica05/anexos/cap2%20p11.png)

3. Bloqueo de endpoint protegido sin token (401 Unauthorized):
![Error 401 Sin Token](nestjs-practica05/anexos/error%202%20p7.png)

---

### 📂 Práctica 12: Protección de Endpoints con Roles

- **Evidencias Gráficas (Capturas):**
  1. Consulta al endpoint `GET /api/users/me` mostrando la información detallada y los roles del usuario del token.
  2. Bloqueo de acceso `403 Forbidden` al intentar consumir `GET /api/products` (sin paginación) usando un token con `ROLE_USER`.
  3. Acceso exitoso `200 OK` al mismo endpoint administrativo usando un token con `ROLE_ADMIN`.

- **Preguntas a Responder:**
  - *¿Cuál es la diferencia entre autenticación y autorización?*
  - *¿Por qué GET /api/products es solo para ADMIN, mientras GET /api/products/page es para cualquier usuario autenticado?*

- **Respuesta sugerida:**
  - Autenticación es validar la identidad del usuario (*¿quién eres?* con JWT).
  - Autorización es validar sus privilegios contextuales (*¿qué puedes hacer?* con roles).
  - `GET /api/products` extrae masivamente todos los registros de la base de datos sin restricciones afectando el rendimiento, por lo que se limita a administradores, mientras que el endpoint paginado mitiga este riesgo y es seguro para consumo general.

1. Consulta al endpoint /users/me:
![Usuario Actual](nestjs-practica05/anexos/cap1%20p12.png)

2. Bloqueo de acceso por rol (403 Forbidden):
![Error 403 Rol](nestjs-practica05/anexos/cap2%20p12.png)

---

### 📂 Práctica 13: Validación de Propiedad de Recursos (Ownership)

- **Evidencias Gráficas (Capturas):**
  1. Creación de un producto (`POST /api/products`), demostrando que el `owner` asignado en la respuesta coincide automáticamente con el usuario del JWT.
  2. Error `403 Forbidden` con el mensaje *"No puedes modificar productos ajenos"* al intentar actualizar (`PUT`) un producto con un usuario que no es el dueño.
  3. Error `403 Forbidden` al intentar eliminar (`DELETE`) un producto ajeno.
  4. Respuesta exitosa `200 OK` o `204 No Content` cuando un **ADMIN** modifica o elimina un producto que le pertenece a otro usuario (Bypass de ADMIN).

- **Preguntas a Responder:**
  - *¿Qué es ownership?*
  - *¿Por qué no es seguro recibir userId in CreateProductDto?*
  - *¿Cuál es la diferencia entre autorización por rol y autorización por ownership?*

- **Respuesta sugerida:**
  - Ownership es el control de acceso basado en la propiedad del recurso.
  - No es seguro recibir el `userId` en el DTO porque un atacante podría alterar el JSON para crear de forma fraudulenta un recurso a nombre de otra persona; la identidad siempre debe extraerse del JWT de forma segura.
  - La autorización por rol valida etiquetas globales (`ROLE_ADMIN`), mientras que la de ownership valida de forma dinámica si el ID del usuario del token coincide con el ID del creador del registro.

1. Creación de producto con owner del JWT:
![Crear Producto con JWT](nestjs-practica05/anexos/cap1%20p13.png)

2. Bloqueo por intentar modificar producto ajeno (Ownership 403):
![Error 403 Ownership](nestjs-practica05/anexos/cap2%20p13.png)
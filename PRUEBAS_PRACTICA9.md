## Guía de Prueba - Práctica 9: Request Parameters en Consultas Relacionadas

### Descripción General
Esta guía proporciona ejemplos de prueba para la implementación de consultas relacionadas
en NestJS con filtrado dinámico usando QueryBuilder.

### Requisitos previos
1. Base de datos PostgreSQL ejecutándose
2. Aplicación NestJS iniciada (`npm run start:dev`)
3. Herramienta HTTP (Postman, Thunder Client, curl, o similar)

### Datos de prueba necesarios

Antes de ejecutar las pruebas, asegúrate de tener datos en la base de datos:

#### 1. Crear usuarios (POST /users)
```json
{
  "name": "Juan García",
  "email": "juan.garcia@example.com",
  "password": "secure_password_123"
}
```

```json
{
  "name": "María López",
  "email": "maria.lopez@example.com",
  "password": "secure_password_456"
}
```

#### 2. Crear categorías (POST /categories)
```json
{
  "name": "Electrónicos",
  "description": "Productos electrónicos en general"
}
```

```json
{
  "name": "Gaming",
  "description": "Productos para gaming y entretenimiento"
}
```

```json
{
  "name": "Oficina",
  "description": "Productos para oficina y productividad"
}
```

#### 3. Crear productos para usuario 1 (POST /products)
```json
{
  "name": "Laptop Gaming",
  "price": 1500.00,
  "stock": 5,
  "description": "Laptop de alta performance para gaming",
  "userId": 1,
  "categoryIds": [1, 2]
}
```

```json
{
  "name": "Mouse Inalámbrico Gaming",
  "price": 89.99,
  "stock": 20,
  "description": "Mouse inalámbrico con precisión de 16000 DPI",
  "userId": 1,
  "categoryIds": [2]
}
```

```json
{
  "name": "Monitor 4K",
  "price": 599.99,
  "stock": 10,
  "description": "Monitor 4K de 32 pulgadas para trabajo y gaming",
  "userId": 1,
  "categoryIds": [1]
}
```

```json
{
  "name": "Teclado Mecánico",
  "price": 199.99,
  "stock": 15,
  "description": "Teclado mecánico RGB con switches Cherry MX",
  "userId": 1,
  "categoryIds": [2, 3]
}
```

#### 4. Crear productos para usuario 2 (POST /products)
```json
{
  "name": "Libro TypeScript Avanzado",
  "price": 45.99,
  "stock": 30,
  "description": "Guía completa de TypeScript para desarrolladores",
  "userId": 2,
  "categoryIds": [3]
}
```

---

## CASOS DE PRUEBA

### 1. Obtener TODOS los productos de un usuario (básico)
**Endpoint:** `GET /users/1/products`

**Descripción:** Retorna todos los productos del usuario especificado

**Respuesta esperada (200):**
```json
[
  {
    "id": 1,
    "name": "Laptop Gaming",
    "price": 1500.00,
    "stock": 5,
    "description": "Laptop de alta performance para gaming",
    "user": {
      "id": 1,
      "name": "Juan García",
      "email": "juan.garcia@example.com"
    },
    "categories": [
      {"id": 1, "name": "Electrónicos", "description": "Productos electrónicos en general"},
      {"id": 2, "name": "Gaming", "description": "Productos para gaming..."}
    ],
    "createdAt": "2024-12-15T10:30:00.000Z",
    "updatedAt": "2024-12-15T10:30:00.000Z"
  },
  // ... más productos
]
```

---

### 2. Filtrar productos por NOMBRE
**Endpoint:** `GET /users/1/products-v2?name=laptop`

**Descripción:** Busca productos cuyo nombre contenga "laptop" (case-insensitive)

**Casos de prueba:**
- `?name=laptop` → Encuentra "Laptop Gaming"
- `?name=mouse` → Encuentra "Mouse Inalámbrico Gaming"
- `?name=gaming` → Encuentra "Laptop Gaming", "Mouse Inalámbrico Gaming", "Teclado Mecánico"
- `?name=xyz` → Retorna array vacío (sin coincidencias)

---

### 3. Filtrar productos por RANGO DE PRECIO
**Endpoint:** `GET /users/1/products-v2?minPrice=100&maxPrice=500`

**Descripción:** Retorna productos con precio entre el rango especificado

**Casos de prueba:**

#### 3.1. Rango medio
`GET /users/1/products-v2?minPrice=100&maxPrice=500`
→ Retorna: Mouse Inalámbrico Gaming (89.99), Teclado Mecánico (199.99), Monitor 4K (599.99)

#### 3.2. Solo precio mínimo
`GET /users/1/products-v2?minPrice=500`
→ Retorna: Laptop Gaming (1500), Monitor 4K (599.99)

#### 3.3. Solo precio máximo
`GET /users/1/products-v2?maxPrice=200`
→ Retorna: Mouse Inalámbrico Gaming (89.99), Teclado Mecánico (199.99)

#### 3.4. Producto exacto
`GET /users/1/products-v2?minPrice=89.99&maxPrice=89.99`
→ Retorna: Mouse Inalámbrico Gaming

---

### 4. Filtrar productos por CATEGORÍA
**Endpoint:** `GET /users/1/products-v2?categoryId=2`

**Descripción:** Retorna productos que pertenecen a la categoría especificada

**Casos de prueba:**

#### 4.1. Categoría "Gaming" (ID=2)
`GET /users/1/products-v2?categoryId=2`
→ Retorna: Laptop Gaming, Mouse Inalámbrico Gaming, Teclado Mecánico

#### 4.2. Categoría "Electrónicos" (ID=1)
`GET /users/1/products-v2?categoryId=1`
→ Retorna: Laptop Gaming, Monitor 4K

#### 4.3. Categoría "Oficina" (ID=3)
`GET /users/1/products-v2?categoryId=3`
→ Retorna: Teclado Mecánico

#### 4.4. Categoría inexistente
`GET /users/1/products-v2?categoryId=999`
→ Retorna: Array vacío

---

### 5. FILTROS COMBINADOS
**Endpoint:** `GET /users/1/products-v2?name=gaming&minPrice=50&maxPrice=500&categoryId=2`

**Descripción:** Combina múltiples filtros simultáneamente

**Casos de prueba:**

#### 5.1. Nombre + Categoría
`GET /users/1/products-v2?name=gaming&categoryId=2`
→ Retorna: Laptop Gaming, Mouse Inalámbrico Gaming

#### 5.2. Nombre + Precio
`GET /users/1/products-v2?name=mouse&minPrice=50&maxPrice=200`
→ Retorna: Mouse Inalámbrico Gaming (89.99)

#### 5.3. Todos los filtros
`GET /users/1/products-v2?name=gaming&minPrice=50&maxPrice=500&categoryId=2`
→ Retorna: Mouse Inalámbrico Gaming

#### 5.4. Filtros sin resultados
`GET /users/1/products-v2?name=laptop&maxPrice=100`
→ Retorna: Array vacío (Laptop Gaming cuesta 1500)

---

### 6. MANEJO DE ERRORES

#### 6.1. Usuario inexistente (404)
`GET /users/999/products`

**Respuesta esperada:**
```json
{
  "statusCode": 404,
  "message": "Usuario no encontrado con ID: 999",
  "error": "Not Found"
}
```

#### 6.2. Rango de precios inválido (400)
`GET /users/1/products-v2?minPrice=1000&maxPrice=100`

**Respuesta esperada:**
```json
{
  "statusCode": 400,
  "message": "El precio máximo debe ser mayor o igual al precio mínimo",
  "error": "Bad Request"
}
```

#### 6.3. Precio negativo (400)
`GET /users/1/products-v2?minPrice=-100`

**Respuesta esperada:**
```json
{
  "statusCode": 400,
  "message": "El precio mínimo no puede ser negativo",
  "error": "Bad Request"
}
```

#### 6.4. Tipo de dato inválido en categoryId
`GET /users/1/products-v2?categoryId=abc`

**Respuesta esperada:**
```json
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```

#### 6.5. Tipo de dato inválido en precio
`GET /users/1/products-v2?minPrice=abc`

**Respuesta esperada:**
```json
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```

---

### 7. VERSIÓN CON DTO (alternativa con validación robusta)
**Endpoint:** `GET /users/1/products-v3?name=laptop&minPrice=500&maxPrice=1600&categoryId=1`

**Descripción:** Igual que v2, pero usa ProductFilterDto para validación automática

**Casos de prueba:** Los mismos que v2

---

## VERIFICACIONES TÉCNICAS

### 1. Validar SQL generado
En logs de la aplicación, debería ver algo como:

```sql
SELECT DISTINCT 
    product.id, product.name, product.price, product.stock, product.description,
    product.created_at, product.updated_at,
    owner.id, owner.name, owner.email,
    category.id, category.name, category.description
FROM products product
INNER JOIN users owner ON product.user_id = owner.id
LEFT JOIN product_categories pc ON product.id = pc.product_id
LEFT JOIN categories category ON pc.category_id = category.id
WHERE product.deleted = false 
  AND owner.id = $1 
  AND LOWER(product.name) LIKE LOWER($2)
  AND product.price >= $3
  AND product.price <= $4
  AND category.id = $5
ORDER BY product.created_at DESC
```

### 2. Verificar que NO hay navegación de relaciones
✅ CORRECTO: Usa `ProductRepository.findByOwnerIdWithFilters()`
❌ INCORRECTO: No debería cargar `user.products` directamente

### 3. Validar ordenamiento
Los productos deben estar ordenados por `createdAt DESC` (más recientes primero)

### 4. Validar eliminación de duplicados
Si un producto tiene múltiples categorías, no debe aparecer duplicado en la respuesta

---

## SCRIPT DE PRUEBA CON cURL

```bash
# 1. Obtener todos los productos del usuario 1
curl -X GET http://localhost:3000/users/1/products

# 2. Filtrar por nombre
curl -X GET "http://localhost:3000/users/1/products-v2?name=laptop"

# 3. Filtrar por rango de precio
curl -X GET "http://localhost:3000/users/1/products-v2?minPrice=100&maxPrice=500"

# 4. Filtrar por categoría
curl -X GET "http://localhost:3000/users/1/products-v2?categoryId=2"

# 5. Combinación de filtros
curl -X GET "http://localhost:3000/users/1/products-v2?name=gaming&minPrice=50&maxPrice=500&categoryId=2"

# 6. Usuario inexistente (error)
curl -X GET http://localhost:3000/users/999/products

# 7. Rango de precios inválido (error)
curl -X GET "http://localhost:3000/users/1/products-v2?minPrice=1000&maxPrice=100"
```

---

## CONCLUSIÓN

La implementación demuestra:

✅ **Contexto semántico correcto:** `/users/{id}/products` refleja la relación del dominio
✅ **Separación de responsabilidades:** Controller → Service → Repository
✅ **Consultas explícitas:** Uso directo de QueryBuilder, no navegación de relaciones
✅ **Filtrado eficiente:** @Query() parameters aplicados en base de datos
✅ **Type-safety:** Completamente tipado con TypeScript
✅ **Validación robusta:** Validación automática con class-validator
✅ **Error handling:** Respuestas de error claras y consistentes
✅ **Escalabilidad:** Funciona con cualquier volumen de datos

# Implementación Completada - Práctica 9

## Resumen de la Implementación

Se ha implementado exitosamente la **Práctica 9: Request Parameters en Consultas Relacionadas** en NestJS, siguiendo las mejores prácticas de arquitectura, separación de responsabilidades y eficiencia en consultas a base de datos.

---

## 📋 Archivos Modificados/Creados

### 1. **User Entity** (Modificado)
- **Archivo:** `src/users/entities/user.entity.ts`
- **Cambios:**
  - Agregada relación `@OneToMany` hacia `ProductEntity`
  - La relación es lazy-loaded para evitar carga innecesaria
  - Comentarios documentando que esta relación es solo para modelo, NO debe usarse en servicios

```typescript
@OneToMany(() => ProductEntity, (product) => product.owner, { lazy: true })
products!: ProductEntity[];
```

### 2. **Product Filter DTO** (Nuevo)
- **Archivo:** `src/users/dtos/product-filter.dto.ts`
- **Propósito:** Validación robusta de parámetros de filtro
- **Validaciones:**
  - `name`: string opcional, 2-100 caracteres
  - `minPrice`: número opcional, ≥ 0
  - `maxPrice`: número opcional, ≥ 0
  - `categoryId`: número opcional, positivo

### 3. **User Controller** (Modificado)
- **Archivo:** `src/users/users.controller.ts`
- **Nuevos Endpoints:**
  1. **GET /users/:id/products** - Obtiene todos los productos del usuario
  2. **GET /users/:id/products-v2** - Con filtros individuales usando @Query()
  3. **GET /users/:id/products-v3** - Alternativa usando ProductFilterDto

**Características:**
- Contexto semántico correcto en URLs
- Validación automática con `ParseIntPipe` y `ParseFloatPipe`
- Documentación detallada en cada endpoint

### 4. **User Service** (Modificado)
- **Archivo:** `src/users/users.service.ts`
- **Nuevos Métodos:**
  1. `getProductsByUserId(userId)` - Consulta básica de productos
  2. `getProductsByUserIdWithFilters(userId, name, minPrice, maxPrice, categoryId)` - Con filtros dinámicos

**Características:**
- Validación de existencia del usuario (404 si no existe)
- Validaciones de negocio (precios negativos, rango inválido)
- Inyección de `ProductRepository` para consultas relacionadas
- Mapeo automático a DTOs de respuesta

### 5. **Product Repository** (Modificado)
- **Archivo:** `src/products/repositories/product.repository.ts`
- **Nuevo Método:**
  - `findByOwnerIdWithFilters(userId, name, minPrice, maxPrice, categoryId)`

**Características:**
- Implementado con TypeORM QueryBuilder para máxima flexibilidad
- Filtros dinámicos opcionales
- Búsqueda de nombre case-insensitive con LIKE
- Ordenamiento por fecha (más recientes primero)
- Eliminación de duplicados con `distinct(true)`
- Comentarios documentando el SQL generado

```typescript
async findByOwnerIdWithFilters(
  userId: number,
  name?: string,
  minPrice?: number,
  maxPrice?: number,
  categoryId?: number,
): Promise<ProductEntity[]>
```

### 6. **Users Module** (Modificado)
- **Archivo:** `src/users/users.module.ts`
- **Cambios:**
  - Registrar `ProductEntity` en imports de TypeORM
  - Inyectar `ProductRepository` en providers
  - Exportar ambos repositorios para uso en otros módulos

### 7. **Archivos de Prueba** (Nuevos)
- **PRUEBAS_PRACTICA9.md** - Guía detallada de prueba manual
- **test-user-products.ts** - Script de pruebas automatizadas

---

## 🏗️ Arquitectura Implementada

### Flujo de Ejecución

```
HTTP Request: GET /users/123/products-v2?name=laptop&minPrice=500&maxPrice=1500
                                    ↓
        UsersController.getProductsWithFilters()
                                    ↓
        ┌─────────────────────────────────────┐
        │ Validación de parámetros (Pipes)    │
        │ - ParseIntPipe (id)                 │
        │ - ParseFloatPipe (precios)          │
        │ - BadRequestException (rango)       │
        └─────────────────────────────────────┘
                                    ↓
        UsersService.getProductsByUserIdWithFilters()
                                    ↓
        ┌─────────────────────────────────────┐
        │ 1. Validar usuario existe           │
        │ 2. Validar filtros negocio          │
        │ 3. Consultar ProductRepository      │
        │ 4. Mapear a DTOs                    │
        └─────────────────────────────────────┘
                                    ↓
        ProductRepository.findByOwnerIdWithFilters()
                                    ↓
        ┌─────────────────────────────────────┐
        │ QueryBuilder con filtros dinámicos  │
        │ - WHERE owner.id = userId           │
        │ - AND LOWER(name) LIKE LOWER(?)     │
        │ - AND price BETWEEN ? AND ?         │
        │ - AND category.id = ?               │
        │ ORDER BY createdAt DESC             │
        │ DISTINCT para evitar duplicados     │
        └─────────────────────────────────────┘
                                    ↓
        Array<ProductResponseDto> con resultados filtrados
```

### Principios Aplicados

1. **✅ Contexto Semántico Correcto**
   - `/users/{id}/products` refleja relación en dominio
   - El contexto es el usuario, los datos consultados son productos

2. **✅ Separación de Responsabilidades**
   - Controller: Expone endpoints, valida parámetros
   - Service: Orquesta lógica de negocio, valida datos
   - Repository: Consulta específica a base de datos

3. **✅ Consultas Explícitas (No navegación)**
   - ❌ EVITAR: `user.products` (NavigationRelation)
   - ✅ USAR: `productRepository.findByOwnerIdWithFilters()` (Explicit Query)

4. **✅ QueryBuilder para Flexibilidad**
   - Filtros dinámicos opcionales
   - SQL eficiente generado por TypeORM
   - Parámetros bindeados contra SQL injection

5. **✅ Validación Robusta**
   - Pipes en Controller para tipos
   - DTO con class-validator en Service
   - Validaciones de negocio explícitas

6. **✅ Type Safety**
   - TypeScript interfaces para DTOs
   - Tipos en métodos y parámetros
   - Generic types en repositorios

---

## 🔍 Detalles Técnicos

### SQL Generado por QueryBuilder

```sql
SELECT DISTINCT 
    product.id, product.name, product.price, product.stock, product.description,
    product.created_at, product.updated_at, product.user_id, product.deleted,
    owner.id AS owner_id, owner.name AS owner_name, owner.email AS owner_email, 
        owner.password_hash, owner.created_at, owner.updated_at, owner.deleted,
    category.id AS category_id, category.name AS category_name, 
        category.description AS category_description, category.created_at, 
        category.updated_at, category.deleted
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

### Parámetros Bindeados
- `$1` - userId
- `$2` - name (con wildcards %)
- `$3` - minPrice
- `$4` - maxPrice
- `$5` - categoryId

---

## 📝 Ejemplos de Uso

### 1. Productos del usuario (básico)
```bash
GET /users/1/products
```

### 2. Filtro por nombre
```bash
GET /users/1/products-v2?name=laptop
```

### 3. Rango de precios
```bash
GET /users/1/products-v2?minPrice=100&maxPrice=500
```

### 4. Categoría específica
```bash
GET /users/1/products-v2?categoryId=2
```

### 5. Combinación de filtros
```bash
GET /users/1/products-v2?name=gaming&minPrice=800&categoryId=2
```

---

## ✅ Validaciones Implementadas

### En Controller (Pipes)
- `ParseIntPipe` - Valida IDs como números
- `ParseFloatPipe` - Valida precios como decimales
- `ValidationPipe` - Valida estructura de DTO

### En Service (Lógica de Negocio)
- Verificación de existencia del usuario → 404
- Validación de precio negativo → 400
- Validación de rango (minPrice > maxPrice) → 400

### En DTO (ProductFilterDto)
- @IsOptional - Todos los campos son opcionales
- @IsString/@IsNumber - Validación de tipos
- @Length/@Min/@IsPositive - Validaciones de rango

---

## 🚀 Performance

### Optimizaciones Implementadas

1. **Filtros en Base de Datos** 
   - No cargar todo y filtrar en memoria
   - WHERE clause aplicado directamente en SQL

2. **SELECT específico**
   - Solo traer relaciones necesarias
   - LEFT JOIN en lugar de INNER JOIN para categorías (opcionales)

3. **Eliminación de Duplicados**
   - `distinct(true)` en QueryBuilder cuando hay LEFT JOIN

4. **Ordenamiento en BD**
   - `ORDER BY created_at DESC` en lugar de en memoria

5. **Índices Recomendados**
   ```sql
   CREATE INDEX idx_products_user_id ON products(user_id);
   CREATE INDEX idx_products_price ON products(price);
   CREATE INDEX idx_products_name ON products(LOWER(name));
   ```

---

## 📊 Comparativa: Navegación vs Consulta Explícita

| Aspecto | ❌ Navegación | ✅ Consulta Explícita |
|---------|-------------|------------------------|
| Performance | Impredecible | Controlada |
| Escalabilidad | Limitada | Excelente |
| Filtros | En memoria | En BD |
| Carga de datos | TODO el árbol | Solo lo necesario |
| Control SQL | Ninguno | Total |
| Testing | Complejo | Directo |
| Mantenimiento | Dependencias ocultas | Explícito |

### Código Problemático ❌
```typescript
const user = await userRepository.findOne({
  where: { id: userId },
  relations: ['products']  // Carga TODO
});
const products = user.products;  // Navegación
// Después filtrar en memoria 😞
```

### Código Recomendado ✅
```typescript
const products = await productRepository.findByOwnerIdWithFilters(
  userId, 
  name, 
  minPrice, 
  maxPrice, 
  categoryId
);  // Filtrado en BD desde el inicio 🚀
```

---

## 🧪 Casos de Prueba Incluidos

Se proporciona documento **PRUEBAS_PRACTICA9.md** con:

### ✓ Casos de éxito (200)
1. Todos los productos
2. Filtro por nombre
3. Filtro por precio
4. Filtro por categoría
5. Filtros combinados

### ✓ Casos de error (4xx)
1. Usuario inexistente (404)
2. Rango de precios inválido (400)
3. Precio negativo (400)
4. Tipos de datos inválidos (400)

### ✓ Verificaciones técnicas
1. SQL generado
2. Ausencia de navegación de relaciones
3. Ordenamiento correcto
4. Eliminación de duplicados

---

## 📚 Próximos Pasos (Recomendaciones)

1. **Paginación** - Agregar limit/offset para grandes resultados
2. **Sorting** - Permitir ordenamiento por múltiples campos
3. **Search avanzada** - Full-text search en descripciones
4. **Caching** - Redis para queries frecuentes
5. **Tests unitarios** - Para cada método del service
6. **Tests E2E** - Para todos los endpoints
7. **Documentación Swagger** - Auto-generar OpenAPI

---

## 📖 Referencias en el Código

### Comentarios Clave
- User Entity: Explica por qué agregar relación pero no usarla
- ProductRepository: Documenta SQL generado
- UserService: Explica el flujo de validación
- UserController: Ejemplos de uso en JSDoc

### Documentación Externa
- [TypeORM QueryBuilder](https://typeorm.io/select-query-builder)
- [NestJS Best Practices](https://docs.nestjs.com/techniques/database)
- [REST API Design](https://restfulapi.net/)

---

## ✨ Características Destacadas

- ✅ **100% TypeScript** - Type-safe en todo
- ✅ **Arquitectura limpia** - Separación de capas
- ✅ **Documentación exhaustiva** - Comentarios y guías
- ✅ **Manejo de errores** - Excepciones específicas
- ✅ **Validación robusta** - En múltiples capas
- ✅ **Extensible** - Fácil agregar nuevos filtros
- ✅ **Performante** - Consultas optimizadas
- ✅ **Testeable** - Lógica desacoplada

---

## 🎯 Conclusión

La implementación demuestra patrones avanzados de NestJS:
1. **Contexto semántico correcto** en URLs REST
2. **Separación de responsabilidades** clara entre capas
3. **Consultas explícitas** con QueryBuilder en lugar de navegación
4. **Filtrado dinámico** completamente tipado
5. **Validación multinivel** robusta
6. **Performance optimizado** con filtros en BD
7. **Código mantenible** y extensible

**Esta es la forma correcta de implementar consultas relacionadas en NestJS. ✅**

# 📊 Paso 15: Carga Masiva de Datos

## Información de tu Base de Datos (Verificada)

Basado en tu `docker-compose.yml`, aquí está la configuración real:

| Parámetro | Valor |
|-----------|-------|
| **Contenedor** | `nestjs-practica05-db` |
| **Usuario** | `postgres` |
| **Password** | `1234` |
| **Base de datos** | `postgres` |
| **Puerto** | `5432` |
| **Imagen** | `postgres:15-alpine` |

---

## 🚀 Cómo Ejecutar el Script `seed_data.sql`

### Opción 1: Ejecutar directamente (RECOMENDADO)

```powershell
# Asegúrate de estar en la raíz del proyecto
cd c:\Users\aluca\Proyectos-Web\fundamentos01\nestjs-practica05

# Ejecutar el script
docker exec -it nestjs-practica05-db psql -U postgres -d postgres -f /dev/stdin < seed_data.sql
```

**Si eso no funciona en PowerShell, intenta:**

```powershell
# Alternativa 1: Usando Get-Content
Get-Content seed_data.sql | docker exec -i nestjs-practica05-db psql -U postgres -d postgres
```

```powershell
# Alternativa 2: Copiar archivo y ejecutar dentro del contenedor
docker cp seed_data.sql nestjs-practica05-db:/tmp/seed_data.sql
docker exec -it nestjs-practica05-db psql -U postgres -d postgres -f /tmp/seed_data.sql
```

---

### Opción 2: Conexión Interactiva

```powershell
# Conectar a PostgreSQL de forma interactiva
docker exec -it nestjs-practica05-db psql -U postgres -d postgres

# Una vez dentro del prompt psql (ves postgres=#), ejecuta:
\i /dev/stdin
# Pega el contenido de seed_data.sql
# Presiona Ctrl+D para terminar

# O simplemente:
\q
```

---

## ✅ Verificar que los datos se cargaron correctamente

Después de ejecutar el script, deberías ver un resumen como este:

```
 total_usuarios
-----------
    10

 total_categorias
-----------
    10

 total_productos
-----------
    20000

 total_relaciones_producto_categoria
-----------
    60000
```

### Verificación Detallada

```powershell
# Conectar y verificar
docker exec -it nestjs-practica05-db psql -U postgres -d postgres

# Dentro del psql:
SELECT COUNT(*) FROM users WHERE deleted = false;
SELECT COUNT(*) FROM categories WHERE deleted = false;
SELECT COUNT(*) FROM products WHERE deleted = false;
SELECT COUNT(*) FROM product_categories;

# Ver algunos datos
SELECT id, name, email FROM users LIMIT 5;
SELECT id, name FROM categories;
SELECT id, name, price, stock FROM products LIMIT 5;

\q
```

---

## 📋 Qué hace el script `seed_data.sql`

### 1. Limpia datos existentes
```sql
TRUNCATE TABLE product_categories CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE users CASCADE;
```

### 2. Inserta 10 usuarios
- Usuarios con nombres españoles realistas
- Emails únicos
- Passwords hasheados (placeholder)

### 3. Inserta 10 categorías
- Electrónica
- Gaming
- Oficina
- Hogar
- Ropa
- Libros
- Deportes
- Audio
- Fotografía
- Accesorios

### 4. Inserta 20,000 productos
- Nombres: "Producto 1", "Producto 2", etc.
- Precios aleatorios: $10 - $5010
- Stock aleatorio: 1 - 1000 unidades
- Distribuidos entre los 10 usuarios
- Fechas de creación esparcidas en el último año

### 5. Inserta relaciones producto-categoría
- Cada producto tiene 2-4 categorías asignadas aleatoriamente
- Crea aproximadamente 60,000 relaciones

### 6. Genera reportes
- Usuarios y sus productos
- Categorías y sus productos
- Precios promedio por usuario

---

## 🧪 Casos de Prueba Después de la Carga

Una vez que los datos estén cargados, puedes probar:

```bash
# 1. Obtener productos del usuario 1
curl http://localhost:3000/api/users/1/products

# 2. Filtrar por nombre (búsqueda a través de 20k productos)
curl "http://localhost:3000/api/users/1/products-v2?name=producto%2050"

# 3. Filtrar por rango de precio
curl "http://localhost:3000/api/users/1/products-v2?minPrice=100&maxPrice=500"

# 4. Filtrar por categoría
curl "http://localhost:3000/api/users/1/products-v2?categoryId=2"

# 5. Combinación de filtros (test de performance)
curl "http://localhost:3000/api/users/1/products-v2?name=producto&minPrice=200&maxPrice=1000&categoryId=3"
```

---

## ⚠️ Notas Importantes

1. **Tiempo de ejecución:** El script tarda ~30-60 segundos en completarse (depende del rendimiento de tu máquina)

2. **Requisitos:** PostgreSQL debe estar ejecutándose en Docker:
   ```powershell
   docker-compose up -d
   ```

3. **Integridad referencial:** El script respeta todas las claves foráneas

4. **Datos persistentes:** Los datos se guardan en el volumen Docker `postgres_data`, sobrevivirán a reinicios del contenedor

5. **Limpiar datos:** Si necesitas resetear, ejecuta el script nuevamente (incluye TRUNCATE al inicio)

---

## 🔧 Si algo falla

### Error: "Cannot find the file"
Asegúrate de estar en el directorio correcto:
```powershell
Get-Location  # Debería mostrar: C:\Users\aluca\Proyectos-Web\fundamentos01\nestjs-practica05
```

### Error: "psql: command not found"
PostgreSQL CLI no está instalado localmente, pero no lo necesitas porque está en Docker:
```powershell
docker exec -it nestjs-practica05-db psql -U postgres -d postgres -c "SELECT 1"
```

### Error: "connection refused"
El contenedor no está corriendo:
```powershell
docker-compose ps
# Si no sale "nestjs-practica05-db    Up (healthy)"
docker-compose up -d
```

---

## 📊 Monitoreo en Tiempo Real

Si quieres ver el progreso mientras se ejecuta:

```powershell
# Terminal 1: Ver logs del contenedor
docker-compose logs -f postgres

# Terminal 2: Ejecutar el script
Get-Content seed_data.sql | docker exec -i nestjs-practica05-db psql -U postgres -d postgres
```

---

## ✨ Resultado Esperado

Después de ejecutar el script, tu base de datos tendrá:

- ✅ 10 usuarios activos
- ✅ 10 categorías
- ✅ 20,000 productos distribuidos aleatoriamente
- ✅ ~60,000 relaciones producto-categoría
- ✅ Datos listos para pruebas de filtrado y performance

**¡Ya puedes probar los endpoints con miles de datos! 🚀**

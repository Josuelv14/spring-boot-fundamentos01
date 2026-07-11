-- ============================================================================
-- SCRIPT DE CARGA MASIVA DE DATOS - PRÁCTICA 9
-- ============================================================================
-- Este script limpia las tablas e inserta:
-- - 10 usuarios
-- - 10 categorías
-- - 20,000 productos
-- - Relaciones producto-categoría
--
-- Ejecutar con:
-- docker exec -it nestjs-practica05-db psql -U postgres -d postgres -f seed_data.sql
-- ============================================================================

-- 1. LIMPIAR DATOS EXISTENTES
-- ============================================================================

TRUNCATE TABLE product_categories CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE users CASCADE;

-- Resetear secuencias de IDs
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE products_id_seq RESTART WITH 1;

-- 2. INSERTAR USUARIOS (10 registros)
-- ============================================================================

INSERT INTO users (name, email, "passwordHash", created_at, updated_at, deleted)
VALUES
  ('Juan García García', 'juan.garcia@example.com', 'HASH_secure_password_123', NOW(), NOW(), false),
  ('María López Martínez', 'maria.lopez@example.com', 'HASH_secure_password_456', NOW(), NOW(), false),
  ('Carlos Rodríguez González', 'carlos.rodriguez@example.com', 'HASH_secure_password_789', NOW(), NOW(), false),
  ('Ana Fernández Ruiz', 'ana.fernandez@example.com', 'HASH_secure_password_101', NOW(), NOW(), false),
  ('David Sánchez Pérez', 'david.sanchez@example.com', 'HASH_secure_password_112', NOW(), NOW(), false),
  ('Laura Martínez López', 'laura.martinez@example.com', 'HASH_secure_password_131', NOW(), NOW(), false),
  ('Miguel Hernández García', 'miguel.hernandez@example.com', 'HASH_secure_password_415', NOW(), NOW(), false),
  ('Elena Díaz Rodríguez', 'elena.diaz@example.com', 'HASH_secure_password_161', NOW(), NOW(), false),
  ('Francisco Torres González', 'francisco.torres@example.com', 'HASH_secure_password_718', NOW(), NOW(), false),
  ('Patricia Moreno Jiménez', 'patricia.moreno@example.com', 'HASH_secure_password_192', NOW(), NOW(), false);

-- 3. INSERTAR CATEGORÍAS (10 registros)
-- ============================================================================

INSERT INTO categories (name, description, created_at, updated_at, deleted)
VALUES
  ('Electrónica', 'Productos electrónicos en general: laptops, tablets, accesorios', NOW(), NOW(), false),
  ('Gaming', 'Productos especializados para gaming: tarjetas gráficas, periféricos gaming', NOW(), NOW(), false),
  ('Oficina', 'Productos para oficina y productividad: impresoras, papelería, escritorios', NOW(), NOW(), false),
  ('Hogar', 'Artículos para el hogar: muebles, decoración, electrodomésticos', NOW(), NOW(), false),
  ('Ropa', 'Prendas de vestir: camisetas, pantalones, chaquetas, zapatos', NOW(), NOW(), false),
  ('Libros', 'Libros de programación, ficción, referencia y más', NOW(), NOW(), false),
  ('Deportes', 'Equipamiento deportivo: pelotas, raquetas, mochilas deportivas', NOW(), NOW(), false),
  ('Audio', 'Equipamiento de audio: auriculares, altavoces, microfonos', NOW(), NOW(), false),
  ('Fotografía', 'Equipo fotográfico: cámaras, lentes, trípodes, iluminación', NOW(), NOW(), false),
  ('Accesorios', 'Accesorios diversos: cables, adaptadores, fundas, protectores', NOW(), NOW(), false);

-- 4. INSERTAR 20,000 PRODUCTOS
-- ============================================================================

-- Nota: Usamos un procedimiento generador para crear 20,000 productos de forma eficiente

INSERT INTO products (name, price, stock, description, user_id, created_at, updated_at, deleted)
SELECT
  'Producto ' || i AS name,
  ROUND(CAST(RANDOM() * 5000 + 10 AS NUMERIC), 2) AS price,
  FLOOR(RANDOM() * 1000 + 1)::int AS stock,
  'Descripción del Producto ' || i || ' - Generado automáticamente en carga masiva' AS description,
  (i % 10) + 1 AS user_id,
  NOW() - INTERVAL '1 day' * (RANDOM() * 365) AS created_at,
  NOW() AS updated_at,
  false AS deleted
FROM generate_series(1, 20000) AS t(i);

-- 5. INSERTAR RELACIONES PRODUCTO-CATEGORÍA
-- ============================================================================

-- Cada producto se asigna a 2-4 categorías aleatorias

INSERT INTO product_categories (product_id, category_id)
SELECT
  p.id AS product_id,
  c.id AS category_id
FROM products p
CROSS JOIN (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY RANDOM()) AS rn
  FROM categories
) c
WHERE c.rn <= (FLOOR(RANDOM() * 3 + 2))::int
AND p.deleted = false;

-- 6. VERIFICACIÓN DE DATOS INSERTADOS
-- ============================================================================

SELECT 'Resumen de carga masiva de datos' AS resultado;
SELECT '=====================================' AS resultado;

SELECT COUNT(*) AS total_usuarios FROM users WHERE deleted = false;
SELECT COUNT(*) AS total_categorias FROM categories WHERE deleted = false;
SELECT COUNT(*) AS total_productos FROM products WHERE deleted = false;
SELECT COUNT(*) AS total_relaciones_producto_categoria FROM product_categories;

-- 7. ESTADÍSTICAS DE DATOS
-- ============================================================================

SELECT 'Estadísticas por usuario' AS resultado;
SELECT 
  u.id,
  u.name,
  COUNT(p.id) AS cantidad_productos,
  ROUND(AVG(p.price)::NUMERIC, 2) AS precio_promedio,
  MIN(p.price) AS precio_minimo,
  MAX(p.price) AS precio_maximo
FROM users u
LEFT JOIN products p ON u.id = p.user_id AND p.deleted = false
WHERE u.deleted = false
GROUP BY u.id, u.name
ORDER BY u.id;

SELECT 'Estadísticas por categoría' AS resultado;
SELECT 
  c.id,
  c.name,
  COUNT(DISTINCT pc.product_id) AS cantidad_productos,
  ROUND(AVG(p.price)::NUMERIC, 2) AS precio_promedio
FROM categories c
LEFT JOIN product_categories pc ON c.id = pc.category_id
LEFT JOIN products p ON pc.product_id = p.id AND p.deleted = false
WHERE c.deleted = false
GROUP BY c.id, c.name
ORDER BY c.id;

-- Fin del script

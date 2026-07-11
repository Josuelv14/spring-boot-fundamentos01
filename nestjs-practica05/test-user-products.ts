import http from 'http';

/**
 * Script de prueba para la Práctica 9: Request Parameters en Consultas Relacionadas
 * 
 * Uso:
 * node test-user-products.js
 * 
 * Este script ejecuta una serie de pruebas contra los endpoints de consultas relacionadas.
 */

const BASE_URL = 'http://localhost:3000/api';

// ============== CONFIGURACIÓN ==============

interface TestCase {
  name: string;
  method: string;
  path: string;
  expectedStatus: number;
  description: string;
}

const testCases: TestCase[] = [
  {
    name: 'Obtener productos del usuario 1 (básico)',
    method: 'GET',
    path: '/users/1/products',
    expectedStatus: 200,
    description: 'Retorna todos los productos del usuario',
  },
  {
    name: 'Filtrar por nombre: laptop',
    method: 'GET',
    path: '/users/1/products-v2?name=laptop',
    expectedStatus: 200,
    description: 'Busca productos con nombre que contenga "laptop"',
  },
  {
    name: 'Filtrar por rango de precio',
    method: 'GET',
    path: '/users/1/products-v2?minPrice=100&maxPrice=500',
    expectedStatus: 200,
    description: 'Retorna productos con precio entre 100 y 500',
  },
  {
    name: 'Filtrar por categoría',
    method: 'GET',
    path: '/users/1/products-v2?categoryId=2',
    expectedStatus: 200,
    description: 'Retorna productos de la categoría 2',
  },
  {
    name: 'Filtros combinados',
    method: 'GET',
    path: '/users/1/products-v2?name=gaming&minPrice=50&maxPrice=500&categoryId=2',
    expectedStatus: 200,
    description: 'Combina múltiples filtros simultáneamente',
  },
  {
    name: 'Usuario inexistente',
    method: 'GET',
    path: '/users/999/products',
    expectedStatus: 404,
    description: 'Debe retornar 404 Not Found',
  },
  {
    name: 'Rango de precios inválido',
    method: 'GET',
    path: '/users/1/products-v2?minPrice=1000&maxPrice=100',
    expectedStatus: 400,
    description: 'Debe retornar 400 Bad Request (precio máximo < mínimo)',
  },
  {
    name: 'Precio negativo',
    method: 'GET',
    path: '/users/1/products-v2?minPrice=-100',
    expectedStatus: 400,
    description: 'Debe retornar 400 Bad Request (precio negativo)',
  },
  {
    name: 'Versión con DTO',
    method: 'GET',
    path: '/users/1/products-v3?name=laptop&minPrice=500&maxPrice=1600',
    expectedStatus: 200,
    description: 'Alternativa usando ProductFilterDto',
  },
];

// ============== FUNCIONES DE PRUEBA ==============

function makeRequest(method: string, path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);

    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data),
            headers: res.headers,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data,
            headers: res.headers,
          });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runTest(testCase: TestCase): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log(`TEST: ${testCase.name}`);
  console.log('='.repeat(80));
  console.log(`Descripción: ${testCase.description}`);
  console.log(`Método: ${testCase.method}`);
  console.log(`Path: ${testCase.path}`);
  console.log(`Status esperado: ${testCase.expectedStatus}`);
  console.log('-'.repeat(80));

  try {
    const response = await makeRequest(testCase.method, testCase.path);

    const passed = response.status === testCase.expectedStatus;
    const status = passed ? '✅ PASADO' : '❌ FALLIDO';

    console.log(`${status}`);
    console.log(`Status recibido: ${response.status}`);
    console.log(`Response:`);
    console.log(JSON.stringify(response.body, null, 2));

    return;
  } catch (error) {
    console.log('❌ ERROR EN LA PRUEBA');
    console.log(`Error: ${error}`);
  }
}

async function runAllTests(): Promise<void> {
  console.log('\n');
  console.log('╔' + '='.repeat(78) + '╗');
  console.log('║' + ' '.repeat(15) + 'PRUEBAS - PRÁCTICA 9' + ' '.repeat(42) + '║');
  console.log('║' + ' '.repeat(10) + 'Request Parameters en Consultas Relacionadas' + ' '.repeat(23) + '║');
  console.log('╚' + '='.repeat(78) + '╝');

  console.log(`\nURL Base: ${BASE_URL}`);
  console.log(`Total de pruebas: ${testCases.length}`);
  console.log('\nIniciando pruebas...');

  for (const testCase of testCases) {
    await runTest(testCase);
    // Pequeña pausa entre pruebas para evitar sobrecargar
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(80));
  console.log('PRUEBAS COMPLETADAS');
  console.log('='.repeat(80));
  console.log('\n✅ Suite de pruebas completada\n');
}

// ============== EJECUCIÓN ==============

runAllTests().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});

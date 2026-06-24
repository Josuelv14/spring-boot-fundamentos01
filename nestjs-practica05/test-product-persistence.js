const { execSync } = require('child_process');
const products = [
  { name: 'Laptop Lenovo', price: 850, stock: 10 },
  { name: 'Mouse Logitech', price: 25, stock: 50 },
  { name: 'Teclado Mecánico', price: 70, stock: 20 },
  { name: 'Monitor Samsung', price: 220, stock: 15 },
  { name: 'Disco SSD 1TB', price: 95, stock: 30 },
];

async function postProduct(product) {
  const res = await fetch('http://localhost:3000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  return { status: res.status, body };
}

async function getProducts() {
  const res = await fetch('http://localhost:3000/api/products');
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  return { status: res.status, body };
}

(async () => {
  const output = [];
  output.push('--- POST results ---');
  for (const product of products) {
    try {
      const result = await postProduct(product);
      output.push(`POST ${product.name} status=${result.status}`);
      output.push(JSON.stringify(result.body, null, 2));
    } catch (err) {
      output.push(`POST ${product.name} ERROR ${err.message}`);
    }
  }
  output.push('--- GET /api/products result ---');
  try {
    const getResult = await getProducts();
    output.push(`GET status=${getResult.status}`);
    output.push(JSON.stringify(getResult.body, null, 2));
  } catch (err) {
    output.push(`GET ERROR ${err.message}`);
  }
  output.push('--- POSTGRES SELECT ---');
  try {
    const sql = 'SELECT id, name, price, stock, deleted, createdAt, updatedAt FROM products;';
    const cmd = ['docker', 'exec', 'postgres-dev', 'psql', '-U', 'ups', '-d', 'devdb_nest', '-c', sql];
    const result = execSync(cmd.join(' '), { encoding: 'utf8' });
    output.push(result);
  } catch (err) {
    output.push('PSQL ERROR');
    output.push(err.stdout || '');
    output.push(err.stderr || '');
    output.push(err.message);
  }
  console.log(output.join('\n'));
})();
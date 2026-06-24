const http = require('http');
const products = [
  { name: 'Laptop Lenovo', price: 850, stock: 10 },
  { name: 'Mouse Logitech', price: 25, stock: 50 },
  { name: 'Teclado Mecánico', price: 70, stock: 20 },
  { name: 'Monitor Samsung', price: 220, stock: 15 },
  { name: 'Disco SSD 1TB', price: 95, stock: 30 },
];

function postProduct(product) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(product);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/products',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      },
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getProducts() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000/api/products', (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

(async () => {
  for (const product of products) {
    try {
      const result = await postProduct(product);
      console.log('POST', product.name, 'status', result.status, 'body', result.body);
    } catch (err) {
      console.error('POST error', product.name, err.message || err);
    }
  }
  try {
    const all = await getProducts();
    console.log('GET /api/products status', all.status);
    console.log(all.body);
  } catch (err) {
    console.error('GET error', err.message || err);
  }
})();
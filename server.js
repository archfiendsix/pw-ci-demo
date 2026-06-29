// Tiny zero-dependency static file server + one fake JSON API endpoint.
// Keeps `npm ci` minimal (only Playwright) so CI installs are fast.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

const QUOTES = [
  'Tests are the seatbelt of refactoring.',
  'Flaky tests are worse than no tests.',
  'Ship green, sleep well.',
];

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // Fake API endpoint — exercised + mocked by api-mock.spec.ts
  if (url.pathname === '/api/quote') {
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    res.writeHead(200, { 'Content-Type': MIME['.json'] });
    res.end(JSON.stringify({ quote, source: 'live-server' }));
    return;
  }

  // Static files
  let pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.join(ROOT, path.normalize(pathname));

  // Prevent path traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': MIME['.html'] });
      res.end('<h1>404 Not Found</h1>');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`pw-ci-demo running at http://localhost:${PORT}`);
});

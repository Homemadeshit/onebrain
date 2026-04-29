import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { join, extname, normalize, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const dist = resolve(__dirname, 'dist');
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf':  'font/ttf',
  '.otf':  'font/otf',
  '.txt':  'text/plain; charset=utf-8',
  '.map':  'application/json; charset=utf-8',
};

const ONE_YEAR = 60 * 60 * 24 * 365;
const NO_CACHE = 'no-cache, no-store, must-revalidate';

function cacheHeader(pathname, ext) {
  // Vite-built files in /assets/ are content-hashed → cache forever.
  if (pathname.startsWith('/assets/')) {
    return `public, max-age=${ONE_YEAR}, immutable`;
  }
  // Fonts and images outside assets/ get medium cache.
  if (['.woff', '.woff2', '.ttf', '.otf', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg'].includes(ext)) {
    return `public, max-age=${60 * 60 * 24 * 7}`;
  }
  // index.html and all other entrypoints must revalidate so deploys roll out.
  return NO_CACHE;
}

async function sendFile(res, filePath, status = 200) {
  const data = await readFile(filePath);
  const ext = extname(filePath).toLowerCase();
  res.writeHead(status, {
    'Content-Type': mimeTypes[ext] || 'application/octet-stream',
    'Cache-Control': cacheHeader(filePath.replace(dist, ''), ext),
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(data);
}

async function sendIndex(res, status = 200) {
  const indexPath = join(dist, 'index.html');
  const data = await readFile(indexPath);
  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': NO_CACHE,
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(data);
}

createServer(async (req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      res.end('Method Not Allowed');
      return;
    }

    // Parse just the pathname so query strings don't confuse routing.
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(url.pathname);

    // Health check for Railway (and load balancers in general).
    if (pathname === '/healthz' || pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('ok');
      return;
    }

    if (pathname === '/' || pathname === '') {
      await sendIndex(res);
      return;
    }

    // Resolve and confine to dist/ to block path traversal.
    const requested = normalize(join(dist, pathname));
    if (!requested.startsWith(dist)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    try {
      const s = await stat(requested);
      if (s.isFile()) {
        await sendFile(res, requested);
        return;
      }
    } catch {
      // Falls through to SPA fallback below.
    }

    // SPA fallback for any non-asset path (e.g. /onebrain, /network).
    await sendIndex(res, 200);
  } catch (err) {
    console.error('[server]', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
    }
    res.end('Internal Server Error');
  }
}).listen(port, host, () => {
  console.log(`Wealth Quest running on http://${host}:${port}`);
});

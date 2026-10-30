import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { createContactHandler } from './routes/contact.mjs';
import { json } from './utils/http.mjs';
export { validateEnquiry } from './validation/contact.mjs';
export { enquiryEmail } from './services/mail.mjs';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

export function createApp({
  dataDir,
  staticDir,
  mailer = null,
  mailFrom,
  mailTo = 'info@edvin.com',
  publicOrigin,
  logger = console,
  limit = 5,
  trustedProxies = '',
} = {}) {
  const contact = createContactHandler({
    dataDir,
    mailer,
    mailFrom,
    mailTo,
    publicOrigin,
    logger,
    limit,
    trustedProxies,
  });
  const dist = path.resolve(staticDir ?? 'dist');
  const server = createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
      return json(response, 400, { success: false, error: 'Invalid URL.' });
    }

    if (pathname === '/api/contact') return contact(request, response);

    if (pathname.startsWith('/api/')) return json(response, 404, { success: false, error: 'Not found.' });
    if (request.method !== 'GET' && request.method !== 'HEAD')
      return json(response, 405, { error: 'Method not allowed.' }, { Allow: 'GET, HEAD' });
    const segments = pathname.split('/');
    if (
      segments.some((segment) => segment.startsWith('.') || segment.includes('\\') || segment.includes('\0'))
    )
      return json(response, 404, { error: 'Not found.' });
    let filename = path.resolve(dist, `.${pathname}`);
    if (!filename.startsWith(dist + path.sep) && filename !== dist)
      return json(response, 404, { error: 'Not found.' });
    try {
      let info;
      try {
        info = await stat(filename);
      } catch {
        /* SPA routes use index.html. */
      }
      if (info?.isDirectory()) {
        const document = path.join(filename, 'index.html');
        try {
          info = await stat(document);
          filename = document;
        } catch {
          info = null;
        }
      }
      if (!info?.isFile()) {
        if (path.extname(pathname)) return json(response, 404, { error: 'Not found.' });
        const pageRoute = /^\/(?:contact(?:-us)?|about-us|products)?\/?$/.test(pathname);
        filename = path.join(dist, pageRoute ? 'index.html' : '404.html');
        if (!pageRoute) {
          try {
            await stat(filename);
          } catch {
            filename = path.join(dist, 'index.html');
          }
        }
        info = await stat(filename);
      }
      const resolved = await realpath(filename);
      if (!resolved.startsWith((await realpath(dist)) + path.sep))
        return json(response, 404, { error: 'Not found.' });
      const headers = {
        'Content-Type': TYPES[path.extname(filename)] ?? 'application/octet-stream',
        'Cache-Control': pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
        'Accept-Ranges': 'bytes',
      };
      let start = 0;
      let end = info.size - 1;
      const pageRoute = /^\/(?:contact(?:-us)?|about-us|products)?\/?$/.test(pathname);
      let status =
        (path.basename(filename) === 'index.html' || path.basename(filename) === '404.html') &&
        !pageRoute &&
        pathname !== '/index.html'
          ? 404
          : 200;
      if (request.headers.range && status === 200) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
        if (!match || (!match[1] && !match[2])) {
          response.writeHead(416, { 'Content-Range': `bytes */${info.size}` });
          return response.end();
        }
        start = match[1] ? Number(match[1]) : Math.max(0, info.size - Number(match[2]));
        end = match[1] && match[2] ? Math.min(Number(match[2]), end) : end;
        if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= info.size) {
          response.writeHead(416, { 'Content-Range': `bytes */${info.size}` });
          return response.end();
        }
        status = 206;
        headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`;
      }
      headers['Content-Length'] = String(Math.max(0, end - start + 1));
      response.writeHead(status, headers);
      if (request.method === 'HEAD' || !info.size) return response.end();
      const stream = createReadStream(filename, { start, end });
      stream.on('error', () => response.destroy());
      response.on('close', () => stream.destroy());
      stream.pipe(response);
    } catch {
      json(response, 404, { error: 'Page unavailable. Run npm run build first.' });
    }
  });
  server.requestTimeout = 20000;
  server.headersTimeout = 10000;
  return server;
}

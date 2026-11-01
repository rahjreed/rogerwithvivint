// Local production-artifact server implementing this repo's Vercel route contract.
// This is a local routing test, not an actual Vercel deployment.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export async function startPwaTestServer() {
  const root = fileURLToPath(new URL('../dist/', import.meta.url));
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };
  let version = 0;
  const file = async pathname => {
    const resolved = path.resolve(root, `.${pathname}`);
    if (resolved !== path.resolve(root) && !resolved.startsWith(path.resolve(root) + path.sep)) return;
    try {
      if ((await stat(resolved)).isFile()) return resolved;
      if (pathname.endsWith('/') && (await stat(path.join(resolved, 'index.html'))).isFile()) return path.join(resolved, 'index.html');
    } catch { /* Not a static file. */ }
  };
  const server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      let resolved;
      for (const route of config.routes) {
        if (route.handle === 'filesystem') { resolved = await file(pathname); if (resolved) break; }
        else if (new RegExp(`^(?:${route.src})$`).test(pathname)) {
          if (route.headers) for (const [key, value] of Object.entries(route.headers)) response.setHeader(key, value);
          if (route.dest) { resolved = await file(route.dest); break; }
        }
      }
      if (!resolved) { response.writeHead(404); response.end('Not found'); return; }
      response.setHeader('Content-Type', mime[path.extname(resolved)] || 'application/octet-stream');
      let body = await readFile(resolved);
      // Simulate a newly released worker without editing the real production artifact.
      if (pathname === '/sw.js' && version) body = Buffer.concat([body, Buffer.from(`\n// local-test-release-${version}\n`)]);
      if (request.method === 'HEAD') response.end(); else response.end(body);
    } catch { response.writeHead(500); response.end('Test server error'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { origin: `http://127.0.0.1:${server.address().port}`, nextVersion: () => version++, close: () => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }) };
}

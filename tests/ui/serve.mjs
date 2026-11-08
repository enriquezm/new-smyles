// Minimal static server for the generated site (.output/public), so the UI
// tests run against exactly what Render serves. Usage: node serve.mjs <dir> <port>
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'

const root = resolve(process.argv[2] ?? '.output/public')
const port = Number(process.argv[3] ?? 4173)

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
}

async function resolveFile(urlPath) {
  const path = join(root, normalize(decodeURIComponent(urlPath)))
  if (!path.startsWith(root)) return null
  for (const candidate of [path, join(path, 'index.html'), `${path}.html`]) {
    const info = await stat(candidate).catch(() => null)
    if (info?.isFile()) return candidate
  }
  return null
}

createServer(async (req, res) => {
  const file = await resolveFile(new URL(req.url ?? '/', 'http://localhost').pathname)
  if (!file) {
    res.writeHead(404).end('Not found')
    return
  }
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
}).listen(port, '127.0.0.1', () => console.log(`Serving ${root} at http://127.0.0.1:${port}`))

// Standalone Node HTTP server for the BJL Studios contact form.
// Runs in the bjl-studios-api Docker container, reverse-proxied by nginx at /api/.
// No external dependencies — uses only Node built-ins.

const http = require('http');
const https = require('https');

const PORT = parseInt(process.env.PORT || '3000', 10);
const TG_TOKEN = process.env.TG_BOT_TOKEN;
const TG_CHAT = process.env.TG_CHAT_ID;

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function sendTelegram(text) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      chat_id: TG_CHAT,
      text,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
    const opts = {
      hostname: 'api.telegram.org',
      path: `/bot${TG_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };
    const tgReq = https.request(opts, (tgRes) => {
      let data = '';
      tgRes.on('data', (c) => { data += c; });
      tgRes.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.ok) return resolve();
          return reject(new Error(parsed.description || 'Telegram error'));
        } catch (e) {
          return reject(new Error('Telegram parse error'));
        }
      });
    });
    tgReq.on('error', reject);
    tgReq.write(postData);
    tgReq.end();
  });
}

const server = http.createServer((req, res) => {
  // CORS — nginx strips the /api prefix, so the app is hit on /contact, /health etc.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Healthcheck — accept with and without /api prefix
  if (req.method === 'GET' && (req.url === '/health' || req.url === '/api/health' || req.url === '/' || req.url === '/api/')) {
    return json(res, 200, { ok: true, service: 'bjl-studios-api' });
  }

  // Accept both /contact (when Caddy uses handle_path to strip /api)
  // and /api/contact (when Caddy uses handle without stripping).
  if (req.url !== '/contact' && req.url !== '/api/contact') {
    return json(res, 404, { error: 'Not found' });
  }

  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  // Read body with a 10 KB limit so nobody can flood us.
  let raw = '';
  let aborted = false;
  req.on('data', (chunk) => {
    raw += chunk;
    if (raw.length > 10_000) {
      aborted = true;
      json(res, 413, { error: 'Payload too large' });
      req.destroy();
    }
  });
  req.on('end', async () => {
    if (aborted) return;

    let body;
    try {
      body = JSON.parse(raw || '{}');
    } catch (e) {
      return json(res, 400, { error: 'Invalid JSON' });
    }

    const { name, email, service, message, tgText } = body;
    if (!name || !email || !service || !message || !tgText) {
      return json(res, 400, { error: 'Missing required fields' });
    }

    if (!TG_TOKEN || !TG_CHAT) {
      return json(res, 500, { error: 'Server not configured', detail: 'Missing TG_BOT_TOKEN / TG_CHAT_ID' });
    }

    try {
      await sendTelegram(tgText);
      return json(res, 200, { success: true });
    } catch (err) {
      return json(res, 502, { error: 'Telegram request failed', detail: err.message });
    }
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`bjl-studios-api listening on :${PORT}`);
});

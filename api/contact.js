const https = require('https');

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, service, message, tgText } = req.body || {};

  if (!name || !email || !service || !message || !tgText) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const TG_TOKEN = process.env.TG_BOT_TOKEN;
  const TG_CHAT = process.env.TG_CHAT_ID;

  if (!TG_TOKEN || !TG_CHAT) {
    return res.status(500).json({ error: 'Server not configured', detail: 'Missing env vars' });
  }

  // Send to Telegram using Node.js https module (always available)
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      chat_id: TG_CHAT,
      text: tgText,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${TG_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const tgReq = https.request(options, (tgRes) => {
      let data = '';
      tgRes.on('data', (chunk) => { data += chunk; });
      tgRes.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.ok) {
            res.status(200).json({ success: true });
          } else {
            res.status(500).json({ error: 'Telegram error', detail: parsed.description });
          }
        } catch (e) {
          res.status(500).json({ error: 'Parse error' });
        }
        resolve();
      });
    });

    tgReq.on('error', (e) => {
      res.status(500).json({ error: 'Request failed', detail: e.message });
      resolve();
    });

    tgReq.write(postData);
    tgReq.end();
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  const { name, company, email, phone, contact_method, service, message, tgText } = req.body;

  if (!name || !email || !service || !message || !tgText) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const TG_TOKEN = process.env.TG_BOT_TOKEN;
  const TG_CHAT = process.env.TG_CHAT_ID;

  if (!TG_TOKEN || !TG_CHAT) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT,
        text: tgText,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });
    const tgData = await tgRes.json();

    if (tgData.ok) {
      return res.status(200).json({ success: true });
    }
    return res.status(500).json({ error: 'Telegram send failed' });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  const { name, email, service, message } = req.body;

  // Validate required fields
  if (!name || !email || !service || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Secrets from Vercel environment variables (never exposed to browser)
  const TG_TOKEN = process.env.TG_BOT_TOKEN;
  const TG_CHAT = process.env.TG_CHAT_ID;
  const W3F_KEY = process.env.WEB3FORMS_KEY;

  const results = { telegram: false, email: false };

  // 1. Send Telegram notification
  if (TG_TOKEN && TG_CHAT) {
    const gmailLink = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${encodeURIComponent('Re: Anfrage von ' + name + ' — BJL Studios')}&body=${encodeURIComponent('Hallo ' + name + ',\n\nvielen Dank für eure Anfrage!\n\n')}`;

    const tgText =
      `🔔 *Neue Anfrage über bjl-studios.de*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📧 *E-Mail:* ${email}\n` +
      `🛠 *Service:* ${service}\n` +
      `💬 *Nachricht:*\n${message}\n\n` +
      `━━━━━━━━━━━━━━━\n` +
      `📩 [Per Gmail antworten](${gmailLink})\n` +
      `📞 [Per E-Mail antworten](mailto:${email}?subject=Re:+Anfrage+BJL+Studios)`;

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
      results.telegram = tgData.ok === true;
    } catch (e) {
      results.telegram = false;
    }
  }

  // 2. Send email via Web3Forms
  if (W3F_KEY) {
    try {
      const w3Res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: W3F_KEY,
          subject: `Neue Anfrage: ${service} — ${name}`,
          from_name: 'BJL Studios Website',
          name,
          email,
          service,
          message,
        }),
      });
      const w3Data = await w3Res.json();
      results.email = w3Data.success === true;
    } catch (e) {
      results.email = false;
    }
  }

  // Success if at least one channel worked
  if (results.telegram || results.email) {
    return res.status(200).json({ success: true, results });
  }

  return res.status(500).json({ error: 'Failed to send notification', results });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  const { name, company, email, phone, contact_method, service, message } = req.body;

  if (!name || !email || !service || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const TG_TOKEN = process.env.TG_BOT_TOKEN;
  const TG_CHAT = process.env.TG_CHAT_ID;
  const W3F_KEY = process.env.WEB3FORMS_KEY;

  const results = { telegram: false, email: false };

  // 1. Telegram notification
  if (TG_TOKEN && TG_CHAT) {
    const gmailLink = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${encodeURIComponent('Re: Anfrage von ' + name + ' — BJL Studios')}&body=${encodeURIComponent('Hallo ' + name + ',\n\nvielen Dank für eure Anfrage!\n\n')}`;
    const cleanPhone = (phone || '').replace(/[^0-9+]/g, '');
    const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace(/^\+/, '')}` : '';

    // Build contact method label + reply link
    let methodLabel = '🤷 Egal';
    let replySection = `📩 [Per Gmail antworten](${gmailLink})\n📧 [Per E-Mail antworten](mailto:${email}?subject=Re:+Anfrage+BJL+Studios)`;

    if (contact_method === 'whatsapp' && waLink) {
      methodLabel = '📱 WhatsApp';
      replySection = `📱 [Per WhatsApp antworten](${waLink})\n📩 [Per Gmail antworten](${gmailLink})`;
    } else if (contact_method === 'email') {
      methodLabel = '📧 E-Mail';
      replySection = `📩 [Per Gmail antworten](${gmailLink})\n📧 [Per E-Mail antworten](mailto:${email}?subject=Re:+Anfrage+BJL+Studios)`;
    }

    let tgText =
      `🔔 *Neue Anfrage über bjl-studios.de*\n\n` +
      `👤 *Name:* ${name}\n`;
    if (company) tgText += `🏢 *Firma:* ${company}\n`;
    tgText += `📧 *E-Mail:* ${email}\n`;
    if (phone) tgText += `📞 *Telefon:* ${phone}\n`;
    tgText +=
      `🛠 *Service:* ${service}\n` +
      `💬 *Kontaktweg:* ${methodLabel}\n\n` +
      `*Nachricht:*\n${message}\n\n` +
      `━━━━━━━━━━━━━━━\n` +
      replySection;

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

  // 2. Email via Web3Forms
  if (W3F_KEY) {
    try {
      const w3Res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: W3F_KEY,
          subject: `Neue Anfrage: ${service} — ${name}${company ? ' (' + company + ')' : ''}`,
          from_name: 'BJL Studios Website',
          name,
          company: company || '-',
          email,
          phone: phone || '-',
          contact_method: contact_method || 'egal',
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

  if (results.telegram || results.email) {
    return res.status(200).json({ success: true, results });
  }

  return res.status(500).json({ error: 'Failed to send notification', results });
}

require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Send Help Request
app.post('/send-help', async (req, res) => {
  const { idTag, subject, reason, ip, time } = req.body;
  if (!idTag || !subject || !reason) return res.status(400).send('Missing fields.');
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const text = `🆘 *新帮助请求 New Help Request*\n\n🆔 ID标签: ${idTag}\n📌 Subject: ${subject}\n📝 Reason: ${reason}\n🌐 IP: ${ip}\n⏰ Time: ${time}`;
  try {
    const resp = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
    });
    const data = await resp.json();
    if (data.ok) return res.json({ ok: true, message_id: data.result.message_id });
    else return res.status(500).send('Failed to send to Telegram.');
  } catch {
    return res.status(500).send('Server error.');
  }
});

// Mark Solved
app.post('/mark-solved', async (req, res) => {
  const { name, messageId } = req.body;
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!name || !messageId) return res.status(400).send('Missing fields.');
  try {
    const resp = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `✅ Solved by ${name}`,
        parse_mode: 'Markdown',
        reply_to_message_id: messageId
      })
    });
    const data = await resp.json();
    if (data.ok) return res.send('Solved message sent!');
    else return res.status(500).send('Failed to send solved message.');
  } catch {
    return res.status(500).send('Server error.');
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));

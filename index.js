require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors()); // Allow all origins; restrict for production
app.use(express.json());

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
    if (data.ok) return res.send('Message sent!');
    else return res.status(500).send('Failed to send to Telegram.');
  } catch (err) {
    return res.status(500).send('Server error.');
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));

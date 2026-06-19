require('dotenv').config();

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  const chatId = String(ctx.chat.id);
  const username = ctx.from.username || '';

  const connectionCode = `TG-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  await fetch(process.env.POWER_AUTOMATE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      connectionCode,
      chatId,
      username
    })
  });

  await ctx.reply(
    `Telegram підключено.

Ваш код підключення:

\`\`\`
${connectionCode}
\`\`\`

Скопіюйте цей код у форму реєстрації.`,
    {
      parse_mode: 'Markdown'
    }
  );
});

bot.launch();

console.log('Conference Leo bot started');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
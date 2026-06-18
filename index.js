require('dotenv').config();

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  const telegramId = ctx.from.id;
  const username = ctx.from.username || '';
  const firstName = ctx.from.first_name || '';
  const lastName = ctx.from.last_name || '';

  await fetch(process.env.POWER_AUTOMATE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      telegramId,
      username,
      firstName,
      lastName
    })
  });

  await ctx.reply(
    'Telegram підключено.\n\nТепер заповніть форму реєстрації та оберіть Telegram як бажаний канал сповіщень.'
  );
});

bot.launch();

console.log('Conference Leo bot started');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
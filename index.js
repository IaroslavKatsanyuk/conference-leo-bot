require('dotenv').config();

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  const chatId = ctx.chat.id;
  const username = ctx.from.username || '';
  const firstName = ctx.from.first_name || '';
  const lastName = ctx.from.last_name || '';

  console.log('Telegram connected:', {
    chatId,
    username,
    firstName,
    lastName,
  });

  await ctx.reply(
    [
      'Telegram підключено.',
      '',
      'Тепер заповніть форму реєстрації та оберіть Telegram як бажаний канал сповіщень.',
      '',
      username
        ? `Ваш Telegram username: @${username}`
        : 'У вас не вказаний Telegram username. Додайте username у налаштуваннях Telegram або оберіть Email у формі.',
    ].join('\n')
  );
});

bot.launch();

console.log('Conference Leo bot started');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
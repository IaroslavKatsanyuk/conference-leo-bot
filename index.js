require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

async function getTelegramCode(ctx) {
  const chatId = String(ctx.chat.id);
  const username = ctx.from.username || '';

  const response = await fetch(process.env.POWER_AUTOMATE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chatId,
      username
    })
  });

  if (!response.ok) {
    throw new Error(`Power Automate error: ${response.status}`);
  }

  const data = await response.json();

  return data.connectionCode;
}

async function sendCode(ctx) {
  try {
    const connectionCode = await getTelegramCode(ctx);

    await ctx.reply(
      `Ваш Telegram код підключення:

\`\`\`
${connectionCode}
\`\`\`

Використовуйте цей код у формі реєстрації на конференцію.`,
      {
        parse_mode: 'Markdown',
        ...Markup.keyboard([
          ['Показати мій код'],
          ['Допомога']
        ]).resize()
      }
    );
  } catch (error) {
    console.error(error);

    await ctx.reply(
      'Не вдалося отримати код підключення. Спробуйте ще раз трохи пізніше.'
    );
  }
}

bot.start(async (ctx) => {
  await ctx.reply(
    'Telegram підключено до системи конференцій.',
    Markup.keyboard([
      ['Показати мій код'],
      ['Допомога']
    ]).resize()
  );

  await sendCode(ctx);
});

bot.hears('Показати мій код', async (ctx) => {
  await sendCode(ctx);
});

bot.hears('Допомога', async (ctx) => {
  await ctx.reply(
    `Як користуватися:

1. Натисніть "Показати мій код".
2. Скопіюйте код TG-XXXXXX.
3. Вставте його у форму реєстрації, якщо обрали Telegram як канал сповіщення.

Код постійний і не змінюється для вашого Telegram акаунта.`
  );
});

bot.launch();

console.log('Conference Leo bot started');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
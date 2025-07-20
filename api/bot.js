import { Telegraf } from 'telegraf';
import { MongoClient } from 'mongodb';

const bot = new Telegraf(process.env.BOT_TOKEN);
const mongo = new MongoClient(process.env.MONGO_URI);

// Подключение к базе данных
await mongo.connect();
const db = mongo.db('blackroom');
const bookings = db.collection('bookings');

// Обработчик команды /start
bot.command('start', (ctx) => {
  ctx.reply('Добро пожаловать в BLACKROOM! Используйте /booking для бронирования стола.');
});

// Обработчик команды /booking
bot.command('booking', (ctx) => {
  // Здесь будет логика бронирования
  ctx.reply('📅 Выберите дату игры:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Сегодня", callback_data: "date_today" }],
        [{ text: "Завтра", callback_data: "date_tomorrow" }],
        [{ text: "Послезавтра", callback_data: "date_dayafter" }]
      ]
    }
  });
});

// Обработка callback-запросов
bot.action('date_today', (ctx) => {
  ctx.editMessageText('✅ Выбрана дата: сегодня\nВыберите время:');
  // ... допишите остальную логику
});

// Экспорт обработчика для Vercel
export default async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
};

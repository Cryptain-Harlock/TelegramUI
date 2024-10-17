import Calendar from "telegram-inline-calendar";
import { Telegraf, Context } from "telegraf";
import dotenv from "dotenv";
dotenv.config();

const TOKEN: string = process.env.BOT_TOKEN || "";
const bot: Telegraf = new Telegraf(TOKEN);

const calendar: Calendar = new Calendar(bot, {
  date_format: "DD-MM-YYYY",
  language: "en",
  bot_api: "telegraf",
});

bot.start((ctx: Context) => calendar.startNavCalendar(ctx.message));

bot.on("callback_query", (ctx: Context) => {
  if (ctx.callbackQuery && ctx.callbackQuery.message) {
    if (
      ctx.callbackQuery.message.message_id ===
      calendar.chats.get(ctx.callbackQuery.message.chat.id)
    ) {
      const res = calendar.clickButtonCalendar(ctx.callbackQuery);
      if (res !== -1) {
        bot.telegram.sendMessage(
          ctx.callbackQuery.message.chat.id,
          "You selected: " + res
        );
      }
    }
  }
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

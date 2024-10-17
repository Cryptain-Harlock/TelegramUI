import { Telegraf, Context } from "telegraf";
import dotenv from "dotenv";
dotenv.config();

const TOKEN: string = process.env.BOT_TOKEN || "";
const bot: Telegraf = new Telegraf(TOKEN);

const MIN_NUMBER = 1;
const MAX_NUMBER = 10;
let currentNumber = MIN_NUMBER; // Start from the minimum number

// Number of blocks for the progress bar (e.g., 10 blocks for 10% increments)
const PROGRESS_BAR_LENGTH = 10;

bot.start((ctx: Context) => {
  ctx.reply(
    `Number stepper bot!\n${generateProgressBar(currentNumber, MAX_NUMBER)}`,
    {
      reply_markup: {
        inline_keyboard: generateKeyboard(currentNumber),
      },
    }
  );
});

bot.action("increment", (ctx: Context) => {
  if (currentNumber < MAX_NUMBER) {
    currentNumber++;
  }
  ctx.editMessageText(
    `Number stepper bot!\n${generateProgressBar(currentNumber, MAX_NUMBER)}`,
    {
      reply_markup: {
        inline_keyboard: generateKeyboard(currentNumber),
      },
    }
  );
});

bot.action("decrement", (ctx: Context) => {
  if (currentNumber > MIN_NUMBER) {
    currentNumber--;
  }
  ctx.editMessageText(
    `Number stepper bot!\n${generateProgressBar(currentNumber, MAX_NUMBER)}`,
    {
      reply_markup: {
        inline_keyboard: generateKeyboard(currentNumber),
      },
    }
  );
});

bot.action("confirm", (ctx: Context) => {
  ctx.reply(`The current number is: ${currentNumber}`);
});

// Function to generate the keyboard dynamically
function generateKeyboard(currentNumber: number) {
  return [
    [
      ...(currentNumber > MIN_NUMBER
        ? [{ text: "<<", callback_data: "decrement" }]
        : [{ text: "MIN", callback_data: "noworks" }]), // Show "-" only if currentNumber > MIN_NUMBER
      { text: currentNumber.toString(), callback_data: "value" },
      ...(currentNumber < MAX_NUMBER
        ? [{ text: ">>", callback_data: "increment" }]
        : [{ text: "MAX", callback_data: "noworks" }]), // Show "+" only if currentNumber < MAX_NUMBER
    ],
    [
      { text: "Confirm", callback_data: "confirm" }, // Confirm button always visible
    ],
  ];
}

// Function to generate a text-based progress bar
function generateProgressBar(current: number, total: number) {
  const progress = Math.round((current / total) * PROGRESS_BAR_LENGTH);
  const emptyProgress = PROGRESS_BAR_LENGTH - progress;

  const progressBar = "█".repeat(progress);
  // const emptyBar = "░".repeat(emptyProgress);
  const emptyBar = `    `.repeat(emptyProgress);

  return `Progress: [${progressBar}${emptyBar}] ${current}/${total}`;
}

bot.launch();

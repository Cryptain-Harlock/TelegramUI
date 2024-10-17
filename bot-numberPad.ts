import { Telegraf, Context } from "telegraf";
import dotenv from "dotenv";
dotenv.config();

const TOKEN: string = process.env.BOT_TOKEN || "";
const bot: Telegraf = new Telegraf(TOKEN);

let currentInput: string = "0";
const limit: number = 100;

const keyboard = [
  [
    { text: "1", callback_data: "1" },
    { text: "2", callback_data: "2" },
    { text: "3", callback_data: "3" },
  ],
  [
    { text: "4", callback_data: "4" },
    { text: "5", callback_data: "5" },
    { text: "6", callback_data: "6" },
  ],
  [
    { text: "7", callback_data: "7" },
    { text: "8", callback_data: "8" },
    { text: "9", callback_data: "9" },
  ],
  [
    { text: "Reset", callback_data: "reset" },
    { text: "0", callback_data: "0" },
    { text: ".", callback_data: "." },
  ],
  [{ text: "Ok", callback_data: "ok" }],
];

// Normalize the input by stripping unnecessary leading zeros
const normalizeInput = (input: string): string => {
  if (input.startsWith("0") && !input.startsWith("0.") && input.length > 1) {
    input = input.replace(/^0+/, ""); // Remove leading zeros unless it's a decimal like "0.5"
  }
  if (input === "") input = "0"; // Reset to "0" if input becomes empty
  return input;
};
// Check if input exceeds the limit of 100
const exceedsLimit = (input: string): boolean => {
  const value = parseFloat(input);
  return value > limit;
};

// Validate the final number format (remove trailing decimal)
const validateNumberFormat = (input: string): string => {
  if (input.endsWith(".")) {
    return input.slice(0, -1); // Remove trailing dot (e.g., "100." -> "100")
  }
  return input;
};

bot.start(async (ctx: Context) => {
  currentInput = "0"; // Reset current input to "0"

  // Send the initial message with input and keyboard together
  await ctx.reply(`Current input: ${currentInput}`, {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });
});

// Handle number button presses
bot.action(/^[0-9.]$/, async (ctx: any) => {
  const number = ctx.match[0];

  // Prevent multiple dots in the input
  if (number === "." && currentInput.includes(".")) {
    await ctx.answerCbQuery("Invalid input: only one decimal point allowed.");
    return;
  }

  let newInput = currentInput;

  // Append valid number to currentInput
  if (currentInput === "0" && number !== ".") {
    newInput = number; // Replace "0" with the number unless it's a decimal point
  } else {
    newInput += number;
  }

  // Normalize the input to prevent leading zeros
  newInput = normalizeInput(newInput);

  // Check if the input exceeds 100
  if (exceedsLimit(newInput)) {
    await ctx.answerCbQuery(`Input cannot exceed ${limit}.`);
    return;
  }

  // Only update the message if the input has changed
  if (newInput !== currentInput) {
    currentInput = newInput;
    await ctx.editMessageText(`Current input: ${currentInput}`, {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  } else {
    await ctx.answerCbQuery("No change in input.");
  }
});

// Handle "OK" button press
bot.action("ok", async (ctx: Context) => {
  // Validate the number format and correct if necessary
  const validatedInput = validateNumberFormat(currentInput);

  if (validatedInput) {
    await ctx.reply(`You entered: ${validatedInput}`);
  } else {
    await ctx.reply("No input provided.");
  }
});

// Handle "Reset" button press
bot.action("reset", async (ctx: Context) => {
  currentInput = "0"; // Reset the input to "0"
  await ctx.editMessageText(`Reset: ${currentInput}`, {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });
});

bot.launch();

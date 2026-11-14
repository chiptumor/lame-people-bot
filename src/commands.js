import * as Dotenv from "dotenv";
import * as Discord from "discord.js";

Dotenv.config();

const commandConfig = {
  type: Discord.ApplicationCommandType.ChatInput
}

const commands = [
  {
    name: "open-channel",
    description: "Open #one-message",
    options: [{
      name: "deletemessages",
      description: "Whether to delete the existing messages (default: true)",
      type: Discord.ApplicationCommandOptionType.Boolean,
      required: false
    }],
    ...commandConfig
  },
  {
    name: "close-channel",
    description: "Close #one-message",
    ...commandConfig
  }
];

const rest = new Discord.REST().setToken(process.env.TOKEN);

const put = body =>
  rest.put(Discord.Routes.applicationCommands(process.env.ID), { body });

put([]).then(() => put(commands)).catch(console.error);

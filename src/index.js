import * as Discord from "discord.js";
import * as Dotenv from "dotenv";
import config from "./config.js";

const ADMINS = new Set(config.admins);

Dotenv.config();
  // allows access to the secret file with secrets like the login token

const client = new Discord.Client({ intents: [
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages,
]});

await client.login(process.env.TOKEN);

const channelId = config.channelId;
const channel = await client.channels.fetch(channelId);

let finalFunction = closeChannel;

client.on("messageCreate", message => {
  if (message.channelId !== channelId) return;

  finalFunction(message);
});

client.on("interactionCreate", async i => {
  await i.deferReply({ flags:
    i.channelId === channelId ? Discord.MessageFlags.Ephemeral : 0
  });

  // prevent non-admins from using commands
  if (!ADMINS.has(i.user.id)) {
    await i.editReply("go eat a poop bro who do you think you are");
    return;
  }

  switch (i.commandName) {
    case "open-channel":
      const deleteMessages = i.options.getBoolean("deletemessages") ?? true;
      await openChannel(deleteMessages);
      await i.editReply(`opened ${channel}`);
      break;
    case "close-channel":
      await closeChannel();
      await i.editReply(`closed ${channel}`);
      break;
  }
});

let timeout;
function cancelDelay() {
  if (timeout) clearTimeout(timeout);
  timeout = null;
}

async function openChannel(deleteMessages) {
  if (deleteMessages) {
    await channel.bulkDelete(25, true).catch(console.error)
  }

  cancelDelay();
  await setPermissions(null);
  console.log("+ opened channel");
}

async function closeChannel(andOpen = false) {
  await setPermissions(false);
  console.log("- closed channel");
  if (andOpen) {
    const tf = config.timeFrame;
    const time = tf.min + (Math.random() * (tf.max - tf.min));
    timeout = setTimeout(() => openChannel(true), time);
  }
}

async function setPermissions(state) {
  await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
    SendMessages: state
  });
}

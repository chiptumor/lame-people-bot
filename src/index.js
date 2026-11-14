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

let finalFunction = initial;

client.on("messageCreate", message => {
  if (message.channelId !== channelId) return;

  finalFunction(message);
});

client.on("interactionCreate", async i => {
  await i.deferReply();

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

async function initial(message) {
  await closeChannel();
  const tf = config.timeFrame;
  const time = tf.min + (Math.random() * (tf.max - tf.min));
  setTimeout(() => openChannel(true), time);
}

async function openChannel(deleteMessages) {
  if (deleteMessages) {
    await channel.bulkDelete(25, true).catch(console.error)
  }

  await setPermissions(null);
  console.log("+ opened channel");
}

async function closeChannel() {
  await setPermissions(false);
  console.log("- closed channel");
}

async function setPermissions(state) {
  await channel.permissionOverwrites.create(channel.guild.roles.everyone, {
    SendMessages: state
  });
}

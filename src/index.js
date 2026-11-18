import * as Discord from "discord.js";
import * as Dotenv from "dotenv";
import CONFIG from "./config.js";

Dotenv.config();
  // allows access to the secret file with secrets like the login token

const client = new Discord.Client({ intents: [
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages,
]});

await client.login(process.env.TOKEN);

for (const [channelId, config] of Object.entries(CONFIG)) {
  const admins = new Set(config.admins);
  const channel = await client.channels.fetch(channelId);
  const guild = channel.guild;

  let finalFunction = () => closeChannel(true);

  client.on("messageCreate", message => {
    if (message.channelId !== channelId) return;

    finalFunction(message);
  });

  client.on("interactionCreate", async i => {
    if (message.guildId !== guild.id) return;
    
    await i.deferReply({ flags:
      i.channelId === channelId ? Discord.MessageFlags.Ephemeral : 0
    });

    // prevent non-admins from using commands
    if (!admins.has(i.user.id)) {
      await i.editReply("go eat a poop bro who do you think you are");
      return;
    }

    switch (i.commandName) {
      case "open-channel":
        await openChannel(
          i.options.getBoolean("deletemessages") ?? true
        );
        await i.editReply(`opened ${channel}`);
        break;
      case "close-channel":
        await closeChannel(
          i.options.getBoolean("reopenlater") ?? true
        );
        await i.editReply(`closed ${channel}`);
        break;
    }
  });

  async function onmessage(message) {
    Discord.Message.prototype.content
    print(`  ${message.author} sent ${message.content
      ? `"${message.content}"`
      : "the one message"}`);
    closeChannel();
  }

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
    print("+ opened channel");
  }

  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    timeStyle: "short"
  });

  async function closeChannel(reopenLater = false) {
    await setPermissions(false);
    print("- closed channel");
    if (reopenLater) {
      const tf = config.timeFrame;
      const time = tf.min + (Math.random() * (tf.max - tf.min));
      timeout = setTimeout(() => openChannel(true), time);
      print("  opens at " + dtf.format(Date.now() + time));
    }
  }

  async function setPermissions(state) {
    await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
      SendMessages: state
    });
  }
  
  function print(message) {
    const color = 13;
    console.log(`\x1b[${color}m[${guild.name}] \x1b[0m${message}`);
  }
}

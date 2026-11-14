/*

channel = get channel(config.channelId)

channel.on("message sent", function (message):
  if channel.permissions.open:
    setPermissions(false)
    time = config.min + (random() * (config.max - config.min))
    setTimeout(openChannel, time)
)

function openChannel():
  messages = channel.messages
  for message in messages:
    message.delete()
  setPermissions(true)

function setPermissions(bool):
  return channel.setPermissions(everyone, {
    SendMessages: true
  })
  // https://discordjs.guide/legacy/popular-topics/permissions
  // https://discord.js.org/docs/packages/discord.js/14.28.0/PermissionOverwriteManager:Class#edit
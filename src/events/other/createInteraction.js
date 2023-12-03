const client = require("../../index");

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const _slashcommand = client.slashcommand.get(interaction.commandName);
  if (!_slashcommand) return;

  try {
    await _slashcommand.run(client, interaction);
  } catch (e) {
    console.error(e);
  }
});

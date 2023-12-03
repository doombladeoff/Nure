const fs = require("fs");
const { Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
const config = require("../../config.json");

module.exports = async (client) => {
  const data = [];
  fs.readdirSync("./src/SlashCommand").forEach((dir) => {
    if (dir.endsWith(".js"))
      return console.error(`[ ${dir} ] не является папкой`);
    console.log(`[ FOLDER ]`, dir);
    const slashCommandFile = fs
      .readdirSync(`./src/SlashCommand/${dir}/`)
      .filter((files) => files.endsWith(".js"));
    for (const file of slashCommandFile) {
      const slashCommand = require(`../SlashCommand/${dir}/${file}`);

      client.slashcommand.set(slashCommand.data.name, slashCommand);
      console.log(
        `\t✅ [ Slash CMD ] Клиентская команда SlashCommands (/) загружена: ${file}`
      );
      data.push(slashCommand.data.toJSON());
    }
  });
  const rest = new REST({ version: "10" }).setToken(config.Token);
  client.on("ready", async () => {
    (async () => {
      try {
        console.log(
          `[ Slash CMD ] Обновление команд приложения (/).`
        );
        await rest.put(Routes.applicationCommands(config.clientID), {
          body: data,
        });
        console.log(
          `[ Slash CMD ] Команды приложения (/) успешно перезагружены.`
        );
      } catch (error) {
        console.error(`[ Slash CMD ] SlashError: ${error}`);
      }
    })();
  });
};

const client = require("../../index");
const fs = require("fs");
const userDataFile = "./users.json";
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  PermissionsBitField,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("subscribe")
    .setDefaultMemberPermissions(PermissionsBitField.Administrator)
    .setDescription("Подписаться на рассылку."),
  run: async (client, interaction) => {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return interaction.reply({ content: "У вас нет прав для этой команды." });
    try {
      const button_subscribe = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("subscribe_btn")
          .setEmoji("🔗")
          .setLabel("Подписаться")
          .setStyle(ButtonStyle.Secondary)
      );

      const embed = new EmbedBuilder()
        .setColor("Grey")
        .setTitle("Рассылка уведомлений")
        .setDescription(
          "Нажмите кнопку ниже чтобы подписаться на рассылку новостей."
        );
      await interaction.channel.send({
        embeds: [embed],
        components: [button_subscribe],
      });
    } catch (error) {
      console.log(error);
    }
  },
};

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isButton()) {
      if (interaction.customId == "subscribe_btn") {
        createUserData(interaction);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

async function createUserData(interaction) {
  const getIdUser = interaction.member.id;

  let data = [];
  if (fs.existsSync(userDataFile)) {
    const rawData = fs.readFileSync(userDataFile);
    if (rawData.length > 0) {
      data = JSON.parse(rawData);
    }
  }
  const resultIndex = checkUserData(data, getIdUser);

  if (resultIndex !== -1) {
    console.log(`Пользователь ${getIdUser} найден по индексу ${resultIndex}.`);
    return interaction.reply({
      content: `Вы уже подписались`,
      ephemeral: true,
    });
  } else {
    console.log(`Пользователь ${getIdUser} не найден в массиве.`);
    addUserData(getIdUser);
  }
}

function addUserData(newUSerDataRecord) {
  try {
    let data = [];
    if (fs.existsSync(userDataFile)) {
      const rawData = fs.readFileSync(userDataFile);
      if (rawData.length > 0) {
        data = JSON.parse(rawData);
      }
    }
    data.push(newUSerDataRecord);
    fs.writeFileSync(userDataFile, JSON.stringify(data, null, 2));

    console.log("Новые данные пользователя успешно добавлены в JSON файл.");
    return interactions.reply({ content: "Вы подписались", ephemeral: true });
  } catch (error) {
    console.log(error);
  }
}

function checkUserData(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

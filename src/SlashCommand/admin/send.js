const client = require('../../index');
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const fs = require("fs");
let attachment;
let messageSend = String

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("Отправить")
    .addStringOption((option) => {
      return option
        .setName("message")
        .setDescription("Сообщение")
        .setRequired(true)
    })
    .addAttachmentOption((option) => {
      return option
        .setName("attachment")
        .setDescription("Attachment 1")
    }),
  run: async (client, interaction) => {
    messageSend = interaction.options.getString("message");
    attachment = (await interaction.options.getAttachment("attachment"));

    const preview_embed = new EmbedBuilder()
      .setTitle('Уведомление')
      .setDescription(messageSend)
      .setColor('Grey')

    const send_button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("sendButton")
        .setLabel("Отправить")
        .setStyle(ButtonStyle.Secondary)
    );

    if (attachment) {
      if (attachment.contentType) {
        preview_embed.setImage(attachment.proxyURL)
      }
      interaction.reply(
        {
          content: 'Предосмотр отправляемого сообщения',
          embeds: [preview_embed],
          components: [send_button],
          ephemeral: true,
        })
    } else {
      interaction.reply(
        {
          content: 'Предосмотр отправляемого сообщения',
          embeds: [preview_embed],
          components: [send_button],
          ephemeral: true,
        })
    }
  },
};

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isButton()) {
      if (interaction.customId == "sendButton") {
        const embed_message = new EmbedBuilder()
          .setColor("Grey")
          .setTitle("Уведомление!")
          .setDescription(messageSend);

        var usersArray = JSON.parse(fs.readFileSync('users.json', 'utf8'));
        if (usersArray) {
          for (let i = 0; i < usersArray.length; i++) {
            const user = client.users.cache.get(usersArray[i]);
            console.log(user)
            if (!attachment) {
              user.send({ embeds: [embed_message] }).catch(console.error);
              interaction.reply({
                content: "Вы отправили сообщение всем подписаным пользователям",
                ephemeral: true,
              });
            } else {
              if (attachment.contentType) {
                console.log('Image Type: ' + attachment.contentType);
                embed_message
                  .setImage(attachment.proxyURL)
                user.send({ embeds: [embed_message] }).catch(console.error);
              } else {
                user.send({ embeds: [embed_message], files: [attachment] }).catch(console.error);
              }
            }
          }
        } else {
          interaction.reply({
            content: "Подписаных пользователей нет",
            ephemeral: true,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

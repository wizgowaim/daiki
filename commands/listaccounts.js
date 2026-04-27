const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "listaccounts",
    description: "Affiche la liste des comptes Valorant enregistrés"
  },

  async execute(interaction) {
    const filePath = path.join(__dirname, "../data/accounts.json");

    if (!fs.existsSync(filePath)) {
      return interaction.reply({
        content: "❌ Aucun compte enregistré.",
        ephemeral: true
      });
    }

    const accounts = JSON.parse(fs.readFileSync(filePath));

    if (accounts.length === 0) {
      return interaction.reply({
        content: "❌ Aucun compte enregistré.",
        ephemeral: true
      });
    }

    let description = "";

    accounts.forEach((acc, i) => {
      description += `**${i + 1}.** ${acc.name}#${acc.tag}\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle("📋 Liste des comptes Valorant")
      .setColor(0xFD4556)
      .setDescription(description)
      .setFooter({
        text: `Total : ${accounts.length} compte(s)`
      });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

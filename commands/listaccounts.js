const db = require("../database/db");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "listaccounts",
    description: "Liste des comptes Valorant"
  },

  async execute(interaction) {
    db.all(`SELECT * FROM accounts`, [], (err, rows) => {
      if (err) {
        return interaction.reply({
          content: "❌ Erreur DB",
          ephemeral: true
        });
      }

      if (!rows.length) {
        return interaction.reply({
          content: "❌ Aucun compte.",
          ephemeral: true
        });
      }

      let description = rows
        .map((r, i) => `**${i + 1}.** ${r.name}#${r.tag}`)
        .join("\n");

      const embed = new EmbedBuilder()
        .setTitle("📋 Comptes Valorant")
        .setColor(0xFD4556)
        .setDescription(description)
        .setFooter({
          text: `Total : ${rows.length}`
        });

      interaction.reply({ embeds: [embed], ephemeral: true });
    });
  }
};

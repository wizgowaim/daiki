const fs = require("fs");
const path = require("path");
const { getRR } = require("../services/valorant");
const { EmbedBuilder } = require("discord.js");

function formatRR(rr) {
  return rr.toString().slice(-2);
}

module.exports = {
  data: {
    name: "leaderboard",
    description: "Affiche le classement Valorant"
  },

  async execute(interaction) {
    await interaction.deferReply();

    const accounts = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/accounts.json"))
    );

    let players = [];

    for (const acc of accounts) {
      const data = await getRR(acc.name, acc.tag);

      players.push({
        name: acc.name,
        rr: data.rr,
        rank: data.rank
      });
    }

    players.sort((a, b) => b.rr - a.rr);

    const medals = ["🥇", "🥈", "🥉"];

    let description = "";

    players.forEach((p, i) => {
      const pos = i + 1;
      const medal = medals[i] || `**${pos}ème**`;

      description += `${medal} **${p.name}**\n`;
      description += `➜ ${p.rank} | **${formatRR(p.rr)} RR**\n\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle("🏆 Leaderboard Valorant")
      .setColor(0xFD4556) // rouge Valorant style
      .setDescription(description)
      .setFooter({
        text: `Page 1/1 • Mis à jour le ${new Date().toLocaleString("fr-FR")}`
      });

    await interaction.editReply({ embeds: [embed] });
  }
};

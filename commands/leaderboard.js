const fs = require("fs");
const path = require("path");
const { getRR } = require("../services/valorant");
const { EmbedBuilder } = require("discord.js");

// 🎯 format RR (2 derniers chiffres comme tu voulais)
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

    // 🏁 tri décroissant
    players.sort((a, b) => b.rr - a.rr);

    const medals = ["🥇", "🥈", "🥉"];

    // 🎮 style VCT clean
    let description = "";

    players.forEach((p, i) => {
      const pos = i + 1;
      const medal = medals[i] || `#${pos}`;

      description += `**${medal} ${p.name}**\n`;
      description += `Rank: **${p.rank}**\n`;
      description += `RR: **${formatRR(p.rr)}**\n`;
      description += `────────────────────\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle("🏆 VALORANT CHAMPIONS TOUR — LEADERBOARD")
      .setDescription(description)
      .setColor(0xff4655) // rouge Valorant officiel
      .setFooter({
        text: `Updated • ${new Date().toLocaleString("fr-FR")}`
      });

    await interaction.editReply({ embeds: [embed] });
  }
};

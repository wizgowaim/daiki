const fs = require("fs");
const path = require("path");
const { getRR } = require("../services/valorant");
const { EmbedBuilder } = require("discord.js");

function formatRR(rr) {
  return rr.toString().slice(-2);
}

// 🎨 couleur selon rank
function getColor(rank) {
  rank = rank.toLowerCase();

  if (rank.includes("iron") || rank.includes("bronze")) return 0x7a7a7a;
  if (rank.includes("silver") || rank.includes("gold")) return 0xf1c40f;
  if (rank.includes("platinum")) return 0x3498db;
  if (rank.includes("diamond")) return 0x9b59b6;
  if (rank.includes("ascendant")) return 0xe91e63;
  if (rank.includes("immortal")) return 0xe74c3c;
  if (rank.includes("radiant")) return 0xf39c12;

  return 0x2f3136;
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

    // 🎨 couleur du TOP 1
    const topRank = players[0]?.rank || "";
    const color = getColor(topRank);

    const embed = new EmbedBuilder()
      .setTitle("🏆 Leaderboard Valorant")
      .setColor(color)
      .setDescription(description)
      .setFooter({
        text: `Page 1/1 • Mis à jour le ${new Date().toLocaleString("fr-FR")}`
      });

    await interaction.editReply({ embeds: [embed] });
  }
};

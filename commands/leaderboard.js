const fs = require("fs");
const path = require("path");
const { getRR } = require("../services/valorant");
const { EmbedBuilder } = require("discord.js");

function formatRR(rr) {
  if (rr === undefined || rr === null) return "0";
  return rr.toString().slice(-2);
}

module.exports = {
  data: {
    name: "leaderboard",
    description: "Affiche le classement des joueurs"
  },

  async execute(interaction) {
    await interaction.deferReply();

    const accounts = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/accounts.json"))
    );

    let players = [];

    // ⚡ récupération RR
    for (const acc of accounts) {
      const data = await getRR(acc.name, acc.tag);

      players.push({
        name: acc.name,
        rr: data?.rr ?? 0,
        rank: data?.rank ?? "UNKNOWN"
      });
    }

    // 🏆 tri décroissant
    players.sort((a, b) => b.rr - a.rr);

    const medals = ["🥇", "🥈", "🥉"];

    let description = "";

    players.forEach((p, i) => {
      const pos = i + 1;
      const medal = medals[i] || `${pos}ème`;

      if (i < 3) {
        // 🥇🥈🥉 format spécial
        description += `${medal} ${pos === 1 ? "1er" : pos === 2 ? "2ème" : "3ème"}\n`;
      } else {
        // autres positions
        description += `${pos}ème\n`;
      }

      description += `${p.name} (${p.rank} | ${formatRR(p.rr)}rr)\n\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle("🏆 Leaderboard Valorant")
      .setColor(0xFD4556)
      .setDescription(description)
      .setFooter({
        text: `Page 1/1 • Aujourd’hui à ${new Date().toLocaleString("fr-FR")}`
      });

    await interaction.editReply({ embeds: [embed] });
  }
};

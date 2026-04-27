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

    // ⚡ récupération des données
    for (const acc of accounts) {
      const data = await getRR(acc.name, acc.tag);

      players.push({
        name: acc.name,
        rr: data?.rr ?? 0,
        rank: data?.rank ?? "UNKNOWN"
      });
    }

    // 🏆 tri
    players.sort((a, b) => b.rr - a.rr);

    const medals = ["🥇", "🥈", "🥉"];

    let description = "";

    players.forEach((p, i) => {
      const pos = i + 1;
      const medal = medals[i] || `${pos}ème`;

      if (i < 3) {
        description += `${medal} ${pos === 1 ? "1er" : pos === 2 ? "2ème" : "3ème"}\n`;
      } else {
        description += `${pos}ème\n`;
      }

      description += `${p.name} (${p.rank} | ${formatRR(p.rr)}rr)\n\n`;
    });

    // 📅 date + heure FR propre
    const now = new Date();

    const date = now.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });

    const time = now.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    const embed = new EmbedBuilder()
      .setTitle("Classement des joueurs")
      .setColor(0x1c171b)
      .setDescription(description)
      });

    await interaction.editReply({ embeds: [embed] });
  }
};

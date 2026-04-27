const fs = require("fs");
const path = require("path");
const { getRR } = require("../services/valorant");
const { EmbedBuilder } = require("discord.js");

function formatRR(rr) {
  if (rr === undefined || rr === null) return "0";
  return rr.toString().slice(-2);
}

// 🇫🇷 traduction des ranks
function translateRank(rank) {
  if (!rank) return "Inconnu";

  const map = {
    iron: "Fer",
    bronze: "Bronze",
    silver: "Argent",
    gold: "Or",
    platinum: "Platine",
    diamond: "Diamant",
    ascendant: "Ascendant",
    immortal: "Immortel",
    radiant: "Radiant"
  };

  const lower = rank?.toLowerCase() || "";

  for (const key in map) {
    if (lower.includes(key)) {
      return rank.replace(new RegExp(key, "i"), map[key]);
    }
  }

  return rank;
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

    // ⚡ appels API en parallèle (beaucoup plus rapide)
    const results = await Promise.all(
      accounts.map(acc => getRR(acc.name, acc.tag))
    );

    let players = accounts.map((acc, i) => ({
      name: acc.name,
      rr: results[i]?.rr ?? 0,
      rank: results[i]?.rank ?? "UNKNOWN"
    }));

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

      description += `${p.name} (${translateRank(p.rank)} | ${formatRR(p.rr)}rr)\n\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle("Classement des joueurs")
      .setColor(0x1a1519)
      .setDescription(description);

    await interaction.editReply({ embeds: [embed] });
  }
};

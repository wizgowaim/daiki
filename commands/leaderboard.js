const { EmbedBuilder } = require("discord.js");
const db = require("../database/db");
const { getRR } = require("../services/valorant");

function formatRR(rr) {
  if (!rr) return "0";
  return rr.toString().slice(-2);
}

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

  const lower = rank.toLowerCase();

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
    description: "Classement des joueurs"
  },

  async execute(interaction) {
    await interaction.deferReply();

    db.all(`SELECT * FROM accounts`, async (err, rows) => {
      if (err) {
        return interaction.editReply("❌ Erreur DB");
      }

      if (!rows.length) {
        return interaction.editReply("❌ Aucun compte");
      }

      // ⚡ appels API en parallèle
      const results = await Promise.all(
        rows.map(acc => getRR(acc.name, acc.tag))
      );

      let players = rows.map((acc, i) => ({
        name: acc.name,
        rr: results[i]?.rr ?? 0,
        rank: results[i]?.rank ?? "UNKNOWN"
      }));

      // 🏆 tri
      players.sort((a, b) => b.rr - a.rr);

      let description = "";

      players.forEach((p, i) => {
        const pos = i + 1;

        const label =
          pos === 1 ? "🥇 1er" :
          pos === 2 ? "🥈 2ème" :
          pos === 3 ? "🥉 3ème" :
          `${pos}ème`;

        description += `${label}\n`;
        description += `${p.name} (${translateRank(p.rank)} | ${formatRR(p.rr)}rr)\n\n`;
      });

      const embed = new EmbedBuilder()
        .setTitle("Classement des joueurs")
        .setColor(0x1a1519)
        .setDescription(description);

      await interaction.editReply({ embeds: [embed] });
    });
  }
};

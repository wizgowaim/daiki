const { EmbedBuilder } = require("discord.js");
const { getRR } = require("../services/valorant");
const db = require("../database/db");

module.exports = {
  data: {
    name: "leaderboard",
    description: "Affiche le classement des joueurs"
  },

  async execute(interaction) {
    await interaction.deferReply();

    // 📦 récupération des comptes depuis SQLite
    db.all(`SELECT * FROM accounts`, async (err, rows) => {
      if (err) {
        return interaction.editReply("❌ Erreur base de données");
      }

      if (!rows.length) {
        return interaction.editReply("❌ Aucun compte enregistré");
      }

      let players = [];

      // ⚡ récupération RR (API Valorant)
      for (const acc of rows) {
        const data = await getRR(acc.name, acc.tag);

        players.push({
          name: acc.name,
          rr: data?.rr ?? 0,
          rank: data?.rank ?? "UNKNOWN"
        });
      }

      // 🏆 tri par RR
      players.sort((a, b) => b.rr - a.rr);

      let description = "";

      players.forEach((p, i) => {
        const pos = i + 1;

        const medal =
          pos === 1 ? "🥇 1er" :
          pos === 2 ? "🥈 2ème" :
          pos === 3 ? "🥉 3ème" :
          `${pos}ème`;

        description += `${medal}\n`;
        description += `${p.name} (${p.rank} | ${p.rr.toString().slice(-2)}rr)\n\n`;
      });

      // 📅 date FR propre
      const now = new Date().toLocaleString("fr-FR");

      const embed = new EmbedBuilder()
        .setTitle("🏆 Leaderboard Valorant")
        .setColor(0xFD4556)
        .setDescription(description)
        .setFooter({
          text: `Page 1/1 • ${now}`
        });

      await interaction.editReply({ embeds: [embed] });
    });
  }
};

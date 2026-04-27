const fs = require("fs");
const path = require("path");
const { getRR } = require("../services/valorant");
const { EmbedBuilder } = require("discord.js");

// 🔢 sécurisation RR
function formatRR(rr) {
  if (rr === undefined || rr === null) return "0";
  return rr.toString().slice(-2);
}

// 🎨 couleur selon rank
function getColor(rank) {
  if (!rank) return 0x2f3136;

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

    // 🏆 tri
    players.sort((a, b) => b.rr - a.rr);

    const medals = ["🥇", "🥈", "🥉"];

    let description = "";

    players.forEach((p, i) => {
      const pos = i + 1;

      if (i < 3) {
        // 🔥 TOP 3 STYLE VCT
        const medal = medals[i];

        description += `${medal} ${pos === 1 ? "1er" : pos === 2 ? "2ème" : "3ème"}\n`;
        description += `**${p.name}**\n`;
        description += `➜ ${p.rank} | **${formatRR(p.rr)} RR**\n\n`;
      } else {
        // 🧊 RESTE DU RANK
        description += `**${pos}ème**\n`;
        description += `${p.name} (${p.rank} | ${formatRR(p.rr)} RR)\n\n`;
      }
    });

    // 🎨 couleur TOP 1
    const color = getColor(players[0]?.rank);

    const embed = new EmbedBuilder()
      .setTitle("🏆 Classement des joueurs")
      .setColor(color)
      .setDescription(description)
      .setFooter({
        text: `Page 1/1 • Mis à jour le ${new Date().toLocaleString("fr-FR")}`
      });

    await interaction.editReply({ embeds: [embed] });
  }
};

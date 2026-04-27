const fs = require("fs");
const path = require("path");
const { getRR } = require("../services/valorant");

function formatRR(rr) {
  const str = rr.toString();

  const last = str.slice(-1);
  const secondLast = str.slice(-2, -1);

  if (secondLast === "0") {
    return last;
  }

  return str.slice(-2);
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

    let msg = "Classement des joueurs\n\n";

    players.forEach((p, i) => {
      const pos = i + 1;
      const medal = medals[i] || `${pos}ème`;

      msg += `${medal} ${pos === 1 ? "1er" : pos === 2 ? "2ème" : pos === 3 ? "3ème" : `${pos}ème`}\n`;
      msg += `${p.name} (${p.rank} | formatRR(p.rr)rr)\n\n`;
    });

    const time = new Date().toLocaleString("fr-FR");
    msg += `Page 1/1 • Aujourd’hui à ${time}`;

    await interaction.editReply(msg);
  }
};

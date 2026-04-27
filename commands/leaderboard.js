const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");
const { getRR } = require("../services/valorant");

// Même chemin que addaccount/removeaccount
// En local : ./data/accounts.json
// Sur Railway avec DATA_DIR=/data : /data/accounts.json
const dataDir = process.env.DATA_DIR || path.join(__dirname, "../data");
const accountsPath = path.join(dataDir, "accounts.json");

function ensureAccountsFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(accountsPath)) {
    fs.writeFileSync(accountsPath, "[]", "utf8");
  }
}

function readAccounts() {
  ensureAccountsFile();

  try {
    const file = fs.readFileSync(accountsPath, "utf8");
    const accounts = JSON.parse(file);

    if (!Array.isArray(accounts)) {
      return [];
    }

    return accounts;
  } catch (error) {
    console.error("Erreur lecture accounts.json :", error);
    return [];
  }
}

function formatRR(value) {
  if (value === undefined || value === null) return "00";

  const number = Number(value);
  if (Number.isNaN(number)) return "00";

  // Ton service renvoie actuellement l'elo global.
  // On récupère donc les deux derniers chiffres pour afficher les RR.
  const rr = number % 100;

  return String(rr).padStart(2, "0");
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

  let translatedRank = rank;

  for (const englishRank in map) {
    const regex = new RegExp(englishRank, "i");

    if (regex.test(translatedRank)) {
      translatedRank = translatedRank.replace(regex, map[englishRank]);
      break;
    }
  }

  return translatedRank;
}

function getPositionLabel(index) {
  if (index === 0) return "🥇 1er";
  if (index === 1) return "🥈 2ème";
  if (index === 2) return "🥉 3ème";
  return `${index + 1}ème`;
}

module.exports = {
  data: {
    name: "leaderboard",
    description: "Affiche le classement des joueurs"
  },

  async execute(interaction) {
    await interaction.deferReply();

    const accounts = readAccounts();

    if (accounts.length === 0) {
      return interaction.editReply({
        content: "Aucun compte n'est enregistré dans le leaderboard."
      });
    }

    try {
      const results = await Promise.allSettled(
        accounts.map(account => getRR(account.name, account.tag))
      );

      const players = accounts.map((account, index) => {
        const result = results[index];

        if (result.status === "fulfilled") {
          return {
            name: account.name,
            tag: account.tag,
            rank: result.value?.rank || "Inconnu",
            elo: result.value?.rr ?? 0,
            hasError: false
          };
        }

        return {
          name: account.name,
          tag: account.tag,
          rank: "Inconnu",
          elo: 0,
          hasError: true
        };
      });

      // Tri par elo global, plus fiable que par RR seulement
      players.sort((a, b) => b.elo - a.elo);

      let description = "";

      players.forEach((player, index) => {
        const position = getPositionLabel(index);
        const rank = translateRank(player.rank);
        const rr = formatRR(player.elo);

        description += `${position}\n`;
        description += `${player.name} (${rank} | ${rr}rr)`;

        if (player.hasError) {
          description += " ⚠️";
        }

        description += "\n\n";
      });

      const embed = new EmbedBuilder()
        .setTitle("Classement des joueurs")
        .setColor(0x1a1519)
        .setDescription(description);

      return interaction.editReply({
        embeds: [embed]
      });
    } catch (error) {
      console.error("Erreur leaderboard :", error);

      return interaction.editReply({
        content: "Impossible de générer le leaderboard pour le moment."
      });
    }
  }
};

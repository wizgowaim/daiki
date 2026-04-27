const fs = require("fs");
const path = require("path");
const { getRR } = require("./services/valorant");
const { EmbedBuilder } = require("discord.js");

let messageId = null;
const channelId = "1498095645729493122"; // 🔴 à remplir

function formatRR(rr) {
  return rr.toString().slice(-2);
}

async function buildEmbed() {
  const accounts = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./data/accounts.json"))
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
    const medal = medals[i] || `${i + 1}ème`;

    description += `${medal} **${p.name}**\n`;
    description += `➜ ${p.rank} | **${formatRR(p.rr)} RR**\n\n`;
  });

  return new EmbedBuilder()
    .setTitle("🏆 Leaderboard Valorant")
    .setColor(0xFD4556)
    .setDescription(description)
    .setFooter({
      text: `Auto-refresh • ${new Date().toLocaleString("fr-FR")}`
    });
}

async function startAutoLeaderboard(client) {
  const channel = await client.channels.fetch(channelId);

  // 🟢 1er lancement → création du message
  const embed = await buildEmbed();

  const msg = await channel.send({ embeds: [embed] });
  messageId = msg.id;

  // 🔁 refresh auto
  setInterval(async () => {
    try {
      const updated = await buildEmbed();

      const message = await channel.messages.fetch(messageId);
      await message.edit({ embeds: [updated] });

      console.log("🔄 Leaderboard updated");
    } catch (err) {
      console.log("❌ Error refresh leaderboard:", err.message);
    }
  }, 5 * 60 * 1000); // 5 min
}

module.exports = { startAutoLeaderboard };

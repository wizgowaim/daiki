async execute(interaction) {
  await interaction.deferReply();

  const db = require("../database/db");

  db.all(`SELECT * FROM accounts`, async (err, rows) => {
    if (err) {
      return interaction.editReply("❌ Erreur base de données");
    }

    let players = [];

    for (const acc of rows) {
      const data = await getRR(acc.name, acc.tag);

      players.push({
        name: acc.name,
        rr: data?.rr ?? 0,
        rank: data?.rank ?? "UNKNOWN"
      });
    }

    players.sort((a, b) => b.rr - a.rr);

    let description = "";

    players.forEach((p, i) => {
      const pos = i + 1;

      description += `${pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : `${pos}ème`}\n`;
      description += `${p.name} (${p.rank} | ${p.rr.toString().slice(-2)}rr)\n\n`;
    });

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

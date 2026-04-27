const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "../data/accounts.json");

module.exports = {
  data: {
    name: "addaccount",
    description: "Ajoute un compte",
    options: [
      { name: "name", type: 3, required: true },
      { name: "tag", type: 3, required: true }
    ]
  },

  async execute(interaction) {
    const name = interaction.options.getString("name");
    const tag = interaction.options.getString("tag");

    let accounts = [];

    // 📥 lire fichier
    if (fs.existsSync(filePath)) {
      accounts = JSON.parse(fs.readFileSync(filePath));
    }

    // ➕ ajouter compte
    accounts.push({ name, tag });

    // 💾 sauvegarder
    fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));

    await interaction.reply({
      content: `✅ Ajouté : ${name}#${tag}`,
      ephemeral: true
    });
  }
};

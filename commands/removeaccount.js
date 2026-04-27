const fs = require("fs");
const path = require("path");

module.exports = {
  data: {
    name: "removeaccount",
    description: "Supprime un compte Valorant",
    options: [
      {
        name: "name",
        description: "Pseudo Valorant",
        type: 3,
        required: true
      }
    ]
  },

  async execute(interaction) {
    const name = interaction.options.getString("name");

    const filePath = path.join(__dirname, "../data/accounts.json");

    if (!fs.existsSync(filePath)) {
      return interaction.reply({
        content: "❌ Aucun compte trouvé.",
        ephemeral: true
      });
    }

    let accounts = JSON.parse(fs.readFileSync(filePath));

    const initialLength = accounts.length;

    accounts = accounts.filter(
      a => a.name.toLowerCase() !== name.toLowerCase()
    );

    if (accounts.length === initialLength) {
      return interaction.reply({
        content: "❌ Compte introuvable.",
        ephemeral: true
      });
    }

    fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));

    return interaction.reply({
      content: `🗑️ Compte supprimé : **${name}**`,
      ephemeral: true
    });
  }
};

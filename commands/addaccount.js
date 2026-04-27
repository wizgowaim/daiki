const fs = require("fs");
const path = require("path");

module.exports = {
  data: {
    name: "addaccount",
    description: "Ajoute un compte Valorant",
    options: [
      {
        name: "name",
        description: "Pseudo Valorant",
        type: 3,
        required: true
      },
      {
        name: "tag",
        description: "Tag (ex: EUW)",
        type: 3,
        required: true
      }
    ]
  },

  async execute(interaction) {
    const name = interaction.options.getString("name");
    const tag = interaction.options.getString("tag");

    const filePath = path.join(__dirname, "../data/accounts.json");

    let accounts = [];

    if (fs.existsSync(filePath)) {
      accounts = JSON.parse(fs.readFileSync(filePath));
    }

    // éviter doublons
    const exists = accounts.find(
      a => a.name.toLowerCase() === name.toLowerCase() && a.tag === tag
    );

    if (exists) {
      return interaction.reply({
        content: "❌ Ce compte existe déjà.",
        ephemeral: true
      });
    }

    accounts.push({ name, tag });

    fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));

    return interaction.reply({
      content: `✅ Compte ajouté : **${name}#${tag}**`,
      ephemeral: true
    });
  }
};

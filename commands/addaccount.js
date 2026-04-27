const db = require("../database/db");

module.exports = {
  data: {
    name: "addaccount",
    description: "Ajoute un compte Valorant",
    options: [
      {
        name: "name",
        type: 3,
        required: true
      },
      {
        name: "tag",
        type: 3,
        required: true
      }
    ]
  },

  async execute(interaction) {
    const name = interaction.options.getString("name");
    const tag = interaction.options.getString("tag");

    db.run(
      `INSERT INTO accounts (name, tag) VALUES (?, ?)`,
      [name, tag],
      function (err) {
        if (err) {
          return interaction.reply({
            content: "❌ Erreur lors de l'ajout.",
            ephemeral: true
          });
        }

        interaction.reply({
          content: `✅ Ajouté : ${name}#${tag}`,
          ephemeral: true
        });
      }
    );
  }
};

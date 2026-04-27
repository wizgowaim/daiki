const db = require("../database/db");

module.exports = {
  data: {
    name: "removeaccount",
    description: "Supprime un compte Valorant",
    options: [
      {
        name: "name",
        type: 3,
        required: true
      }
    ]
  },

  async execute(interaction) {
    const name = interaction.options.getString("name");

    db.run(
      `DELETE FROM accounts WHERE LOWER(name) = LOWER(?)`,
      [name],
      function (err) {
        if (err) {
          return interaction.reply({
            content: "❌ Erreur suppression.",
            ephemeral: true
          });
        }

        if (this.changes === 0) {
          return interaction.reply({
            content: "❌ Compte introuvable.",
            ephemeral: true
          });
        }

        interaction.reply({
          content: `🗑️ Supprimé : ${name}`,
          ephemeral: true
        });
      }
    );
  }
};

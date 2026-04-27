const axios = require("axios");

async function getRR(name, tag) {
  try {
    const url = `https://api.henrikdev.xyz/valorant/v1/mmr/eu/${name}/${tag}`;

    const res = await axios.get(url, {
      headers: {
        Authorization: process.env.VALORANT_API_KEY
      }
    });

    console.log("🔥 SUCCESS RESPONSE:");
    console.log(JSON.stringify(res.data, null, 2));

    return res.data;

  } catch (err) {
    console.log("❌ FULL ERROR:");
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", err.response?.data);
    console.log("MESSAGE:", err.message);

    return null;
  }
}

module.exports = { getRR };

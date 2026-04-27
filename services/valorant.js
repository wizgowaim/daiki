const axios = require("axios");

async function getRR(name, tag) {
  try {
    const res = await axios.get(
      `https://api.henrikdev.xyz/valorant/v1/mmr/eu/${name}/${tag}`,
      {
        headers: {
          Authorization: process.env.VALORANT_API_KEY
        }
      }
    );

    // 🔍 debug pour voir la vraie réponse API
    console.log("API RESPONSE:", JSON.stringify(res.data, null, 2));

    const data = res.data?.data;

    const current = data?.current_data || data?.current;

    return {
      rr: current?.mmr ?? 0,
      rank: current?.currenttierpatched ?? "Unknown"
    };

  } catch (err) {
    console.log("API ERROR:", err.response?.data || err.message);

    return {
      rr: 0,
      rank: "Unknown"
    };
  }
}

module.exports = { getRR };

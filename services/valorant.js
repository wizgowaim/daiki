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

    console.log("🔥 FULL API RESPONSE:");
    console.log(JSON.stringify(res.data, null, 2));

    return { rr: 0, rank: "TEST" };

  } catch (err) {
    console.log("❌ API ERROR:");
    console.log(err.response?.data || err.message);

    return { rr: 0, rank: "ERROR" };
  }
}

module.exports = { getRR };

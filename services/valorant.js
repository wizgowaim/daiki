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

    const data = res.data?.data?.current_data;

    return {
      rr: data?.mmr ?? 0,
      rank: data?.currenttierpatched ?? "Unknown"
    };
  } catch (err) {
    return {
      rr: 0,
      rank: "Unknown"
    };
  }
}

module.exports = { getRR };
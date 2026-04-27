const axios = require("axios");

const cache = new Map();
const CACHE_TTL = 2 * 60 * 1000;

async function getRR(name, tag) {
  const key = `${name}#${tag}`;
  const now = Date.now();

  if (cache.has(key)) {
    const cached = cache.get(key);
    if (now - cached.time < CACHE_TTL) return cached.data;
  }

  try {
    const res = await axios.get(
      `https://api.henrikdev.xyz/valorant/v1/mmr/eu/${name}/${tag}`,
      {
        headers: {
          Authorization: process.env.VALORANT_API_KEY
        }
      }
    );

    // 🔥 DEBUG IMPORTANT (active temporairement)
    console.log("API RESPONSE:", JSON.stringify(res.data, null, 2));

    const data = res.data?.data;

    const current = data?.current_data || data?.current;

    const result = {
      rr: current?.mmr ?? 0,
      rank: current?.currenttierpatched ?? "Unknown"
    };

    cache.set(key, {
      time: now,
      data: result
    });

    return result;

  } catch (err) {
    console.log("API ERROR:", err.response?.data || err.message);

    return {
      rr: 0,
      rank: "Unknown"
    };
  }
}

module.exports = { getRR };

import axios from "axios";

const API_KEY = "sk_tzIuIbEx726kD8uL"; // ⚠️ টেস্টের জন্য ঠিক আছে, কিন্তু প্রোডাকশনে গোপন রাখো

export default async function handler(req, res) {
  // ✅ Allow public access from anywhere
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { linkId } = req.query;

  if (!linkId) {
    return res.status(400).json({ error: "Missing linkId" });
  }

  try {
    const response = await axios.get(
      `https://api-v2.short.io/statistics/link/${linkId}`,
      {
        params: { period: "total" },
        headers: { accept: "*/*", authorization: API_KEY },
      }
    );

    const data = response.data;
    const humanClicks = data.humanClicks || 0;

    let countries = [];
    if (data.country) {
      countries = data.country.map((c) => ({
        ...c,
        score: c.humanScore || c.score,
      }));
    }

    res.status(200).json({
      success: true,
      message: "🚀 Public API Ready!",
      humanClicks,
      countries,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
}

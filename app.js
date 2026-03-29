const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
const DEEZER_BASE = "https://api.deezer.com";

async function deezerFetch(path) {
  const url = `${DEEZER_BASE}${path}&output=json`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/deezer/search", async (req, res) => {
  const { q, type = "track" } = req.query;
  if (!q) return res.status(400).json({ error: "q requis" });
  try {
    const data = await deezerFetch(`/search/${type}?q=${encodeURIComponent(q)}`);
    res.json({ total: data.total, results: data.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`API sur port ${PORT}`));



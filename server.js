import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/proxy", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data", details: error.toString() });
  }
});

app.get("/", (req, res) => {
  res.send("Proxy server running");
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});

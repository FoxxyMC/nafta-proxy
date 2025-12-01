import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

// --------- ENDPOINT CORRECTO ---------
app.get("/api", async (req, res) => {
  try {
    const targetURL = req.query.url;
    if (!targetURL) {
      return res.status(400).json({ error: "Falta parámetro ?url=" });
    }

    const response = await fetch(targetURL);

    // si la API devuelve HTML o error → mostrar mensaje claro
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await response.text();
      return res.status(500).json({
        error: "La API no devolvió JSON",
        detalle: text.substring(0, 200)
      });
    }

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: "Error en el proxy", detalle: err.message });
  }
});

// Render usa este puerto:
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Proxy server running on port " + PORT);
});

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

// Ruta raíz para evitar que Render devuelva HTML
app.get("/", (req, res) => {
  res.json({ status: "ok", msg: "Proxy operativo" });
});

// ENDPOINT CORRECTO DEL PROXY
app.get("/api", async (req, res) => {
  try {
    const targetURL = req.query.url;
    if (!targetURL) {
      return res.status(400).json({ error: "Falta parámetro ?url=" });
    }

    const response = await fetch(targetURL);

    // Validación de contenido JSON real
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await response.text();
      return res.status(502).json({
        error: "La API remota NO devolvió JSON",
        detalle: text.substring(0, 200)
      });
    }

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: "Error interno del proxy", detalle: err.message });
  }
});

// Puerto obligatorio para Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Servidor proxy activo en puerto " + PORT);
});

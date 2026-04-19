import express from "express";
import multer from "multer";
import { extractPdfText } from "../services/pdfService.js";
import { analyzeCvWithAi } from "../services/groqService.js";

const router = express.Router();
const upload = multer();

function extractScore(text) {
  const match = text.match(/(\d{1,3})%/);
  if (!match) return 0;

  const value = Number(match[1]);
  if (Number.isNaN(value)) return 0;
  if (value > 100) return 100;
  if (value < 0) return 0;

  return value;
}

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const { jobDescription } = req.body;

    if (!file) {
      return res.status(400).json({ message: "No se recibió el PDF." });
    }

    if (!jobDescription?.trim()) {
      return res.status(400).json({ message: "La vacante es obligatoria." });
    }

    const cvText = await extractPdfText(file.buffer);

    if (!cvText.trim()) {
      return res.status(400).json({ message: "No se pudo leer el PDF." });
    }

    const analysis = await analyzeCvWithAi(cvText, jobDescription);
    const score = extractScore(analysis);

    res.json({
      score,
      analysis
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error interno al analizar el CV."
    });
  }
});

export default router;
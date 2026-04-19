import express from "express";
import multer from "multer";
import { extractPdfText } from "../services/pdfService.js";
import { optimizeCvWithAi } from "../services/groqService.js";

const router = express.Router();
const upload = multer();

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

    const optimizedText = await optimizeCvWithAi(cvText, jobDescription);

    res.json({
      optimizedText
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error interno al optimizar el CV."
    });
  }
});

export default router;
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { authenticateToken, checkSubscription } = require('../middleware/auth');
const User = require('../models/User');
const Groq = require('groq-sdk');

const router = express.Router();

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF y DOC/DOCX'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Inicializar Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Función para extraer texto de PDF
async function extractPDFText(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

// Función para analizar CV con Groq
async function analyzeCVWithGroq(cvText, jobDescription) {
  const prompt = `
Eres un experto reclutador y auditor de CVs. Analiza el siguiente CV y compáralo con la descripción del puesto.

CV:
${cvText.substring(0, 8000)}

Descripción del puesto:
${jobDescription}

Proporciona un análisis estructurado en JSON con el siguiente formato:
{
  "score": (número del 0-100),
  "matchPercentage": (número del 0-100),
  "strengths": ["fortaleza1", "fortaleza2", ...],
  "weaknesses": ["debilidad1", "debilidad2", ...],
  "missingSkills": ["habilidad1", "habilidad2", ...],
  "recommendations": ["recomendación1", "recomendación2", ...],
  "summary": "resumen breve del análisis"
}

Sé objetivo y profesional.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Eres un experto reclutador profesional. Analizas CVs y proporcionas evaluaciones detalladas y objetivas."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0]?.message?.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('Error analizando con Groq:', error);
    throw new Error('Error al analizar el CV con IA');
  }
}

// Endpoint para auditar CV
router.post('/analyze', authenticateToken, checkSubscription, upload.single('cv'), async (req, res) => {
  let uploadedFile = null;
  
  try {
    const { jobDescription } = req.body;
    const cvFile = req.file;

    if (!cvFile) {
      return res.status(400).json({ error: 'Por favor sube un archivo de CV' });
    }

    if (!jobDescription) {
      return res.status(400).json({ error: 'Por favor proporciona la descripción del puesto' });
    }

    uploadedFile = cvFile.path;

    // Extraer texto del CV
    let cvText = '';
    if (cvFile.mimetype === 'application/pdf') {
      cvText = await extractPDFText(cvFile.path);
    } else {
      // Para DOC/DOCX, por ahora solo PDF
      return res.status(400).json({ error: 'Por ahora solo soportamos archivos PDF' });
    }

    if (!cvText || cvText.trim().length === 0) {
      return res.status(400).json({ error: 'No se pudo extraer texto del CV' });
    }

    // Analizar con Groq
    const analysis = await analyzeCVWithGroq(cvText, jobDescription);

    // Actualizar créditos del usuario
    const user = await User.findById(req.user.userId);
    if (user.subscription.plan !== 'enterprise') {
      user.subscription.creditsUsed += 1;
    }
    
    // Guardar en historial
    user.auditHistory.push({
      fileName: cvFile.originalname,
      jobDescription: jobDescription.substring(0, 500),
      score: analysis.score,
      result: analysis,
      createdAt: new Date()
    });
    
    await user.save();

    // Eliminar archivo temporal
    if (uploadedFile && fs.existsSync(uploadedFile)) {
      fs.unlinkSync(uploadedFile);
    }

    res.json({
      success: true,
      analysis: analysis,
      creditsRemaining: user.subscription.creditsLimit - user.subscription.creditsUsed,
      plan: user.subscription.plan
    });

  } catch (error) {
    console.error('Error en análisis:', error);
    
    // Limpiar archivo si existe
    if (uploadedFile && fs.existsSync(uploadedFile)) {
      fs.unlinkSync(uploadedFile);
    }
    
    res.status(500).json({ 
      error: error.message || 'Error al procesar el análisis' 
    });
  }
});

// Endpoint para obtener historial de auditorías
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('auditHistory subscription');
    res.json({
      history: user.auditHistory.reverse(),
      subscription: user.subscription
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

// Endpoint para obtener estadísticas del usuario
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('subscription auditHistory');
    res.json({
      plan: user.subscription.plan,
      creditsUsed: user.subscription.creditsUsed,
      creditsLimit: user.subscription.creditsLimit,
      remainingCredits: user.subscription.creditsLimit - user.subscription.creditsUsed,
      totalAudits: user.auditHistory.length,
      subscriptionEndDate: user.subscription.subscriptionEndDate
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// ========== GENERADOR DE CARTA DE PRESENTACIÓN ==========
router.post('/cover-letter', authenticateToken, async (req, res) => {
  try {
    const { jobTitle, companyName, skills, additionalInfo } = req.body;
    const Groq = require('groq-sdk');
    
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const prompt = `Genera una carta de presentación profesional para el siguiente puesto:

Puesto: ${jobTitle}
Empresa: ${companyName}
Habilidades destacadas: ${skills}
Información adicional: ${additionalInfo || 'Ninguna'}

La carta debe:
1. Ser profesional y persuasiva
2. Tener formato de carta formal con lugar y fecha
3. Incluir saludo, introducción, cuerpo y cierre
4. Ser personalizada para la empresa y el puesto
5. Extensión: aproximadamente 250-350 palabras

Devuelve SOLO la carta de presentación, sin texto adicional.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Eres un experto redactor de cartas de presentación. Genera cartas profesionales, persuasivas y personalizadas."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
    });

    const coverLetter = completion.choices[0]?.message?.content;
    
    res.json({ success: true, coverLetter });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al generar la carta de presentación' });
  }
});

module.exports = router;
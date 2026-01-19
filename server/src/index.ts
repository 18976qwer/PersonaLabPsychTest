import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { generateDeepSeekReport } from './services/deepseek';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limit body size

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// AI Report Generation
app.post('/api/generate-report', async (req, res) => {
  try {
    const { mbti, mainType, subtype, lang, modules } = req.body;

    if (!mbti || !mainType || !subtype) {
      return res.status(400).json({ error: 'Missing personality data (mbti, mainType, subtype are required)' });
    }

    const report = await generateDeepSeekReport(
      mbti,
      String(mainType),
      String(subtype),
      lang || 'zh',
      modules
    );

    res.json(report);
  } catch (error: any) {
    console.error('Generation Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate report', 
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

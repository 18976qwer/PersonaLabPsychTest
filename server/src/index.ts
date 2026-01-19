import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import axios from 'axios';

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

// Mock AI Report Generation
app.post('/api/generate-report', async (req, res) => {
  const { mbti, enneagram } = req.body;

  if (!mbti || !enneagram) {
    return res.status(400).json({ error: 'Missing personality data' });
  }

  // TODO: Integrate with DeepSeek API
  // const response = await axios.post('https://api.deepseek.com/v1/chat/completions', { ... });

  // Mock response for now
  setTimeout(() => {
    res.json({
      success: true,
      report: `
        <h1>Personalized Analysis</h1>
        <p>Your MBTI type is <strong>${mbti}</strong> and your Enneagram type is <strong>${enneagram.mainType}w${enneagram.subtype}</strong>.</p>
        <p>This unique combination suggests...</p>
        <p><em>(This is a mock AI generated report)</em></p>
      `
    });
  }, 1000);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

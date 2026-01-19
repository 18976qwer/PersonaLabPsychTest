"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const deepseek_1 = require("./services/deepseek");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Security Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10kb' })); // Limit body size
// Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
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
        const report = await (0, deepseek_1.generateDeepSeekReport)(mbti, String(mainType), String(subtype), lang || 'zh', modules);
        res.json(report);
    }
    catch (error) {
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

import axios from 'axios';
import { AIReportData } from '../../types/report';
import { GenerateParams } from './types';
import { getSystemPrompt, buildStructure, getUserPrompt } from './utils';

const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

export const callDeepSeek = async (params: GenerateParams): Promise<Partial<AIReportData> | null> => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    console.error('DEEPSEEK_API_KEY is not set in environment variables');
    throw new Error('Server configuration error: Missing API Key');
  }

  const systemPrompt = getSystemPrompt(
    params.lang, 
    params.mbti, 
    params.mainType, 
    params.subtype, 
    `{ ${buildStructure(params.lang, params.mbti, params.mainType, params.subtype, params.modules)} }`
  );

  const baseUserPrompt = getUserPrompt(params.lang, params.mbti, params.mainType, params.subtype, params.modules);
  const userPrompt = params.extra ? `${baseUserPrompt}\n\nREFINE:\n${params.extra}` : baseUserPrompt;

  try {
    const response = await axios.post(DEEPSEEK_API_URL, {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 1.0,
      response_format: { type: "json_object" }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const content = response.data.choices[0].message.content;
    return JSON.parse(content) as Partial<AIReportData>;
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    throw error;
  }
};

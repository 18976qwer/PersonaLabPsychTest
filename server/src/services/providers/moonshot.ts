import axios from 'axios';
import { AIReportData } from '../../types/report';
import { GenerateParams } from './types';
import { getSystemPrompt, buildStructure, getUserPrompt } from './utils';
import { callDeepSeek } from './deepseek';

const TIMEOUT_MS = 60000;

export const callMoonshot = async (params: GenerateParams): Promise<Partial<AIReportData>> => {
  const apiKey = process.env.MOONSHOT_API_KEY;
  if (!apiKey) {
    console.warn('Missing Moonshot Config, falling back to DeepSeek...');
    return callDeepSeek(params) as Promise<Partial<AIReportData>>;
  }

  const systemPrompt = getSystemPrompt(params.lang, params.mbti, params.mainType, params.subtype, `{ ${buildStructure(params.lang, params.mbti, params.mainType, params.subtype, params.modules)} }`);
  const baseUserPrompt = getUserPrompt(params.lang, params.mbti, params.mainType, params.subtype, params.modules);
  const userPrompt = params.extra ? `${baseUserPrompt}\n\nREFINE:\n${params.extra}` : baseUserPrompt;

  try {
    const response = await axios.post(
      'https://api.moonshot.cn/v1/chat/completions',
      {
        model: params.model || 'moonshot-v1-8k',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      },
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        timeout: TIMEOUT_MS
      }
    );
    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Moonshot Failed, falling back to DeepSeek...', error);
    return callDeepSeek(params) as Promise<Partial<AIReportData>>;
  }
};

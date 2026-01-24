import axios from 'axios';
import { AIReportData } from '../../types/report';
import { GenerateParams } from './types';
import { getSystemPrompt, buildStructure, getUserPrompt } from './utils';
import { callMiniMax } from './minimax';

const TIMEOUT_MS = 60000;

export const callQwen = async (params: GenerateParams): Promise<Partial<AIReportData>> => {
  const apiKey = process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY;
  if (!apiKey) {
    console.warn('Missing Qwen API Key, falling back to MiniMax...');
    return callMiniMax(params);
  }

  const systemPrompt = getSystemPrompt(params.lang, params.mbti, params.mainType, params.subtype, `{ ${buildStructure(params.lang, params.mbti, params.mainType, params.subtype, params.modules)} }`);
  const baseUserPrompt = getUserPrompt(params.lang, params.mbti, params.mainType, params.subtype, params.modules);
  const userPrompt = params.extra ? `${baseUserPrompt}\n\nREFINE:\n${params.extra}` : baseUserPrompt;
  
  try {
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        model: params.model || 'qwen-plus',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        presence_penalty: 0.6
      },
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        timeout: TIMEOUT_MS
      }
    );
    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Qwen Failed, falling back to MiniMax...', error);
    return callMiniMax(params);
  }
};

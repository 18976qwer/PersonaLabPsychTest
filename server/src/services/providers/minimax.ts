import axios from 'axios';
import { AIReportData } from '../../types/report';
import { GenerateParams } from './types';
import { getSystemPrompt, buildStructure, getUserPrompt } from './utils';
import { callMoonshot } from './moonshot';

const TIMEOUT_MS = 60000;

export const callMiniMax = async (params: GenerateParams): Promise<Partial<AIReportData>> => {
  const apiKey = process.env.MINIMAX_API_KEY;
  const groupId = process.env.MINIMAX_GROUP_ID;
  
  if (!apiKey) {
    console.warn('Missing MiniMax API Key, falling back to Moonshot...');
    return callMoonshot(params);
  }

  const systemPrompt = getSystemPrompt(params.lang, params.mbti, params.mainType, params.subtype, `{ ${buildStructure(params.lang, params.mbti, params.mainType, params.subtype, params.modules)} }`);
  const baseUserPrompt = getUserPrompt(params.lang, params.mbti, params.mainType, params.subtype, params.modules);
  const userPrompt = params.extra ? `${baseUserPrompt}\n\nREFINE:\n${params.extra}` : baseUserPrompt;

  const url = groupId 
    ? `https://api.minimax.chat/v1/text/chatcompletion_v2?GroupId=${groupId}`
    : 'https://api.minimax.chat/v1/text/chatcompletion_v2';

  try {
    const response = await axios.post(
      url,
      {
        model: params.model || 'abab6.5s-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false,
        response_format: { type: 'json_object' }
      },
      {
        headers: { 
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: TIMEOUT_MS
      }
    );
    
    // MiniMax response structure check
    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('MiniMax Failed, falling back to Moonshot...', error);
    return callMoonshot(params);
  }
};

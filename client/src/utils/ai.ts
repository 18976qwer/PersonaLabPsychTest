// Determine API Base URL
// In production (Vercel), this will be relative '/api' which is proxied to backend
// In local dev, this can be configured via VITE_API_URL or default to relative if proxy is set in vite.config
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface AIReportData {
  traits: {
    quote: string;
    quoteAuthor?: string;
    mbtiDesc?: string;
    mainTypeDesc?: string;
    wingTypeDesc?: string;
  };
  overviewSection: {
    line1: string;
    line2: string;
  };
  combo: {
    overview: string;
    strengths: Array<{ title: string; desc: string }>;
    conflicts: Array<{ title: string; desc: string }>;
  };
  decoding: {
    strategic: { drive: string; manifestation: string };
    action: { drive: string; manifestation: string };
    resource: { drive: string; manifestation: string };
    chemistry: string;
  };
  ranking: {
    absoluteField: Array<{ area: string; desc: string; improve: string }>;
    top5Talents: Array<{ area: string; desc: string; improve: string }>;
    top10Abilities: Array<{ area: string; desc: string; improve: string }>;
    bottom10Weaknesses: Array<{ area: string; desc: string; improve: string }>;
  };
  pastFuture: {
    past: Array<{ title: string; desc: string }>;
    future: Array<{ title: string; desc: string }>;
  };
  subjective: {
    summary: string;
    highlights_intro: string;
    highlights: Array<{ title: string; desc: string }>;
    core_title: string;
    core: string;
  };
  career: {
    strengths: Array<{ point: string; desc: string }>;
    blindSpots: Array<{ point: string; desc: string }>;
    teamRole: Array<{ point: string; desc: string }>;
    collaborationStyle: Array<{ point: string; desc: string }>;
    environment: Array<{ point: string; desc: string }>;
    companions: Array<{ mbti: string; desc: string }>;
    traps: Array<{ point: string; desc: string }>;
  };
  growth: {
    best: { state: string; work: string; rel: string; feeling: string; how: string };
    daily: { state: string; work: string; rel: string; feeling: string; how: string };
    stress: { state: string; work: string; rel: string; feeling: string; how: string };
  };
  relationships: {
    communication: Array<{ mistake: string; cause: string; adjustment: string }>;
    intimacy: {
      strengths: string[];
      challenges: string[];
      growth: {
        consciousness: Array<{ title: string; desc: string }>;
        skill: Array<{ title: string; desc: string }>;
        pattern: Array<{ title: string; desc: string }>;
      };
    };
  };
  summary: {
    title: string;
    summary: string;
    highlights: {
      thinking: string;
      behavior: string;
      growth: string;
    };
  };
  guide?: {
    title: string;
    intro?: string;
    sections: Array<{
      title: string;
      items: string[];
    }>;
    outro?: string;
  };
  prompt?: string;
}

export const fetchAiAnalysis = async (
  mbti: string, 
  mainType: string, 
  subtype: string, 
  lang: 'zh' | 'en',
  modules?: string[],
  provider?: 'qwen' | 'minimax' | 'moonshot' | 'deepseek'
): Promise<Partial<AIReportData> | null> => {
  try {
    const baseUrl = API_BASE_URL.replace(/\/$/, '');
    const endpoint = `${baseUrl}/generate-report`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mbti,
        mainType,
        subtype,
        lang,
        modules,
        provider
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data as Partial<AIReportData>;
  } catch (error) {
    throw error;
  }
};

export const subscribeAiAnalysisStream = (
  params: {
    mbti: string
    mainType: string
    subtype: string
    lang: 'zh' | 'en'
    modules?: string[]
    provider?: 'qwen' | 'minimax' | 'moonshot' | 'deepseek'
  },
  onModule: (m: string, data: Partial<AIReportData>) => void,
  onDone?: () => void,
  onError?: (e: any) => void
) => {
  const baseUrl = API_BASE_URL.replace(/\/$/, '');
  const qs = new URLSearchParams({
    mbti: params.mbti,
    mainType: params.mainType,
    subtype: params.subtype,
    lang: params.lang,
    provider: params.provider || 'qwen',
    modules: (params.modules && params.modules.length ? params.modules.join(',') : '')
  }).toString();
  const url = `${baseUrl}/generate-report/stream?${qs}`;
  const es = new EventSource(url);
  es.addEventListener('module', (ev) => {
    try {
      const payload = JSON.parse((ev as MessageEvent).data);
      if (payload && payload.m && payload.data) onModule(payload.m, payload.data);
    } catch {}
  });
  es.addEventListener('refine', (ev) => {
    try {
      const payload = JSON.parse((ev as MessageEvent).data);
      if (payload && payload.m && payload.data) onModule(payload.m, payload.data);
    } catch {}
  });
  es.addEventListener('done', () => {
    if (onDone) onDone();
    es.close();
  });
  es.addEventListener('error', (e) => {
    if (onError) onError(e);
    es.close();
  });
  return es;
}

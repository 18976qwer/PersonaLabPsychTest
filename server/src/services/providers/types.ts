export type ProviderName = 'qwen' | 'minimax' | 'moonshot' | 'deepseek';

export interface GenerateParams {
  mbti: string;
  mainType: string;
  subtype: string;
  lang: 'zh' | 'en';
  modules?: string[];
  model?: string;
  extra?: string;
}

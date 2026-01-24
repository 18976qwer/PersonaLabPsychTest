import { COMMON_RULES, CN_RULES, EN_RULES, getModuleStructure } from '../promptTemplates';
import { mbtiAnchors, enneagramAnchors, bannedPhrasesZh } from '../lexicon';

export const getSystemPrompt = (lang: 'zh' | 'en', mbti: string, mainType: string, subtype: string, structureJSON: string) => {
  const langRules = lang === 'zh' ? CN_RULES : EN_RULES;
  
  return `${COMMON_RULES}
  
  ${langRules}
  
  QUALITY GUARD:
  - Avoid generic labels (热情/创造力/自信/积极/善于沟通/团队合作/努力/优秀). Use labels that are specific to MBTI ${mbti} and Enneagram ${mainType}w${subtype}.
  - Each description must include concrete scenario details (工作/人际/团队) rather than abstract adjectives.
  
  CRITICAL: You MUST analyze based strictly on the provided MBTI type (${mbti}) and Enneagram type (${mainType}w${subtype}). 
  You must NOT change, infer, or replace the MBTI or Enneagram type. All analysis, examples, and labels must remain for MBTI=${mbti} and Enneagram=${mainType}w${subtype}.
  
  Output ONLY valid JSON. No markdown code blocks. No explanations.
  Structure:
  {
      ${structureJSON}
  }
  Keep content concise, professional, and empathetic.`;
};

export const buildStructure = (lang: 'zh' | 'en', mbti: string, mainType: string, subtype: string, modules?: string[]) => {
  const allModules = getModuleStructure(lang, mbti, mainType, subtype);
  const requested = modules && modules.length > 0 ? modules : Object.keys(allModules);
  return requested.map(k => (allModules as any)[k]).join(',\n');
};

export const getUserPrompt = (lang: 'zh' | 'en', mbti: string, mainType: string, subtype: string, modules?: string[]) => {
  const anchors = [
    ...(mbtiAnchors[mbti] || []),
    ...(enneagramAnchors[String(mainType)] || []),
    ...(enneagramAnchors[String(subtype)] || [])
  ].slice(0, 6);
  const banned = lang === 'zh' ? bannedPhrasesZh.join('、') : 'enthusiasm, creativity, confidence, positivity, communication skills, teamwork';
  return `Analyze personality: MBTI=${mbti}, Enneagram=${mainType}w${subtype}.
  Language: ${lang === 'zh' ? 'Chinese (Simplified)' : 'English'}.
  GLOBAL CONSTRAINTS:
  - If the target language is Chinese, the output must be strictly in Chinese. Do NOT use English words mixed in sentences. All terms must be translated into natural, professional Chinese.
  - If the target language is English, the output must be strictly in English. Do NOT use Chinese characters or terms. Use natural, professional English terminology across all sections.
  - Avoid generic, universally applicable words (e.g., 热情/创造力/自信/积极/善于沟通/团队合作/努力/优秀). Use labels specific to MBTI ${mbti} and Enneagram ${mainType}w${subtype} interaction.
  - For strengths/conflicts descriptions, include: Scene -> Behavior -> Impact -> Advice. Keep it concrete, scenario-based, and rich in detail (40-60 words).
  - Use these everyday anchors in titles and descriptions: ${anchors.join('、')}.
  - Banned words: ${banned}.
  Provide specific insights for ${modules ? modules.join(', ') : 'all sections'}.
  
  Ensure ALL output content is strictly in ${lang === 'zh' ? 'Chinese (Simplified)' : 'English'} and strictly ABOUT ${mbti} ${mainType}w${subtype}.`;
};

export const buildRefineUserPrompt = (lang: 'zh' | 'en', mbti: string, mainType: string, subtype: string, module: string, issues: string[], constraints?: string) => {
  const anchors = [
    ...(mbtiAnchors[mbti] || []),
    ...(enneagramAnchors[String(mainType)] || []),
    ...(enneagramAnchors[String(subtype)] || [])
  ].slice(0, 6);
  return `Refine ${module} for MBTI=${mbti}, Enneagram=${mainType}w${subtype}.
  Language: ${lang === 'zh' ? 'Chinese (Simplified)' : 'English'}.
  Fix: ${issues.join('; ')}.
  Use anchors: ${anchors.join('、')}.
  ${constraints ? `Constraints:\n${constraints}` : ''}
  Keep JSON strictly valid.`;
};

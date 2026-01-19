import { StorageManager } from './storage';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

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

export const fetchDeepSeekAnalysis = async (
  mbti: string, 
  mainType: string, 
  subtype: string, 
  lang: 'zh' | 'en',
  modules?: string[]
): Promise<Partial<AIReportData> | null> => {
  const apiKey = StorageManager.getItem<string>('deepseek_api_key');
  if (!apiKey) return null;

  console.log('fetchDeepSeekAnalysis called with:', {
    mbti,
    enneagram: `${mainType}w${subtype}`,
    lang,
    modules
  });

  const commonRules = `
  1. Role Definition:
  You are a professional personality test report generation AI. Based on the MBTI and Enneagram test results provided by the user, generate a structured, easy-to-understand personalized report.

  2. Report Output Style:
  - Chinese Version: Friendly and natural, like chatting with a friend.
  - English Version: Clear and conversational, like explaining to a friend.

  3. General Content Principles:
  - User Friendliness: Target ordinary users without psychology background.
  - Life-oriented Expression: Use daily scenarios and metaphors to explain abstract concepts.
  - Positive Orientation: Constructive language, avoid negative labels.
  - Structured Output: Strictly follow the specified format and structure.
  - Quality Control: Automatically detect mixed languages and content anomalies.

  4. Accuracy Check:
  - Content must conform to basic psychological principles.
  - Descriptions must match the MBTI/Enneagram type.
  - Examples must be reasonable and appropriate.

  5. Practicality Check:
  - Suggestions must be specific and actionable.
  - Examples must be close to daily life.
  - Avoid excessive generalization.

  6. Safety Check:
  - No discriminatory or biased content.
  - No inappropriate suggestions.
  - No exaggerated or misleading descriptions.

  7. Sensitive Content Filtering Rules:
  - Prohibited: Any form of discrimination (race, gender, age, etc.), suggestions inducing anxiety/depression, medical diagnosis/treatment advice, absolute negative evaluations, illegal content.
  - Handle with Care: Mental health content, interpersonal conflict content, negative career evaluations, personal privacy suggestions.
  - Strategy: Use constructive language, provide positive perspectives, emphasize individual differences, suggest seeking professional help.
  `;

  const cnRules = `
  8. Language Rules (Chinese Mode):
  - Output Language: Use Chinese exclusively, with exceptions below.
  - Allowed English: MBTI codes (e.g., INTJ), Enneagram codes (e.g., Type 2), original English psychology terms (only on first appearance).
  - English Processing: All allowed English must be immediately followed by Chinese translation/explanation (e.g., INTJ（内向-直觉-思考-判断型）). After first use, use Chinese abbreviations.
  - Strictly Prohibited: Non-proper noun English words (e.g., "这个idea很好"), mixed Chinese/English, unexplained acronyms, irrelevant content (weddings, cooking, etc.).
  - Expression Requirements: Use plain, life-oriented language. Avoid complex jargon; if used, add "Simply put" explanation. Use metaphors and concrete scenarios.
  `;

  const enRules = `
  8. Language Rules (English Mode):
  - Output Language: Use English exclusively, with exceptions below.
  - Allowed Chinese: Chinese proper nouns (names, places), specialized psychology terms without direct English equivalents.
  - Chinese Processing: All allowed Chinese must be followed by English translation/explanation (e.g., 九型人格 (Enneagram)). After first use, use English terms.
  - Strictly Prohibited: Non-specialized Chinese words, untranslated terms, irrelevant content.
  - Expression Requirements: Clear, conversational English. Avoid academic jargon; provide simple explanations. Use metaphors and concrete examples.
  `;

  const langRules = lang === 'zh' ? cnRules : enRules;

  // Define module structures
  const allModules = {
    traits: `
      "traits": { 
          "quote": "Famous quote matching this personality",
          "quoteAuthor": "Author Name",
          "mbtiDesc": "Analysis of MBTI aspect",
          "mainTypeDesc": "Analysis of Enneagram Main Type aspect",
          "wingTypeDesc": "Analysis of Enneagram Wing aspect"
      },
      "overviewSection": {
          "line1": "Main Enneagram impact on MBTI",
          "line2": "Wing Enneagram impact on overall personality"
      },
      "combo": {
          "overview": "Detailed combination overview. Format: '${mbti} combined with Enneagram Type ${mainType} and Wing ${subtype} shapes a [Archetype Name] archetype. You blend ${mbti}'s [Trait], Type ${mainType}'s [Trait], and Wing ${subtype}'s [Trait] tendencies, forming the following unique profile:'",
          "strengths": [{ "title": "Strength Title", "desc": "Detailed description" }, { "title": "Strength Title", "desc": "Detailed description" }, { "title": "Strength Title", "desc": "Detailed description" }],
          "conflicts": [{ "title": "Conflict Title", "desc": "Detailed description" }, { "title": "Conflict Title", "desc": "Detailed description" }, { "title": "Conflict Title", "desc": "Detailed description" }]
      },
      "decoding": {
          "strategic": { "drive": "Primary Drive", "manifestation": "Possible Manifestation" },
          "action": { "drive": "Primary Drive", "manifestation": "Possible Manifestation" },
          "resource": { "drive": "Primary Drive", "manifestation": "Possible Manifestation" },
          "chemistry": "Chemical Reaction Summary"
      },
      "ranking": {
          "absoluteField": [
              { "area": "Area Name", "desc": "Description & Daily Manifestation", "improve": "Actionable Improvement Direction" }
          ],
          "top5Talents": [
              { "area": "Area Name", "desc": "Description", "improve": "Improvement Advice" }
          ],
          "top10Abilities": [
              { "area": "Area Name", "desc": "Description", "improve": "Improvement Advice" }
          ],
          "bottom10Weaknesses": [
              { "area": "Area Name", "desc": "Description", "improve": "Improvement Advice" }
          ]
      },
      "pastFuture": {
          "past": [{ "title": "Past Experience", "desc": "Detailed description" }, { "title": "Past Experience", "desc": "Detailed description" }, { "title": "Past Experience", "desc": "Detailed description" }],
          "future": [{ "title": "Future Prediction", "desc": "Detailed description" }, { "title": "Future Prediction", "desc": "Detailed description" }, { "title": "Future Prediction", "desc": "Detailed description" }]
      },
      "subjective": {
          "summary": "Metaphorical summary of ${mbti} and ${mainType}w${subtype} combination",
          "highlights_intro": "Introductory sentence for highlights, customized to this specific personality",
          "highlights": [{ "title": "Observation Title", "desc": "Detailed description" }, { "title": "Observation Title", "desc": "Detailed description" }],
          "core_title": "Introductory sentence for core uniqueness",
          "core": "Core uniqueness analysis"
      }`,
    career: `
      "career": { 
          "strengths": [{ "point": "Point 1", "desc": "Description" }, { "point": "Point 2", "desc": "Description" }, { "point": "Point 3", "desc": "Description" }],
          "blindSpots": [{ "point": "Point 1", "desc": "Description" }, { "point": "Point 2", "desc": "Description" }, { "point": "Point 3", "desc": "Description" }],
          "teamRole": [{ "point": "Point 1", "desc": "Description" }, { "point": "Point 2", "desc": "Description" }, { "point": "Point 3", "desc": "Description" }],
          "collaborationStyle": [{ "point": "Point 1", "desc": "Description" }, { "point": "Point 2", "desc": "Description" }, { "point": "Point 3", "desc": "Description" }],
          "environment": [{ "point": "Point 1", "desc": "Description" }, { "point": "Point 2", "desc": "Description" }, { "point": "Point 3", "desc": "Description" }],
          "companions": [{ "mbti": "Type", "desc": "Description" }, { "mbti": "Type", "desc": "Description" }, { "mbti": "Type", "desc": "Description" }],
          "traps": [{ "point": "Point 1", "desc": "Description" }, { "point": "Point 2", "desc": "Description" }, { "point": "Point 3", "desc": "Description" }]
      }`,
    growth: `
      "growth": { 
          "best": { "state": "最佳状态", "work": "3条工作表现，用中文全角冒号连接“概述：具体描述”，每条之间用分号或换行分隔", "rel": "3条亲密关系表现，格式同上", "feeling": "详细描述此状态下的内在感受", "how": "进入该状态的关键路径与日常练习要点" },
          "daily": { "state": "日常状态", "work": "3条工作表现，格式同上", "rel": "3条亲密关系表现，格式同上", "feeling": "详细描述此状态下的内在感受", "how": "保持或优化该状态的建议" },
          "stress": { "state": "压力状态", "work": "3条工作表现，格式同上", "rel": "3条亲密关系表现，格式同上", "feeling": "详细描述此状态下的内在感受", "how": "识别并调节该状态的具体方法" }
      }`,
    relationships: `
      "relationships": {
          "communication": [
              { "mistake": "Common Mistake", "cause": "Underlying Cause", "adjustment": "Suggested Adjustment" },
              { "mistake": "Common Mistake", "cause": "Underlying Cause", "adjustment": "Suggested Adjustment" },
              { "mistake": "Common Mistake", "cause": "Underlying Cause", "adjustment": "Suggested Adjustment" }
          ],
          "intimacy": {
              "strengths": ["Strength 1", "Strength 2", "Strength 3"],
              "challenges": ["Challenge 1", "Challenge 2", "Challenge 3"],
              "growth": {
                  "consciousness": [{ "title": "Point Title", "desc": "Detailed description" }, { "title": "Point Title", "desc": "Detailed description" }],
                  "skill": [{ "title": "Point Title", "desc": "Detailed description" }, { "title": "Point Title", "desc": "Detailed description" }],
                  "pattern": [{ "title": "Point Title", "desc": "Detailed description" }, { "title": "Point Title", "desc": "Detailed description" }]
              }
          }
      }`,
    summary: `
      "summary": {
          "title": "A short, catchy persona title (e.g. Rational Altruist)",
          "summary": "High-level summary of the report for ${mbti} ${mainType}w${subtype}. Around 80-100 words.",
          "highlights": {
              "thinking": "Short keywords for thinking pattern (e.g. Systematic, Logical, Strategic)",
              "behavior": "Short keywords for behavioral traits (e.g. Action-oriented, Reliable)",
              "growth": "Short keywords for growth direction (e.g. Emotional expression, Flexibility)"
          }
      }`
  };

  // Determine which modules to include
  const requestedModules = modules && modules.length > 0 ? modules : Object.keys(allModules);
  const structureParts = requestedModules.map(mod => {
    return (allModules as any)[mod] || '';
  }).filter(part => part !== '').join(',\n');

  const systemPrompt = `${commonRules}

  ${langRules}
  
  CRITICAL: You MUST analyze based strictly on the provided MBTI type (${mbti}) and Enneagram type (${mainType}w${subtype}). 
  You must NOT change, infer, or replace the MBTI or Enneagram type. All analysis, examples, and labels must remain for MBTI=${mbti} and Enneagram=${mainType}w${subtype}.

  Output ONLY valid JSON. No markdown code blocks. No explanations.
  Structure:
  {
      ${structureParts}
  }
  Keep content concise, professional, and empathetic.`;

  const userPrompt = `Analyze personality: MBTI=${mbti}, Enneagram=${mainType}w${subtype}.
  Language: ${lang === 'zh' ? 'Chinese (Simplified)' : 'English'}.
  GLOBAL CONSTRAINT: If the target language is Chinese, the output must be strictly in Chinese. Do NOT use English words mixed in sentences. All terms must be translated into natural, professional Chinese.
  Provide specific insights for ${requestedModules.join(', ')}.
  
  Ensure ALL output content is strictly in ${lang === 'zh' ? 'Chinese (Simplified)' : 'English'} and strictly ABOUT ${mbti} ${mainType}w${subtype}.`;

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 1.0,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      if (response.status === 402) throw new Error('Insufficient Balance');
      if (response.status === 401) throw new Error('Invalid API Key');
      throw new Error(`API Error (${response.status})`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content) as Partial<AIReportData>;
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    throw error;
  }
};

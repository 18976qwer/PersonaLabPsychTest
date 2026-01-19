export interface AnalysisResult {
  readingGuide: {
    characterType: {
      cn: string; // e.g., "建筑师 × 助人者"
      en: string; // e.g., "INTJ-2"
      avatarUrl?: string;
    };
    guideText: string[];
    oneLiner?: string;
    keywords?: string[];
  };
  personalityTraits: {
    summary: {
      mbti: string;
      enneagramMain: string;
      enneagramWing: string;
    };
    detailAnalysis: {
      chemistry: string; // 组合特质概述
      decodingTable: {
        level: string; // 战略层/行动层/资源层
        theory: string;
        driver: string;
        manifestation: string;
      }[];
      chemistryConclusion: string; // 三层动力的化学反应
      strengths: { title: string; desc: string }[];
      conflicts: { title: string; desc: string }[];
    };
    timeline: {
      past: string[];
      future: string[];
    };
    subjectiveEvaluation: {
      portrait: string; // 深度画像
      uniqueness: string; // 独特之处
    };
  };
  personalGrowth: {
    reactionTable: {
      state: string; // 最佳/日常/压力
      work: string[];
      relation: string[];
      feeling: string;
      entry: string;
    }[];
    strengthsAnalysis: {
      level: string; // 顶尖天赋/显著才能...
      field: string;
      desc: string;
      improvement: string;
    }[];
  };
  careerPath: {
    strengths: { title: string; desc: string }[];
    blindSpots: { title: string; desc: string }[];
    roles: { title: string; desc: string }[];
    collaboration: { title: string; desc: string }[];
    environment: { title: string; desc: string }[];
    partners: { type: string; desc: string }[];
    traps: { title: string; desc: string }[];
  };
  relationships: {
    communicationTable: {
      misunderstanding: string;
      reason: string;
      adjustment: string;
    }[];
    intimacy: {
      strengths: string[];
      challenges: string[];
      growth: {
        awareness: { title: string; desc: string }[];
        skill: { title: string; desc: string }[];
        pattern: { title: string; desc: string }[];
      };
    };
  };
  reportSummary: {
    title: string;
    text: string;
    keyPoints: {
      thinking: string;
      behavior: string;
      growth: string;
    };
  };
  chatgptPrompt: string;
}

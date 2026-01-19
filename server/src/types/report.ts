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

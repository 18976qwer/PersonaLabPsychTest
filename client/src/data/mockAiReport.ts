import { AIReportData } from '../utils/ai';

export const mockAiReportZh: AIReportData = {
  guide: {
    title: '阅读指引',
    intro: '本报告旨在为你提供一份清晰易读的个人使用说明书，帮助你快速把结果转化为行动与成长。',
    sections: [
      {
        title: '如何使用这份报告？',
        items: [
          '可以从头至尾阅读，获得一个关于自我的完整认知框架。',
          '也可以直接跳转至最关心的部分，如“个人成长”或“职业路径”，寻找即刻可用的建议。',
          '报告中的语言避免专业术语，力求平实且可操作；你可以按需收藏或分享给亲友与同事。'
        ]
      },
      {
        title: '报告能为你解答什么？',
        items: [
          '“我为什么总是这样？”：看清你常见的思维与行为模式来源。',
          '“我到底擅长什么？”：识别你最核心的优势与可复制的方法。',
          '“我为何总陷入某种矛盾？”：理解那些反复出现的内在冲突与情绪反应。',
          '“我该怎么办？”：获取在个人成长、职业发展与人际关系中的具体、可操作的行动指引。'
        ]
      }
    ],
    outro: '请放松心情，把它视为一次与自我深入对话的开始。我们出发吧。'
  },
  prompt: '请分析一个 MBTI 为 [MBTI] 且九型人格为 [MainType]w[Wing] 的人。请提供以下方面的深度见解：人格特质（包括 MBTI、九型主型及侧翼解析、组合特质概述、人格特质解码、三层动力产生的化学反应、核心优势、内在冲突、过去与未来推测、主观评价）、个人成长建议（最佳状态、日常状态、压力状态）、职业路径分析（优势、盲点、团队角色、协作风格、理想环境、最佳搭档、职业陷阱）、人际关系建议（沟通误区、亲密关系中的优势与挑战）以及整体报告总结。',
  traits: {
    quote: '认识你自己，是智慧的开端。',
    quoteAuthor: '苏格拉底',
    mbtiDesc: '待生成...',
    mainTypeDesc: '待生成...',
    wingTypeDesc: '待生成...'
  },
  overviewSection: {
    line1: '待生成...',
    line2: '待生成...'
  },
  combo: {
    overview: '待生成...',
    strengths: [{ title: '待生成...', desc: '待生成...' }],
    conflicts: [{ title: '待生成...', desc: '待生成...' }]
  },
  decoding: {
    strategic: { drive: '待生成...', manifestation: '待生成...' },
    action: { drive: '待生成...', manifestation: '待生成...' },
    resource: { drive: '待生成...', manifestation: '待生成...' },
    chemistry: '待生成...'
  },
  ranking: {
    absoluteField: [{ area: '待生成...', desc: '待生成...', improve: '待生成...' }],
    top5Talents: [{ area: '待生成...', desc: '待生成...', improve: '待生成...' }],
    top10Abilities: [{ area: '待生成...', desc: '待生成...', improve: '待生成...' }],
    bottom10Weaknesses: [{ area: '待生成...', desc: '待生成...', improve: '待生成...' }]
  },
  pastFuture: {
    past: [{ title: '待生成...', desc: '待生成...' }],
    future: [{ title: '待生成...', desc: '待生成...' }]
  },
  subjective: {
    summary: '待生成...',
    highlights_intro: '待生成...',
    highlights: [{ title: '待生成...', desc: '待生成...' }],
    core_title: '待生成...',
    core: '待生成...'
  },
  career: {
    strengths: [{ point: '待生成...', desc: '待生成...' }],
    blindSpots: [{ point: '待生成...', desc: '待生成...' }],
    teamRole: [{ point: '待生成...', desc: '待生成...' }],
    collaborationStyle: [{ point: '待生成...', desc: '待生成...' }],
    environment: [{ point: '待生成...', desc: '待生成...' }],
    companions: [{ mbti: '待生成...', desc: '待生成...' }],
    traps: [{ point: '待生成...', desc: '待生成...' }]
  },
  growth: {
    best: { state: '待生成...', work: '待生成...', rel: '待生成...', feeling: '待生成...', how: '待生成...' },
    daily: { state: '待生成...', work: '待生成...', rel: '待生成...', feeling: '待生成...', how: '待生成...' },
    stress: { state: '待生成...', work: '待生成...', rel: '待生成...', feeling: '待生成...', how: '待生成...' }
  },
  relationships: {
    communication: [{ mistake: '待生成...', cause: '待生成...', adjustment: '待生成...' }],
    intimacy: {
      strengths: ['待生成...'],
      challenges: ['待生成...'],
      growth: {
        consciousness: [{ title: '待生成...', desc: '待生成...' }],
        skill: [{ title: '待生成...', desc: '待生成...' }],
        pattern: [{ title: '待生成...', desc: '待生成...' }]
      }
    }
  },
  summary: {
    title: '待生成...',
    summary: '待生成...',
    highlights: {
      thinking: '待生成...',
      behavior: '待生成...',
      growth: '待生成...'
    }
  }
};

export const mockAiReportEn: AIReportData = {
  guide: {
    title: 'Reading Guide',
    intro: 'This report is a clear and practical personal manual to help you turn insights into action.',
    sections: [
      {
        title: 'How to use this report?',
        items: [
          'Read from start to finish to gain a complete framework of self-understanding.',
          'Or jump directly to what you care about most, such as "Personal Growth" or "Career Path", to find actionable advice.',
          'We avoid heavy jargon and keep language practical; feel free to save or share with people you trust.'
        ]
      },
      {
        title: 'What can this report answer?',
        items: [
          '"Why am I like this?": Clarify the sources of your recurring thinking and behavior patterns.',
          '"What am I truly good at?": Identify your core strengths and repeatable methods.',
          '"Why do I fall into certain conflicts?": Understand recurring inner tensions and emotional reactions.',
          '"What should I do?": Get specific, actionable guidance for growth, career, and relationships.'
        ]
      }
    ],
    outro: 'Relax and see this as the start of a deeper dialogue with yourself. Let\'s begin.'
  },
  prompt: 'Please analyze a person with MBTI [MBTI] and Enneagram [MainType]w[Wing]. Provide deep insights on: Personality Traits (including MBTI, Enneagram Main Type & Wing analysis, Combination Overview, Trait Decoding, Chemical Reaction of Three Layers of Motivation, Core Strengths, Inner Conflicts, Past & Future Speculation, Subjective Evaluation), Personal Growth (Best State, Daily State, Stress State), Career Path (Strengths, Blind Spots, Team Role, Collaboration Style, Ideal Environment, Best Companions, Career Traps), Relationships (Communication Mistakes, Intimacy Strengths & Challenges), and Report Summary.',
  traits: {
    quote: 'Knowing yourself is the beginning of all wisdom.',
    quoteAuthor: 'Socrates',
    mbtiDesc: 'Pending...',
    mainTypeDesc: 'Pending...',
    wingTypeDesc: 'Pending...'
  },
  overviewSection: {
    line1: 'Pending...',
    line2: 'Pending...'
  },
  combo: {
    overview: 'Pending...',
    strengths: [{ title: 'Pending...', desc: 'Pending...' }],
    conflicts: [{ title: 'Pending...', desc: 'Pending...' }]
  },
  decoding: {
    strategic: { drive: 'Pending...', manifestation: 'Pending...' },
    action: { drive: 'Pending...', manifestation: 'Pending...' },
    resource: { drive: 'Pending...', manifestation: 'Pending...' },
    chemistry: 'Pending...'
  },
  ranking: {
    absoluteField: [{ area: 'Pending...', desc: 'Pending...', improve: 'Pending...' }],
    top5Talents: [{ area: 'Pending...', desc: 'Pending...', improve: 'Pending...' }],
    top10Abilities: [{ area: 'Pending...', desc: 'Pending...', improve: 'Pending...' }],
    bottom10Weaknesses: [{ area: 'Pending...', desc: 'Pending...', improve: 'Pending...' }]
  },
  pastFuture: {
    past: [{ title: 'Pending...', desc: 'Pending...' }],
    future: [{ title: 'Pending...', desc: 'Pending...' }]
  },
  subjective: {
    summary: 'Pending...',
    highlights_intro: 'Pending...',
    highlights: [{ title: 'Pending...', desc: 'Pending...' }],
    core_title: 'Pending...',
    core: 'Pending...'
  },
  career: {
    strengths: [{ point: 'Pending...', desc: 'Pending...' }],
    blindSpots: [{ point: 'Pending...', desc: 'Pending...' }],
    teamRole: [{ point: 'Pending...', desc: 'Pending...' }],
    collaborationStyle: [{ point: 'Pending...', desc: 'Pending...' }],
    environment: [{ point: 'Pending...', desc: 'Pending...' }],
    companions: [{ mbti: 'Pending...', desc: 'Pending...' }],
    traps: [{ point: 'Pending...', desc: 'Pending...' }]
  },
  growth: {
    best: { state: 'Pending...', work: 'Pending...', rel: 'Pending...', feeling: 'Pending...', how: 'Pending...' },
    daily: { state: 'Pending...', work: 'Pending...', rel: 'Pending...', feeling: 'Pending...', how: 'Pending...' },
    stress: { state: 'Pending...', work: 'Pending...', rel: 'Pending...', feeling: 'Pending...', how: 'Pending...' }
  },
  relationships: {
    communication: [{ mistake: 'Pending...', cause: 'Pending...', adjustment: 'Pending...' }],
    intimacy: {
      strengths: ['Pending...'],
      challenges: ['Pending...'],
      growth: {
        consciousness: [{ title: 'Pending...', desc: 'Pending...' }],
        skill: [{ title: 'Pending...', desc: 'Pending...' }],
        pattern: [{ title: 'Pending...', desc: 'Pending...' }]
      }
    }
  },
  summary: {
    title: 'Pending...',
    summary: 'Pending...',
    highlights: {
      thinking: 'Pending...',
      behavior: 'Pending...',
      growth: 'Pending...'
    }
  }
};

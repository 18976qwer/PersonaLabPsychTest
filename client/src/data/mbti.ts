
export type MBTIDimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export interface MBTIQuestion {
  id: number;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  options: [
    { label: string; value: MBTIDimension },
    { label: string; value: MBTIDimension }
  ];
}

export const mbtiQuestionsEn: MBTIQuestion[] = [
  // E vs I
  {
    id: 1,
    dimension: 'EI',
    options: [
      { label: "I work better by taking action first and debugging as I go.", value: 'E' },
      { label: "I tend to listen and observe in my mind before acting.", value: 'I' }
    ]
  },
  {
    id: 2,
    dimension: 'EI',
    options: [
      { label: "I feel more energized when interacting with people.", value: 'E' },
      { label: "I need alone time to recharge my energy.", value: 'I' }
    ]
  },
  {
    id: 3,
    dimension: 'EI',
    options: [
      { label: "I think while talking and formulate thoughts out loud.", value: 'E' },
      { label: "I need to think through things fully before speaking.", value: 'I' }
    ]
  },
  {
    id: 4,
    dimension: 'EI',
    options: [
      { label: "I prefer a broad variety of tasks and fast-paced environments.", value: 'E' },
      { label: "I prefer deep focus on one task at a time in a quiet environment.", value: 'I' }
    ]
  },
  // S vs N
  {
    id: 5,
    dimension: 'SN',
    options: [
      { label: "I prefer solving practical problems with concrete solutions.", value: 'S' },
      { label: "I enjoy thinking about the big picture and theoretical possibilities.", value: 'N' }
    ]
  },
  {
    id: 6,
    dimension: 'SN',
    options: [
      { label: "I feel comfortable when given specific, detailed instructions.", value: 'S' },
      { label: "I get bored with details and prefer general concepts.", value: 'N' }
    ]
  },
  {
    id: 7,
    dimension: 'SN',
    options: [
      { label: "I trust what I can see, hear, and touch (facts).", value: 'S' },
      { label: "I trust my gut feelings and imagination (patterns).", value: 'N' }
    ]
  },
  {
    id: 8,
    dimension: 'SN',
    options: [
      { label: "I focus primarily on the present reality and what is happening now.", value: 'S' },
      { label: "I focus primarily on the future and what could happen.", value: 'N' }
    ]
  },
  // T vs F
  {
    id: 9,
    dimension: 'TF',
    options: [
      { label: "I make decisions based on logic and objective principles.", value: 'T' },
      { label: "I make decisions based on personal values and how they affect others.", value: 'F' }
    ]
  },
  {
    id: 10,
    dimension: 'TF',
    options: [
      { label: "I value fairness and justice over harmony.", value: 'T' },
      { label: "I value harmony and positive relationships over strict justice.", value: 'F' }
    ]
  },
  {
    id: 11,
    dimension: 'TF',
    options: [
      { label: "I tend to analyze problems objectively, stepping back from emotions.", value: 'T' },
      { label: "I tend to empathize with the people involved in the problem.", value: 'F' }
    ]
  },
  {
    id: 12,
    dimension: 'TF',
    options: [
      { label: "Being described as cold and rational is a compliment.", value: 'T' },
      { label: "Being described as warm and emotional is a compliment.", value: 'F' }
    ]
  },
  // J vs P
  {
    id: 13,
    dimension: 'JP',
    options: [
      { label: "I feel secure when things are decided and structured in advance.", value: 'J' },
      { label: "I feel comfortable keeping options open and adapting to changes.", value: 'P' }
    ]
  },
  {
    id: 14,
    dimension: 'JP',
    options: [
      { label: "I prefer to have a plan and follow it rather than leaving things up in the air.", value: 'J' },
      { label: "I like to explore multiple possibilities before making a decision.", value: 'P' }
    ]
  },
  {
    id: 15,
    dimension: 'JP',
    options: [
      { label: "I like to finish existing projects before starting new ones.", value: 'J' },
      { label: "I often find that the best ideas come from allowing myself to be spontaneous.", value: 'P' }
    ]
  },
  {
    id: 16,
    dimension: 'JP',
    options: [
      { label: "I work first, play later.", value: 'J' },
      { label: "I mix work and play, working in bursts of energy.", value: 'P' }
    ]
  }
];

export const mbtiQuestionsZh: MBTIQuestion[] = [
  // E vs I
  {
    id: 1,
    dimension: 'EI',
    options: [
      { label: "我更喜欢先行动，边做边调整。", value: 'E' },
      { label: "我倾向于先在脑海中观察和思考，然后再行动。", value: 'I' }
    ]
  },
  {
    id: 2,
    dimension: 'EI',
    options: [
      { label: "与人互动让我感到精力充沛。", value: 'E' },
      { label: "我需要独处的时间来充电。", value: 'I' }
    ]
  },
  {
    id: 3,
    dimension: 'EI',
    options: [
      { label: "我边说边想，大声表达想法。", value: 'E' },
      { label: "我需要在说话前把事情想清楚。", value: 'I' }
    ]
  },
  {
    id: 4,
    dimension: 'EI',
    options: [
      { label: "我喜欢多样化的任务和快节奏的环境。", value: 'E' },
      { label: "我更喜欢在安静的环境中专注于一项任务。", value: 'I' }
    ]
  },
  // S vs N
  {
    id: 5,
    dimension: 'SN',
    options: [
      { label: "我更喜欢用具体的解决方案来解决实际问题。", value: 'S' },
      { label: "我喜欢思考大局和理论上的可能性。", value: 'N' }
    ]
  },
  {
    id: 6,
    dimension: 'SN',
    options: [
      { label: "当给出具体、详细的指示时，我感到很舒服。", value: 'S' },
      { label: "相比琐碎细节，我更关注核心概念与逻辑脉络。", value: 'N' }
    ]
  },
  {
    id: 7,
    dimension: 'SN',
    options: [
      { label: "我看重可验证的事实与具体的经验。", value: 'S' },
      { label: "我看重事物背后的规律与模式。", value: 'N' }
    ]
  },
  {
    id: 8,
    dimension: 'SN',
    options: [
      { label: "我主要关注当前的现实和正在发生的事情。", value: 'S' },
      { label: "我主要关注未来和可能发生的事情。", value: 'N' }
    ]
  },
  // T vs F
  {
    id: 9,
    dimension: 'TF',
    options: [
      { label: "我根据逻辑和客观原则做决定。", value: 'T' },
      { label: "我根据个人价值观以及对通过他人的影响做决定。", value: 'F' }
    ]
  },
  {
    id: 10,
    dimension: 'TF',
    options: [
      { label: "我看重公平和正义胜过和谐。", value: 'T' },
      { label: "我看重和谐及积极的关系胜过严格的正义。", value: 'F' }
    ]
  },
  {
    id: 11,
    dimension: 'TF',
    options: [
      { label: "我倾向于客观地分析问题，从情绪中抽离出来。", value: 'T' },
      { label: "我倾向于对问题涉及的人产生共鸣。", value: 'F' }
    ]
  },
  {
    id: 12,
    dimension: 'TF',
    options: [
      { label: "被描述为冷静和理性是一种赞美。", value: 'T' },
      { label: "被描述为热情和感性是一种赞美。", value: 'F' }
    ]
  },
  // J vs P
  {
    id: 13,
    dimension: 'JP',
    options: [
      { label: "当事情提前决定并结构化时，我会感到安全。", value: 'J' },
      { label: "我对保持选择开放和灵活应对变化感到自在。", value: 'P' }
    ]
  },
  {
    id: 14,
    dimension: 'JP',
    options: [
      { label: "我更喜欢制定计划并遵循它们，而不是让事情悬而未决。", value: 'J' },
      { label: "我喜欢在做出决定前探索多种可能性。", value: 'P' }
    ]
  },
  {
    id: 15,
    dimension: 'JP',
    options: [
      { label: "我喜欢在开始新项目之前完成现有项目。", value: 'J' },
      { label: "我经常发现，最好的想法来自于允许自己自发行动。", value: 'P' }
    ]
  },
  {
    id: 16,
    dimension: 'JP',
    options: [
      { label: "我先工作，再玩耍。", value: 'J' },
      { label: "我工作和玩耍结合，在精力充沛时工作。", value: 'P' }
    ]
  }
];

interface MBTIDescription {
  title: string;
  description: string;
  strengths: string[];
  challenges: string[];
  icon?: string;
}

export const mbtiDescriptionsEn: Record<string, MBTIDescription> = {
  'INTJ': { 
    title: 'Architect', 
    description: 'Strategic and logical long-term vision.',
    strengths: ['Rational', 'Informed', 'Independent', 'Determined'],
    challenges: ['Arrogant', 'Judgmental', 'Overly analytical'],
    icon: '🧠'
  },
  'INTP': { 
    title: 'Logician', 
    description: 'Analytical and innovative problem solver.',
    strengths: ['Analytical', 'Original', 'Open-minded', 'Objective'],
    challenges: ['Disconnected', 'Insensitive', 'Dissatisfied'],
    icon: '🧪'
  },
  'ENTJ': { 
    title: 'Commander', 
    description: 'Confident and organized leader.',
    strengths: ['Efficient', 'Energetic', 'Self-Confident', 'Strong-willed'],
    challenges: ['Stubborn', 'Intolerant', 'Impatient', 'Arrogant'],
    icon: '🧑‍✈️'
  },
  'ENTP': { 
    title: 'Debater', 
    description: 'Curious and flexible debater.',
    strengths: ['Knowledgeable', 'Quick-thinking', 'Original', 'Charismatic'],
    challenges: ['Very Argumentative', 'Insensitive', 'Intolerant'],
    icon: '🗣️'
  },
  'INFJ': { 
    title: 'Advocate', 
    description: 'Idealistic and insightful advisor.',
    strengths: ['Creative', 'Insightful', 'Principled', 'Passionate'],
    challenges: ['Sensitive to criticism', 'Extremely private', 'Perfectionistic'],
    icon: '🧙‍♂️'
  },
  'INFP': { 
    title: 'Mediator', 
    description: 'Passionate and value-driven advocate.',
    strengths: ['Empathetic', 'Generous', 'Open-minded', 'Creative'],
    challenges: ['Unrealistic', 'Self-isolating', 'Unfocused'],
    icon: '🧚'
  },
  'ENFJ': { 
    title: 'Protagonist', 
    description: 'Charismatic and inspiring coach.',
    strengths: ['Reliable', 'Passionate', 'Altruistic', 'Charismatic'],
    challenges: ['Overly idealistic', 'Too sensitive', 'Self-esteem fluctuations'],
    icon: '⚔️'
  },
  'ENFP': { 
    title: 'Campaigner', 
    description: 'Energetic and creative explorer.',
    strengths: ['Curious', 'Observant', 'Energetic', 'Enthusiastic'],
    challenges: ['Poor practical skills', 'Difficult to focus', 'Overthinking'],
    icon: '🎉'
  },
  'ISTJ': { 
    title: 'Logistician', 
    description: 'Reliable and practical organizer.',
    strengths: ['Honest', 'Direct', 'Strong-willed', 'Dutiful'],
    challenges: ['Stubborn', 'Insensitive', 'Always by the book'],
    icon: '📋'
  },
  'ISFJ': { 
    title: 'Defender', 
    description: 'Dutiful and caring protector.',
    strengths: ['Supportive', 'Reliable', 'Patient', 'Imaginative'],
    challenges: ['Humble and shy', 'Takes things personally', 'Represses feelings'],
    icon: '🛡️'
  },
  'ESTJ': { 
    title: 'Executive', 
    description: 'Practical and efficient manager.',
    strengths: ['Dedicated', 'Strong-willed', 'Direct', 'Honest'],
    challenges: ['Inflexible', 'Uncomfortable with unconventional situations', 'Judgmental'],
    icon: '📊'
  },
  'ESFJ': { 
    title: 'Consul', 
    description: 'Friendly and cooperative coordinator.',
    strengths: ['Strong practical skills', 'Warm', 'Loyal', 'Sensitive'],
    challenges: ['Worried about social status', 'Inflexible', 'Vulnerable to criticism'],
    icon: '🤝'
  },
  'ISTP': { 
    title: 'Virtuoso', 
    description: 'Calm and precise craftsman.',
    strengths: ['Optimistic', 'Energetic', 'Creative', 'Spontaneous'],
    challenges: ['Stubborn', 'Insensitive', 'Private and reserved', 'Easily bored'],
    icon: '🔧'
  },
  'ISFP': { 
    title: 'Adventurer', 
    description: 'Flexible and artistic performer.',
    strengths: ['Charming', 'Sensitive to others', 'Imaginative', 'Passionate'],
    challenges: ['Fiercely independent', 'Unpredictable', 'Easily stressed'],
    icon: '🎨'
  },
  'ESTP': { 
    title: 'Entrepreneur', 
    description: 'Energetic and adaptable initiator.',
    strengths: ['Bold', 'Rational', 'Original', 'Perceptive'],
    challenges: ['Insensitive', 'Impatient', 'Risk-prone', 'Unstructured'],
    icon: '🚀'
  },
  'ESFP': { 
    title: 'Entertainer', 
    description: 'Enthusiastic and outgoing performer.',
    strengths: ['Bold', 'Original', 'Aesthetics and showmanship', 'Practical'],
    challenges: ['Sensitive', 'Conflict-averse', 'Easily bored', 'Poor long-term planner'],
    icon: '🎭'
  }
};

export const mbtiDescriptionsZh: Record<string, MBTIDescription> = {
  'INTJ': { 
    title: '建筑师', 
    description: '战略与逻辑的长期愿景。',
    strengths: ['理性', '博学', '独立', '坚定'],
    challenges: ['傲慢', '批判性强', '过度分析'],
    icon: '🧠'
  },
  'INTP': { 
    title: '逻辑学家', 
    description: '分析与创新的问题解决者。',
    strengths: ['分析力强', '原创', '思想开放', '客观'],
    challenges: ['脱节', '不敏感', '易不满'],
    icon: '🧪'
  },
  'ENTJ': { 
    title: '指挥官', 
    description: '自信与有组织的领导者。',
    strengths: ['高效', '精力充沛', '自信', '意志坚定'],
    challenges: ['固执', '不宽容', '不耐烦', '傲慢'],
    icon: '🧑‍✈️'
  },
  'ENTP': { 
    title: '辩论家', 
    description: '好奇与灵活的辩论家。',
    strengths: ['知识渊博', '思维敏捷', '原创', '有魅力'],
    challenges: ['好辩', '不敏感', '不宽容'],
    icon: '🗣️'
  },
  'INFJ': { 
    title: '提倡者', 
    description: '理想与有洞察力的顾问。',
    strengths: ['富有创造力', '有洞察力', '有原则', '充满激情'],
    challenges: ['对批评敏感', '极度隐私', '完美主义'],
    icon: '🧙‍♂️'
  },
  'INFP': { 
    title: '调停者', 
    description: '热情与价值驱动的倡导者。',
    strengths: ['善解人意', '慷慨', '思想开放', '富有创造力'],
    challenges: ['不切实际', '自我隔离', '注意力不集中'],
    icon: '🧚'
  },
  'ENFJ': { 
    title: '主人公', 
    description: '富有魅力与鼓舞人心的教练。',
    strengths: ['可靠', '充满激情', '利他主义', '有魅力'],
    challenges: ['过于理想化', '过于敏感', '自尊心波动'],
    icon: '⚔️'
  },
  'ENFP': { 
    title: '竞选者', 
    description: '充满活力与创造性的探索者。',
    strengths: ['好奇', '观察力强', '精力充沛', '热情'],
    challenges: ['实践能力差', '难以集中注意力', '过度思考'],
    icon: '🎉'
  },
  'ISTJ': { 
    title: '物流师', 
    description: '可靠与务实的组织者。',
    strengths: ['诚实', '直接', '意志坚定', '尽职'],
    challenges: ['固执', '不敏感', '墨守成规'],
    icon: '📋'
  },
  'ISFJ': { 
    title: '守卫者', 
    description: '尽职与关怀的保护者。',
    strengths: ['支持性', '可靠', '耐心', '富有想象力'],
    challenges: ['谦虚害羞', '太在意他人看法', '压抑情感'],
    icon: '🛡️'
  },
  'ESTJ': { 
    title: '总经理', 
    description: '务实与高效的管理者。',
    strengths: ['专注', '意志坚定', '直接', '诚实'],
    challenges: ['不灵活', '不适应非常规情况', '批判性强'],
    icon: '📊'
  },
  'ESFJ': { 
    title: '执政官', 
    description: '友好与合作的协调者。',
    strengths: ['实践能力强', '温暖', '忠诚', '敏感'],
    challenges: ['担心社会地位', '不灵活', '易受批评影响'],
    icon: '🤝'
  },
  'ISTP': { 
    title: '鉴赏家', 
    description: '冷静与精确的手艺者。',
    strengths: ['乐观', '精力充沛', '富有创造力', '自发'],
    challenges: ['固执', '不敏感', '私密保留', '易无聊'],
    icon: '🔧'
  },
  'ISFP': { 
    title: '探险家', 
    description: '灵活与艺术的表演者。',
    strengths: ['迷人', '对他人敏感', '富有想象力', '充满激情'],
    challenges: ['极度独立', '不可预测', '易受压力'],
    icon: '🎨'
  },
  'ESTP': { 
    title: '企业家', 
    description: '精力充沛与适应性强的发起者。',
    strengths: ['大胆', '理性', '原创', '敏锐'],
    challenges: ['不敏感', '不耐烦', '倾向冒险', '无组织'],
    icon: '🚀'
  },
  'ESFP': { 
    title: '表演者', 
    description: '热情与外向的表演者。',
    strengths: ['大胆', '原创', '审美感强', '务实'],
    challenges: ['敏感', '回避冲突', '易无聊', '缺乏规划'],
    icon: '🎭'
  }
};

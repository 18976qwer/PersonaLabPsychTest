import { AnalysisResult } from '../types/report';

export const mockAnalysisData: AnalysisResult = {
  readingGuide: {
    characterType: {
      cn: "建筑师 × 助人者",
      en: "INTJ-2",
      avatarUrl: "/assets/avatars/intj-2.png" // Placeholder
    },
    guideText: [
      "本报告融合了 MBTI（心理功能）与九型人格（核心动机）的双重分析。",
      "战略层 (MBTI) 揭示了你的认知操作系统，即你如何接收信息和做决定。",
      "行动层 (九型主型) 揭示了你的核心驱动力，即你为什么而行动。",
      "资源层 (九型侧翼) 提供了你的辅助手段，帮助你更好地适应环境。"
    ]
  },
  personalityTraits: {
    summary: {
      mbti: "INTJ：具有长远眼光的战略家，追求逻辑与效率。",
      enneagramMain: "2号：渴望被爱与需要的助人者，关注他人情感。",
      enneagramWing: "1号：追求完美与秩序的改革者，注重原则。"
    },
    detailAnalysis: {
      chemistry: "当 INTJ 的冷峻逻辑遇上 2 号的热情奉献，你成为了一位“为人类福祉而深谋远虑的建筑师”，用理性的系统去实现感性的关怀。",
      decodingTable: [
        {
          level: "战略层 (MBTI)",
          theory: "Ni-Te 主导",
          driver: "构建完美系统",
          manifestation: "能够一眼看穿事物本质，并迅速制定高效的执行方案。"
        },
        {
          level: "行动层 (九型主型)",
          theory: "2号 助人者",
          driver: "获得爱与认可",
          manifestation: "积极介入他人的问题，渴望成为他人生命中不可或缺的一部分。"
        },
        {
          level: "资源层 (九型侧翼)",
          theory: "1号 侧翼",
          driver: "追求正确与秩序",
          manifestation: "对自己和他人有高标准，做事严谨，带有一定的道德洁癖。"
        }
      ],
      chemistryConclusion: "这三层动力的结合，使你既有宏大的愿景，又有细腻的情感触角。你不仅仅满足于系统的逻辑自洽，更在乎这个系统能否切实地帮助到人。你是理性的利他主义者。",
      strengths: [
        { title: "抗压与危机处理", desc: "在复杂多变的环境中，能保持INTJ的冷静逻辑，同时发挥2号的掌控欲来稳定局势。" },
        { title: "战略性同理心", desc: "能够精准预测他人的需求，并提前规划解决方案，而非仅停留在情绪安抚层面。" },
        { title: "高效的执行力", desc: "Te功能的执行力结合1号侧翼的严谨，让你能高质量地完成既定目标。" }
      ],
      conflicts: [
        { title: "行动与思考的拉锯", desc: "INTJ倾向于深思熟虑，而2号渴望立即行动去帮助他人，可能导致决策前的内心焦灼。" },
        { title: "理性与情感的互斥", desc: "在做决策时，常常在“最高效的方案”和“最不伤人的方案”之间左右为难。" },
        { title: "过度承担", desc: "习惯性地将他人的责任背负在自己身上，又因为INTJ的独立性而不愿寻求帮助。" }
      ]
    },
    timeline: {
      past: [
        "童年时期可能表现得比同龄人成熟，倾向于独自思考但又渴望父母的关注。",
        "学生时代可能是成绩优异的“学霸”，同时也是老师得力的助手。",
        "早期职场中可能因为过于直率的建议而无意中得罪人，但因业务能力强而被重用。"
      ],
      future: [
        "随着阅历增长，将学会更好地平衡逻辑与情感，成为更具感召力的领导者。",
        "可能会投身于教育、咨询或社会公益领域，用系统化的方式解决社会问题。",
        "晚年将致力于将自己的经验总结成理论体系，传承给后人。"
      ]
    },
    subjectiveEvaluation: {
      portrait: "你就像一位手持设计图纸的慈善家，眼中看到的不仅是受苦的人，更是导致苦难的结构性问题。你不仅想擦干他们的眼泪，更想重建这栋漏雨的房子。",
      uniqueness: "在冷酷的理性中包裹着炽热的爱心，在感性的奉献中保持着清醒的头脑。"
    }
  },
  personalGrowth: {
    reactionTable: [
      {
        state: "最佳状态",
        work: [
          "远见卓识的领袖：能描绘激动人心的未来，并鼓舞团队一起实现。",
          "兼顾人性的决策者：在效率与照顾他人感受之间找到平衡。",
          "创造型问题解决者：在复杂局面中提出突破性的系统解决方案。"
        ],
        relation: [
          "深情而温暖的伴侣：用具体行动而不仅是言语表达爱意。",
          "高度包容的倾听者：能欣赏对方的差异与节奏，不急于评判。",
          "真诚分享的知己：愿意打开内心世界，分享自己的思考与脆弱。"
        ],
        feeling: "充满掌控感与意义感，内心平静而喜悦，感到与世界深度连结。",
        entry: "保持规律的独处充电时间，并在持续助人中获得正向反馈与肯定。"
      },
      {
        state: "日常状态",
        work: [
          "稳健推进的执行者：按部就班地完成既定目标，关注效率与质量。",
          "理性苛求的同事：偶尔会因他人低效而不耐烦，语气偏直接。",
          "责任上身的担当者：习惯自动承担更多工作，确保事情被做好。"
        ],
        relation: [
          "体贴但略带控制的照顾者：通过“安排好一切”来表达关心。",
          "期待被采纳的建议者：希望对方按自己的专业判断行事。",
          "略显啰嗦的提醒者：出于担心而频繁提出注意事项。"
        ],
        feeling: "整体忙碌而充实，偶尔觉得被误解或被依赖过度，需要被看见。",
        entry: "维持基本的作息与运动习惯，并学会在关系中适度表达真实需求。"
      },
      {
        state: "压力状态",
        work: [
          "专断孤立的指挥者：强行推动自己的方案，难以听进不同意见。",
          "细节纠结的完美主义者：过度关注小问题，放大瑕疵与错误。",
          "情绪失控的爆点：在长期压抑后突然在会议或合作中情绪爆发。"
        ],
        relation: [
          "情绪勒索的付出者：不断强调自己的牺牲，希望对方“懂事一点”。",
          "冷漠抽离的旁观者：选择沉默或冷战来避免进一步受伤。",
          "高度敏感的防御者：对任何批评都格外在意，容易解读为否定。"
        ],
        feeling: "焦虑、不被理解与被辜负感交织，内心充满怨气与失控感。",
        entry: "遭遇重大挫折、长期付出得不到回应，或在关键关系中感到被背叛。"
      }
    ],
    strengthsAnalysis: [
      {
        level: "顶尖天赋",
        field: "危机战略整合能力",
        desc: "在系统崩溃或重大变动时依然能保持冷静，迅速看清全局结构与关键节点，搭建兼顾长期愿景与短期落地的整体方案。",
        improvement: "主动承担需要前瞻性规划与系统设计的任务，不断在实战中迭代自己的判断模型。"
      },
      {
        level: "显著才能",
        field: "复杂系统漏洞识别",
        desc: "善于洞察复杂系统中的薄弱环节：能看见流程断点、权限灰区以及信息黑箱，并在问题暴露之前提出预警。",
        improvement: "将这些洞察形成结构化的“风险清单”和“复盘模板”，帮助团队建立可复制的防御机制。"
      },
      {
        level: "显著才能",
        field: "长期风险预判",
        desc: "越是面对压力与不确定性，越能冷静评估不同路径的长期代价与收益，擅长做出艰难但必要的决策。",
        improvement: "在保持独立判断的同时，刻意练习向团队解释自己的推演过程，让别人看见你决策背后的逻辑。"
      },
      {
        level: "显著才能",
        field: "本质洞察力",
        desc: "能够透过表象直抵事物的本质逻辑，不过度被情绪和噪音干扰，善于抓住最关键的 20% 变量。",
        improvement: "尝试用更温和、形象的语言向他人解释这些本质规律，扩大你的影响半径。"
      },
      {
        level: "优势领域",
        field: "跨学科知识整合",
        desc: "擅长把心理学、商业、技术与社会学等不同领域的概念拼接在一起，为复杂问题提供多视角、可落地的综合方案。",
        improvement: "在团队中承担“架构师”和“流程优化者”的角色，把抽象思路转化为清晰的行动路径。"
      },
      {
        level: "优势领域",
        field: "逆境中心理韧性",
        desc: "善于在压力情境下保持第三视角观察和分析，不被情绪完全吞没，反而能从挫折中提炼经验与洞见。",
        improvement: "将观察所得用于建立合作与预警机制，而非仅仅用于自我防御。"
      },
      {
        level: "优势领域",
        field: "独立思考与判断",
        desc: "不随波逐流，有明确的价值标准和判断框架，能够从不同角度审视问题并给出冷静结论。",
        improvement: "在团队讨论中更自信地表达这些判断，让你的独立视角成为他人的启发，而不是只留在脑海中。"
      },
      {
        level: "需留意领域",
        field: "日常情感维护",
        desc: "容易过度关注目标与未来，忽略当下身体感受与情绪状态，关系中的温度维护往往被排在优先级之后。",
        improvement: "有意识地安排“无目的相处时间”，练习在日常对话中表达关心与感谢，而不仅是提供解决方案。"
      },
      {
        level: "需留意领域",
        field: "模糊容忍度",
        desc: "对缺乏逻辑的行为或低效协作较难容忍，容易在不经意间表现出不耐烦或批判态度。",
        improvement: "在面对不确定和混乱时，刻意提醒自己先观察再评判，为他人的学习曲线预留空间。"
      },
      {
        level: "需留意领域",
        field: "社交耐力与能量管理",
        desc: "长时间的高密度社交或冲突沟通会迅速消耗能量，若不及时抽离，可能出现情绪冷却甚至关系抽离。",
        improvement: "允许自己在重要交流前后安排缓冲时间，并向亲近的人说明你的能量节奏，而不是硬撑或突然消失。"
      }
    ]
  },
  careerPath: {
    strengths: [
      { title: "宏观视野", desc: "能跳出具体事务，看到行业发展的趋势。" },
      { title: "服务精神", desc: "真心实意地想为客户解决问题，赢得信任。" },
      { title: "逻辑闭环", desc: "做事有始有终，方案严谨周全。" }
    ],
    blindSpots: [
      { title: "过度干涉", desc: "出于好意而过度介入同事的工作，可能招致反感。" },
      { title: "忽视细节", desc: "在宏大构想中可能忽略了落地的具体困难。" },
      { title: "固执己见", desc: "一旦认定某个方案，很难听进反对意见。" }
    ],
    roles: [
      { title: "战略顾问", desc: "为企业提供长期的发展建议。" },
      { title: "产品经理", desc: "结合用户需求（感性）与技术实现（理性）。" },
      { title: "人力资源总监", desc: "规划人才体系，关注员工成长。" }
    ],
    collaboration: [
      { title: "明确边界", desc: "事先约定好各自的职责范围。" },
      { title: "结果导向", desc: "用数据和结果说话，而非情绪。" },
      { title: "定期复盘", desc: "及时总结经验教训，不断优化流程。" }
    ],
    environment: [
      { title: "扁平化管理", desc: "减少层级束缚，能够直接沟通。" },
      { title: "鼓励创新", desc: "允许尝试新方法，包容试错。" },
      { title: "人文关怀", desc: "重视员工的个人感受和成长。" }
    ],
    partners: [
      { type: "ENTP (辩论家)", desc: "能提供源源不断的创意，弥补你的思维定势。" },
      { type: "ISFJ (守卫者)", desc: "能处理好细节落地，让你无后顾之忧。" },
      { type: "ESTJ (总经理)", desc: "强大的执行力能帮你把蓝图变为现实。" }
    ],
    traps: [
      { title: "讨好型工作", desc: "为了维持关系而承接不合理的需求。" },
      { title: "完美主义陷阱", desc: "在细节上纠结过久，拖慢整体进度。" },
      { title: "孤芳自赏", desc: "因为无人理解自己的深谋远虑而感到失落。" }
    ]
  },
  relationships: {
    communicationTable: [
      {
        misunderstanding: "你太冷漠了，根本不关心我。",
        reason: "INTJ 在思考问题时习惯抽离情感，面无表情。",
        adjustment: "在思考前先说明：“我现在在想怎么帮你解决问题，比较专注。”"
      },
      {
        misunderstanding: "你总是想控制我。",
        reason: "2号特质让你习惯性地为对方安排好一切。",
        adjustment: "学会询问而非直接安排：“你需要我的建议吗？”"
      },
      {
        misunderstanding: "你说话太伤人了。",
        reason: "Te 功能让你说话直奔主题，忽略了修饰。",
        adjustment: "运用“三明治沟通法”，先肯定，再建议，最后鼓励。"
      }
    ],
    intimacy: {
      strengths: [
        "极其忠诚，一旦认定就是一辈子。",
        "愿意为了对方的成长而付出一切资源。",
        "能提供高质量的精神交流和深度陪伴。"
      ],
      challenges: [
        "不擅长处理突如其来的情绪冲突。",
        "对伴侣的要求很高，有时会像“教导主任”。",
        "在感到被拒绝时会通过冷战来保护自己。"
      ],
      growth: {
        awareness: [
          { title: "自我觉察能力", desc: "能够意识到自己在关系中的行为模式" },
          { title: "情绪识别能力", desc: "能够识别自己和他人的情绪变化" }
        ],
        skill: [
          { title: "有效沟通技巧", desc: "能够清晰表达需求和倾听对方" },
          { title: "冲突处理能力", desc: "能够以建设性方式处理分歧" }
        ],
        pattern: [
          { title: "依恋模式调整", desc: "逐步建立更安全的依恋关系" },
          { title: "重复性模式识别", desc: "觉察并打破不健康的关系循环" }
        ]
      }
    }
  },
  reportSummary: {
    title: "理性利他主义者",
    text: "你拥有出色的系统化思维能力和战略性眼光，能够从宏观角度审视问题并制定周密的执行计划。在人际交往中，你善于倾听他人的需求，并以实际行动提供有价值的支持。这种特质使你在团队协作中成为可靠的核心成员。",
    keyPoints: {
      thinking: "系统化、战略性、理性分析、逻辑清晰",
      behavior: "行动导向、务实可靠、目标明确、执行力强",
      growth: "情感表达、灵活变通、接纳不确定性、享受当下"
    }
  },
  chatgptPrompt: "My 16 Type is INTJ, my Enneagram Type is 2, and my subtype is 1. Based on these results, please provide a comprehensive and deep psychological analysis:\n\n1. **Core Personality Analysis**:\n   - The unique chemistry between INTJ and Enneagram Type 2 (Wing 1).\n   - Key strengths and hidden talents.\n   - Deep-seated motivations and fears.\n\n2. **Inner Conflicts & Struggles**:\n   - Contradictions between my MBTI cognitive functions and Enneagram motivations.\n   - The specific type of loneliness or misunderstanding I often experience.\n   - Common stress triggers and unhealthy coping mechanisms.\n\n3. **Growth & Development**:\n   - Practical advice for personal growth and self-transcendence.\n   - How to balance my conflicting traits.\n   - Recommendations for career path and work style.\n\n4. **Relationships & Social Dynamics**:\n   - My typical role in relationships (romantic, friendship, professional).\n   - Potential blind spots in social interactions.\n   - What kind of partner/environment suits me best.\n\n5. **Subjective Evaluation**:\n   - Provide a metaphorical summary for this MBTI + Enneagram (2 with Wing 1) combination among 1152 possibilities.\n   - Give 2 numbered interaction observations referencing my MBTI and Enneagram traits.\n   - Conclude with a core uniqueness analysis focusing on paradoxical productivity (how contradictions become output).\n\nPlease provide an empathetic, insightful, and structured response in Chinese."
};

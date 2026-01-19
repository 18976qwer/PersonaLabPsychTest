export const translations = {
  zh: {
    common: {
      appName: 'PersonaLab',
      appNameLine1: 'PersonaLab',
      appNameLine2: '',
      confirm: '确认',
      cancel: '取消',
      next: '下一页',
      prev: '上一页',
      submit: '提交测试',
      loading: '加载中...',
    },
    header: {
      returnHome: '返回首页',
      progress: '完成度',
    },
    landing: {
      title: '发现你真正的自我',
      subtitle: '通过 MBTI 与九型人格的深度融合，144 种独特人格类型，为你揭示最真实的内心世界。',
      start: '开始测试',
      meta: {
        time: '约15分钟',
        privacy: '隐私保护'
      },
      features: {
        mbti: {
          title: 'MBTI 评估',
          desc: '通过16型人格视角，了解你的认知功能以及你与世界的互动方式。'
        },
        enneagram: {
          title: '九型人格洞察',
          desc: '深入探索九型人格系统中的核心动机、恐惧和渴望。'
        },
        ai: {
          title: 'AI 深度分析',
          desc: '获取由先进AI生成的个性化深度报告，专门针对你的独特组合量身定制。'
        }
      }
    },
    mbti: {
      title: 'MBTI 评估',
      instruction: '选择最能描述你的陈述。',
      nextStep: '下一步：九型人格',
      progress: '答题进度',
    },
    enneagram: {
      title: '九型人格评估',
      page: '页',
      seeResults: '查看结果',
      options: [
        '完全不同意',
        '不同意',
        '有点不同意',
        '中立',
        '有点同意',
        '同意',
        '完全同意'
      ]
    },
    modal: {
      returnHomeTitle: '返回首页？',
      returnHomeMessage: '确定要返回首页吗？未完成的测试进度将丢失。',
      aiConfigTitle: '配置 DeepSeek API',
      aiModalDesc: '请输入您的 DeepSeek API Key 以启用实时 AI 分析。Key 将仅存储在您的本地浏览器中。',
      apiKeyLabel: 'DeepSeek API Key',
      apiKeyPlaceholder: 'sk-...',
      enableAiLabel: '启用 AI 分析功能',
      save: '保存并分析',
      cancel: '取消',
      getApiKey: '获取 API Key'
    },
    footer: {
      copyright: '© 2025 144型人格测试。保留所有权利。',
      disclaimer: '测试报告部分内容由 AI 生成，内容仅供参考，请仔细甄别。',
      privacy: '隐私政策',
      terms: '服务条款',
      disclaimerLink: '免责声明'
    },
    report: {
      pageTitle: '人格测试报告',
      navTitle: '目录',
      readingGuide: '阅读指引',
      traits: '人格特质',
      growth: '个人成长',
      career: '职业路径',
      relationships: '人际关系',
      summary: '报告总结',
      downloadPdf: '保存为 PDF',
      shareReport: '分享报告',
      retest: '重新测试',
      idLabel: '专属 ID',
      retestConfirm: '确定要重新开始测试吗？当前的记录将会被清除。',
      thinkingPattern: '思维模式',
      behaviorTraits: '行为特质',
      growthKeys: '成长关键',
      dimension: {
        extravert: '外向',
        introvert: '内向',
        sensing: '实感',
        intuition: '直觉',
        thinking: '思维',
        feeling: '情感',
        judging: '判断',
        perceiving: '知觉'
      },
      readingGuideData: {
        keywords: ['工匠型人格', '实践者', '逻辑思维'],
        oneLiner: '您是一个冷静务实、善于解决具体问题的行动派。',
        howToUse: {
          title: '如何使用这份报告？',
          intro: '本报告旨在为你提供一份清晰易读的个人使用说明书，帮助你快速把结果转化为行动和成长。',
          steps: [
            '可以从头至尾阅读，获得一个关于自我的完整认知框架。',
            '也可以直接跳转至最关心的部分，如“个人成长”或“职业路径”，寻找即刻可用的建议。',
            '报告中的语言避免专业术语，力求平实且可操作；你可以按需收藏或分享给亲友与同事。'
          ]
        },
        faq: {
          title: '报告可以解答什么？',
          questions: [
            {
              title: '“我为什么总是这样？”',
              body: '看清你常见的思维与行为模式来源。'
            },
            {
              title: '“我到底擅长什么？”',
              body: '识别你最核心的优势与可复制的方法。'
            },
            {
              title: '“我为何总陷入某种矛盾？”',
              body: '理解那些反复出现的内在冲突与情绪反应。'
            },
            {
              title: '“我该怎么办？”',
              body: '获取在个人成长、职业发展与人际关系中的具体、可操作的建议。'
            }
          ]
        },
        outro: '把这份报告当作一次和自己好好聊聊的起点。'
      },
      traitsSection: {
        decodingTitle: '人格特质解码',
        level: {
          strategic: '战略层',
          action: '行动层',
          resource: '资源层',
          theoryFallback: '理论'
        },
        decoding: {
          driver: '主要驱动力',
          manifestation: '外在表现'
        },
        chemistry: {
          title: '组合特质概述',
          label: '化学反应：'
        },
        strengthsTitle: '核心优势',
        conflictsTitle: '内在冲突',
        timelineTitle: '时间线推测',
        pastTitle: '过去经历',
        futureTitle: '未来预测',
        quote: {
          uniqueness: '—— 你的独特之处：{text}'
        }
      },
      careerSection: {
        strengthsTitle: '核心优势',
        blindSpotsTitle: '潜在盲点',
        rolesTitle: '团队角色',
        collaborationTitle: '协作风格',
        environmentTitle: '最佳环境',
        partnersTitle: '互补同伴',
        trapsTitle: '职业陷阱警示'
      },
      relationshipsSection: {
        communication: {
          title: '沟通模式调整清单',
          misunderstanding: '常见误区',
          reason: '背后的原因',
          reasonShort: '背后原因',
          adjustment: '可以尝试的调整',
          adjustmentShort: '尝试调整'
        },
        intimacy: {
          title: '亲密关系中的动态',
          strengthsTitle: '优势',
          challengesTitle: '挑战'
        },
        growth: {
          title: '关系成长方向',
          awarenessTitle: '意识层面',
          skillTitle: '技能层面',
          patternTitle: '模式层面'
        }
      },
      visualization: {
        energyTitle: '能量分布图',
        averageLine: '平均水平'
      },
      growthSection: {
        reactionTitle: '内在反应模式',
        reaction: {
          state: '状态',
          work: '工作表现',
          relation: '亲密关系表现',
          relationShort: '亲密关系',
          feeling: '内在感受',
          entry: '如何进入',
          stateLabel: {
            best: '最佳状态',
            daily: '日常状态',
            stress: '压力状态',
            other: '当前状态'
          }
        },
        rankingTitle: '优劣势深度分析',
        ranking: {
          level: '评估等级',
          field: '具体领域',
          desc: '说明与日常体现',
          descMobile: '说明与体现',
          improvement: '改善方向'
        },
        levels: {
          top: {
            label: '顶尖天赋',
            description: '领先大多数人'
          },
          significant: {
            label: '显著才能',
            description: '明显优势'
          },
          advantage: {
            label: '优势领域',
            description: '稳定优势'
          },
          attention: {
            label: '需留意领域',
            description: '需要重点提升'
          }
        }
      }
    },
    share: {
      myPersonality: '我的性格档案',
      scanTest: '扫码测试',
      findYours: '发现你的性格密码'
    },
    results: {
      title: '你的人格档案',
      subtitle: '探索你的认知和情感模式的独特融合。',
      cognitiveStyle: '认知风格',
      coreMotivation: '核心动机',
      wing: '侧翼',
      wingDesc: '你主要认同 {main} 号类型，辅以 {wing} 号类型的特征。',
      type: '主型',
      mbtiAssessment: 'MBTI',
      enneagramTag: '九型人格',
      keyStrengths: '核心优势',
      potentialChallenges: '潜在挑战',
      downloadPdf: '下载 PDF',
      aiReport: '生成 AI 报告',
      aiError: '生成报告失败，请检查您的API Key或网络连接。',
      apiKeyError: '请在上方设置中填写有效的 API Key 以启用 AI 分析。',
      aiNoData: 'AI 分析未返回数据，请检查 API Key。',
      onlyDeepSeek: '当前仅支持 DeepSeek 实时生成。',
      summary: '综合总结',
      comboOverview: '组合分析',
      conflicts: '内在冲突',
      growth: '个人成长',
      bestState: '最佳状态',
      stressState: '压力状态',
      comingSoon: '功能即将推出！'
    }
  },
  en: {
    common: {
      appName: 'PersonaLab',
      appNameLine1: 'PersonaLab',
      appNameLine2: '',
      confirm: 'Confirm',
      cancel: 'Cancel',
      next: 'Next',
      prev: 'Previous',
      submit: 'Submit Test',
      loading: 'Loading...',
    },
    header: {
      returnHome: 'Return to Home',
      progress: 'Completed',
    },
    landing: {
      title: 'Discover Your True Self',
      subtitle: 'Through the deep integration of MBTI and the Enneagram, 144 unique personality types reveal the truest version of your inner world.',
      start: 'Start Assessment',
      meta: {
        time: 'About 15 minutes',
        privacy: 'Privacy protected'
      },
      features: {
        mbti: {
          title: 'MBTI Assessment',
          desc: 'Understand your cognitive functions and how you interact with the world through the 16-type lens.'
        },
        enneagram: {
          title: 'Enneagram Insight',
          desc: 'Dive deeper into your core motivations, fears, and desires with the 9-type Enneagram system.'
        },
        ai: {
          title: 'AI Analysis',
          desc: 'Get a personalized, in-depth report generated by advanced AI, tailored specifically to your unique combination.'
        }
      }
    },
    mbti: {
      title: 'MBTI Assessment',
      instruction: 'Select the statement that best describes you.',
      nextStep: 'Next Step: Enneagram',
      progress: 'Progress',
    },
    enneagram: {
      title: 'Enneagram Assessment',
      page: 'Page',
      seeResults: 'See Results',
      options: [
        'Strongly Disagree',
        'Disagree',
        'Somewhat Disagree',
        'Neutral',
        'Somewhat Agree',
        'Agree',
        'Strongly Agree'
      ]
    },
    results: {
      title: 'Your Personality Profile',
      subtitle: 'Discover the unique blend of your cognitive and emotional patterns.',
      cognitiveStyle: 'Cognitive Style',
      coreMotivation: 'Core Motivation',
      wing: 'Wing',
      wingDesc: 'You primarily identify with Type {main}, supported by Type {wing} characteristics.',
      type: 'Type',
      mbtiAssessment: 'MBTI',
      enneagramTag: 'Enneagram',
      keyStrengths: 'Key Strengths',
      potentialChallenges: 'Potential Challenges',
      downloadPdf: 'Download PDF',
      aiReport: 'Generate AI Report',
      aiError: 'Failed to generate report. Please check your API Key or network connection.',
      summary: 'Summary',
      comboOverview: 'Combination Overview',
      conflicts: 'Internal Conflicts',
      growth: 'Personal Growth',
      bestState: 'Best State',
      stressState: 'Stress State',
      comingSoon: 'Coming soon!',
      apiKeyError: 'Please enter a valid API key in the settings above to enable AI analysis.',
      aiNoData: 'No data returned from AI. Please check API Key.',
      onlyDeepSeek: 'Currently only DeepSeek is supported.'
    },
    modal: {
      returnHomeTitle: 'Return to Home?',
      returnHomeMessage: 'Are you sure you want to return to the home page? Your current test progress will be lost.',
      aiConfigTitle: 'AI Configuration',
      apiKeyLabel: 'DeepSeek API Key',
      apiKeyPlaceholder: 'Enter your DeepSeek API Key',
      enableAiLabel: 'Enable AI Analysis Report',
      save: 'Save',
      cancel: 'Cancel'
    },
    footer: {
      copyright: '© 2025 144 Types Test. All rights reserved.',
      disclaimer: 'Part of the test report is generated by AI and is for reference only. Please verify carefully.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      disclaimerLink: 'Disclaimer'
    },
    report: {
      pageTitle: 'Personality Test Report',
      navTitle: 'Contents',
      readingGuide: 'Reading Guide',
      traits: 'Personality Traits',
      growth: 'Personal Growth',
      career: 'Career Path',
      relationships: 'Relationships',
      summary: 'Report Summary',
      downloadPdf: 'Save as PDF',
      shareReport: 'Share Report',
      retest: 'Retake Assessment',
      idLabel: 'ID',
      retestConfirm: 'Are you sure you want to retake the assessment? Current progress will be lost.',
      thinkingPattern: 'Thinking Pattern',
      behaviorTraits: 'Behavior Traits',
      growthKeys: 'Growth Keys',
      dimension: {
        extravert: 'Extravert',
        introvert: 'Introvert',
        sensing: 'Sensing',
        intuition: 'Intuition',
        thinking: 'Thinking',
        feeling: 'Feeling',
        judging: 'Judging',
        perceiving: 'Perceiving'
      },
      readingGuideData: {
        keywords: ['Artisan', 'Practitioner', 'Logical'],
        oneLiner: 'You are a calm, pragmatic action-taker who excels at solving concrete problems.',
        howToUse: {
          title: 'How to use this report?',
          intro: 'This report is a clear and practical personal manual to help you turn insights into action.',
          steps: [
            'Read from start to finish to gain a complete framework of self-understanding.',
            'Or jump directly to what you care about most, such as "Personal Growth" or "Career Path".',
            'We avoid heavy jargon and keep language practical; feel free to save or share with people you trust.'
          ]
        },
        faq: {
          title: 'What can this report answer?',
          questions: [
            {
              title: '"Why am I like this?"',
              body: 'Clarify the sources of your recurring thinking and behavior patterns.'
            },
            {
              title: '"What am I truly good at?"',
              body: 'Identify your core strengths and repeatable methods.'
            },
            {
              title: '"Why do I fall into certain conflicts?"',
              body: 'Understand recurring inner tensions and emotional reactions.'
            },
            {
              title: '"What should I do?"',
              body: 'Get specific, actionable guidance for growth, career, and relationships.'
            }
          ]
        },
        outro: 'Treat this report as a starting point for an honest talk with yourself.'
      },
      traitsSection: {
        decodingTitle: 'Personality Trait Decoding',
        level: {
          strategic: 'Strategic Level',
          action: 'Action Level',
          resource: 'Resource Level',
          theoryFallback: 'Theory'
        },
        decoding: {
          driver: 'Core Driving Force',
          manifestation: 'External Manifestation'
        },
        chemistry: {
          title: 'Combined Trait Overview',
          label: 'Chemistry:'
        },
        strengthsTitle: 'Core Strengths',
        conflictsTitle: 'Inner Conflicts',
        timelineTitle: 'Timeline Projection',
        pastTitle: 'Past Experiences',
        futureTitle: 'Future Projection',
        quote: {
          uniqueness: '—— Your uniqueness: {text}'
        }
      },
      careerSection: {
        strengthsTitle: 'Core Strengths',
        blindSpotsTitle: 'Potential Blind Spots',
        rolesTitle: 'Team Roles',
        collaborationTitle: 'Collaboration Style',
        environmentTitle: 'Best Environment',
        partnersTitle: 'Complementary Partners',
        trapsTitle: 'Career Pitfalls'
      },
      relationshipsSection: {
        communication: {
          title: 'Communication Adjustment Checklist',
          misunderstanding: 'Common Misunderstandings',
          reason: 'Underlying Reasons',
          reasonShort: 'Underlying Reasons',
          adjustment: 'Suggested Adjustments',
          adjustmentShort: 'Adjustments'
        },
        intimacy: {
          title: 'Dynamics in Intimate Relationships',
          strengthsTitle: 'Strengths',
          challengesTitle: 'Challenges'
        },
        growth: {
          title: 'Relationship Growth Directions',
          awarenessTitle: 'Awareness Level',
          skillTitle: 'Skill Level',
          patternTitle: 'Pattern Level'
        }
      },
      visualization: {
        energyTitle: 'Energy Distribution Map',
        averageLine: 'Average Level'
      },
      growthSection: {
        reactionTitle: 'Inner Reaction Patterns',
        reaction: {
          state: 'State',
          work: 'Work Performance',
          relation: 'Relationship Performance',
          relationShort: 'Relationships',
          feeling: 'Inner Feelings',
          entry: 'How to Enter',
          stateLabel: {
            best: 'Best State',
            daily: 'Daily State',
            stress: 'Stress State',
            other: 'Current State'
          }
        },
        rankingTitle: 'Strengths & Weaknesses Deep Analysis',
        ranking: {
          level: 'Level',
          field: 'Domain',
          desc: 'Description & Daily Expression',
          descMobile: 'Description',
          improvement: 'Growth Direction'
        },
        levels: {
          top: {
            label: 'Top Talent',
            description: 'Ahead of most people'
          },
          significant: {
            label: 'Significant Strength',
            description: 'Clear advantage'
          },
          advantage: {
            label: 'Strong Area',
            description: 'Stable strength'
          },
          attention: {
            label: 'Needs Attention',
            description: 'Needs focused improvement'
          }
        }
      }
    },
    share: {
      myPersonality: 'My Personality Profile',
      scanTest: 'Scan to Test',
      findYours: 'Discover Your Type'
    }
  }
};

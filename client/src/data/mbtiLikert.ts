export type MBTIDimension = 'EI' | 'SN' | 'TF' | 'JP' | 'ID';
export type MBTISide =
  | 'E' | 'I'
  | 'S' | 'N'
  | 'T' | 'F'
  | 'J' | 'P'
  | 'A' | 'T';

export interface LikertQuestion {
  id: number;
  dimension: MBTIDimension;
  side: MBTISide;
  textZh: string;
  textEn: string;
}

export const likertQuestions: LikertQuestion[] = [
  { id: 1,  dimension: 'JP', side: 'P', textZh: '你不喜欢特定的工作计划，反而是自由安排时间做想做的工作效率会毕竟高', textEn: 'You dislike fixed work plans; flexible self-arranged work feels more efficient.' },
  { id: 2,  dimension: 'EI', side: 'E', textZh: '参与社交聚会，你总能认识几个新朋友', textEn: 'At social events, you often meet new friends.' },
  { id: 3,  dimension: 'JP', side: 'P', textZh: '你经常在做决定时犹犹豫豫', textEn: 'You frequently hesitate when making decisions.' },
  { id: 4,  dimension: 'EI', side: 'E', textZh: '你常常是聚会/活动的发起人，组织一场活动对你来说很简单', textEn: 'You often initiate events; organizing them feels easy.' },
  { id: 5,  dimension: 'JP', side: 'J', textZh: '一旦做出选择，你就会坚信自己的选择是正确的', textEn: 'Once you decide, you strongly believe your choice is right.' },
  { id: 6,  dimension: 'TF', side: 'F', textZh: '你的幸福更多地来自帮助别人完成事情，而不是你自己的成就', textEn: 'Your happiness comes more from helping others than personal achievements.' },
  { id: 7,  dimension: 'ID', side: 'A', textZh: '你对事情会向对自己有利的方向发展有信心', textEn: 'You are confident things will turn in your favor.' },
  { id: 8,  dimension: 'JP', side: 'J', textZh: '你喜欢每天有一份待办事项清单', textEn: 'You like having a daily to-do list.' },
  { id: 9,  dimension: 'TF', side: 'T', textZh: '你认为，人们应该多依靠理性思考来解决问题', textEn: 'Problems should be solved primarily through rational thinking.' },
  { id: 10, dimension: 'JP', side: 'J', textZh: '相比起同时做很多事，你更喜欢完成一件事之后再开启另一件', textEn: 'You prefer finishing one task before starting another.' },
  { id: 11, dimension: 'TF', side: 'F', textZh: '你会非常小心不让别人难堪，即使这完全是他们的错', textEn: 'You avoid embarrassing others, even when they are at fault.' },
  { id: 12, dimension: 'EI', side: 'E', textZh: '经历了繁忙而辛苦的工作后，你需要跟朋友一起尽兴玩闹来恢复元气', textEn: 'After heavy work, you recharge by socializing with friends.' },
  { id: 13, dimension: 'TF', side: 'F', textZh: '你很容易同情别人的遭遇', textEn: 'You easily empathize with others’ situations.' },
  { id: 14, dimension: 'JP', side: 'J', textZh: '你的时间观念很强', textEn: 'You have a strong sense of time.' },
  { id: 15, dimension: 'TF', side: 'F', textZh: '当看到别人伤心难过时，你也会跟着难过', textEn: 'You feel sad when others feel sad.' },
  { id: 16, dimension: 'SN', side: 'N', textZh: '你很容易看出具体事件背后的普遍原理', textEn: 'You readily see general principles behind specific events.' },
  { id: 17, dimension: 'JP', side: 'J', textZh: '在让自己放松之前，你喜欢先做做家务', textEn: 'You prefer finishing chores before relaxing.' },
  { id: 18, dimension: 'ID', side: 'A', textZh: '即使在很大的压力下，你依旧保持冷静', textEn: 'You remain calm even under heavy pressure.' },
  { id: 19, dimension: 'JP', side: 'J', textZh: '当你的计划被打断，那么你的首要任务是尽快回到正轨', textEn: 'When plans are interrupted, you quickly get back on track.' },
  { id: 20, dimension: 'JP', side: 'P', textZh: '你经常在最后的截止时间前疯狂赶工', textEn: 'You often rush close to deadlines.' },
  { id: 21, dimension: 'SN', side: 'N', textZh: '你喜欢开放式结局的电影，这样你可以依据自己的理解来诠释故事的最终结果', textEn: 'You like open-ended films to interpret the ending yourself.' },
  { id: 22, dimension: 'SN', side: 'N', textZh: '你经常花很多时间来试图理解与自己截然不同的观点', textEn: 'You spend time understanding viewpoints very different from yours.' },
  { id: 23, dimension: 'EI', side: 'E', textZh: '相比起待在安静、私密的房间里，你更愿意去繁忙、熙攘的街道逛逛', textEn: 'You prefer bustling streets over quiet private rooms.' },
  { id: 24, dimension: 'EI', side: 'I', textZh: '在社交活动之后，你通常需要时间独处来恢复精力和思考', textEn: 'After social activities, you need solitude to recover energy.' },
  { id: 25, dimension: 'EI', side: 'E', textZh: '相比起独处，你更喜欢与其他人待在一起', textEn: 'You prefer being with others over being alone.' },
  { id: 26, dimension: 'JP', side: 'P', textZh: '你颇为喜欢处理迫使你分秒必争的突发情况', textEn: 'You like handling urgent, time-pressing situations.' },
  { id: 27, dimension: 'SN', side: 'N', textZh: '你喜欢畅想未来的种种可能，脑海里也会常常冒出一些新点子', textEn: 'You enjoy imagining future possibilities and new ideas.' },
  { id: 28, dimension: 'TF', side: 'T', textZh: '你喜欢并关注科学、技术领域', textEn: 'You like and follow science and technology fields.' },
  { id: 29, dimension: 'EI', side: 'I', textZh: '你会尽量避免打电话', textEn: 'You try to avoid phone calls.' },
  { id: 30, dimension: 'SN', side: 'N', textZh: '你花了很多空闲时间探索各种激起你兴趣的随机主题', textEn: 'You explore random topics in your free time.' },
  { id: 31, dimension: 'ID', side: 'T', textZh: '你很容易担心事情会不会朝着更糟糕的方向发展', textEn: 'You easily worry things might go worse.' },
  { id: 32, dimension: 'ID', side: 'T', textZh: '你会因为犯了一个小错误而对自己深陷怀疑', textEn: 'You fall into self-doubt over small mistakes.' },
  { id: 33, dimension: 'JP', side: 'J', textZh: '你善用组织计划工具，例如日程表和计划列表等', textEn: 'You use planning tools like calendars and lists effectively.' },
  { id: 34, dimension: 'SN', side: 'S', textZh: '你认为，把时间花在思考抽象的哲学问题上是无意义的', textEn: 'Spending time on abstract philosophical questions is meaningless.' },
  { id: 35, dimension: 'SN', side: 'S', textZh: '参加会议或培训，你会比较容易记住会议内容中的数据信息、时间信息等细节', textEn: 'You remember numbers, schedules and details from meetings.' },
  { id: 36, dimension: 'ID', side: 'A', textZh: '你很少担心你是否会给别人留下好印象', textEn: 'You rarely worry about making a good impression.' },
  { id: 37, dimension: 'TF', side: 'F', textZh: '你是个多愁善感的人', textEn: 'You are sentimental.' },
  { id: 38, dimension: 'TF', side: 'T', textZh: '比起处理感情方面的事，你更擅长解决需要用到理性或逻辑的问题', textEn: 'You handle logical problems better than emotional ones.' },
  { id: 39, dimension: 'EI', side: 'I', textZh: '你更喜欢保持低调，不喜欢成为别人关注的焦点', textEn: 'You prefer staying low-key, not being the center of attention.' },
  { id: 40, dimension: 'SN', side: 'N', textZh: '你热衷于猎奇和掌握新概念', textEn: 'You love exploring and mastering new concepts.' },
  { id: 41, dimension: 'EI', side: 'I', textZh: '你喜欢做那种大部分时间都可以独自完成的工作', textEn: 'You prefer work that you can do mostly alone.' },
  { id: 42, dimension: 'SN', side: 'S', textZh: '你很少去想人类存在的原因或者生命的意义之类的问题', textEn: 'You rarely think about human existence or the meaning of life.' },
];

export const likertLabels = {
  zh: ['强烈不同意', '不同意', '略微不同意', '中立', '略微同意', '同意', '强烈同意'],
  en: ['Strongly Disagree', 'Disagree', 'Slightly Disagree', 'Neutral', 'Slightly Agree', 'Agree', 'Strongly Agree'],
};

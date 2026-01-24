import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { bannedPhrasesZh, mbtiAnchors, enneagramAnchors } from './services/lexicon';
import { buildRefineUserPrompt, getSystemPrompt } from './services/providers/utils';
import { callDeepSeek, callQwen, callMiniMax, callMoonshot, ProviderName } from './services/providers';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());
const allowedOrigins = [/vercel\.app$/, /onrender\.com$/, /localhost:5173$/];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(re => re.test(origin))) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json({ limit: '10kb' })); // Limit body size

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// AI Report Generation
app.post('/api/generate-report', async (req, res) => {
  try {
    const { mbti, mainType, subtype, lang, modules, provider, model } = req.body;

    if (!mbti || !mainType || !subtype) {
      return res.status(400).json({ error: 'Missing personality data (mbti, mainType, subtype are required)' });
    }

    const primary: ProviderName =
      (String(provider || process.env.PRIMARY_PROVIDER || 'qwen') as ProviderName);

    let report: any = null;
    if (primary === 'qwen') {
      report = await callQwen({ mbti, mainType: String(mainType), subtype: String(subtype), lang: (lang || 'zh'), modules, model });
    } else if (primary === 'minimax') {
      report = await callMiniMax({ mbti, mainType: String(mainType), subtype: String(subtype), lang: (lang || 'zh'), modules, model });
    } else if (primary === 'moonshot') {
      report = await callMoonshot({ mbti, mainType: String(mainType), subtype: String(subtype), lang: (lang || 'zh'), modules, model });
    } else {
      report = await callDeepSeek({ mbti, mainType: String(mainType), subtype: String(subtype), lang: (lang || 'zh'), modules });
    }

    res.json(report);
  } catch (error: any) {
    console.error('Generation Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate report', 
      details: error.message 
    });
  }
});

// Streaming generation via SSE
app.get('/api/generate-report/stream', async (req, res) => {
  try {
    const mbti = String(req.query.mbti || '');
    const mainType = String(req.query.mainType || '');
    const subtype = String(req.query.subtype || '');
    const lang = (String(req.query.lang || 'zh') === 'en' ? 'en' : 'zh') as 'zh' | 'en';
    const provider = String(req.query.provider || process.env.PRIMARY_PROVIDER || 'qwen') as ProviderName;
    const model = req.query.model ? String(req.query.model) : undefined;
    const modulesParam = String(req.query.modules || '');
    const modules = modulesParam ? modulesParam.split(',').filter(Boolean) : ['traits','growth','career','relationships','summary'];

    if (!mbti || !mainType || !subtype) {
      res.status(400).end();
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
      // Ensure headers are flushed immediately
      // @ts-ignore
      if (typeof (res as any).flushHeaders === 'function') (res as any).flushHeaders();
      res.write(`retry: 1500\n\n`);

    const call = async (mods: string[]) => {
      const chosenModel =
        model || (mods.some(m => m === 'traits' || m === 'career') ? 'qwen-turbo' : 'qwen-plus');
      if (provider === 'qwen') {
        return callQwen({ mbti, mainType, subtype, lang, modules: mods, model: chosenModel });
      } else if (provider === 'minimax') {
        return callMiniMax({ mbti, mainType, subtype, lang, modules: mods, model: chosenModel });
      } else if (provider === 'moonshot') {
        return callMoonshot({ mbti, mainType, subtype, lang, modules: mods, model: chosenModel });
      }
      return callDeepSeek({ mbti, mainType, subtype, lang, modules: mods, model: chosenModel });
    };
    
    const hasEnglish = (s: string) => /[A-Za-z]/.test(s);
    const buildConstraintsForModule = (m: string, langSel: 'zh' | 'en') => {
      const zh = {
        traits: `中文-only；组合概述两句中文（各40–60字，总80–120）；past(童年/学生/早期职场)与future(近期/中期/远期)各3条，每条30–60字，采用“情境→行为→反馈→建议”；strengths/conflicts各3条，具体且避免通用词。`,
        career: `中文-only；strengths/blindSpots/teamRole/collaborationStyle/environment/companions/traps各3条；teamRole为角色类词；描述采用场景链，30–60字；companions为MBTI类型+一句说明。`,
        growth: `中文-only；禁止序号；best/daily/stress的work/rel各1条，格式“形容词+的+角色：具体场景与行为+结果”，28–48字。`,
        default: `中文-only且用具体场景描述。`,
      };
      const en = {
        traits: `English-only; two-sentence overview (40–60 words each, total 80–120); past (childhood/student/early career) and future (near/mid/long term): 3 items each, 30–60 words; use "situation → behavior → feedback → advice"; strengths/conflicts: 3 items each; avoid generic words.`,
        career: `English-only; Titles and descriptions MUST be in English. strengths/blindSpots/teamRole/collaborationStyle/environment/companions/traps: 3 items each; teamRole must be role nouns; each description 30–60 words with concrete scenes; companions use MBTI code + one-sentence explanation.`,
        growth: `English-only; No numbering; best/daily/stress each with work/rel: 1 item; format "Adjective role: concrete scene and behavior + outcome", 28–48 words.`,
        default: `English-only with concrete scene descriptions.`,
      };
      const dict = langSel === 'en' ? en : zh;
      if (m === 'traits') return dict.traits;
      if (m === 'career') return dict.career;
      if (m === 'growth') return dict.growth;
      return dict.default;
    };

      const tasks = modules.map(m => 
        call([m])
          .then(data => ({ m, data }))
          .catch(err => ({ m, error: String(err?.message || err) }))
      );
      
      let finished = 0;
      const total = tasks.length;
      
      tasks.forEach(p => {
        p.then(r => {
          const payload = JSON.stringify(r);
          res.write(`event: module\n`);
          res.write(`data: ${payload}\n\n`);
          const m = (r as any).m;
          const data = (r as any).data || {};
          if (m === 'traits' || m === 'career' || m === 'growth') {
            const issues: string[] = [];
            const textDump = JSON.stringify(data);
            if (lang === 'zh') {
              if (hasEnglish(textDump)) issues.push('中文环境禁止英文（除类型代码）');
              if (bannedPhrasesZh.some(b => textDump.includes(b))) issues.push('包含通用/禁用词');
            } else {
              const hasChineseChars = /[\u4e00-\u9fff]/.test(textDump);
              if (hasChineseChars) issues.push('English environment forbids Chinese');
            }
            if (m === 'traits') {
              const ok =
                data.combo &&
                Array.isArray(data.combo.strengths) &&
                Array.isArray(data.combo.conflicts) &&
                data.combo.strengths.length >= 3 &&
                data.combo.conflicts.length >= 3;
              if (!ok) issues.push('优势/冲突条目不足或缺失');
              const overviewLen = String(data.combo?.overview || '').length;
              if (!data.combo?.overview || overviewLen < 90) issues.push('组合特质概述过短或缺失');
              const pf = data.pastFuture;
              if (!(pf && Array.isArray(pf.past) && pf.past.length >= 3 && Array.isArray(pf.future) && pf.future.length >= 3)) {
                issues.push('时间线条目不足');
              }
              const line1Len = String(data.overviewSection?.line1 || '').length;
              const line2Len = String(data.overviewSection?.line2 || '').length;
              if (!data.overviewSection || line1Len < 40 || line2Len < 40) {
                issues.push('概述段落过短');
              }
              const chemLen = String(data.decoding?.chemistry || '').length;
              if (!data.decoding?.chemistry || chemLen < 80) {
                issues.push('化学反应描述过短');
              }
            }
            if (m === 'career') {
              const ok =
                data.strengths &&
                data.blindSpots &&
                data.teamRole &&
                data.collaborationStyle &&
                data.environment &&
                data.companions &&
                data.traps &&
                [data.strengths, data.blindSpots, data.teamRole, data.collaborationStyle, data.environment, data.companions, data.traps].every((arr: any) => Array.isArray(arr) && arr.length >= 3);
              if (!ok) issues.push('职业路径各列表不足3项');
              const norm = (s: string) => String(s || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/\s+/g, ' ').trim();
              const collect = (list: any[], key: 'title' | 'desc' | 'point' | 'mbti' | 'type') => (Array.isArray(list) ? list.map((x: any) => norm(String(x[key] || ''))) : []);
              const catTitles = [
                ...collect(data.strengths, 'title'),
                ...collect(data.blindSpots, 'title'),
                ...collect(data.teamRole, 'title'),
                ...collect(data.collaborationStyle, 'title'),
                ...collect(data.environment, 'title'),
                ...collect(data.traps, 'title')
              ].filter(Boolean);
              const titleSet = new Set<string>();
              let titleDup = false;
              for (const t of catTitles) {
                if (titleSet.has(t)) { titleDup = true; break; }
                titleSet.add(t);
              }
              if (titleDup) issues.push('职业路径标题存在重复或过度相似');
              const descs = [
                ...collect(data.strengths, 'desc'),
                ...collect(data.blindSpots, 'desc'),
                ...collect(data.teamRole, 'desc'),
                ...collect(data.collaborationStyle, 'desc'),
                ...collect(data.environment, 'desc'),
                ...collect(data.traps, 'desc')
              ].filter(Boolean);
              const seen = new Set<string>();
              let descDup = false;
              for (const d of descs) {
                if (seen.has(d)) { descDup = true; break; }
                seen.add(d);
              }
              if (descDup) issues.push('职业路径描述存在重复或过度相似');
              // teamRole must be noun roles (Chinese)
              const isCnRoleNoun = (s: string) => {
                const str = String(s || '').trim();
                if (!str) return false;
                if (/(者|师|经理|顾问|主管|总监|负责人|协调员|分析师|专员|架构师|工程师)$/.test(str)) return true;
                if (/^(主动|希望|推动|回应|支持|执行|协调|引导|带动)/.test(str)) return false;
                const len = [...str].length;
                return len >= 2 && len <= 8;
              };
              const badRoles = Array.isArray(data.teamRole) ? data.teamRole.some((r: any) => !isCnRoleNoun(String(r.point || r.title || ''))) : false;
              if (badRoles) issues.push('团队角色需为角色名词（如“协调员/顾问/经理/分析师”等），不得为描述性短语');
            }
            if (m === 'growth') {
              const g = data.growth || data;
              const checkList = (obj: any, key: string) => obj && obj[key] && Array.isArray(obj[key]) && obj[key].length >= 1;
              const isBalanced = (s: string) => {
                const stack: string[] = [];
                for (const ch of s) {
                  if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
                  if (ch === ')' || ch === ']' || ch === '}') {
                    const last = stack.pop();
                    if (!last) return false;
                    if (last === '(' && ch !== ')') return false;
                    if (last === '[' && ch !== ']') return false;
                    if (last === '{' && ch !== '}') return false;
                  }
                }
                return stack.length === 0;
              };
              const isCompleteSentence = (s: string) => {
                const str = String(s || '').trim();
                if (str.length < 20) return false;
                if (!isBalanced(str)) return false;
                return /[\\.!?)]$/.test(str);
              };
              const checkIntegrity = (arr: any[]) => Array.isArray(arr) && arr.length >= 1 && arr.every(item => isCompleteSentence(item));
              const isBalancedZh = (s: string) => {
                const stack: string[] = [];
                for (const ch of s) {
                  if (ch === '（' || ch === '【' || ch === '｛') stack.push(ch);
                  if (ch === '）' || ch === '】' || ch === '｝') {
                    const last = stack.pop();
                    if (!last) return false;
                    if (last === '（' && ch !== '）') return false;
                    if (last === '【' && ch !== '】') return false;
                    if (last === '｛' && ch !== '｝') return false;
                  }
                }
                return stack.length === 0;
              };
              const isCnRoleDesc = (s: string) => {
                const str = String(s || '').trim();
                const idx = str.indexOf('：');
                if (idx <= 0) return false;
                const role = str.slice(0, idx).trim();
                const desc = str.slice(idx + 1).trim();
                if (!role || !desc) return false;
                const roleLen = [...role].length;
                if (roleLen < 2 || roleLen > 8) return false;
                if (!isBalancedZh(desc)) return false;
                const endOk = /[。！？]$/.test(desc);
                if (!endOk) return false;
                const descLen = [...desc].length;
                if (descLen < 28 || descLen > 60) return false;
                if (/^(建议|请|应该|尽量|最好)/.test(desc)) return false;
                return true;
              };
              const checkIntegrityZh = (arr: any[]) => Array.isArray(arr) && arr.length === 1 && arr.every(item => isCnRoleDesc(String(item || '')));
              const enRoleTooAdjective = (s: string) => {
                const str = String(s || '').trim();
                const idx = str.indexOf(':');
                if (idx <= 0) return false;
                const role = str.slice(0, idx).trim();
                const tokens = role.split(/\\s+/).filter(Boolean);
                if (tokens.length > 4) return true;
                const banned = ['visionary','dynamic','thoughtful','steady','aesthetic','values-aligned','warm','loyal','intentional','engaging','conscientious','overloaded'];
                const lower = role.toLowerCase();
                return banned.some(w => lower.includes(w));
              };
              if (!(g && checkList(g.best, 'work') && checkList(g.best, 'rel') && checkList(g.daily, 'work') && checkList(g.daily, 'rel') && checkList(g.stress, 'work') && checkList(g.stress, 'rel'))) {
                issues.push('内在反应模式条目不足或未按格式');
              } else {
                if (lang === 'en') {
                  const enListsOk = checkIntegrity(g.best.work) && checkIntegrity(g.best.rel) &&
                    checkIntegrity(g.daily.work) && checkIntegrity(g.daily.rel) &&
                    checkIntegrity(g.stress.work) && checkIntegrity(g.stress.rel);
                  const roleAdjBad = [g.best.work, g.best.rel, g.daily.work, g.daily.rel, g.stress.work, g.stress.rel]
                    .some((arr: any[]) => Array.isArray(arr) && arr.some(v => enRoleTooAdjective(String(v || ''))));
                  if (!enListsOk) issues.push('内在反应模式条目不完整或句子不规范');
                  if (roleAdjBad) issues.push('Role 过长或含过多形容词');
                } else {
                  const zhListsOk = checkIntegrityZh(g.best.work) && checkIntegrityZh(g.best.rel) &&
                    checkIntegrityZh(g.daily.work) && checkIntegrityZh(g.daily.rel) &&
                    checkIntegrityZh(g.stress.work) && checkIntegrityZh(g.stress.rel);
                  if (!zhListsOk) issues.push('中文需“角色：描述”且长度与句式合规');
                }
              }
            }
            if (issues.length) {
              const strictConstraints = buildConstraintsForModule(m, lang) + (m === 'growth'
                ? (lang === 'en'
                  ? `\nSTRICT FORMAT:\n- Do not use numbering or bullets.\n- Each item MUST be "Role: Description".\n- Role (1–4 words, minimal adjectives), Description (28–60 words), single sentence, ends with . ! or ?\n- No line breaks; balanced quotes and brackets.\n- Exactly 1 item for each of best/daily/stress work/rel.`
                  : `\n严格格式：\n- 禁止使用序号或列表符。\n- 每条必须为“角色：描述”。\n- 角色为2–8个汉字的名词短语；描述为28–60字的单句，以“。/！/？”结尾。\n- 禁止换行；括号与引号成对闭合。\n- 每个 best/daily/stress 的 work/rel 均严格返回1条；不得出现以“建议/请/应该/尽量/最好”开头的条目。`)
                : (m === 'career'
                   ? (lang === 'en'
                      ? `\nUNIQUENESS:\n- Titles across strengths/blindSpots/teamRole/collaborationStyle/environment/traps MUST be unique.\n- Descriptions MUST be semantically different across lists; avoid rephrasing the same point.\n- Replace duplicates with more specific, context-rich items.\nROLE NOUNS:\n- teamRole items MUST be noun roles (e.g., Coordinator/Consultant/Manager/Analyst), not descriptive phrases.`
                      : `\n唯一性要求：\n- strengths/blindSpots/teamRole/collaborationStyle/environment/traps 的标题不可重复；\n- 各条描述需语义显著不同，避免同义改写；\n- 若出现重复，请替换为更具体且场景化的内容。\n角色名词要求：\n- teamRole 必须为角色名词（如 协调员/顾问/经理/分析师 等），不得使用“主动…/希望…/推动…”的描述性短语。`)
                   : ''));
              const doRefine = async (extraPrompt: string) => {
                const chosenModelRef = 'qwen-plus';
                if (provider === 'qwen') {
                  return callQwen({ mbti, mainType, subtype, lang, modules: [m], model: chosenModelRef, extra: extraPrompt });
                } else if (provider === 'minimax') {
                  return callMiniMax({ mbti, mainType, subtype, lang, modules: [m], model: chosenModelRef, extra: extraPrompt });
                } else if (provider === 'moonshot') {
                  return callMoonshot({ mbti, mainType, subtype, lang, modules: [m], model: chosenModelRef, extra: extraPrompt });
                }
                return callDeepSeek({ mbti, mainType, subtype, lang, modules: [m], model: chosenModelRef, extra: extraPrompt });
              };
              const refineOnce = async (currentIssues: string[]) => {
                const refinePrompt = buildRefineUserPrompt(lang, mbti, mainType, subtype, m, currentIssues, strictConstraints);
                return doRefine(refinePrompt);
              };
              refineOnce(issues)
                .then(async updated => {
                  // Re-validate after first refine; if still issues, do second refine
                  let updatedIssues: string[] = [];
                  try {
                    const dump = JSON.stringify(updated || {});
                    if (lang === 'en' && /[\u4e00-\u9fff]/.test(dump)) updatedIssues.push('English environment forbids Chinese');
                    if (m === 'growth') {
                      const g2 = (updated as any).growth || updated;
                      const okLen = (obj: any, key: string) => obj && obj[key] && Array.isArray(obj[key]) && obj[key].length === 1;
                      if (!(okLen(g2.best, 'work') && okLen(g2.best, 'rel') && okLen(g2.daily, 'work') && okLen(g2.daily, 'rel') && okLen(g2.stress, 'work') && okLen(g2.stress, 'rel'))) {
                        updatedIssues.push('Exactly 1 item required for each list');
                      }
                    }
                  } catch {}
                  if (updatedIssues.length) {
                    const refined2 = await refineOnce(updatedIssues).catch(() => null);
                    const payload2 = JSON.stringify({ m, data: refined2 || updated });
                    res.write(`event: refine\n`);
                    res.write(`data: ${payload2}\n\n`);
                  } else {
                    const payload2 = JSON.stringify({ m, data: updated });
                    res.write(`event: refine\n`);
                    res.write(`data: ${payload2}\n\n`);
                  }
                })
                .catch(() => {});
            }
          }
        }).catch(err => {
          const payload = JSON.stringify({ error: String(err?.message || err) });
          res.write(`event: error\n`);
          res.write(`data: ${payload}\n\n`);
        }).finally(() => {
          finished += 1;
          if (finished >= total) {
            res.write(`event: done\n`);
            res.write(`data: {}\n\n`);
            res.end();
          }
        });
      });
      
      req.on('close', () => {
        try {
          res.end();
        } catch {}
      });
  } catch (error: any) {
    try {
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify({ error: String(error?.message || error) })}\n\n`);
    } catch {}
    res.end();
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Keep process alive for debugging
  setInterval(() => {}, 10000);
});

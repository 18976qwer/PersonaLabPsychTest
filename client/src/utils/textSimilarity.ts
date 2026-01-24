export const normalizeText = (s: string) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const makeTokens = (s: string) => {
  const norm = normalizeText(s);
  if (!norm) return new Set<string>();
  const parts = norm.split(' ').filter(Boolean);
  return new Set(parts);
};

export const jaccardSimilarity = (a: string, b: string) => {
  const ta = makeTokens(a);
  const tb = makeTokens(b);
  if (ta.size === 0 && tb.size === 0) return 1;
  let inter = 0;
  for (const t of ta) {
    if (tb.has(t)) inter++;
  }
  const union = ta.size + tb.size - inter;
  return union === 0 ? 1 : inter / union;
};

export const isTitleDuplicate = (a: string, b: string) => {
  const na = normalizeText(a);
  const nb = normalizeText(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
};

export const filterDuplicates = <T extends { title?: string; desc?: string }>(
  list: T[],
  otherLists: T[][],
  descThresh = 0.8
): T[] => {
  const out: T[] = [];
  for (const item of list) {
    const t = String(item.title || '');
    const d = String(item.desc || '');
    let dup = false;
    // compare within out
    for (const exist of out) {
      if (isTitleDuplicate(t, String(exist.title || ''))) { dup = true; break; }
      if (jaccardSimilarity(d, String(exist.desc || '')) >= descThresh) { dup = true; break; }
    }
    // compare with other lists
    if (!dup) {
      for (const ol of otherLists) {
        for (const o of ol) {
          if (isTitleDuplicate(t, String(o.title || ''))) { dup = true; break; }
          if (jaccardSimilarity(d, String(o.desc || '')) >= descThresh) { dup = true; break; }
        }
        if (dup) break;
      }
    }
    if (!dup) out.push(item);
  }
  return out;
};

const ALLOWED_EN_WHITELIST = new Set([
  // MBTI types
  'entp','enfp','entj','enfj','estj','esfj','estp','esfp',
  'intj','intp','infj','infp','istj','isfj','istp','isfp',
  // common acronyms
  'kpi','okr','mbti',
  // functions
  'ni','ne','ti','te','fi','fe','si','se'
]);

export const sanitizeZh = (s: string) => {
  const text = String(s || '');
  // Remove standalone English words except whitelist
  return text.replace(/\b([A-Za-z][A-Za-z\-]{1,})\b/g, (m) => {
    const key = m.toLowerCase();
    return ALLOWED_EN_WHITELIST.has(key) ? m : '';
  }).replace(/\s+/g, ' ').trim();
};

import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import {
  FaSeedling,
  FaLevelUpAlt,
  FaChartLine,
  FaSun,
  FaCloudSun,
  FaCloudShowersHeavy,
  FaCrown,
  FaMedal,
  FaGem,
  FaExclamationTriangle
} from 'react-icons/fa';
import { ReportSection } from './ReportSection';
import { AnalysisResult } from '../../types/report';
import { useLanguage } from '../../context/LanguageContext';
import { AIReportData } from '../../utils/ai';
import { sanitizeZh } from '../../utils/textSimilarity';
import {
  DesktopTableContainer,
  MobileCardContainer,
  MobileCard,
  CardRow,
  ProcessList,
  ProcessItem,
  ProcessContent
} from '../common/ResponsiveStyles';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const SkeletonBlock = styled.div<{ width?: string; height?: string }>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '1.5rem'};
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const TableWrapper = styled(DesktopTableContainer)`
  margin-bottom: 2.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid rgba(0,0,0,0.05);
  background: ${({ theme }) => theme.colors.white};
`;

const BaseTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 800px;

  th, td {
    padding: 1.1rem;
    text-align: left;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    vertical-align: top;
  }

  th {
    background: ${({ theme }) => `${theme.colors.primary}10`}; // 10% opacity
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 0.95rem;
    white-space: nowrap;
    
    &:first-child {
      border-top-left-radius: ${({ theme }) => theme.borderRadius.medium};
    }
    
    &:last-child {
      border-top-right-radius: ${({ theme }) => theme.borderRadius.medium};
    }
  }

  td {
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
    
    &:first-child {
      font-weight: 600;
    }
  }
  
  tr:last-child td {
    border-bottom: none;
    
    &:first-child {
      border-bottom-left-radius: ${({ theme }) => theme.borderRadius.medium};
    }
    
    &:last-child {
      border-bottom-right-radius: ${({ theme }) => theme.borderRadius.medium};
    }
  }
  
  tr:hover td {
    background: ${({ theme }) => `${theme.colors.background}80`};
  }
`;

const ReactionTable = styled(BaseTable)`
  th:first-child { width: 120px; }
`;

const RankingTable = styled(BaseTable)`
  th:first-child { width: 180px; }
  th:nth-child(2) { width: 22%; }
  th:nth-child(3) { width: 40%; }
  th:nth-child(4) { width: 28%; }
  
  td:first-child { width: 180px; }
  
  td {
    border-top: none;
    border-bottom: none;
  }
  
  thead tr {
    background: #f7fafc;
  }
  
  tbody tr:nth-child(odd) {
    background: #f9fafb;
  }
  
  tbody tr:nth-child(even) {
    background: #ffffff;
  }
  
  tbody tr:hover {
    background: #edf2f7;
  }
`;

const StateBadge = styled.span<{ $state: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.9rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  
  ${({ $state, theme }) => {
    if ($state.includes('最佳')) return `background: ${theme.colors.success}20; color: ${theme.colors.success};`;
    if ($state.includes('压力')) return `background: ${theme.colors.error}20; color: ${theme.colors.error};`;
    return `background: ${theme.colors.primary}15; color: ${theme.colors.primary};`;
  }}
`;

const pulse = keyframes`
  0% { opacity: 0.8; transform: scale(0.98); }
  50% { opacity: 1; transform: scale(1.02); }
  100% { opacity: 0.8; transform: scale(0.98); }
`;

const LevelBadge = styled.span<{ $level: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.8rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  animation: ${pulse} 2s infinite ease-in-out;
  
  svg {
    font-size: 1.1em;
  }

  ${({ $level, theme }) => {
    // Req C: Primary background, 10% brightness gradient
    if ($level.includes('顶尖')) {
      return `background: ${theme.colors.primary}; color: ${theme.colors.white};`; 
    }
    if ($level.includes('显著')) {
      return `background: ${theme.colors.primary}CC; color: ${theme.colors.white};`;
    }
    if ($level.includes('优势')) {
      return `background: ${theme.colors.primary}99; color: ${theme.colors.white};`;
    }
    if ($level.includes('需留意') || $level.includes('弱项') || $level.includes('短板')) {
      return `background: ${theme.colors.primary}33; color: ${theme.colors.text};`;
    }
    return `background: ${theme.colors.primary}1A; color: ${theme.colors.text};`;
  }}
`;

const LevelText = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textLight};
  visibility: hidden;
`;

const LevelDescription = styled.div`
  margin-top: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textLight};
  opacity: 0.9;
`;

const ListUl = styled.ul`
  margin: 0;
  padding-left: 0;
  list-style-type: none;
  
  li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
  }
  
  strong {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
  }
`;

const SubHeader = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  line-height: 1.6;
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

interface Props {
  data: AnalysisResult['personalGrowth'];
  aiReport?: AIReportData | null;
  isAiEnabled?: boolean;
  aiLoading?: boolean;
  onToggleAi?: () => void;
  showAiToggle?: boolean;
}

const splitReactionList = (text: string, maxItems = 2): string[] => {
  if (!text) {
    return [];
  }
  const merged = text
    .split(/[\n\r]/)
    .map(s => s.trim())
    .filter(Boolean)
    .join(' ');
  // English模式易因句点拆分导致半句；仅按分号与中文分号拆分
  let segments = merged
    .split(/[；;]/)
    .map(s => s.trim())
    .filter(Boolean);
  if (!segments.length) {
    segments = [merged];
  }
  if (segments.length === 1) {
    const subSegments = segments[0]
      .split(/[，;]/) // 避免按英文逗号拆分导致半句
      .map(s => s.trim())
      .filter(Boolean);
    if (subSegments.length > 1) {
      segments = subSegments;
    }
  }
  if (segments.length > maxItems) {
      segments = segments.slice(0, maxItems);
    }
    return segments;
  };

const parseReactionItem = (text: string) => {
  if (!text) {
    return { label: '', desc: '' };
  }
  const enColonIndex = text.indexOf(':');
  if (enColonIndex !== -1) {
    const label = text.slice(0, enColonIndex).trim();
    const desc = text.slice(enColonIndex + 1).trim();
    return { label, desc };
  }
  const colonIndex = text.indexOf('：');
  if (colonIndex !== -1) {
    const label = text.slice(0, colonIndex).trim();
    const desc = text.slice(colonIndex + 1).trim();
    return { label, desc };
  }
  const commaIndex = text.indexOf('，');
  if (commaIndex !== -1) {
    const label = text.slice(0, commaIndex).trim();
    const desc = text.slice(commaIndex + 1).replace(/^[，。；、\s]+/g, '').trim();
    return { label, desc };
  }
  return { label: '', desc: text };
};

const stripSuggestion = (text: string, lang: 'zh' | 'en') => {
  const s = String(text || '').trim();
  if (!s) return '';
  if (lang === 'zh') {
    const first = s.split(/[。！？]/)[0] || s;
    return first.replace(/^(建议|请|应该|尽量|最好)[^\u4e00-\u9fff]*?/g, '').trim();
  }
  // Remove suggestion tail introduced by em-dash or hyphen
  let out = s.replace(/\s*—.*$/, '').replace(/\s*-\s*suggest.*$/i, '');
  // Remove parenthetical fragments
  out = out.replace(/\s*\([^)]*\)/g, '').trim();
  // Keep only the first sentence segment if multiple
  out = (out.split(/[.!?]/)[0] || out).trim();
  // Ensure terminal punctuation
  if (!/[.!?)]$/.test(out)) out = `${out}.`;
  return out;
};

const isSuggestionStart = (text: string, lang: 'zh' | 'en') => {
  const s = String(text || '').trim();
  if (lang === 'zh') return /^(建议|请|应该|尽量|最好)/.test(s);
  return /^(set|pause|ask|name|avoid|schedule|create|practice|try|delegate|text|send|write|plan|hold|keep|add|convert|choose)\b/i.test(s);
};
const getStateKey = (state: string) => {
  if (state.includes('最佳')) {
    return 'best';
  }
  if (state.includes('日常')) {
    return 'daily';
  }
  if (state.includes('压力')) {
    return 'stress';
  }
  return 'other';
};

const getStateIcon = (state: string) => {
  const key = getStateKey(state);
  if (key === 'best') {
    return <FaSun />;
  }
  if (key === 'stress') {
    return <FaCloudShowersHeavy />;
  }
  return <FaCloudSun />;
};

const getLevelIcon = (level: string) => {
  if (level.includes('顶尖')) {
    return <FaCrown />;
  }
  if (level.includes('显著')) {
    return <FaGem />;
  }
  if (level.includes('优势')) {
    return <FaMedal />;
  }
  return <FaExclamationTriangle />;
};

const getLevelDescriptionKey = (level: string) => {
  if (level.includes('顶尖')) {
    return 'top';
  }
  if (level.includes('显著')) {
    return 'significant';
  }
  if (level.includes('优势')) {
    return 'advantage';
  }
  return 'attention';
};

const getStateColor = (state: string, theme: any) => {
  const key = getStateKey(state);
  if (key === 'best') return theme.colors.success;
  if (key === 'stress') return theme.colors.error;
  return theme.colors.primary;
};

export const PersonalGrowthSection: React.FC<Props> = ({ 
  data, 
  aiReport, 
  isAiEnabled = false, 
  aiLoading = false,
  onToggleAi,
  showAiToggle = false
}) => {
  const { t, language } = useLanguage();
  const theme = useTheme();

  const useAiGrowth = Boolean(isAiEnabled && aiReport && (aiReport as any).growth);

  const useAiRanking =
    Boolean(
      isAiEnabled &&
        aiReport &&
        (aiReport as any).ranking &&
        (
          (Array.isArray((aiReport as any).ranking.top5Talents) &&
           Array.isArray((aiReport as any).ranking.top10Abilities) &&
           Array.isArray((aiReport as any).ranking.bottom10Weaknesses)) ||
          (Array.isArray((aiReport as any).ranking.top3Talents) &&
           Array.isArray((aiReport as any).ranking.top3Abilities) &&
           Array.isArray((aiReport as any).ranking.bottom3Weaknesses))
        )
    );

  const isNonEmptyArray = (v: any) => Array.isArray(v) && v.length > 0;
  const reactionData = useAiGrowth
    ? (() => {
        const rows = [
          { ...(aiReport as any).growth.best, state: '最佳状态' },
          { ...(aiReport as any).growth.daily, state: '日常状态' },
          { ...(aiReport as any).growth.stress, state: '压力状态' }
        ].map(item => ({
          state: item.state,
          work: splitReactionList(item.work),
          relation: splitReactionList(item.rel),
          feeling: item.feeling,
          entry: item.how
        }));
        if (!isNonEmptyArray(rows) || rows.some(r => !isNonEmptyArray(r.work) || !isNonEmptyArray(r.relation))) {
          return data.reactionTable;
        }
        return rows;
      })()
    : data.reactionTable;

  const strengthsData = useAiRanking
    ? (() => {
        const rows = [
          ...(((aiReport as any).ranking.top5Talents || (aiReport as any).ranking.top3Talents || []).slice(0, 1).map((item: any) => ({
            level: '顶尖天赋',
            field: item.area,
            desc: item.desc,
            improvement: item.improve
          }))),
          ...(((aiReport as any).ranking.top10Abilities || (aiReport as any).ranking.top3Abilities || []).slice(0, 3).map((item: any) => ({
            level: '显著才能',
            field: item.area,
            desc: item.desc,
            improvement: item.improve
          }))),
          ...(Array.isArray((aiReport as any).ranking.absoluteField)
            ? (aiReport as any).ranking.absoluteField.slice(0, 3).map((item: any) => ({
                level: '优势领域',
                field: item.area,
                desc: item.desc,
                improvement: item.improve
              }))
            : []),
          ...(((aiReport as any).ranking.bottom10Weaknesses || (aiReport as any).ranking.bottom3Weaknesses || []).slice(0, 3).map((item: any) => ({
            level: '需留意领域',
            field: item.area,
            desc: item.desc,
            improvement: item.improve
          })))
        ];
        const norm = (s: string) => String(s || '').toLowerCase().trim();
        const seen = new Set<string>();
        const deduped: any[] = [];
        for (const r of rows) {
          const key = norm(r.field);
          if (key && !seen.has(key)) {
            deduped.push(r);
            seen.add(key);
          }
        }
        // Ensure minimum items by merging fallback
        const minTotal = 6;
        let out = deduped;
        if (out.length < minTotal) {
          for (const fb of data.strengthsAnalysis) {
            if (out.length >= minTotal) break;
            const key = norm((fb as any).field);
            if (!seen.has(key)) {
              out.push(fb as any);
              seen.add(key);
            }
          }
        }
        if (!isNonEmptyArray(out)) {
          return data.strengthsAnalysis;
        }
        return out;
      })()
    : data.strengthsAnalysis;
    
  const showLoading = isAiEnabled && aiLoading && !useAiGrowth;

  return (
    <ReportSection 
      id="growth" 
      title={t('report.growth')} 
      icon={FaSeedling}
      onToggleAi={onToggleAi}
      isAiEnabled={isAiEnabled}
      showAiToggle={showAiToggle}
    >
      
      <SubHeader><FaChartLine /> {t('report.growthSection.reactionTitle')}</SubHeader>
      
      {/* Desktop View */}
      <TableWrapper>
        <ReactionTable>
          <thead>
            <tr>
              <th>{t('report.growthSection.reaction.state')}</th>
              <th style={{ width: '25%' }}>{t('report.growthSection.reaction.work')}</th>
              <th style={{ width: '25%' }}>{t('report.growthSection.reaction.relation')}</th>
              <th>{t('report.growthSection.reaction.feeling')}</th>
              <th>{t('report.growthSection.reaction.entry')}</th>
            </tr>
          </thead>
          <tbody>
            {showLoading ? (
              // Loading Skeleton Rows
              [1, 2].map(i => (
                <tr key={i}>
                  <td><SkeletonBlock width="80px" /></td>
                  <td><SkeletonBlock /><SkeletonBlock width="80%" /></td>
                  <td><SkeletonBlock /><SkeletonBlock width="80%" /></td>
                  <td><SkeletonBlock /></td>
                  <td><SkeletonBlock /></td>
                </tr>
              ))
            ) : (
              reactionData.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <StateBadge $state={row.state}>
                    {getStateIcon(row.state)}
                    {t(`report.growthSection.reaction.stateLabel.${getStateKey(row.state)}`)}
                  </StateBadge>
                </td>
                <td>
                  <ListUl>
                    {row.work
                      .map((item: string) => {
                        const { label, desc } = parseReactionItem(item);
                        let cleaned = stripSuggestion(desc, language);
                        if (language === 'zh') cleaned = sanitizeZh(cleaned);
                        return { label, desc: cleaned };
                      })
                      .filter(it => it.label && it.desc && !isSuggestionStart(it.desc, language))
                      .slice(0,1)
                      .map((it, i) => (
                        <li key={i}>
                          <strong>{it.label}：</strong>
                          {it.desc}
                        </li>
                      ))}
                  </ListUl>
                </td>
                <td>
                  <ListUl>
                    {row.relation
                      .map((item: string) => {
                        const { label, desc } = parseReactionItem(item);
                        let cleaned = stripSuggestion(desc, language);
                        if (language === 'zh') cleaned = sanitizeZh(cleaned);
                        return { label, desc: cleaned };
                      })
                      .filter(it => it.label && it.desc && !isSuggestionStart(it.desc, language))
                      .slice(0,1)
                      .map((it, i) => (
                        <li key={i}>
                          <strong>{it.label}：</strong>
                          {it.desc}
                        </li>
                      ))}
                  </ListUl>
                </td>
                <td>{row.feeling}</td>
                <td>{row.entry}</td>
              </tr>
            )))}
          </tbody>
        </ReactionTable>
      </TableWrapper>

      {/* Mobile View */}
      <MobileCardContainer>
        {showLoading ? (
           [1, 2].map(i => (
             <MobileCard key={i}>
               <SkeletonBlock width="100px" style={{marginBottom: '1rem'}} />
               <SkeletonBlock />
               <SkeletonBlock width="80%" />
               <SkeletonBlock style={{marginTop: '1rem'}} />
               <SkeletonBlock width="60%" />
             </MobileCard>
           ))
        ) : (
          reactionData.map((row, idx) => (
          <MobileCard key={idx} $borderColor={getStateColor(row.state, theme)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <StateBadge $state={row.state}>
                {getStateIcon(row.state)}
                {t(`report.growthSection.reaction.stateLabel.${getStateKey(row.state)}`)}
              </StateBadge>
            </div>
            
            <CardRow>
              <strong>{t('report.growthSection.reaction.work')}</strong>
              <ProcessList>
                {row.work
                  .map((item: string) => {
                    const { label, desc } = parseReactionItem(item);
                    const cleaned = stripSuggestion(desc, language);
                    return { label, desc: cleaned };
                  })
                  .filter(it => it.label && it.desc && !isSuggestionStart(it.desc, language))
                  .slice(0,1)
                  .map((it, i) => (
                    <ProcessItem key={i}>
                      <ProcessContent>
                        <p><strong>{it.label}：</strong>{it.desc}</p>
                      </ProcessContent>
                    </ProcessItem>
                  ))}
              </ProcessList>
            </CardRow>

            <CardRow>
              <strong>{t('report.growthSection.reaction.relationShort')}</strong>
              <ProcessList>
                {row.relation
                  .map((item: string) => {
                    const { label, desc } = parseReactionItem(item);
                    const cleaned = stripSuggestion(desc, language);
                    return { label, desc: cleaned };
                  })
                  .filter(it => it.label && it.desc && !isSuggestionStart(it.desc, language))
                  .slice(0,1)
                  .map((it, i) => (
                    <ProcessItem key={i}>
                      <ProcessContent>
                        <p><strong>{it.label}：</strong>{it.desc}</p>
                      </ProcessContent>
                    </ProcessItem>
                  ))}
              </ProcessList>
            </CardRow>
            
            <CardRow>
              <strong>{t('report.growthSection.reaction.feeling')}</strong>
              <p>{row.feeling}</p>
            </CardRow>
            
            <CardRow>
              <strong>{t('report.growthSection.reaction.entry')}</strong>
              <p>{row.entry}</p>
            </CardRow>
          </MobileCard>
        )))}
      </MobileCardContainer>

      <SubHeader style={{ marginTop: '2rem' }}><FaLevelUpAlt /> {t('report.growthSection.rankingTitle')}</SubHeader>
      
      {/* Desktop View */}
      <TableWrapper>
        <RankingTable>
          <thead>
            <tr>
              <th>{t('report.growthSection.ranking.level')}</th>
              <th>{t('report.growthSection.ranking.field')}</th>
              <th>{t('report.growthSection.ranking.desc')}</th>
              <th>{t('report.growthSection.ranking.improvement')}</th>
            </tr>
          </thead>
          <tbody>
            {showLoading ? (
               [1, 2, 3, 4].map(i => (
                 <tr key={i}>
                   <td><SkeletonBlock width="100px" /></td>
                   <td><SkeletonBlock width="120px" /></td>
                   <td><SkeletonBlock /></td>
                   <td><SkeletonBlock /></td>
                 </tr>
               ))
            ) : (
              strengthsData.map((row, idx) => {
              const showBadge =
                idx === 0 || row.level !== strengthsData[idx - 1].level;

              return (
                <tr key={idx}>
                  <td>
                    {showBadge ? (
                      <>
                        <LevelBadge $level={row.level}>
                          {getLevelIcon(row.level)}
                          <span>{t(`report.growthSection.levels.${getLevelDescriptionKey(row.level)}.label`)}</span>
                        </LevelBadge>
                        <LevelDescription>
                          {t(`report.growthSection.levels.${getLevelDescriptionKey(row.level)}.description`)}
                        </LevelDescription>
                      </>
                    ) : (
                      <LevelText>{row.level}</LevelText>
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>{row.field}</td>
                  <td>{row.desc}</td>
                  <td>{row.improvement}</td>
                </tr>
              );
            }))}
          </tbody>
        </RankingTable>
      </TableWrapper>

      {/* Mobile View */}
      <MobileCardContainer>
        {showLoading ? (
          [1, 2, 3, 4].map(i => (
            <MobileCard key={i}>
               <SkeletonBlock width="100px" style={{marginBottom: '0.5rem'}} />
               <SkeletonBlock width="40%" style={{marginBottom: '1rem'}} />
               <SkeletonBlock />
               <SkeletonBlock width="80%" />
            </MobileCard>
          ))
        ) : (
          strengthsData.map((row, idx) => (
          <MobileCard key={idx}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <LevelBadge $level={row.level}>
                {getLevelIcon(row.level)}
                <span>{t(`report.growthSection.levels.${getLevelDescriptionKey(row.level)}.label`)}</span>
              </LevelBadge>
            </div>
            
            <CardRow>
              <strong>{t('report.growthSection.ranking.field')}</strong>
              <p style={{ fontWeight: 600 }}>{row.field}</p>
            </CardRow>
            
            <CardRow>
              <strong>{t('report.growthSection.ranking.descMobile')}</strong>
              <p>{row.desc}</p>
            </CardRow>
            
            <CardRow>
              <strong>{t('report.growthSection.ranking.improvement')}</strong>
              <p>{row.improvement}</p>
            </CardRow>
          </MobileCard>
        )))}
      </MobileCardContainer>

    </ReportSection>
  );
};

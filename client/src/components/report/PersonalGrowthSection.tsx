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
  padding-left: 1.4rem;
  list-style-type: decimal;
  
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

const splitReactionList = (text: string, maxItems = 3): string[] => {
  if (!text) {
    return [];
  }
  const merged = text
    .split(/[\n\r]/)
    .map(s => s.trim())
    .filter(Boolean)
    .join(' ');
  let segments = merged
    .split(/[；;。.!?]/)
    .map(s => s.trim())
    .filter(Boolean);
  if (!segments.length) {
    segments = [merged];
  }
  if (segments.length === 1) {
    const subSegments = segments[0]
      .split(/[，,]/)
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
  const { t } = useLanguage();
  const theme = useTheme();

  const useAiGrowth = Boolean(isAiEnabled && aiReport && (aiReport as any).growth);

  const useAiRanking =
    Boolean(
      isAiEnabled &&
        aiReport &&
        (aiReport as any).ranking &&
        Array.isArray((aiReport as any).ranking.top5Talents) &&
        Array.isArray((aiReport as any).ranking.top10Abilities) &&
        Array.isArray((aiReport as any).ranking.bottom10Weaknesses)
    );

  const reactionData = useAiGrowth
    ? [
        { ...(aiReport as any).growth.best, state: '最佳状态' },
        { ...(aiReport as any).growth.daily, state: '日常状态' },
        { ...(aiReport as any).growth.stress, state: '压力状态' }
      ].map(item => ({
        state: item.state,
        work: splitReactionList(item.work),
        relation: splitReactionList(item.rel),
        feeling: item.feeling,
        entry: item.how
      }))
    : data.reactionTable;

  const strengthsData = useAiRanking
    ? [
        ...(aiReport as any).ranking.top5Talents.slice(0, 1).map((item: any) => ({
          level: '顶尖天赋',
          field: item.area,
          desc: item.desc,
          improvement: item.improve
        })),
        ...(aiReport as any).ranking.top10Abilities.slice(0, 3).map((item: any) => ({
          level: '显著才能',
          field: item.area,
          desc: item.desc,
          improvement: item.improve
        })),
        ...(Array.isArray((aiReport as any).ranking.absoluteField)
          ? (aiReport as any).ranking.absoluteField.slice(0, 3).map((item: any) => ({
              level: '优势领域',
              field: item.area,
              desc: item.desc,
              improvement: item.improve
            }))
          : []),
        ...(aiReport as any).ranking.bottom10Weaknesses.slice(0, 3).map((item: any) => ({
          level: '需留意领域',
          field: item.area,
          desc: item.desc,
          improvement: item.improve
        }))
      ]
    : data.strengthsAnalysis;

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
            {(isAiEnabled && aiLoading ? data.reactionTable : reactionData).map((row, idx) => (
              <tr key={idx}>
                <td>
                  <StateBadge $state={row.state}>
                    {getStateIcon(row.state)}
                    {t(`report.growthSection.reaction.stateLabel.${getStateKey(row.state)}`)}
                  </StateBadge>
                </td>
                {isAiEnabled && aiLoading ? (
                  <>
                    <td><SkeletonBlock /><SkeletonBlock width="80%" /><SkeletonBlock width="90%" /></td>
                    <td><SkeletonBlock /><SkeletonBlock width="80%" /><SkeletonBlock width="90%" /></td>
                    <td><SkeletonBlock height="4rem" /></td>
                    <td><SkeletonBlock height="4rem" /></td>
                  </>
                ) : (
                  <>
                    <td>
                      <ListUl>
                        {row.work.map((item: string, i: number) => {
                          const { label, desc } = parseReactionItem(item);
                          return (
                            <li key={i}>
                              {label ? (
                                <>
                                  <strong>{label}：</strong>
                                  {desc}
                                </>
                              ) : (
                                item
                              )}
                            </li>
                          );
                        })}
                      </ListUl>
                    </td>
                    <td>
                      <ListUl>
                        {row.relation.map((item: string, i: number) => {
                          const { label, desc } = parseReactionItem(item);
                          return (
                            <li key={i}>
                              {label ? (
                                <>
                                  <strong>{label}：</strong>
                                  {desc}
                                </>
                              ) : (
                                item
                              )}
                            </li>
                          );
                        })}
                      </ListUl>
                    </td>
                    <td>{row.feeling}</td>
                    <td>{row.entry}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </ReactionTable>
      </TableWrapper>

      {/* Mobile View */}
      <MobileCardContainer>
        {(isAiEnabled && aiLoading ? data.reactionTable : reactionData).map((row, idx) => (
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
                {row.work.map((item: string, i: number) => (
                  <ProcessItem key={i}>
                    <ProcessContent>
                      <p>{item}</p>
                    </ProcessContent>
                  </ProcessItem>
                ))}
              </ProcessList>
            </CardRow>

            <CardRow>
              <strong>{t('report.growthSection.reaction.relationShort')}</strong>
              <ProcessList>
                {row.relation.map((item: string, i: number) => (
                  <ProcessItem key={i}>
                    <ProcessContent>
                      <p>{item}</p>
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
        ))}
      </MobileCardContainer>

      <SubHeader style={{ marginTop: '3rem' }}><FaLevelUpAlt /> {t('report.growthSection.rankingTitle')}</SubHeader>
      
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
            {(isAiEnabled && aiLoading ? data.strengthsAnalysis : strengthsData).map((row, idx) => {
              const showBadge =
                idx === 0 || row.level !== (isAiEnabled && aiLoading ? data.strengthsAnalysis : strengthsData)[idx - 1].level;

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
                  {isAiEnabled && aiLoading ? (
                    <>
                      <td><SkeletonBlock width="120px" /></td>
                      <td><SkeletonBlock /></td>
                      <td><SkeletonBlock /></td>
                    </>
                  ) : (
                    <>
                      <td style={{ fontWeight: 500 }}>{row.field}</td>
                      <td>{row.desc}</td>
                      <td>{row.improvement}</td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </RankingTable>
      </TableWrapper>

      {/* Mobile View */}
      <MobileCardContainer>
        {(isAiEnabled && aiLoading ? data.strengthsAnalysis : strengthsData).map((row, idx) => (
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
        ))}
      </MobileCardContainer>

    </ReportSection>
  );
};

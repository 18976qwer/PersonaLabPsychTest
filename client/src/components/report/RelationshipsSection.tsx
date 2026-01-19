import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import { FaUserFriends, FaComments, FaHeart, FaThumbsUp, FaExclamationCircle } from 'react-icons/fa';
import { ReportSection } from './ReportSection';
import { AnalysisResult } from '../../types/report';
import { useLanguage } from '../../context/LanguageContext';
import { AIReportData } from '../../utils/ai';
import {
  DesktopTableContainer,
  MobileCardContainer,
  MobileCard,
  CardRow
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
  margin-bottom: 3rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.background};
`;

const CommTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.background};
  }

  th {
    background: ${({ theme }) => `${theme.colors.background}80`};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }

  td {
    vertical-align: top;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const IntimacyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContentBox = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.hover};
    border-color: ${({ theme }) => `${theme.colors.primary}40`};
  }
  
  h4 {
    margin-top: 0;
    color: ${({ theme }) => theme.colors.textLight};
    border-bottom: 2px solid ${({ theme }) => theme.colors.background};
    padding-bottom: 0.8rem;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
  
  ul {
    margin: 0;
    padding-left: 1.6rem;
    list-style-type: decimal;
    
    li {
      margin-bottom: 0.6rem;
      line-height: 1.5;
      color: ${({ theme }) => theme.colors.text};
    }
  }
`;

const GrowthContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GrowthCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  padding: 1.8rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.card};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
  
  h4 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const NumberBadge = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #F08080;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const ContentItem = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.textLight};
    line-height: 1.6;
    padding-left: 0.8rem;
    border-left: 3px solid #F08080;
  }
`;

const SubHeader = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

interface Props {
  data: AnalysisResult['relationships'];
  aiReport?: AIReportData | null;
  isAiEnabled?: boolean;
  aiLoading?: boolean;
  onToggleAi?: () => void;
  showAiToggle?: boolean;
}

export const RelationshipsSection: React.FC<Props> = ({ 
  data, 
  aiReport, 
  isAiEnabled = false, 
  aiLoading = false,
  onToggleAi,
  showAiToggle = false
}) => {
  const { t } = useLanguage();
  const theme = useTheme();

  const useAiRelationships = Boolean(isAiEnabled && aiReport && (aiReport as any).relationships);

  const communicationData = useAiRelationships &&
    Array.isArray((aiReport as any).relationships.communication)
      ? (aiReport as any).relationships.communication.map((item: any) => ({
          misunderstanding: item.mistake,
          reason: item.cause,
          adjustment: item.adjustment
        }))
      : data.communicationTable;

  const intimacyStrengths = useAiRelationships &&
    (aiReport as any).relationships.intimacy &&
    Array.isArray((aiReport as any).relationships.intimacy.strengths)
      ? (aiReport as any).relationships.intimacy.strengths
      : data.intimacy.strengths;

  const intimacyChallenges = useAiRelationships &&
    (aiReport as any).relationships.intimacy &&
    Array.isArray((aiReport as any).relationships.intimacy.challenges)
      ? (aiReport as any).relationships.intimacy.challenges
      : data.intimacy.challenges;
  
  const growthData = useAiRelationships &&
    (aiReport as any).relationships.intimacy &&
    (aiReport as any).relationships.intimacy.growth
      ? {
          awareness: (aiReport as any).relationships.intimacy.growth.consciousness,
          skill: (aiReport as any).relationships.intimacy.growth.skill,
          pattern: (aiReport as any).relationships.intimacy.growth.pattern
        }
      : data.intimacy.growth;

  if (isAiEnabled && aiLoading) {
    return (
      <ReportSection 
        id="relationships" 
        title={t('report.relationships')} 
        icon={FaUserFriends}
        onToggleAi={onToggleAi}
        isAiEnabled={isAiEnabled}
        showAiToggle={showAiToggle}
      >
        <SubHeader><FaComments /> {t('report.relationshipsSection.communication.title')}</SubHeader>
        <TableWrapper>
          <CommTable>
            <thead>
              <tr>
                <th style={{ width: '30%' }}>{t('report.relationshipsSection.communication.misunderstanding')}</th>
                <th style={{ width: '35%' }}>{t('report.relationshipsSection.communication.reason')}</th>
                <th style={{ width: '35%' }}>{t('report.relationshipsSection.communication.adjustment')}</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map(i => (
                <tr key={i}>
                  <td><SkeletonBlock width="90%" /></td>
                  <td><SkeletonBlock width="95%" /></td>
                  <td><SkeletonBlock width="90%" /></td>
                </tr>
              ))}
            </tbody>
          </CommTable>
        </TableWrapper>

        <SubHeader><FaHeart /> {t('report.relationshipsSection.intimacy.title')}</SubHeader>
        <IntimacyGrid>
          <ContentBox>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaThumbsUp /> {t('report.relationshipsSection.intimacy.strengthsTitle')}
            </h4>
            <ul>
              {[1, 2, 3].map(i => (
                <li key={i}><SkeletonBlock width="90%" /></li>
              ))}
            </ul>
          </ContentBox>
          <ContentBox>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaExclamationCircle /> {t('report.relationshipsSection.intimacy.challengesTitle')}
            </h4>
            <ul>
              {[1, 2, 3].map(i => (
                <li key={i}><SkeletonBlock width="90%" /></li>
              ))}
            </ul>
          </ContentBox>
        </IntimacyGrid>

        <SubHeader><FaHeart /> {t('report.relationshipsSection.growth.title')}</SubHeader>
        <GrowthContainer>
          {[1, 2, 3].map(i => (
            <GrowthCard key={i}>
              <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <SkeletonBlock width="2rem" height="2rem" style={{ borderRadius: '50%' }} />
                <SkeletonBlock width="60%" height="2rem" />
              </div>
              <SkeletonBlock height="1.2rem" width="40%" style={{ marginBottom: '0.5rem' }} />
              <SkeletonBlock height="3rem" style={{ marginBottom: '1.5rem' }} />
              <SkeletonBlock height="1.2rem" width="40%" style={{ marginBottom: '0.5rem' }} />
              <SkeletonBlock height="3rem" />
            </GrowthCard>
          ))}
        </GrowthContainer>
      </ReportSection>
    );
  }

  return (
    <ReportSection 
      id="relationships" 
      title={t('report.relationships')} 
      icon={FaUserFriends}
      onToggleAi={onToggleAi}
      isAiEnabled={isAiEnabled}
      showAiToggle={showAiToggle}
    >
      
      <SubHeader><FaComments /> {t('report.relationshipsSection.communication.title')}</SubHeader>
      
      {/* Desktop Table View */}
      <TableWrapper>
        <CommTable>
          <thead>
            <tr>
              <th style={{ width: '30%' }}>{t('report.relationshipsSection.communication.misunderstanding')}</th>
              <th style={{ width: '35%' }}>{t('report.relationshipsSection.communication.reason')}</th>
              <th style={{ width: '35%' }}>{t('report.relationshipsSection.communication.adjustment')}</th>
            </tr>
          </thead>
          <tbody>
            {communicationData.map(
              (
                row: { misunderstanding: string; reason: string; adjustment: string },
                idx: number
              ) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{row.misunderstanding}</td>
                  <td style={{ color: 'inherit' }}>{row.reason}</td>
                  <td style={{ fontWeight: 500 }}>{row.adjustment}</td>
                </tr>
              )
            )}
          </tbody>
        </CommTable>
      </TableWrapper>

      {/* Mobile Card View */}
      <MobileCardContainer>
        {communicationData.map(
          (
            row: { misunderstanding: string; reason: string; adjustment: string },
            idx: number
          ) => (
            <MobileCard key={idx} $borderColor={theme.colors.secondary}>
               <CardRow>
                 <strong>{t('report.relationshipsSection.communication.misunderstanding')}</strong>
                 <p style={{ fontWeight: 600 }}>{row.misunderstanding}</p>
               </CardRow>
               <CardRow>
                 <strong>{t('report.relationshipsSection.communication.reasonShort')}</strong>
                 <p>{row.reason}</p>
               </CardRow>
               <CardRow>
                 <strong>{t('report.relationshipsSection.communication.adjustmentShort')}</strong>
                 <p>{row.adjustment}</p>
               </CardRow>
            </MobileCard>
          )
        )}
      </MobileCardContainer>

      <SubHeader style={{ marginTop: '2rem' }}><FaHeart /> {t('report.relationshipsSection.intimacy.title')}</SubHeader>
      <IntimacyGrid>
        <ContentBox>
          <h4 style={{ color: theme.colors.success, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaThumbsUp /> {t('report.relationshipsSection.intimacy.strengthsTitle')}
          </h4>
          <ul>
            {intimacyStrengths.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </ContentBox>
        <ContentBox>
          <h4 style={{ color: theme.colors.error, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaExclamationCircle /> {t('report.relationshipsSection.intimacy.challengesTitle')}
          </h4>
          <ul>
            {intimacyChallenges.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </ContentBox>
      </IntimacyGrid>

      <SubHeader style={{ marginTop: '2rem' }}><FaHeart /> {t('report.relationshipsSection.growth.title')}</SubHeader>
      <GrowthContainer>
        {[
          { title: t('report.relationshipsSection.growth.awarenessTitle'), data: growthData.awareness, number: 1 },
          { title: t('report.relationshipsSection.growth.skillTitle'), data: growthData.skill, number: 2 },
          { title: t('report.relationshipsSection.growth.patternTitle'), data: growthData.pattern, number: 3 },
        ].map(
          (
            section: {
              title: string;
              data: { title: string; desc: string }[];
              number: number;
            },
            idx: number
          ) => (
            <GrowthCard key={idx}>
              <CardHeader>
                <NumberBadge>{section.number}</NumberBadge>
                <h4>{section.title}</h4>
              </CardHeader>
              <div>
                {section.data.map(
                  (item: { title: string; desc: string }, i: number) => (
                    <ContentItem key={i}>
                      <strong>{item.title}</strong>
                      <p>{item.desc}</p>
                    </ContentItem>
                  )
                )}
              </div>
            </GrowthCard>
          )
        )}
      </GrowthContainer>

    </ReportSection>
  );
};

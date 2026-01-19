import React from 'react';
import styled from 'styled-components';
import { FaFingerprint, FaQuoteLeft, FaHourglassHalf, FaStar, FaExclamationTriangle, FaBullseye, FaWalking, FaDatabase } from 'react-icons/fa';
import { ReportSection } from './ReportSection';
import { AnalysisResult } from '../../types/report';
import { useLanguage } from '../../context/LanguageContext';
import { AIReportData } from '../../utils/ai';
import { motion } from 'framer-motion';
import { ProcessList, ProcessItem, ProcessContent } from '../common/ResponsiveStyles';

const SectionHeader = styled.h3`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 24px;
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 3px;
  }
`;

const DecodingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DecodingCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.hover};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const LevelBadge = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: 0.5px;
`;

const TheoryBadge = styled.span`
  background: ${({ theme }) => `${theme.colors.secondary}20`};
  color: ${({ theme }) => theme.colors.secondary};
  padding: 0.3rem 0.8rem;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
`;

const CardSection = styled.div`
  h4 {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.textLight};
    margin: 0 0 0.3rem 0;
  }
  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
    line-height: 1.5;
  }
`;

const ChemistryBox = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => `${theme.colors.background}cc`}, #ffffff);
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    right: -20px;
    top: -20px;
    width: 100px;
    height: 100px;
    background: ${({ theme }) => theme.colors.primary};
    opacity: 0.05;
    border-radius: 50%;
  }
`;

const ChemistryTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
 
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ListCard = styled(motion.div)<{ $type: 'strength' | 'conflict' }>`
  background: white;
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border-top: 4px solid ${({ $type, theme }) => ($type === 'strength' ? theme.colors.success : theme.colors.error)};
  box-shadow: ${({ theme }) => theme.shadows.card};
  
  h3 {
    color: ${({ $type, theme }) => ($type === 'strength' ? theme.colors.success : theme.colors.error)};
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-top: 0;
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }
`;

const TimelineBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const TimeCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.card};
  position: relative;
  
  h3 {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.3rem;
    margin-top: 0;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    
    svg {
      color: ${({ theme }) => theme.colors.gold};
    }
  }
`;

const QuoteContainer = styled.div`
  margin-top: 1.75rem;
  position: relative;
  padding: 2.1rem 2.4rem;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.white} 0%,
    ${({ theme }) => `${theme.colors.background}`} 100%
  );
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => `${theme.colors.gold}20`};
  text-align: center;
`;

const QuoteIcon = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.gold};
  opacity: 0.3;
  margin-bottom: 1rem;
`;

const QuoteText = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  font-style: italic;
  line-height: 1.7;
  margin: 0 0 1.25rem 0;
  font-family: serif;
`;

const QuoteHighlight = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.gold};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SkeletonBlock = styled.div<{ width?: string; height?: string }>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '14px'};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.background};
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
`;

interface Props {
  data: AnalysisResult['personalityTraits'];
  aiReport: AIReportData | null;
  isAiEnabled: boolean;
  aiLoading: boolean;
  onToggleAi?: () => void;
  showAiToggle?: boolean;
}

const parseSummaryLine = (text: string) => {
  if (!text) return { type: '', desc: '' };
  const parts = text.split('：');
  if (parts.length === 1) return { type: '', desc: text };
  return { type: parts[0], desc: parts[1] || '' };
};

const getLevelLabel = (index: number, t: (key: string, options?: any) => string) => {
  if (index === 0) return t('report.traitsSection.level.strategic');
  if (index === 1) return t('report.traitsSection.level.action');
  if (index === 2) return t('report.traitsSection.level.resource');
  return '';
};

const getLevelIcon = (index: number) => {
  if (index === 0) return <FaBullseye />;
  if (index === 1) return <FaWalking />;
  if (index === 2) return <FaDatabase />;
  return <FaStar />;
};

const getTheoryLabel = (index: number, data: AnalysisResult['personalityTraits'], fallback: string) => {
  const mbti = parseSummaryLine(data.summary.mbti).type;
  const main = parseSummaryLine(data.summary.enneagramMain).type;
  const wing = parseSummaryLine(data.summary.enneagramWing).type;
  if (index === 0) return mbti || fallback;
  if (index === 1) return main || fallback;
  if (index === 2) return wing || fallback;
  return fallback;
};

export const PersonalityTraitsSection: React.FC<Props> = ({
  data,
  aiReport,
  isAiEnabled,
  aiLoading,
  onToggleAi,
  showAiToggle
}) => {
  const { t } = useLanguage();

  const decodingRows = isAiEnabled && aiReport && aiReport.decoding
    ? [
        { driver: aiReport.decoding.strategic.drive, manifestation: aiReport.decoding.strategic.manifestation },
        { driver: aiReport.decoding.action.drive, manifestation: aiReport.decoding.action.manifestation },
        { driver: aiReport.decoding.resource.drive, manifestation: aiReport.decoding.resource.manifestation }
      ]
    : data.detailAnalysis.decodingTable;

  const chemistryText =
    isAiEnabled && aiReport && aiReport.combo && aiReport.combo.overview
      ? aiReport.combo.overview
      : data.detailAnalysis.chemistry;

  const chemistryConclusionText =
    isAiEnabled && aiReport && aiReport.decoding && aiReport.decoding.chemistry
      ? aiReport.decoding.chemistry
      : data.detailAnalysis.chemistryConclusion;

  type StrengthItem = { title: string; desc: string };

  const strengths: StrengthItem[] =
    isAiEnabled &&
    aiReport &&
    aiReport.combo &&
    Array.isArray(aiReport.combo.strengths) &&
    aiReport.combo.strengths.length > 0
      ? (aiReport.combo.strengths as StrengthItem[])
      : data.detailAnalysis.strengths;

  const conflicts: StrengthItem[] =
    isAiEnabled &&
    aiReport &&
    aiReport.combo &&
    Array.isArray(aiReport.combo.conflicts) &&
    aiReport.combo.conflicts.length > 0
      ? (aiReport.combo.conflicts as StrengthItem[])
      : data.detailAnalysis.conflicts;

  const hasPastTimeline =
    isAiEnabled &&
    aiReport &&
    aiReport.pastFuture &&
    Array.isArray(aiReport.pastFuture.past) &&
    aiReport.pastFuture.past.length > 0;

  const hasFutureTimeline =
    isAiEnabled &&
    aiReport &&
    aiReport.pastFuture &&
    Array.isArray(aiReport.pastFuture.future) &&
    aiReport.pastFuture.future.length > 0;

  const buildTimelineText = (list: Array<string | { title: string; desc: string }>): string[] =>
    list.map(item => (typeof item === 'string' ? item : item.desc || item.title));

  const rawPastTimeline: Array<string | { title: string; desc: string }> = hasPastTimeline
    ? (aiReport!.pastFuture!.past as Array<string | { title: string; desc: string }>)
    : data.timeline.past;

  const rawFutureTimeline: Array<string | { title: string; desc: string }> = hasFutureTimeline
    ? (aiReport!.pastFuture!.future as Array<string | { title: string; desc: string }>)
    : data.timeline.future;

  const pastTimeline = buildTimelineText(rawPastTimeline);
  const futureTimeline = buildTimelineText(rawFutureTimeline);

  const portraitText =
    isAiEnabled && aiReport && aiReport.subjective && aiReport.subjective.summary
      ? aiReport.subjective.summary
      : data.subjectiveEvaluation.portrait;

  const uniquenessText =
    isAiEnabled && aiReport && aiReport.subjective && aiReport.subjective.core
      ? aiReport.subjective.core
      : data.subjectiveEvaluation.uniqueness;

  return (
    <ReportSection 
      id="traits" 
      title={t('report.traits')} 
      icon={FaFingerprint}
      onToggleAi={onToggleAi}
      isAiEnabled={isAiEnabled}
      showAiToggle={showAiToggle}
    >
      <SectionHeader>{t('report.traitsSection.decodingTitle')}</SectionHeader>
      
      <DecodingGrid>
        {decodingRows.map((row, idx) => {
          const levelLabel = getLevelLabel(idx, t);
          const theoryLabel = getTheoryLabel(idx, data, t('report.traitsSection.level.theoryFallback'));
          return (
            <DecodingCard key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <CardHeader>
                <LevelBadge style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getLevelIcon(idx)} {levelLabel}
                </LevelBadge>
                <TheoryBadge>{theoryLabel}</TheoryBadge>
              </CardHeader>
              {isAiEnabled && aiLoading ? (
                 <>
                   <div style={{ marginBottom: '0.3rem' }}>
                     <h4>{t('report.traitsSection.decoding.driver')}</h4>
                     <SkeletonBlock width="100%" height="40px" />
                   </div>
                   <div>
                     <h4>{t('report.traitsSection.decoding.manifestation')}</h4>
                     <SkeletonBlock width="100%" height="60px" />
                   </div>
                 </>
              ) : (
                <>
                  <CardSection>
                    <h4>{t('report.traitsSection.decoding.driver')}</h4>
                    <p>{row.driver}</p>
                  </CardSection>
                  <CardSection>
                    <h4>{t('report.traitsSection.decoding.manifestation')}</h4>
                    <p>{row.manifestation}</p>
                  </CardSection>
                </>
              )}
            </DecodingCard>
          );
        })}
      </DecodingGrid>

      <ChemistryBox>
        <ChemistryTitle><FaQuoteLeft /> {t('report.traitsSection.chemistry.title')}</ChemistryTitle>
        {isAiEnabled && aiLoading ? <SkeletonBlock width="100%" height="80px" /> : (
          <>
            <p style={{ lineHeight: 1.7, color: '#4A5568' }}>{chemistryText}</p>
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <strong style={{ color: '#2D3748' }}>{t('report.traitsSection.chemistry.label')}</strong> {chemistryConclusionText}
            </div>
          </>
        )}
      </ChemistryBox>

      <ListGrid>
        <ListCard $type="strength" whileHover={{ y: -5 }}>
          <h3><FaStar /> {t('report.traitsSection.strengthsTitle')}</h3>
          {isAiEnabled && aiLoading ? <SkeletonBlock height="200px" /> : (
            <ProcessList>
              {strengths.map((item, idx) => (
                <ProcessItem key={idx}>
                  <ProcessContent>
                    <strong>{item.title}</strong>
                    {item.desc && <p>{item.desc}</p>}
                  </ProcessContent>
                </ProcessItem>
              ))}
            </ProcessList>
          )}
        </ListCard>
        <ListCard $type="conflict" whileHover={{ y: -5 }}>
          <h3><FaExclamationTriangle /> {t('report.traitsSection.conflictsTitle')}</h3>
          {isAiEnabled && aiLoading ? <SkeletonBlock height="200px" /> : (
            <ProcessList>
              {conflicts.map((item, idx) => (
                <ProcessItem key={idx}>
                  <ProcessContent>
                    <strong>{item.title}</strong>
                    {item.desc && <p>{item.desc}</p>}
                  </ProcessContent>
                </ProcessItem>
              ))}
            </ProcessList>
          )}
        </ListCard>
      </ListGrid>

      <SectionHeader>{t('report.traitsSection.timelineTitle')}</SectionHeader>
      <TimelineBox>
        <TimeCard whileHover={{ y: -5 }}>
          <h3><FaHourglassHalf /> {t('report.traitsSection.pastTitle')}</h3>
          {isAiEnabled && aiLoading ? <SkeletonBlock height="100px" /> : (
            <ProcessList>
              {pastTimeline.map((item, idx) => (
                <ProcessItem key={idx}>
                  <ProcessContent>
                    <p>{item}</p>
                  </ProcessContent>
                </ProcessItem>
              ))}
            </ProcessList>
          )}
        </TimeCard>
        <TimeCard whileHover={{ y: -5 }}>
          <h3><FaHourglassHalf /> {t('report.traitsSection.futureTitle')}</h3>
          {isAiEnabled && aiLoading ? <SkeletonBlock height="100px" /> : (
            <ProcessList>
              {futureTimeline.map((item, idx) => (
                <ProcessItem key={idx}>
                  <ProcessContent>
                    <p>{item}</p>
                  </ProcessContent>
                </ProcessItem>
              ))}
            </ProcessList>
          )}
        </TimeCard>
      </TimelineBox>

      <QuoteContainer>
        <QuoteIcon><FaQuoteLeft /></QuoteIcon>
        {isAiEnabled && aiLoading ? <SkeletonBlock height="80px" /> : (
          <>
            <QuoteText>"{portraitText}"</QuoteText>
            {uniquenessText && (
              <QuoteHighlight>
                {t('report.traitsSection.quote.uniqueness', { text: uniquenessText })}
              </QuoteHighlight>
            )}
          </>
        )}
      </QuoteContainer>
    </ReportSection>
  );
};

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaFlagCheckered, FaLightbulb, FaRunning, FaTree } from 'react-icons/fa';
import { ReportSection } from './ReportSection';
import { AnalysisResult } from '../../types/report';
import { useLanguage } from '../../context/LanguageContext';
import { AIReportData } from '../../utils/ai';
import { motion } from 'framer-motion';

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

const SummaryBox = styled(motion.div)`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.white} 0%,
    ${({ theme }) => `${theme.colors.primary}10`} 40%,
    ${({ theme }) => theme.colors.background} 100%
  );
  padding: 2.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.card};
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  overflow: hidden;
`;

const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
`;

const AccentBar = styled.div`
  width: 6px;
  height: 2.5rem;
  background: ${({ theme }) => theme.colors.primary}; // Using theme primary color
  border-radius: 4px;
`;

const SummaryTitle = styled.h3`
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: 0.5px;
  line-height: 1.2;
`;

const SummaryText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
  text-align: justify;
  position: relative;
  z-index: 2;
  word-break: break-word;
`;

const KeyPointsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const PointCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem 1.8rem;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 1.2rem;
  transition: ${({ theme }) => theme.transitions.default};
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.hover};
  }
`;

const IconCircle = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${({ $color }) => `${$color}20`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-bottom: 0.5rem;
`;

const CardContent = styled.div`
  width: 100%;
  
  h4 {
    margin: 0 0 0.8rem 0;
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 1.05rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 1.05rem;
    line-height: 1.6;
    word-break: break-word; // Handle long English words
  }
`;

interface Props {
  data: AnalysisResult['reportSummary'];
  aiReport?: AIReportData | null;
  isAiEnabled?: boolean;
  aiLoading?: boolean;
  onToggleAi?: () => void;
  showAiToggle?: boolean;
}

export const ReportSummarySection: React.FC<Props> = ({ 
  data, 
  aiReport, 
  isAiEnabled = false, 
  aiLoading = false,
  onToggleAi,
  showAiToggle = false
}) => {
  const { t } = useLanguage();

  const useAiSummary = Boolean(isAiEnabled && aiReport && (aiReport as any).summary);

  const summaryTitle =
    useAiSummary && (aiReport as any).summary.title
      ? (aiReport as any).summary.title
      : data.title;

  const summaryText =
    useAiSummary && (aiReport as any).summary.summary
      ? (aiReport as any).summary.summary
      : data.text;
  
  const keyPoints = useAiSummary && (aiReport as any).summary.highlights
    ? {
        thinking: (aiReport as any).summary.highlights.thinking || data.keyPoints.thinking,
        behavior: (aiReport as any).summary.highlights.behavior || data.keyPoints.behavior,
        growth: (aiReport as any).summary.highlights.growth || data.keyPoints.growth
      }
    : data.keyPoints;

  if (isAiEnabled && aiLoading) {
    return (
      <ReportSection 
        id="summary" 
        title={t('report.summary')} 
        icon={FaFlagCheckered}
        onToggleAi={onToggleAi}
        isAiEnabled={isAiEnabled}
        showAiToggle={showAiToggle}
      >
        <SummaryBox
          key="loading"
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SkeletonBlock />
          <SkeletonBlock />
          <SkeletonBlock width="80%" />
          <SkeletonBlock width="90%" />
        </SummaryBox>
        
        <KeyPointsGrid>
          {[1, 2, 3].map(i => (
            <PointCard key={i}>
              <IconCircle $color="#cbd5e0"><SkeletonBlock width="32px" height="32px" style={{borderRadius: '50%', margin: 0}} /></IconCircle>
              <CardContent>
                <h4><SkeletonBlock width="40%" height="1rem" style={{margin: '0 auto 0.8rem'}} /></h4>
                <p><SkeletonBlock width="80%" height="1rem" style={{margin: '0 auto'}} /></p>
              </CardContent>
            </PointCard>
          ))}
        </KeyPointsGrid>
      </ReportSection>
    );
  }

  // Also check if we are waiting for AI but have no data yet (fallback loading)
  if (isAiEnabled && !useAiSummary && !data) {
     return (
      <ReportSection 
        id="summary" 
        title={t('report.summary')} 
        icon={FaFlagCheckered}
        onToggleAi={onToggleAi}
        isAiEnabled={isAiEnabled}
        showAiToggle={showAiToggle}
      >
        <SummaryBox>
          <SkeletonBlock />
          <SkeletonBlock />
          <SkeletonBlock width="80%" />
        </SummaryBox>
      </ReportSection>
     )
  }

  return (
    <ReportSection 
      id="summary" 
      title={t('report.summary')} 
      icon={FaFlagCheckered}
      onToggleAi={onToggleAi}
      isAiEnabled={isAiEnabled}
      showAiToggle={showAiToggle}
    >
      <SummaryBox
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SummaryHeader>
          <AccentBar />
          <SummaryTitle>{summaryTitle || t('report.summary')}</SummaryTitle>
        </SummaryHeader>
        <SummaryText>
          {summaryText}
        </SummaryText>
      </SummaryBox>
      
      <KeyPointsGrid>
        <PointCard
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
        >
          <IconCircle $color="#FF7F7F"><FaLightbulb /></IconCircle>
          <CardContent>
            <h4>{t('report.thinkingPattern')}</h4>
            <p>{keyPoints.thinking}</p>
          </CardContent>
        </PointCard>
        <PointCard
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <IconCircle $color="#98D8C8"><FaRunning /></IconCircle>
          <CardContent>
            <h4>{t('report.behaviorTraits')}</h4>
            <p>{keyPoints.behavior}</p>
          </CardContent>
        </PointCard>
        <PointCard
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <IconCircle $color="#D4AF37"><FaTree /></IconCircle>
          <CardContent>
            <h4>{t('report.growthKeys')}</h4>
            <p>{keyPoints.growth}</p>
          </CardContent>
        </PointCard>
      </KeyPointsGrid>
    </ReportSection>
  );
};

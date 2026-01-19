import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaBriefcase, FaCheckCircle, FaExclamationCircle, FaUserTie, FaHandshake, FaBuilding, FaUserPlus, FaBug } from 'react-icons/fa';
import { ReportSection } from './ReportSection';
import { AnalysisResult } from '../../types/report';
import { useLanguage } from '../../context/LanguageContext';
import { AIReportData } from '../../utils/ai';

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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
 
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 22px rgba(0,0,0,0.06);
    border-color: #cbd5e0;
  }
`;

const CardHeader = styled.h3`
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2d3748;
  font-size: 1.1rem;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ListItem = styled.li`
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
  
  &:last-child { margin-bottom: 0; }
`;

const ItemTitle = styled.span`
  font-weight: 600;
  color: #2c5282;
  display: block;
  margin-bottom: 0.2rem;
`;

const ItemDesc = styled.span`
  color: #718096;
`;

interface Props {
  data: AnalysisResult['careerPath'];
  aiReport?: AIReportData | null;
  isAiEnabled?: boolean;
  aiLoading?: boolean;
  onToggleAi?: () => void;
  showAiToggle?: boolean;
}

export const CareerPathSection: React.FC<Props> = ({ 
  data, 
  aiReport, 
  isAiEnabled = false, 
  aiLoading = false,
  onToggleAi,
  showAiToggle = false
}) => {
  const { t } = useLanguage();

  const useAiCareer = Boolean(isAiEnabled && aiReport && (aiReport as any).career);

  const strengths = useAiCareer && Array.isArray((aiReport as any).career.strengths)
    ? (aiReport as any).career.strengths.map((item: any) => ({ title: item.point, desc: item.desc }))
    : data.strengths;

  const blindSpots = useAiCareer && Array.isArray((aiReport as any).career.blindSpots)
    ? (aiReport as any).career.blindSpots.map((item: any) => ({ title: item.point, desc: item.desc }))
    : data.blindSpots;

  const roles = useAiCareer && Array.isArray((aiReport as any).career.teamRole)
    ? (aiReport as any).career.teamRole.map((item: any) => ({ title: item.point, desc: item.desc }))
    : data.roles;

  const collaboration = useAiCareer && Array.isArray((aiReport as any).career.collaborationStyle)
    ? (aiReport as any).career.collaborationStyle.map((item: any) => ({ title: item.point, desc: item.desc }))
    : data.collaboration;

  const environment = useAiCareer && Array.isArray((aiReport as any).career.environment)
    ? (aiReport as any).career.environment.map((item: any) => ({ title: item.point, desc: item.desc }))
    : data.environment;

  const partners = useAiCareer && Array.isArray((aiReport as any).career.companions)
    ? (aiReport as any).career.companions.map((item: any) => ({ type: item.mbti, desc: item.desc }))
    : data.partners;

  const traps = useAiCareer && Array.isArray((aiReport as any).career.traps)
    ? (aiReport as any).career.traps.map((item: any) => ({ title: item.point, desc: item.desc }))
    : data.traps;

  return (
    <ReportSection 
      id="career" 
      title={t('report.career')} 
      icon={FaBriefcase}
      onToggleAi={onToggleAi}
      isAiEnabled={isAiEnabled}
      showAiToggle={showAiToggle}
    >
      <GridContainer>
        <Card>
          <CardHeader><FaCheckCircle color="#38a169" /> {t('report.careerSection.strengthsTitle')}</CardHeader>
          {isAiEnabled && aiLoading ? (
            <List>
              <ListItem>
                <SkeletonBlock width="40%" />
                <SkeletonBlock width="90%" />
                <SkeletonBlock width="80%" />
              </ListItem>
              <ListItem>
                <SkeletonBlock width="50%" />
                <SkeletonBlock width="85%" />
                <SkeletonBlock width="75%" />
              </ListItem>
            </List>
          ) : (
            <List>
              {strengths.map(
                (item: { title: string; desc: string }, idx: number) => (
                  <ListItem key={idx}>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemDesc>{item.desc}</ItemDesc>
                  </ListItem>
                )
              )}
            </List>
          )}
        </Card>

        <Card>
          <CardHeader><FaExclamationCircle color="#e53e3e" /> {t('report.careerSection.blindSpotsTitle')}</CardHeader>
          {isAiEnabled && aiLoading ? (
            <List>
              <ListItem>
                <SkeletonBlock width="40%" />
                <SkeletonBlock width="90%" />
                <SkeletonBlock width="80%" />
              </ListItem>
              <ListItem>
                <SkeletonBlock width="50%" />
                <SkeletonBlock width="85%" />
                <SkeletonBlock width="75%" />
              </ListItem>
            </List>
          ) : (
            <List>
              {blindSpots.map(
                (item: { title: string; desc: string }, idx: number) => (
                  <ListItem key={idx}>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemDesc>{item.desc}</ItemDesc>
                  </ListItem>
                )
              )}
            </List>
          )}
        </Card>

        <Card>
          <CardHeader><FaUserTie color="#3182ce" /> {t('report.careerSection.rolesTitle')}</CardHeader>
          {isAiEnabled && aiLoading ? (
            <List>
              <ListItem>
                <SkeletonBlock width="40%" />
                <SkeletonBlock width="90%" />
                <SkeletonBlock width="80%" />
              </ListItem>
              <ListItem>
                <SkeletonBlock width="50%" />
                <SkeletonBlock width="85%" />
                <SkeletonBlock width="75%" />
              </ListItem>
            </List>
          ) : (
            <List>
              {roles.map(
                (item: { title: string; desc: string }, idx: number) => (
                  <ListItem key={idx}>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemDesc>{item.desc}</ItemDesc>
                  </ListItem>
                )
              )}
            </List>
          )}
        </Card>

        <Card>
          <CardHeader><FaHandshake color="#805ad5" /> {t('report.careerSection.collaborationTitle')}</CardHeader>
          {isAiEnabled && aiLoading ? (
            <List>
              <ListItem>
                <SkeletonBlock width="40%" />
                <SkeletonBlock width="90%" />
                <SkeletonBlock width="80%" />
              </ListItem>
              <ListItem>
                <SkeletonBlock width="50%" />
                <SkeletonBlock width="85%" />
                <SkeletonBlock width="75%" />
              </ListItem>
            </List>
          ) : (
            <List>
              {collaboration.map(
                (item: { title: string; desc: string }, idx: number) => (
                  <ListItem key={idx}>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemDesc>{item.desc}</ItemDesc>
                  </ListItem>
                )
              )}
            </List>
          )}
        </Card>

        <Card>
          <CardHeader><FaBuilding color="#d69e2e" /> {t('report.careerSection.environmentTitle')}</CardHeader>
          {isAiEnabled && aiLoading ? (
            <List>
              <ListItem>
                <SkeletonBlock width="40%" />
                <SkeletonBlock width="90%" />
                <SkeletonBlock width="80%" />
              </ListItem>
              <ListItem>
                <SkeletonBlock width="50%" />
                <SkeletonBlock width="85%" />
                <SkeletonBlock width="75%" />
              </ListItem>
            </List>
          ) : (
            <List>
              {environment.map(
                (item: { title: string; desc: string }, idx: number) => (
                  <ListItem key={idx}>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemDesc>{item.desc}</ItemDesc>
                  </ListItem>
                )
              )}
            </List>
          )}
        </Card>

        <Card>
          <CardHeader><FaUserPlus color="#dd6b20" /> {t('report.careerSection.partnersTitle')}</CardHeader>
          {isAiEnabled && aiLoading ? (
            <List>
              <ListItem>
                <SkeletonBlock width="40%" />
                <SkeletonBlock width="90%" />
                <SkeletonBlock width="80%" />
              </ListItem>
              <ListItem>
                <SkeletonBlock width="50%" />
                <SkeletonBlock width="85%" />
                <SkeletonBlock width="75%" />
              </ListItem>
            </List>
          ) : (
            <List>
              {partners.map(
                (item: { type: string; desc: string }, idx: number) => (
                  <ListItem key={idx}>
                    <ItemTitle>{item.type}</ItemTitle>
                    <ItemDesc>{item.desc}</ItemDesc>
                  </ListItem>
                )
              )}
            </List>
          )}
        </Card>

        <Card style={{ gridColumn: '1 / -1' }}>
          <CardHeader><FaBug color="#718096" /> {t('report.careerSection.trapsTitle')}</CardHeader>
          {isAiEnabled && aiLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i}>
                  <SkeletonBlock width="60%" />
                  <SkeletonBlock width="100%" />
                  <SkeletonBlock width="90%" />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {traps.map(
                (item: { title: string; desc: string }, idx: number) => (
                  <div key={idx}>
                    <ItemTitle style={{ color: '#c53030' }}>{item.title}</ItemTitle>
                    <ItemDesc>{item.desc}</ItemDesc>
                  </div>
                )
              )}
            </div>
          )}
        </Card>
      </GridContainer>
    </ReportSection>
  );
};

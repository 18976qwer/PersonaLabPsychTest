import React from 'react';
import styled from 'styled-components';
import { AIReportData } from '../utils/ai';
import { useLanguage } from '../context/LanguageContext';

const Container = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.textLight}20;
`;

const Section = styled.div`
  margin-bottom: 2.5rem;
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuoteBox = styled.div`
  background: linear-gradient(to right, ${({ theme }) => theme.colors.primary}10, transparent);
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  padding: 1.5rem;
  border-radius: 0 8px 8px 0;
  margin-bottom: 2rem;
`;

const QuoteText = styled.p`
  font-size: 1.2rem;
  font-style: italic;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const QuoteAuthor = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textLight};
  text-align: right;
`;

const List = styled.ul`
  padding-left: 1.5rem;
  margin: 1rem 0;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
`;

const SubSection = styled.div`
  margin-top: 1.5rem;
`;

const SubTitle = styled.h4`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  font-weight: 600;
`;

interface AIReportViewProps {
  data: AIReportData;
}

export const AIReportView: React.FC<AIReportViewProps> = ({ data }) => {
  const { t } = useLanguage();

  if (!data) return null;

  return (
    <Container>
      <Section>
        <SectionTitle>🤖 {t('results.aiReport') || 'AI Analysis Report'}</SectionTitle>
        
        {data.traits && (
          <QuoteBox>
            <QuoteText>"{data.traits.quote}"</QuoteText>
            {data.traits.quoteAuthor && <QuoteAuthor>- {data.traits.quoteAuthor}</QuoteAuthor>}
          </QuoteBox>
        )}

        {data.combo && (
          <SubSection>
            <SubTitle>{t('results.comboOverview') || 'Combination Overview'}</SubTitle>
            <p style={{ lineHeight: 1.6 }}>{data.combo.overview}</p>
          </SubSection>
        )}

        {data.summary && (
          <SubSection>
            <SubTitle>{t('results.summary') || 'Summary'}</SubTitle>
            <p style={{ lineHeight: 1.6 }}>{data.summary.summary}</p>
          </SubSection>
        )}
      </Section>

      {data.combo && (
        <Section>
           <SubSection>
            <SubTitle>⚡ {t('results.keyStrengths')}</SubTitle>
            <List>
              {data.combo.strengths.map((item, index) => (
                <ListItem key={index}>{item}</ListItem>
              ))}
            </List>
          </SubSection>

          <SubSection>
            <SubTitle>⚔️ {t('results.conflicts') || 'Internal Conflicts'}</SubTitle>
            <List>
              {data.combo.conflicts.map((item, index) => (
                <ListItem key={index}>{item}</ListItem>
              ))}
            </List>
          </SubSection>
        </Section>
      )}

      {data.growth && (
        <Section>
          <SectionTitle>🌱 {t('results.growth') || 'Personal Growth'}</SectionTitle>
          <SubSection>
             <SubTitle>{t('results.bestState') || 'Best State'}</SubTitle>
             <p>{data.growth.best.state}</p>
          </SubSection>
           <SubSection>
             <SubTitle>{t('results.stressState') || 'Stress State'}</SubTitle>
             <p>{data.growth.stress.state}</p>
          </SubSection>
        </Section>
      )}
    </Container>
  );
};

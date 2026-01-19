import React from 'react';
import styled from 'styled-components';
import { FaBookOpen, FaLayerGroup, FaSearch } from 'react-icons/fa';
import { ReportSection } from './ReportSection';
import { AnalysisResult } from '../../types/report';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { FaLink } from 'react-icons/fa';

const HeroContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.02);
  margin-bottom: 2rem;
`;

const HeaderSection = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.white};
  min-height: 360px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    min-height: auto;
  }
`;

const HeaderLeft = styled.div`
  flex: 0.95;
  background: ${({ theme }) => theme.colors.primary};
  padding: 2.5rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem;
    flex: none;
  }
`;

const HeaderRight = styled.div`
  flex: 1.05;
  padding: 2.5rem;
  background: #F4FBFB;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem;
    flex: none;
  }
`;

const SectionLabel = styled.div`
  font-size: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const BigType = styled.h2`
  font-size: 5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  line-height: 0.9;
  letter-spacing: -2px;
  
  span {
    color: rgb(255, 217, 217);
  }
`;

const Subtitle = styled.h3`
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 400;
  margin: 1rem 0 0 0;
  letter-spacing: 1px;
`;

const Divider = styled.div`
  width: 40px;
  height: 4px;
  background: rgb(255, 217, 217);
  margin: 2rem 0;
  border-radius: 2px;
`;

const OneLiner = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  margin: 0;
  line-height: 1.6;
  max-width: 100%;
`;

const RightSectionTitle = styled.h4`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0 0 1.2rem 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  position: relative;
  padding-bottom: 0.8rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: rgba(0,0,0,0.06);
  }
`;

const InfoBlocksGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InfoBlock = styled.div`
  padding: 0.3rem 1rem;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 4px;
  background: #E0F2F1;
  transition: all 0.2s;
  overflow: hidden;
  
  &:hover {
    background: #F1FBF9;
    box-shadow: ${({ theme }) => theme.shadows.soft};
    border-color: transparent;
  }
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.8rem;
  font-weight: 600;
`;

const InfoValue = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  margin-bottom: 0.4rem;
`;

const InfoSubtext = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
  opacity: 0.8;
`;

const KeywordTags = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const Tag = styled.span<{ $variant?: 'dark' | 'light' | 'outline' }>`
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 2px;
  letter-spacing: 0.5px;
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'light':
        return `
          background: ${theme.colors.secondary}20;
          color: ${theme.colors.text};
          border: 1px solid ${theme.colors.secondary}40;
        `;
      case 'outline':
        return `
          background: white;
          border: 1px solid ${theme.colors.primary};
          color: ${theme.colors.primary};
        `;
      default: // dark
        return `
          background: ${theme.colors.primary};
          color: white;
        `;
    }
  }}
`;

const ContentSection = styled.div`
  padding: 2.4rem 2.4rem 1.8rem 2.4rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem;
  }
`;

const GuideGroup = styled.div`
  margin-bottom: 2.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const GuideTitle = styled.h3`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  svg {
    color: ${({ theme }) => theme.colors.secondary};
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  }
`;

const IntroText = styled.p`
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.8;
  margin: 0 0 1.5rem 0;
`;

const StyledList = styled.ul`
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  list-style: none;
`;

const ListItem = styled.li`
  background: ${({ theme }) => theme.colors.background};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border-left: 4px solid ${({ theme }) => theme.colors.secondary};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateX(5px);
    background: ${({ theme }) => `${theme.colors.secondary}15`};
  }
`;

const StepList = styled(StyledList)`
  counter-reset: step;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const StepItem = styled(ListItem)`
  position: relative;
  padding-right: 3rem;
  border-left: none;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.background} 0%, ${({ theme }) => `${theme.colors.primary}10`} 100%);
  display: flex;
  align-items: center;
  min-height: 5rem;
  
  &::after {
    counter-increment: step;
    content: counter(step, decimal-leading-zero);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 1.2rem;
    font-size: 2.4rem;
    font-weight: 800;
    color: ${({ theme }) => `${theme.colors.textLight}18`};
    letter-spacing: 1px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.5rem;
    padding-right: 1.5rem;
    justify-content: center;
    text-align: center;
    
    &::after {
      display: none; /* 移动端隐藏大数字，避免遮挡或干扰居中 */
    }
  }
`;

const QuestionList = styled(StyledList)`
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const QuestionItem = styled(ListItem)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-left: none;
  background: white;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}60`};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: 2rem 1.8rem;
  height: 100%;
  
  &:hover {
    background: white;
    box-shadow: ${({ theme }) => theme.shadows.card};
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.2rem;
  }
`;

const MobileQuickNav = styled.div`
  display: none;
  margin: 1rem 0 2rem;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: flex;
  }
`;

const QuickNavItem = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: white;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:active {
    background: ${({ theme }) => `${theme.colors.primary}10`};
  }
`;

const QuestionTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 1rem;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 1rem;
    background: ${({ theme }) => theme.colors.accent};
    border-radius: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1rem;
    padding-left: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    display: block;
    
    &::before {
      top: 0.7em;
    }
  }
`;

const QuestionBody = styled.div`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textLight};
`;

interface Props {
  data: AnalysisResult['readingGuide'];
  primaryEnneagram: string;
  wingEnneagram: string;
}

export const ReadingGuideSection: React.FC<Props> = ({ data, primaryEnneagram, wingEnneagram }) => {
  const { language, t } = useLanguage();
  
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Mobile breakpoint from theme is 480px
      const isMobile = window.innerWidth <= 480;
      // Mobile: Header (56px) + Nav (approx 50px) + padding
      // Desktop: Header (56px) + padding
      const offset = isMobile ? 140 : 80;
      
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // Use dynamic data if available, otherwise fallback to mock
  const keywords = data.keywords || t('report.readingGuideData.keywords', { returnObjects: true }) as string[];
  const oneLiner = data.oneLiner || t('report.readingGuideData.oneLiner');

  const guideSteps = t('report.readingGuideData.howToUse.steps', { returnObjects: true }) as string[];
  const questions = t('report.readingGuideData.faq.questions', { returnObjects: true }) as Array<{title: string, body: string}>;

  const getEnneagramInfo = (text: string) => {
    if (!text) return { num: '', title: '' };
    const parts = text.split('号');
    if (parts.length < 2) return { num: '', title: text };
    return { num: parts[0] + '号', title: parts[1].trim() };
  };

  const primaryInfo = getEnneagramInfo(primaryEnneagram);
  const wingInfo = getEnneagramInfo(wingEnneagram);

  return (
    <ReportSection id="guide" title={t('report.readingGuide')} icon={FaBookOpen}>
      <HeroContainer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <HeaderSection>
          <HeaderLeft>
            <SectionLabel>
              {language === 'zh' ? '人格评估概览' : 'PERSONALITY ASSESSMENT'}
            </SectionLabel>
            
            <BigType>
              {data.characterType.en.split('-')[0]}
              <span>-{data.characterType.en.split('-')[1]}</span>
            </BigType>
            
            <Subtitle>
              {language === 'zh' ? data.characterType.cn : data.characterType.en}
            </Subtitle>

            <Divider />
            
            <OneLiner>
              {oneLiner}
            </OneLiner>
          </HeaderLeft>
          
          <HeaderRight>
            <div>
              <RightSectionTitle>{t('report.traitsSection.decodingTitle') || '人格结构分析'}</RightSectionTitle>
              <InfoBlocksGrid>
                <InfoBlock>
                  <InfoLabel>{language === 'zh' ? '主型人格' : 'PRIMARY TYPE'}</InfoLabel>
                  <InfoValue>{primaryInfo.num} {primaryInfo.title}</InfoValue>
                  <InfoSubtext>{language === 'zh' ? '核心主导类型' : 'Core Dominant Type'}</InfoSubtext>
                </InfoBlock>
                <InfoBlock>
                  <InfoLabel>{language === 'zh' ? '亚型 / 侧翼' : 'WING / SUBTYPE'}</InfoLabel>
                  <InfoValue>{wingInfo.num} {wingInfo.title}</InfoValue>
                  <InfoSubtext>{language === 'zh' ? '伴生发展方向' : 'Secondary Influence'}</InfoSubtext>
                </InfoBlock>
              </InfoBlocksGrid>
            </div>

            <div>
              <RightSectionTitle>
                {language === 'zh' ? '核心特质' : 'CORE TRAITS'}
              </RightSectionTitle>
              <KeywordTags>
                {keywords.map((tag, i) => (
                  <Tag 
                    key={i} 
                    $variant={i === 0 ? 'dark' : i === 1 ? 'light' : i === 2 ? 'outline' : 'dark'}
                  >
                    {tag}
                  </Tag>
                ))}
              </KeywordTags>
            </div>
          </HeaderRight>
        </HeaderSection>
        
        <ContentSection>
          <MobileQuickNav>
            <QuickNavItem onClick={() => handleScroll('traits')}>
              <FaLink style={{ marginRight: 6 }} />{t('report.traits')}
            </QuickNavItem>
            <QuickNavItem onClick={() => handleScroll('growth')}>
              <FaLink style={{ marginRight: 6 }} />{t('report.growth')}
            </QuickNavItem>
            <QuickNavItem onClick={() => handleScroll('career')}>
              <FaLink style={{ marginRight: 6 }} />{t('report.career')}
            </QuickNavItem>
            <QuickNavItem onClick={() => handleScroll('relationships')}>
              <FaLink style={{ marginRight: 6 }} />{t('report.relationships')}
            </QuickNavItem>
            <QuickNavItem onClick={() => handleScroll('summary')}>
              <FaLink style={{ marginRight: 6 }} />{t('report.summary')}
            </QuickNavItem>
          </MobileQuickNav>
          <GuideGroup>
            <GuideTitle>
              <FaLayerGroup /> 
              {t('report.readingGuideData.howToUse.title')}
            </GuideTitle>
            <IntroText>
              {t('report.readingGuideData.howToUse.intro')}
            </IntroText>
            <StepList>
              {guideSteps.map((step, i) => (
                <StepItem key={i}>
                  {step}
                </StepItem>
              ))}
            </StepList>
          </GuideGroup>
          
          <GuideGroup>
            <GuideTitle>
              <FaSearch />
              {t('report.readingGuideData.faq.title')}
            </GuideTitle>
            <QuestionList>
              {questions.map((q, i) => (
                <QuestionItem key={i}>
                  <QuestionTitle>{q.title}</QuestionTitle>
                  <QuestionBody>{q.body}</QuestionBody>
                </QuestionItem>
              ))}
            </QuestionList>
            <IntroText style={{ marginTop: '2rem', fontStyle: 'italic', opacity: 0.8, textAlign: 'center', fontSize: '1.05rem' }}>
              {t('report.readingGuideData.outro')}
            </IntroText>
          </GuideGroup>
        </ContentSection>
      </HeroContainer>
    </ReportSection>
  );
};

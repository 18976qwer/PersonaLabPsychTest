import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaClock, FaShieldAlt } from 'react-icons/fa';
import { FiHeart, FiCircle, FiStar } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { StorageManager } from '../utils/storage';

const LandingContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 160px);
  text-align: center;
  gap: 1.5rem;
  padding: 1.5rem 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 1rem;
    padding: 6rem 1rem 1rem;
    min-height: calc(100vh - 140px);
  }
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  letter-spacing: 0.03em;
  font-weight: 800;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.6rem;
    padding: 0 0.5rem;
    line-height: 1.3;
    word-break: keep-all; /* 防止中文换行断词 */
    white-space: normal;
  }
`;

const TitleHighlight = styled.span`
  background: linear-gradient(90deg, #f4a5c4, #d7a9e8, #b8b5f3);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block; /* 确保渐变背景在inline元素上正常显示 */
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 760px;
  line-height: 1.6;
  margin: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-width: 90%;
    font-size: 1rem;
  }
`;

const StartButton = styled(motion.button)`
  padding: 0.8rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.hover};
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const StartMetaRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 0.9rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: row;
    gap: 1rem;
  }
`;

const MetaItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: ${({ theme }) => theme.shadows.card};
  font-weight: 500;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  margin-top: 2.5rem;
  width: 100%;
  align-items: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-top: 1.5rem;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled(motion.div)`
  background: linear-gradient(145deg, #ffffff, ${({ theme }) => `${theme.colors.background}dd`});
  padding: 2.1rem 2.2rem;
  border-radius: 24px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  transition: ${({ theme }) => theme.transitions.default};
  border: 1px solid rgba(148, 163, 184, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 28px;
    height: 3px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.primary};
    transition: transform 0.25s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.hover};
  }

  &:hover::after {
    transform: translateX(-50%) scaleX(1);
  }
  
  h3 {
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.5rem;
    font-size: 1.15rem;
    font-weight: 700;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 0.92rem;
    margin: 0;
  }
`;

const FeatureIcon = styled.div<{ $variant: 'mbti' | 'enneagram' | 'ai' }>`
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.1rem;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.35rem;
  transition: transform 0.2s ease;

  ${({ $variant }) => {
    if ($variant === 'mbti') {
      return `
        background: linear-gradient(135deg, #fde3cf, #f8c9a5);
      `;
    }
    if ($variant === 'enneagram') {
      return `
        background: linear-gradient(135deg, #fdf1d0, #f4dba0);
      `;
    }
    return `
      background: linear-gradient(135deg, #efe7ff, #e1d2ff);
    `;
  }}
`;

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const handleStartTest = () => {
    StorageManager.removeItem('mbti_answers');
    StorageManager.removeItem('mbti_likert_answers');
    StorageManager.removeItem('enneagram_answers');
    StorageManager.removeItem('enneagram_result');
    navigate('/mbti');
  };

  return (
    <LandingContainer>
      <Title
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {language === 'zh' ? (
          <>
            发现你
            <TitleHighlight>真正的自我</TitleHighlight>
          </>
        ) : (
          <>
            Discover Your <TitleHighlight>True Self</TitleHighlight>
          </>
        )}
      </Title>
      
      <Subtitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {t('landing.subtitle')}
      </Subtitle>
      
      <StartButton
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStartTest}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {t('landing.start')} <FaArrowRight />
      </StartButton>

      <StartMetaRow
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <MetaItem>
          <FaClock />
          {t('landing.meta.time')}
        </MetaItem>
        <MetaItem>
          <FaShieldAlt />
          {t('landing.meta.privacy')}
        </MetaItem>
      </StartMetaRow>

      <FeatureGrid>
        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <FeatureIcon $variant="mbti">
            <FiHeart />
          </FeatureIcon>
          <h3>{t('landing.features.mbti.title')}</h3>
          <p>{t('landing.features.mbti.desc')}</p>
        </FeatureCard>
        
        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <FeatureIcon $variant="enneagram">
            <FiCircle />
          </FeatureIcon>
          <h3>{t('landing.features.enneagram.title')}</h3>
          <p>{t('landing.features.enneagram.desc')}</p>
        </FeatureCard>
        
        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <FeatureIcon $variant="ai">
            <FiStar />
          </FeatureIcon>
          <h3>{t('landing.features.ai.title')}</h3>
          <p>{t('landing.features.ai.desc')}</p>
        </FeatureCard>
      </FeatureGrid>
    </LandingContainer>
  );
};

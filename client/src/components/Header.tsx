import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from './Modal';
import { useTestProgress } from '../context/TestProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { useAi } from '../context/AiContext';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 2rem;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const Logo = styled.div<{ $clickable: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

const LogoMark = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  font-size: 1.1rem;
`;

const LogoTextContainer = styled.div`
  display: flex;
  align-items: center;
  line-height: 1;
`;

const LogoLine1 = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
`;

const ProgressContainer = styled.div`
  flex: 1;
  max-width: 300px;
  margin: 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
  text-align: center;
`;

const LanguageSwitcher = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
`;

const LanguageItem = styled.span<{ $active: boolean; $disabled?: boolean }>`
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  font-weight: ${({ $active }) => ($active ? '700' : '400')};
  color: ${({ $active, $disabled, theme }) =>
    $disabled
      ? theme.colors.textLight
      : $active
        ? theme.colors.text
        : theme.colors.textLight};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme, $disabled }) => ($disabled ? theme.colors.textLight : theme.colors.primary)};
  }
`;

const Separator = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
`;

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const { progress, total, showProgress, setShowProgress } = useTestProgress();
  const { language, setLanguage, t } = useLanguage();
  const { aiLoading } = useAi();

  const isHome = location.pathname === '/';
  const isTestPage = location.pathname.includes('/mbti') || location.pathname.includes('/enneagram');
  
  const handleLogoClick = () => {
    if (isHome) return;

    if (isTestPage) {
      setShowModal(true);
    } else {
      setShowProgress(false);
      navigate('/');
    }
  };

  const confirmReturnHome = () => {
    setShowModal(false);
    setShowProgress(false);
    navigate('/');
  };

  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;

  return (
    <>
      <HeaderContainer>
        <Logo onClick={handleLogoClick} $clickable={!isHome}>
          <LogoMark>P</LogoMark>
          <LogoTextContainer>
            <LogoLine1>{t('common.appNameLine1')}</LogoLine1>
          </LogoTextContainer>
        </Logo>
        
        {showProgress && isTestPage && (
          <ProgressContainer>
            <ProgressBar>
              <ProgressFill $progress={percentage} />
            </ProgressBar>
            <ProgressText>{progress} / {total} {t('header.progress')} ({percentage}%)</ProgressText>
          </ProgressContainer>
        )}

        <div>
          <LanguageSwitcher>
            <LanguageItem
              $active={language === 'zh'}
              $disabled={aiLoading}
              onClick={() => {
                if (!aiLoading) setLanguage('zh');
              }}
            >
              中文
            </LanguageItem>
            <Separator>/</Separator>
            <LanguageItem
              $active={language === 'en'}
              $disabled={aiLoading}
              onClick={() => {
                if (!aiLoading) setLanguage('en');
              }}
            >
              English
            </LanguageItem>
          </LanguageSwitcher>
        </div>
      </HeaderContainer>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmReturnHome}
        title={t('modal.returnHomeTitle')}
        message={t('modal.returnHomeMessage')}
      />
    </>
  );
};

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useLanguage } from '../context/LanguageContext';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translate3d(0, 100%, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
`;

const FooterContainer = styled.footer`
  padding: 0.5rem 0 0.7rem 0;
  background: ${({ theme }) => theme.colors.white};
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.75rem;
  border-top: 1px solid #eee;
  margin-top: 1.2rem;
  animation: ${fadeInUp} 0.4s ease forwards;

  p {
    margin: 0.25rem 0;
    line-height: 1.5;
  }
`;

const FooterLinksRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 0.4rem;
`;

const FooterLinkButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.78rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <FooterContainer>
      <FooterLinksRow>
        <FooterLinkButton type="button">
          {t('footer.privacy')}
        </FooterLinkButton>
        <FooterLinkButton type="button">
          {t('footer.terms')}
        </FooterLinkButton>
        <FooterLinkButton type="button">
          {t('footer.disclaimerLink')}
        </FooterLinkButton>
      </FooterLinksRow>
      <p>{t('footer.disclaimer')}</p>
      <p>{t('footer.copyright')}</p>
    </FooterContainer>
  );
};

import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaShareAlt, FaQrcode } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import html2canvas from 'html2canvas';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalCard = styled(motion.div)`
  background: white;
  width: 100%;
  max-width: 380px;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  z-index: 10;
  opacity: 0.5;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

const CardContent = styled.div`
  padding: 3rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const HeaderTitle = styled.div`
  font-size: 0.9rem;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const MbtiTitle = styled.h2`
  font-size: 4rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1;
`;

const TypePill = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px ${({ theme }) => `${theme.colors.primary}40`};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem 0.8rem;
  margin-bottom: 1.75rem;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 1rem;
  border-radius: 999px;
  background: ${({ theme }) => `${theme.colors.primary}08`};
  border: 1px solid ${({ theme }) => `${theme.colors.primary}30`};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  line-height: 1.4;
  box-shadow: 0 4px 10px ${({ theme }) => `${theme.colors.primary}1f`};
`;

const SummaryText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  opacity: 0.8;
`;

const QrSection = styled.div`
  background: #f7fafc;
  width: 100%;
  padding: 1rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  text-align: left;
`;

const QrPlaceholder = styled.div`
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const QrText = styled.div`
  h4 {
    margin: 0 0 0.2rem;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.text};
  }
  p {
    margin: 0;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const ShareButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 99px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  box-shadow: 0 4px 15px ${({ theme }) => `${theme.colors.primary}40`};
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 2rem 1.5rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: {
    mbti: string;
    type: string;
    keywords: string[];
    oneLiner: string;
  };
}

export const ShareModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const { t } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);

  const displayKeywords = data.keywords || [];
  const oneLiner = data.oneLiner;

  const handleSaveImage = async () => {
    if (!cardRef.current) return;

    try {
      // Create a canvas from the card element
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 2, // Better resolution
        backgroundColor: null, // Transparent background if needed, but ModalCard has white bg
        ignoreElements: (element) => {
           // Ignore the close button in the screenshot
           return element.tagName === 'BUTTON' && element.innerHTML.includes('path'); // Crude check for close button svg, better to use class or id
        }
      });

      // Convert canvas to data URL
      const image = canvas.toDataURL('image/png');

      // Create a link to download the image
      const link = document.createElement('a');
      link.href = image;
      link.download = `personality-report-${data.mbti}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to save image. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalCard
            ref={cardRef}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton onClick={onClose} className="close-btn">
              <FaTimes />
            </CloseButton>
            
            <CardContent>
              <HeaderTitle>{t('share.myPersonality')}</HeaderTitle>
              <MbtiTitle>{data.mbti}</MbtiTitle>
              <TypePill>{data.type}</TypePill>
              
              <TagsContainer>
                {displayKeywords.map((tag, i) => (
                  <Tag key={i}>{tag}</Tag>
                ))}
              </TagsContainer>
              
              <SummaryText>{oneLiner}</SummaryText>
              
              <QrSection>
                <QrPlaceholder>
                  <FaQrcode />
                </QrPlaceholder>
                <QrText>
                  <h4>{t('share.scanTest')}</h4>
                  <p>{t('share.findYours')}</p>
                </QrText>
              </QrSection>
              
              <ShareButton onClick={handleSaveImage}>
                <FaShareAlt /> {t('report.shareReport')}
              </ShareButton>
            </CardContent>
            
            <Footer>
              <span>PersonaLab</span>
              <span>{new Date().toLocaleDateString()}</span>
            </Footer>
          </ModalCard>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

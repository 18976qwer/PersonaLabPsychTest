import React, { useState } from 'react';
import styled from 'styled-components';
import { FaRobot, FaCopy, FaCheck, FaBrain } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const SectionContainer = styled(motion.div)`
  margin-top: 2rem;
  margin-bottom: 1.8rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.white} 0%, #fffaf0 100%);
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: 1.6rem 2rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.02);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.2rem;
    margin-top: 1.5rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    
    svg {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
  
  p {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 1.05rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const ChatInterface = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 1.4rem;
  border: 1px solid rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: inset 0 2px 6px rgba(0,0,0,0.02);
`;

const AvatarRow = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: flex-start;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const Avatar = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

const ChatBubble = styled.div`
  background: #f7fafc;
  border-radius: 0 20px 20px 20px;
  padding: 1.2rem 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
  position: relative;
  flex-grow: 1;
  border: 1px solid rgba(0,0,0,0.03);
  min-width: 0; /* Important for preventing overflow */
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -12px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 12px 12px 0;
    border-color: transparent #f7fafc transparent transparent;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1rem;
    border-radius: 12px;
    margin-top: 0.5rem;
    
    &::before {
      display: none;
    }
  }
`;

const PromptText = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.8;
  white-space: pre-wrap;
  margin-bottom: 1rem;
  font-family: ${({ theme }) => theme.fonts.main};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 0.9rem;
    line-height: 1.6;
    word-break: break-word;
  }
`;

const CopyButton = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 1.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1.1rem;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  box-shadow: ${({ theme }) => theme.shadows.depth1};
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.hover};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: static;
    margin-bottom: 0.8rem;
    width: 100%;
    justify-content: center;
    padding: 0.6rem;
  }
`;

interface Props {
  prompt: string;
}

export const ChatGPTPromptSection: React.FC<Props> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);
  const { language } = useLanguage();

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLabel = copied
    ? language === 'zh'
      ? '已复制'
      : 'Copied'
    : language === 'zh'
      ? '复制'
      : 'Copy';

  return (
    <SectionContainer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Header>
        <h3>
          <FaRobot /> {language === 'zh' ? 'AI 心理咨询师深度对话' : 'Deep-dive conversation with an AI counselor'}
        </h3>
        <p>
          {language === 'zh'
            ? '基于测试结果，复制下方的专业指令并发送至 AI，以获取更进一步的分析。'
            : 'Based on your results, copy the professional prompt below and send it to an AI assistant for deeper analysis.'}
        </p>
      </Header>
      
      <ChatInterface>
        <AvatarRow>
          <Avatar>
            <FaBrain />
          </Avatar>
          <ChatBubble>
            <CopyButton onClick={handleCopy}>
              {copied ? <FaCheck /> : <FaCopy />}
              {copyLabel}
            </CopyButton>
            <PromptText>{prompt}</PromptText>
          </ChatBubble>
        </AvatarRow>
      </ChatInterface>
    </SectionContainer>
  );
};

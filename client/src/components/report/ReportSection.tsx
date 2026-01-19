import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { IconType } from 'react-icons';
import { FaRobot } from 'react-icons/fa';

const SectionContainer = styled.section`
  margin-bottom: 2rem;
  scroll-margin-top: 100px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 1rem;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 6px rgba(49, 151, 149, 0.2);
`;

const Title = styled.h2`
  font-size: 1.6rem;
  color: #2d3748;
  margin: 0;
  font-weight: 700;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: #f7fafc;
  border: 1px solid #edf2f7;
  transition: all 0.2s;

  &:hover {
    background: #edf2f7;
  }
`;

const ToggleLabel = styled.span<{ $active: boolean }>`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ $active }) => ($active ? '#38a169' : '#718096')};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const ToggleSwitch = styled.div<{ $active: boolean }>`
  width: 44px;
  height: 24px;
  background: ${({ $active }) => ($active ? '#38a169' : '#cbd5e0')};
  border-radius: 12px;
  position: relative;
  transition: background 0.3s;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ $active }) => ($active ? '22px' : '2px')};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: left 0.3s, box-shadow 0.3s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
`;

interface ReportSectionProps {
  id: string;
  title: string;
  icon: IconType;
  children: ReactNode;
  onToggleAi?: () => void;
  isAiEnabled?: boolean;
  showAiToggle?: boolean;
}

export const ReportSection: React.FC<ReportSectionProps> = ({ 
  id, 
  title, 
  icon: Icon, 
  children,
  onToggleAi,
  isAiEnabled = false,
  showAiToggle = false
}) => {
  return (
    <SectionContainer id={id}>
      <SectionHeader>
        <TitleGroup>
          <IconWrapper>
            <Icon />
          </IconWrapper>
          <Title>{title}</Title>
        </TitleGroup>
        
        {showAiToggle && onToggleAi && (
          <ToggleContainer onClick={onToggleAi}>
            <ToggleLabel $active={isAiEnabled}>
              <FaRobot size={14} />
              AI 分析
            </ToggleLabel>
            <ToggleSwitch $active={isAiEnabled} />
          </ToggleContainer>
        )}
      </SectionHeader>
      {children}
    </SectionContainer>
  );
};

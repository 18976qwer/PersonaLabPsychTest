import React, { useState } from 'react';
import styled from 'styled-components';
import { useAi } from '../../context/AiContext';
import { FaCog, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const PanelContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
`;

const Header = styled.div`
  padding: 0.75rem 1rem;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  
  h3 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    color: #2d3748;
  }
`;

const Content = styled.div<{ $isOpen: boolean }>`
  padding: ${({ $isOpen }) => ($isOpen ? '1rem 1rem' : '0 1rem')};
  height: ${({ $isOpen }) => ($isOpen ? 'auto' : '0')};
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transition: all 0.3s ease;
  border-top: ${({ $isOpen }) => ($isOpen ? '1px solid #e2e8f0' : 'none')};
`;

const FormGroup = styled.div`
  margin-bottom: 0.5rem;
`;

const SwitchLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.8rem;
`;

const SwitchInput = styled.input`
  display: none;
`;

const SwitchSlider = styled.div<{ $checked: boolean }>`
  width: 44px;
  height: 24px;
  background-color: ${({ $checked, theme }) => ($checked ? theme.colors.primary : '#cbd5e0')};
  border-radius: 24px;
  position: relative;
  transition: background-color 0.2s;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ $checked }) => ($checked ? '22px' : '2px')};
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
`;

export const AiSettingsPanel: React.FC = () => {
  const { isAiEnabled, setIsAiEnabled } = useAi();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PanelContainer>
      <Header onClick={() => setIsOpen(!isOpen)}>
        <h3>
          <FaCog /> AI 分析设置
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: 'normal', 
            color: isAiEnabled ? '#38a169' : '#718096',
            marginLeft: '0.5rem',
            padding: '2px 8px',
            background: isAiEnabled ? '#f0fff4' : '#edf2f7',
            borderRadius: '12px'
          }}>
            {isAiEnabled ? '已开启' : '已关闭'}
          </span>
        </h3>
        {isOpen ? <FaChevronUp color="#a0aec0" /> : <FaChevronDown color="#a0aec0" />}
      </Header>
      
      <Content $isOpen={isOpen}>
        <FormGroup>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <SwitchLabel>
              <SwitchInput 
                type="checkbox" 
                checked={isAiEnabled} 
                onChange={(e) => setIsAiEnabled(e.target.checked)} 
              />
              <SwitchSlider $checked={isAiEnabled} />
              <span style={{ fontWeight: 500 }}>启用 AI 深度分析功能</span>
            </SwitchLabel>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            开启后，系统将基于您的 MBTI 和九型人格结果生成深度定制报告。
            关闭时将显示标准版分析模板。
          </p>
        </FormGroup>
      </Content>
    </PanelContainer>
  );
};

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { StorageManager } from '../utils/storage';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  max-width: 500px;
  width: 90%;
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const Link = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: ${({ $variant }) => $variant === 'secondary' ? `1px solid #ddd` : 'none'};
  border-radius: 6px;
  font-weight: 600;
  background: ${({ theme, $variant }) => $variant === 'secondary' ? theme.colors.white : theme.colors.primary};
  color: ${({ theme, $variant }) => $variant === 'secondary' ? theme.colors.text : theme.colors.white};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
`;

interface AIConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const AIConfigModal: React.FC<AIConfigModalProps> = ({ isOpen, onClose, onSave }) => {
  const { t } = useLanguage();
  const [apiKey, setApiKey] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const storedKey = StorageManager.getItem<string>('deepseek_api_key');
      const storedEnabled = StorageManager.getItem<string>('deepseek_ai_enabled');
      
      if (storedKey) setApiKey(storedKey);
      // Default to true if not set, or parse string 'true'
      setIsEnabled(storedEnabled === null ? true : storedEnabled === 'true');
    }
  }, [isOpen]);

  const handleSave = () => {
    StorageManager.setItem('deepseek_api_key', apiKey);
    StorageManager.setItem('deepseek_ai_enabled', String(isEnabled));
    onSave(); // Close modal
    navigate('/ai-analysis');
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
          <ModalContainer
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Title>{t('modal.aiConfigTitle')}</Title>
            
            <Description>
              {t('modal.aiModalDesc')}
            </Description>
            
            <FormGroup>
              <Input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t('modal.apiKeyPlaceholder')}
              />
            </FormGroup>

            <CheckboxGroup onClick={() => setIsEnabled(!isEnabled)}>
              <Checkbox 
                type="checkbox" 
                checked={isEnabled} 
                onChange={(e) => setIsEnabled(e.target.checked)}
              />
              <span style={{ cursor: 'pointer', color: '#555' }}>{t('modal.enableAiLabel')}</span>
            </CheckboxGroup>

            <Footer>
              <Link 
                href="https://platform.deepseek.com/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {t('modal.getApiKey')}
              </Link>

              <ButtonGroup>
                <Button $variant="secondary" onClick={onClose}>{t('modal.cancel')}</Button>
                <Button onClick={handleSave}>{t('modal.save')}</Button>
              </ButtonGroup>
            </Footer>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

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
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 1.5rem;
  gap: 1rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  background: ${({ theme, $variant }) => $variant === 'secondary' ? theme.colors.textLight : theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { t } = useLanguage();

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
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{title}</h3>
            <p>{message}</p>
            <ButtonGroup>
              <Button $variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
              <Button onClick={onConfirm}>{t('common.confirm')}</Button>
            </ButtonGroup>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookOpen, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const NavContainer = styled.div`
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: block;
    width: 100%;
    position: fixed;
    top: 56px; /* Header height */
    left: 0;
    right: 0;
    z-index: 890; /* Slightly below the MBTI sidebar z-index if overlapping, but here it is main nav */
    background: ${({ theme }) => theme.colors.background};
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
`;

const NavHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  background: white;
  cursor: pointer;
  border-bottom: 1px solid rgba(0,0,0,0.05);

  h3 {
    font-size: 1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ExpandedMenu = styled(motion.div)`
  background: white;
  padding: 0.5rem 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-radius: 0 0 12px 12px;
  max-height: 60vh;
  overflow-y: auto;
`;

const MenuItem = styled.a`
  display: block;
  padding: 0.8rem 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background: #f7fafc;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ReportNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const menuItems = [
    { id: 'guide', label: t('report.readingGuide') },
    { id: 'traits', label: t('report.traits') },
    { id: 'growth', label: t('report.growth') },
    { id: 'career', label: t('report.career') },
    { id: 'relationships', label: t('report.relationships') },
    { id: 'summary', label: t('report.summary') }
  ];

  const handleScroll = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Header + Nav height compensation
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <NavContainer>
      <NavHeader onClick={() => setIsOpen(!isOpen)}>
        <h3>
          <FaBookOpen size={16} color="#4FD1C5" />
          {t('report.readingGuide')}
        </h3>
        {isOpen ? <FaChevronUp color="#a0aec0" /> : <FaChevronDown color="#a0aec0" />}
      </NavHeader>

      <AnimatePresence>
        {isOpen && (
          <ExpandedMenu
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {menuItems.map(item => (
              <MenuItem 
                key={item.id} 
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll(item.id);
                }}
              >
                {item.label}
              </MenuItem>
            ))}
          </ExpandedMenu>
        )}
      </AnimatePresence>
    </NavContainer>
  );
};

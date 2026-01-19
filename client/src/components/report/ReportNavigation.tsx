import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaBookOpen, FaFingerprint, FaSeedling, FaBriefcase, FaUserFriends, FaFlagCheckered } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const NavContainer = styled.nav`
  position: fixed;
  top: 50%;
  right: 2.5rem;
  transform: translateY(-50%);
  background: white;
  padding: 1.5rem 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  z-index: 100;
  width: 180px;
  
  @media (max-width: 1200px) {
    display: none;
  }
`;

const NavTitle = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-left: 0.8rem;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavItem = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : '#718096')};
  background: ${({ $active }) => ($active ? '#f0fff4' : 'transparent')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  transition: all 0.2s;
  font-size: 0.9rem;

  &:hover {
    background: #f7fafc;
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    font-size: 1rem;
    opacity: ${({ $active }) => ($active ? 1 : 0.6)};
  }
`;

const sections = [
  { id: 'reading-guide', labelKey: 'report.readingGuide', icon: FaBookOpen },
  { id: 'traits', labelKey: 'report.traits', icon: FaFingerprint },
  { id: 'growth', labelKey: 'report.growth', icon: FaSeedling },
  { id: 'career', labelKey: 'report.career', icon: FaBriefcase },
  { id: 'relationships', labelKey: 'report.relationships', icon: FaUserFriends },
  { id: 'summary', labelKey: 'report.summary', icon: FaFlagCheckered },
];

export const ReportNavigation: React.FC = () => {
  const [activeId, setActiveId] = useState('reading-guide');
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <NavContainer>
      <NavTitle>{t('report.navTitle')}</NavTitle>
      <NavList>
        {sections.map(({ id, labelKey, icon: Icon }) => (
          <NavItem 
            key={id} 
            $active={activeId === id}
            onClick={() => scrollToSection(id)}
          >
            <Icon />
            {t(labelKey)}
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  );
};

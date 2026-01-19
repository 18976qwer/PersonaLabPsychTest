import styled from 'styled-components';

export const MobileCardContainer = styled.div`
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

export const DesktopTableContainer = styled.div`
  display: block;
  overflow-x: auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

export const MobileCard = styled.div<{ $borderColor?: string }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border-left: 4px solid ${({ $borderColor, theme }) => $borderColor || theme.colors.primary};
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

export const CardRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  
  strong {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  span, p, div {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1rem;
    line-height: 1.5;
  }
`;

export const ProcessList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ProcessItem = styled.li`
  position: relative;
  padding-left: 2rem;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.6rem;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 0 4px ${({ theme }) => `${theme.colors.secondary}33`};
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 1.5rem;
    bottom: -1rem;
    width: 2px;
    background: ${({ theme }) => `${theme.colors.secondary}33`};
  }
  
  &:last-child::after {
    display: none;
  }
`;

export const ProcessContent = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  
  strong {
    display: block;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.3rem;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

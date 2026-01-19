import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 2rem 1.2rem 2rem;
  position: relative;
  overflow: hidden;
  background: rgb(253, 248, 245);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0.5rem 1rem 1.2rem 1rem;
  }
`;

export const Layout: React.FC = () => {
  return (
    <LayoutWrapper>
      <Header />
      <MainContent>
        <Outlet />
      </MainContent>
      <Footer />
    </LayoutWrapper>
  );
};

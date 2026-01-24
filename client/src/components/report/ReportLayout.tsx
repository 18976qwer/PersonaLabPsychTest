import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { ReportNavigation } from './ReportNavigation';
import { ScrollProgress } from '../common/ScrollProgress';
import { BackToTop } from '../common/BackToTop';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #fcfcfc;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 4.5rem 1rem 2rem 1rem;
  position: relative;
  flex: 1;
  width: 100%;
  
  @media (max-width: 1200px) {
    max-width: 100%;
  }
`;

const MainContent = styled.main`
  width: 100%;
`;

interface Props {
  children: ReactNode;
}

const MobileNavSpacer = styled.div`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: block;
    height: 50px; /* Adjust based on ReportNavigation height */
    margin-bottom: 1rem;
  }
`;

export const ReportLayout: React.FC<Props> = ({ children }) => {
  return (
    <PageContainer>
      <ScrollProgress />
      <ContentWrapper>
        <ReportNavigation />
        <MobileNavSpacer />
        <MainContent>
          {children}
        </MainContent>
      </ContentWrapper>
      <BackToTop />
    </PageContainer>
  );
};

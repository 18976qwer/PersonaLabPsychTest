import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { MBTIPage } from './pages/MBTIPage';
import { EnneagramPage } from './pages/EnneagramPage';
import { ResultsPage } from './pages/ResultsPage';
import { AIAnalysisPage } from './pages/AIAnalysisPage';
import { TestProgressProvider } from './context/TestProgressContext';
import { RequireMBTI, RequireResults } from './components/RouteGuard';
import { LanguageProvider } from './context/LanguageContext';
import { AiProvider } from './context/AiContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <LanguageProvider>
        <AiProvider>
          <TestProgressProvider>
            <BrowserRouter>
              <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<LandingPage />} />
                <Route path="mbti" element={<MBTIPage />} />
                <Route 
                  path="enneagram" 
                  element={
                    <RequireMBTI>
                      <EnneagramPage />
                    </RequireMBTI>
                  } 
                />
                <Route 
                  path="results" 
                  element={
                    <RequireResults>
                      <ResultsPage />
                    </RequireResults>
                  } 
                />
                <Route 
                  path="ai-analysis" 
                  element={
                    <RequireResults>
                      <AIAnalysisPage />
                    </RequireResults>
                  } 
                />
              </Route>
            </Routes>
            </BrowserRouter>
          </TestProgressProvider>
        </AiProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { enneagramQuestionsEn, enneagramQuestionsZh } from '../data/enneagram';
import { StorageManager } from '../utils/storage';
import { useTestProgress } from '../context/TestProgressContext';
import { analyzeEnneagramResults } from '../utils/scoring';
import { useLanguage } from '../context/LanguageContext';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 4.5rem 1rem 1.3rem 1rem;
`;

const PageLayout = styled.div`
  display: flex;
  gap: 2rem;
  position: relative;
  align-items: flex-start;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Sidebar = styled.div`
  width: 250px;
  flex-shrink: 0;
  position: sticky;
  top: 6rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    position: sticky;
    top: 60px;
    z-index: 100;
    background: ${({ theme }) => theme.colors.background};
    padding: 0;
    margin-top: 0;
    height: auto;
  }
`;

const SidebarContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  margin-bottom: 2rem;

  h3 {
    margin-bottom: 1rem;
    font-size: 1.1rem;
    color: ${({ theme }) => theme.colors.text};
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0;
    max-height: none;
    margin-bottom: 0;
    background: transparent;
    box-shadow: none;
    border-radius: 0;
    
    h3 {
      margin-bottom: 0;
      cursor: pointer;
    }
  }
`;

const ExpandedContent = styled.div<{ $isExpanded?: boolean }>`
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: ${({ $isExpanded }) => ($isExpanded ? 'block' : 'none')};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 100;
    border-radius: 0 0 12px 12px;
    margin-top: 0;
    border-top: none;
  }
`;

const QuestionGrid = styled.div<{ $isExpanded?: boolean }>`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  justify-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(5, 1fr);
    max-height: 300px;
    overflow-y: auto;
    width: 100%;
  }
`;

const MobileProgressHeader = styled.div`
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    position: relative;
    padding: 0.8rem 1rem;
    background: #f0f2f5;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    cursor: pointer;
    z-index: 101;
    
    h3 {
      font-size: 0.95rem;
      font-weight: 600;
      color: #4a5568;
      margin: 0;
    }
  }
`;

const MobileProgressPreview = styled.div`
  display: none;
`;

const QuestionNumber = styled.button<{ $status: 'answered' | 'active' | 'normal' }>`
  width: 100%;
  aspect-ratio: 1;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'answered':
        return `
          background: ${theme.colors.primary};
          color: white;
        `;
      case 'active':
        return `
          background: #fbd38d; // Yellowish
          color: ${theme.colors.text};
          border: 2px solid #f6ad55;
        `;
      default: // normal
        return `
          background: #f0f0f0;
          color: ${theme.colors.text};
          &:hover { background: #e0e0e0; }
        `;
    }
  }}
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
    flex-shrink: 0;
  }
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  margin-top: 1.4rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-top: 0;
  }
`;

const TestButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
`;

const PageTitle = styled.h2`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const QuestionItem = styled.div<{ $isActive: boolean }>`
  background: ${({ $isActive }) => $isActive ? '#fffcf0' : '#f7fafc'};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  margin-bottom: 1.5rem;
  border: 1px solid ${({ $isActive }) => $isActive ? '#fbd38d' : '#e2e8f0'};
  transition: all 0.3s ease;
`;

const QuestionText = styled.h4`
  margin-bottom: 1rem;
`;

const OptionsScale = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0;
  align-items: stretch;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`;

const ScaleOption = styled.label<{ $selected: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 0.5rem 2px;
  color: ${({ theme, $selected }) => $selected ? '#2c7a7b' : theme.colors.text};
  font-size: 0.85rem;
  transition: all 0.2s;
  white-space: normal;
  text-align: center;
  line-height: 1.2;

  &:hover {
    color: #2c7a7b;
  }

  /* Custom Radio Button */
  &::before {
    content: '';
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid ${({ $selected }) => $selected ? '#319795' : '#cbd5e0'};
    background-color: transparent;
    transition: all 0.2s;
    flex-shrink: 0;
    
    ${({ $selected }) => $selected && `
      background-color: transparent;
      box-shadow: inset 0 0 0 4px #319795; /* Create a dot effect */
    `}
  }

  input {
    display: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1.4rem 0 0.5rem 0;
`;

const NavButton = styled.button`
  padding: 0.75rem 2rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 6px;
  font-weight: 600;
  
  &:disabled {
    background: ${({ theme }) => theme.colors.textLight};
    cursor: not-allowed;
  }
`;

const ITEMS_PER_PAGE = 9;

export const EnneagramPage: React.FC = () => {
  const navigate = useNavigate();
  const { setProgress, setTotal, setShowProgress } = useTestProgress();
  const { language, t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [pendingScrollTo, setPendingScrollTo] = useState<number | null>(null);
  const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);

  // Ensure page is at the top when entering the Enneagram test
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const enneagramQuestions = language === 'zh' ? enneagramQuestionsZh : enneagramQuestionsEn;
  
  const optionsZh = [
    '完全不同意',
    '很不同意',
    '不同意',
    '中立',
    '同意',
    '很同意',
    '完全同意'
  ];

  const optionsEn = [
    'Strongly Disagree',
    'Disagree',
    'Somewhat Disagree',
    'Neutral',
    'Somewhat Agree',
    'Agree',
    'Strongly Agree'
  ];

  const currentOptions = language === 'zh' ? optionsZh : optionsEn;

  useEffect(() => {
    // Reset progress for new test section
    const savedAnswers = StorageManager.getItem<Record<number, number>>('enneagram_answers');
    const initialProgress = savedAnswers ? Object.keys(savedAnswers).length : 0;
    
    setTotal(enneagramQuestions.length);
    setProgress(initialProgress);
    setShowProgress(true);

    if (savedAnswers) {
      setAnswers(savedAnswers);
    }
  }, [setTotal, setShowProgress, setProgress, enneagramQuestions.length]);

  useEffect(() => {
    setProgress(Object.keys(answers).length);
    StorageManager.setItem('enneagram_answers', answers);
  }, [answers, setProgress]);

  useEffect(() => {
    if (pendingScrollTo !== null) {
      const element = questionRefs.current[pendingScrollTo];
      if (element) {
        const rect = element.getBoundingClientRect();
        const absoluteY = window.scrollY + rect.top;
        const offset = 80;
        window.scrollTo({
          top: absoluteY - offset,
          behavior: 'smooth'
        });
        setPendingScrollTo(null);
      }
    }
  }, [currentPage, pendingScrollTo]);

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    setAnswers(prev => {
      const updated = { ...prev, [questionId]: optionIndex };
      const nextUnansweredInPage = currentQuestions.find(q => updated[q.id] === undefined);
      setCurrentQuestionId(nextUnansweredInPage ? nextUnansweredInPage.id : questionId);
      return updated;
    });
  };

  const totalPages = Math.ceil(enneagramQuestions.length / ITEMS_PER_PAGE);
  const currentQuestions = enneagramQuestions.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const isPageComplete = currentQuestions.every(q => answers[q.id] !== undefined);
  const firstUnansweredId = currentQuestions.find(q => answers[q.id] === undefined)?.id;
  const activeQuestionId = currentQuestionId ?? firstUnansweredId ?? currentQuestions[0]?.id;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      // Finish
      const result = analyzeEnneagramResults(answers);
      StorageManager.setItem('enneagram_result', result);
      navigate('/results');
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo(0, 0);
    } else {
      // Go back to MBTI page
      navigate('/mbti');
    }
  };

  const handleSidebarClick = (questionId: number) => {
    const targetPage = Math.floor((questionId - 1) / ITEMS_PER_PAGE);
    if (targetPage !== currentPage) {
      setCurrentPage(targetPage);
    }
    setPendingScrollTo(questionId);
    setCurrentQuestionId(questionId);
  };

  const fillAllAnswers = () => {
    const newAnswers: Record<number, number> = {};
    enneagramQuestions.forEach(q => {
      const randomOption = Math.floor(Math.random() * 7); // 0-6
      newAnswers[q.id] = randomOption;
    });
    setAnswers(newAnswers);
  };

  return (
    <Container>
      <PageLayout>
        <Sidebar>
          <SidebarContent>
            <MobileProgressHeader onClick={() => setIsExpanded(!isExpanded)}>
              <h3>{t('mbti.progress') || (language === 'zh' ? '答题进度' : 'Progress')}</h3>
              <MobileProgressPreview>
                {enneagramQuestions.map((q) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isActive = q.id === activeQuestionId;
                  
                  // Only show a few bubbles around current question
                  const currentIndex = enneagramQuestions.findIndex(eq => eq.id === activeQuestionId);
                  const qIndex = enneagramQuestions.findIndex(eq => eq.id === q.id);
                  if (Math.abs(qIndex - currentIndex) > 2 && qIndex !== 0 && qIndex !== enneagramQuestions.length - 1) return null;

                  return (
                    <QuestionNumber
                      key={q.id}
                      $status={isAnswered ? 'answered' : isActive ? 'active' : 'normal'}
                      style={{ minWidth: '30px', width: '30px', height: '30px', fontSize: '0.8rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSidebarClick(q.id);
                      }}
                    >
                      {q.id}
                    </QuestionNumber>
                  );
                })}
              </MobileProgressPreview>
              <div style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                ▼
              </div>
            </MobileProgressHeader>

            <h3 className="desktop-only" style={{ display: 'none' }}>{t('mbti.progress') || (language === 'zh' ? '答题进度' : 'Progress')}</h3>
            <style>{`
              @media (min-width: 769px) {
                .desktop-only { display: block !important; }
              }
            `}</style>

            <ExpandedContent $isExpanded={isExpanded}>
              <QuestionGrid>
                {enneagramQuestions.map((q) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isActive = q.id === activeQuestionId;
                  
                  return (
                    <QuestionNumber
                      key={q.id}
                      $status={isAnswered ? 'answered' : isActive ? 'active' : 'normal'}
                      onClick={() => {
                        handleSidebarClick(q.id);
                        setIsExpanded(false);
                      }}
                    >
                      {q.id}
                    </QuestionNumber>
                  );
                })}
              </QuestionGrid>
              <TestButton onClick={fillAllAnswers}>测试专用：一键填写</TestButton>
            </ExpandedContent>
          </SidebarContent>
        </Sidebar>

        <MainContent>
          <PageTitle>{t('enneagram.title')} ({t('enneagram.page')} {currentPage + 1}/{totalPages})</PageTitle>
      
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentQuestions.map(q => (
              <QuestionItem 
                key={q.id} 
                $isActive={q.id === activeQuestionId}
                ref={(el: HTMLDivElement | null) => { questionRefs.current[q.id] = el; }}
              >
                <QuestionText>{q.id}. {q.question}</QuestionText>
                <OptionsScale>
              {/* Force casting to string[] because we know t returns array for this key or fallback */}
              {(currentOptions as string[]).map((opt, idx) => (
                <ScaleOption key={idx} $selected={answers[q.id] === idx}>
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={idx}
                    checked={answers[q.id] === idx}
                    onChange={() => handleOptionSelect(q.id, idx)}
                  />
                  {opt}
                </ScaleOption>
              ))}
            </OptionsScale>
          </QuestionItem>
        ))}
      </motion.div>

      <ButtonGroup>
        <NavButton onClick={handlePrev}>
          {t('common.prev')}
        </NavButton>
        <NavButton onClick={handleNext} disabled={!isPageComplete}>
          {currentPage === totalPages - 1 ? t('enneagram.seeResults') : t('common.next')}
        </NavButton>
      </ButtonGroup>
    </MainContent>
  </PageLayout>
</Container>
  );
};

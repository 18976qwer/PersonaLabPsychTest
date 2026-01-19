import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { mbtiQuestionsEn, mbtiQuestionsZh } from '../data/mbti';
import { StorageManager } from '../utils/storage';
import { useTestProgress } from '../context/TestProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { FaExclamationTriangle } from 'react-icons/fa';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4.5rem 1rem 0.5rem 1rem;
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
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 6rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    position: sticky;
    top: 60px; /* Exact header height match */
    z-index: 100;
    background: ${({ theme }) => theme.colors.background};
    padding: 0;
    margin-top: 0;
    height: auto;
  }
`;

const SidebarContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  margin-bottom: 2rem;
  
  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.text};
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0;
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
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  justify-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(4, 1fr);
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
    background: #f0f2f5; /* Light gray background for folded state */
    border-bottom: 1px solid rgba(0,0,0,0.05);
    cursor: pointer; /* Ensure clickable */
    z-index: 101; /* Above expanded content */
    
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

const QuestionNumber = styled.button<{ $status: 'answered' | 'error' | 'normal' | 'active' }>`
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
  font-size: 0.9rem;
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'answered':
        return `
          background: ${theme.colors.primary};
          color: white;
        `;
      case 'error':
        return `
          background: #ff4d4f; // Red
          color: white;
        `;
      case 'active':
        return `
          background: #fff7ed;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
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
  margin-top: 0.4rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-top: 0;
  }
`;

const PageTitle = styled.h2`
  margin: 0.7rem 0 1.3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-top: 0.5rem;
  }
`;

const AlertBar = styled(motion.div)`
  position: sticky;
  top: 1rem;
  z-index: 90;
  background: #ff4d4f;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #ff7875;
  }
`;

const QuestionCard = styled(motion.div)<{ $hasError?: boolean; $isActive?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  padding: 1.4rem 1.6rem;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  margin-bottom: 1.1rem;
  border: 2px solid
    ${({ $hasError, $isActive }) =>
      $hasError ? '#ff4d4f' : $isActive ? '#f6ad55' : 'transparent'};
  background: ${({ $isActive }) => ($isActive ? '#fffcf0' : 'white')};
  transition: border-color 0.3s, background-color 0.3s;
`;

const QuestionText = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const OptionButton = styled.button<{ $selected: boolean }>`
  padding: 0.85rem;
  text-align: left;
  background: ${({ theme, $selected }) => $selected ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, $selected }) => $selected ? theme.colors.white : theme.colors.text};
  border: 2px solid ${({ theme, $selected }) => $selected ? theme.colors.primary : 'transparent'};
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 1rem;

  &:hover {
    background: ${({ theme, $selected }) => $selected ? theme.colors.primary : '#e9ecef'};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1.2rem 0 0.5rem 0;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.textLight};
    cursor: not-allowed;
    transform: none;
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

export const MBTIPage: React.FC = () => {
  const navigate = useNavigate();
  const { setProgress, setTotal, setShowProgress } = useTestProgress();
  const { language, t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    return StorageManager.getItem<Record<number, string>>('mbti_answers') || {};
  });
  const [triedSubmit, setTriedSubmit] = useState(false);
  const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);

  const mbtiQuestions = language === 'zh' ? mbtiQuestionsZh : mbtiQuestionsEn;

  useEffect(() => {
    setTotal(mbtiQuestions.length);
    setShowProgress(true);
  }, [setTotal, setShowProgress, mbtiQuestions.length, mbtiQuestions]);

  useEffect(() => {
    const unanswered = mbtiQuestions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      setCurrentQuestionId(unanswered[0].id);
    } else if (mbtiQuestions.length > 0) {
      setCurrentQuestionId(mbtiQuestions[0].id);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      setProgress(Object.keys(answers).length);
      StorageManager.setItem('mbti_answers', answers);
    }
  }, [answers, setProgress]);

  const handleOptionSelect = (questionId: number, value: string) => {
    setAnswers(prev => {
      const updated = { ...prev, [questionId]: value };
      const wasAnswered = !!prev[questionId];
      if (wasAnswered) {
        setCurrentQuestionId(questionId);
      } else {
        const nextUnanswered = mbtiQuestions.find(q => !updated[q.id]);
        setCurrentQuestionId(nextUnanswered ? nextUnanswered.id : null);
      }
      return updated;
    });
  };

  const getUnansweredQuestions = () => {
    return mbtiQuestions.filter(q => !answers[q.id]);
  };

  // Ensure page is at the top whenever进入 MBTI 测试界面
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const scrollToQuestion = (id: number) => {
    const element = questionRefs.current[id];
    if (element) {
      const rect = element.getBoundingClientRect();
      const absoluteY = window.scrollY + rect.top;
      const offset = 80;
      window.scrollTo({
        top: absoluteY - offset,
        behavior: 'smooth'
      });
      setCurrentQuestionId(id);
    }
  };

  const handleSubmit = () => {
    setTriedSubmit(true);
    const unanswered = getUnansweredQuestions();
    
    if (unanswered.length > 0) {
      // Scroll to first unanswered
      scrollToQuestion(unanswered[0].id);
      return;
    }

    calculateAndSaveResult();
    navigate('/enneagram');
  };

  const calculateAndSaveResult = () => {
    let e = 0, i = 0, s = 0, n = 0, t = 0, f = 0, j = 0, p = 0;

    mbtiQuestionsEn.forEach(q => {
      const answer = answers[q.id];
      if (answer === 'E') e++;
      if (answer === 'I') i++;
      if (answer === 'S') s++;
      if (answer === 'N') n++;
      if (answer === 'T') t++;
      if (answer === 'F') f++;
      if (answer === 'J') j++;
      if (answer === 'P') p++;
    });

    const type = [
      e > i ? 'E' : 'I', // Tie goes to I (Right side)
      s > n ? 'S' : 'N', // Tie goes to N (Right side)
      t > f ? 'T' : 'F', // Tie goes to F (Right side)
      j > p ? 'J' : 'P'  // Tie goes to P (Right side)
    ].join('');

    StorageManager.setItem('mbti_result', type);
    StorageManager.setItem('mbti_letter_counts', {
      E: e,
      I: i,
      S: s,
      N: n,
      T: t,
      F: f,
      J: j,
      P: p
    });
  };

  const fillAllAnswers = () => {
    const newAnswers: Record<number, string> = {};
    mbtiQuestions.forEach(q => {
      const randomOption = q.options[Math.floor(Math.random() * q.options.length)];
      newAnswers[q.id] = randomOption.value;
    });
    setAnswers(newAnswers);
  };

  const unansweredCount = getUnansweredQuestions().length;

  return (
    <Container>
      <PageLayout>
        <Sidebar>
          <SidebarContent>
            <MobileProgressHeader onClick={() => setIsExpanded(!isExpanded)}>
              <h3>{t('mbti.progress') || 'Progress'}</h3>
              <MobileProgressPreview>
                {mbtiQuestions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = currentQuestionId === q.id;
                  const currentIndex = mbtiQuestions.findIndex(mq => mq.id === currentQuestionId);
                  
                  if (Math.abs(idx - currentIndex) > 2 && idx !== 0 && idx !== mbtiQuestions.length - 1) return null;
                  
                  return (
                    <QuestionNumber
                      key={q.id}
                      $status={isAnswered ? 'answered' : isCurrent ? 'active' : 'normal'}
                      style={{ minWidth: '30px', width: '30px', height: '30px', fontSize: '0.8rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToQuestion(q.id);
                      }}
                    >
                      {idx + 1}
                    </QuestionNumber>
                  );
                })}
              </MobileProgressPreview>
              <div style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                ▼
              </div>
            </MobileProgressHeader>

            <h3 className="desktop-only" style={{ display: 'none' }}>{t('mbti.progress') || 'Progress'}</h3>
            <style>{`
              @media (min-width: 769px) {
                .desktop-only { display: block !important; }
              }
            `}</style>

            <ExpandedContent $isExpanded={isExpanded}>
              <QuestionGrid>
                {mbtiQuestions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isError = triedSubmit && !isAnswered;
                  const isCurrent = currentQuestionId === q.id;
                  const status = isAnswered ? 'answered' : isError ? 'error' : isCurrent ? 'active' : 'normal';
                  return (
                    <QuestionNumber
                      key={q.id}
                      $status={status}
                      onClick={() => {
                        scrollToQuestion(q.id);
                        setIsExpanded(false);
                      }}
                    >
                      {idx + 1}
                    </QuestionNumber>
                  );
                })}
              </QuestionGrid>
              <TestButton onClick={fillAllAnswers}>测试专用：一键填写</TestButton>
            </ExpandedContent>
          </SidebarContent>
        </Sidebar>

        <MainContent>
          <PageTitle>{t('mbti.title')}</PageTitle>
          <p style={{ marginBottom: '1.3rem' }}>{t('mbti.instruction')}</p>

          <AnimatePresence>
            {triedSubmit && unansweredCount > 0 && (
              <AlertBar
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => {
                  const firstUnanswered = getUnansweredQuestions()[0];
                  if (firstUnanswered) scrollToQuestion(firstUnanswered.id);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaExclamationTriangle />
                  {language === 'zh' 
                    ? `您有 ${unansweredCount} 道题目未作答，点击此处跳转`
                    : `You have ${unansweredCount} unanswered questions. Click to jump.`}
                </div>
              </AlertBar>
            )}
          </AnimatePresence>

          {mbtiQuestions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              ref={(el: HTMLDivElement | null) => { questionRefs.current[q.id] = el; }}
              $hasError={triedSubmit && !answers[q.id]}
              $isActive={currentQuestionId === q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <QuestionText>{idx + 1}. {(q as any).text}</QuestionText>
              
              <OptionsContainer>
                {q.options.map((option, optIdx) => (
                  <OptionButton
                    key={optIdx}
                    $selected={answers[q.id] === option.value}
                    onClick={() => handleOptionSelect(q.id, option.value)}
                  >
                    {option.label}
                  </OptionButton>
                ))}
              </OptionsContainer>
            </QuestionCard>
          ))}

          <SubmitButton onClick={handleSubmit}>
            {t('mbti.nextStep') || (language === 'zh' ? '下一步：九型人格' : 'Next Step: Enneagram')}
          </SubmitButton>
        </MainContent>
      </PageLayout>
    </Container>
  );
};

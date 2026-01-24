import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { likertQuestions, likertLabels } from '../data/mbtiLikert';
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
    position: fixed;
    top: 56px; /* Exact header height match */
    left: 0;
    right: 0;
    z-index: 900;
    background: ${({ theme }) => theme.colors.background};
    padding: 0;
    margin-top: 0;
    height: auto;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
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
    background: #fff0f0; /* Light pink background to match style */
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
    padding: 0.5rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 100;
    border-radius: 0 0 12px 12px;
    margin-top: 0;
    border-top: 1px solid rgba(0,0,0,0.05);
  }
`;

const QuestionGrid = styled.div<{ $isExpanded?: boolean }>`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  justify-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(14, 1fr);
    gap: 0.2rem;
    max-height: none;
    overflow: visible;
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
    background: transparent;
    cursor: pointer;
    z-index: 101;
    
    h3 {
      font-size: 1rem;
      font-weight: 700;
      color: ${({ theme }) => theme.colors.textLight};
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
    font-size: 0.6rem;
    padding: 0;
  }
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  margin-top: 0.4rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-top: 45px; /* Compensate for fixed sidebar height */
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

const OptionsScale = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  align-items: stretch;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(7, 1fr);
  }
`;

const ScaleOption = styled.label<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 0.6rem 2px;
  color: ${({ theme, $selected }) => $selected ? theme.colors.secondary : theme.colors.text};
  font-size: 0.85rem;
  transition: all 0.2s;
  text-align: center;
  line-height: 1.2;
  user-select: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
  
  &::before {
    content: '';
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid ${({ $selected, theme }) => $selected ? theme.colors.secondary : '#cbd5e0'};
    background-color: transparent;
    transition: all 0.2s;
    flex-shrink: 0;
    
    ${({ $selected, theme }) => $selected && `
      background-color: transparent;
      box-shadow: inset 0 0 0 4px ${theme.colors.secondary};
    `}
  }
  
  input {
    display: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1.2rem 0 0.6rem 0;
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
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [triedSubmit, setTriedSubmit] = useState(false);
  const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pendingScrollTo, setPendingScrollTo] = useState<number | null>(null);

  const mbtiQuestions = likertQuestions.map(q => ({
    id: q.id,
    text: language === 'zh' ? q.textZh : q.textEn,
    dimension: q.dimension,
    side: q.side
  }));
  const totalPages = 6;
  const perPage = 7;
  const pagedQuestions = Array.from({ length: totalPages }, (_, i) =>
    mbtiQuestions.slice(i * perPage, i * perPage + perPage)
  );

  useEffect(() => {
    setTotal(mbtiQuestions.length);
    setShowProgress(true);
  }, [setTotal, setShowProgress, mbtiQuestions.length, mbtiQuestions]);

  useEffect(() => {
    // Restore progress from storage if available
    const savedAnswers = StorageManager.getItem<Record<number, number>>('mbti_likert_answers');
    if (savedAnswers) {
      setAnswers(savedAnswers);
    }
  }, []);

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
      StorageManager.setItem('mbti_likert_answers', answers);
    }
  }, [answers, setProgress]);

  const handleOptionSelect = (questionId: number, value: number) => {
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
        setCurrentQuestionId(pendingScrollTo);
        setPendingScrollTo(null);
      }
    }
  }, [currentPage, pendingScrollTo]);

  const scrollToQuestion = (id: number) => {
    const targetPage = Math.ceil(id / perPage);
    if (targetPage !== currentPage) {
      setCurrentPage(targetPage);
      setPendingScrollTo(id);
    } else {
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
    let E = 0, I = 0, S = 0, N = 0, T = 0, F = 0, J = 0, P = 0;
    let A = 0, TT = 0;
    mbtiQuestions.forEach(q => {
      const raw = answers[q.id] || 0; // 1..7
      const mapped = raw - 4; // -3..+3
      if (mapped === 0) return;
      if (q.dimension === 'EI') {
        if (q.side === 'E') E += Math.max(0, mapped);
        if (q.side === 'I') I += Math.max(0, mapped);
      } else if (q.dimension === 'SN') {
        if (q.side === 'S') S += Math.max(0, mapped);
        if (q.side === 'N') N += Math.max(0, mapped);
      } else if (q.dimension === 'TF') {
        if (q.side === 'T') T += Math.max(0, mapped);
        if (q.side === 'F') F += Math.max(0, mapped);
      } else if (q.dimension === 'JP') {
        if (q.side === 'J') J += Math.max(0, mapped);
        if (q.side === 'P') P += Math.max(0, mapped);
      } else if (q.dimension === 'ID') {
        if (q.side === 'A') A += Math.max(0, mapped);
        if (q.side === 'T') TT += Math.max(0, mapped);
      }
    });
    const choose = (left: number, right: number, leftLetter: string, rightLetter: string) => {
      const total = left + right;
      if (total === 0) return rightLetter;
      const rightPct = right / total;
      return rightPct > 0.5 ? rightLetter : rightPct < 0.5 ? leftLetter : rightLetter;
    };
    const L1 = choose(E, I, 'E', 'I');
    const L2 = choose(S, N, 'S', 'N');
    const L3 = choose(T, F, 'T', 'F');
    const L4 = choose(J, P, 'J', 'P');
    const type = `${L1}${L2}${L3}${L4}`;
    const identity = (() => {
      const total = A + TT;
      if (total === 0) return 'A';
      const aPct = A / total;
      return aPct >= 0.55 ? 'A' : 'T';
    })();
    const fullType = `${type}-${identity}`;
    StorageManager.setItem('mbti_result', type);
    StorageManager.setItem('mbti_identity', identity);
    StorageManager.setItem('mbti_type_full', fullType);
    StorageManager.setItem('mbti_letter_counts', { E, I, S, N, T, F, J, P });
    StorageManager.setItem('mbti_identity_counts', { A, T: TT });
  };

  const fillAllAnswers = () => {
    const newAnswers: Record<number, number> = {};
    mbtiQuestions.forEach(q => {
      newAnswers[q.id] = Math.floor(Math.random() * 7) + 1;
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <TestButton onClick={() => {
                  const preset: Record<number, number> = {};
                  mbtiQuestions.forEach(q => {
                    let v = 4;
                    if (q.dimension === 'EI') v = q.side === 'E' ? 7 : 1;
                    else if (q.dimension === 'SN') v = q.side === 'N' ? 7 : 1;
                    else if (q.dimension === 'TF') v = q.side === 'T' ? 7 : 1;
                    else if (q.dimension === 'JP') v = q.side === 'J' ? 7 : 1;
                    else if (q.dimension === 'ID') v = q.side === 'A' ? 7 : 1;
                    preset[q.id] = v;
                  });
                  setAnswers(preset);
                }}>极端：ENTJ-A</TestButton>
                <TestButton onClick={() => {
                  const preset: Record<number, number> = {};
                  mbtiQuestions.forEach(q => {
                    let v = 4;
                    if (q.dimension === 'EI') v = q.side === 'I' ? 7 : 1;
                    else if (q.dimension === 'SN') v = q.side === 'S' ? 7 : 1;
                    else if (q.dimension === 'TF') v = q.side === 'F' ? 7 : 1;
                    else if (q.dimension === 'JP') v = q.side === 'P' ? 7 : 1;
                    else if (q.dimension === 'ID') v = q.side === 'T' ? 7 : 1;
                    preset[q.id] = v;
                  });
                  setAnswers(preset);
                }}>极端：ISFP-T</TestButton>
              </div>
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

          {pagedQuestions[currentPage - 1].map((q, idx) => (
            <QuestionCard
              key={q.id}
              ref={(el: HTMLDivElement | null) => { questionRefs.current[q.id] = el; }}
              $hasError={triedSubmit && !answers[q.id]}
              $isActive={currentQuestionId === q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <QuestionText>{(currentPage - 1) * perPage + idx + 1}. {q.text}</QuestionText>
              
              <OptionsContainer>
                <OptionsScale>
                  {(language === 'zh' ? likertLabels.zh : likertLabels.en).map((label, i) => {
                    const val = i + 1;
                    const selected = answers[q.id] === val;
                    return (
                      <ScaleOption key={val} $selected={selected} onClick={() => handleOptionSelect(q.id, val)}>
                        <input type="radio" name={`q-${q.id}`} value={val} />
                        {label}
                      </ScaleOption>
                    );
                  })}
                </OptionsScale>
              </OptionsContainer>
            </QuestionCard>
          ))}

          <ButtonGroup>
            <NavButton
              style={{ background: 'rgb(255, 127, 127)' }}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              {t('common.prev')}
            </NavButton>
            <div style={{ alignSelf: 'center', color: '#718096' }}>
              {language === 'zh' ? `第 ${currentPage} / ${totalPages} ${t('mbti.page')}` : `Page ${currentPage} / ${totalPages}`}
            </div>
            <NavButton
              style={{ background: 'rgb(113, 128, 150)' }}
              onClick={() => {
                if (currentPage === totalPages) {
                  handleSubmit();
                } else {
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo(0, 0);
                }
              }}
            >
              {currentPage === totalPages 
                ? (t('mbti.nextStep') || (language === 'zh' ? '下一步：九型人格' : 'Next Step: Enneagram'))
                : t('common.next')}
            </NavButton>
          </ButtonGroup>
        </MainContent>
      </PageLayout>
    </Container>
  );
};

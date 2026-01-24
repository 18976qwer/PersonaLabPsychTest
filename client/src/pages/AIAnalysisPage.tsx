import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { StorageManager } from '../utils/storage';
import { AIReportData, fetchAiAnalysis } from '../utils/ai';
import { mockAiReportZh, mockAiReportEn } from '../data/mockAiReport';
import { useLanguage } from '../context/LanguageContext';
import { EnneagramResult } from '../utils/scoring';
import { mbtiDescriptionsEn, mbtiDescriptionsZh } from '../data/mbti';
import { enneagramDescriptionsEn, enneagramDescriptionsZh } from '../data/enneagram';
import { FaCopy, FaCheck } from 'react-icons/fa';

const Container = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 6rem 1rem 4rem 1rem; /* Increased top padding to account for fixed header (approx 4rem height) + desired spacing */
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 0; /* Removed margin-bottom */
`;

const Section = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 0.9rem 1.6rem 0.8rem 1.6rem;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.8rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary}20;
  padding-bottom: 0.5rem;
`;

const GuideGrid = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.5rem;
  align-items: stretch; /* Ensure columns have same height */
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled.div`
  background: linear-gradient(135deg, #F0FDF9 0%, #E6FFFA 100%);
  padding: 1rem 1.2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: 0.8rem;
`;

const ProfileTitle = styled.h3`
  font-size: 20px; /* Increased font size from 18px to 20px */
  color: #00695C;
  font-weight: 600;
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.4;
  max-width: 100%;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const BigType = styled.h2`
  font-size: 48px;
  font-weight: 800;
  color: #00695C;
  margin: 0;
  line-height: 1;
`;

const IconsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  font-size: 40px;
  margin-top: 0.6rem;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
`;

const InfoBlockContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px; /* Increased gap from 8px to 12px */
  margin-top: 0;
  max-width: 210px;
`;

const InfoBlock = styled.div`
  background: rgba(255, 255, 255, 0.6);
  padding: 8px 12px;
  border-radius: 12px;
  box-shadow: none;
  width: 100%;
  border: 1px solid rgba(0, 137, 123, 0.1);
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  }
  
  h4 {
    font-size: 16px;
    color: #00695C;
    margin-bottom: 2px;
    font-weight: 700;
    opacity: 0.8;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  
  p {
    font-size: 22px;
    font-weight: 600;
    color: #1F2937;
    margin: 0;
  }
`;

const GuideContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Evenly distribute space */
  gap: 0; /* Let space-between handle spacing */
  height: 100%;
  padding: 1rem 0;
`;

const GuideIntro = styled.p`
  font-size: 1.1rem;
  color: #455A64;
  line-height: 1.6;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const GuideOutro = styled.p`
  font-size: 1.1rem;
  color: #00897B; /* Mint accent */
  font-weight: 600;
  margin: 0;
  text-align: left;
`;


const GuideSection = styled.div`
  margin-bottom: 0.75rem;
  padding: 0.9rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
  
  h3 {
    font-size: 1.3rem;
    color: #375A7F;
    margin-bottom: 4px;
    font-weight: 700;
  }
  
  ol, ul {
    padding-left: 1.5rem;
    margin: 4px 0;
  }
 
  ol {
    list-style-type: decimal;
  }
  
  ul {
    list-style-type: disc;
  }
  
  li {
    margin-bottom: 3px;
    line-height: 1.35;
    color: #455A64;
    padding-left: 4px;
  }
  
  li::marker {
    color: #00897B;
    font-weight: 700;
  }
`;

const PromptSection = styled.div`
  background: #1A1A1A; /* Dark terminal background */
  padding: 1rem 1rem 0.9rem 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  color: #E0E0E0; /* Light grey text */
  position: relative; /* For absolute positioning of copy button */
`;

const CenteredPromptTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 800;
  text-align: center;
  margin: 0 0 0.6rem 0;
`;

const PromptContent = styled.div`
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.95rem;
  line-height: 1.45;
  white-space: pre-wrap;
  color: #A0A0A0; /* Dimmed text color */
  
  strong {
    color: #4DB6AC; /* Highlight color */
    font-weight: bold;
  }
`;

const CopyButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #333;
  border: 1px solid #444;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  transition: all 0.2s;

  &:hover {
    background: #444;
    border-color: #555;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const AIAnalysisPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<AIReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [profile, setProfile] = useState<{
    mbti: string;
    mbtiName: string;
    mbtiIcon: string;
    enneagram: string;
    enneagramName: string;
    enneagramIcon: string;
    wing: string;
    wingName: string;
  } | null>(null);
  
  // Cache for reports to prevent re-fetching
  const reportCache = useRef<{ zh: AIReportData | null, en: AIReportData | null }>({ zh: null, en: null });

  const mbtiDescriptions = language === 'zh' ? mbtiDescriptionsZh : mbtiDescriptionsEn;
  const enneagramDescriptions = language === 'zh' ? enneagramDescriptionsZh : enneagramDescriptionsEn;

  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      const mbti = StorageManager.getItem<string>('mbti_result');
      const enneagram = StorageManager.getItem<EnneagramResult>('enneagram_result');
      const storedAiEnabled = StorageManager.getItem<string>('deepseek_ai_enabled');
      const aiEnabled = storedAiEnabled === null ? true : storedAiEnabled === 'true';

      if (!mbti || !enneagram) {
        navigate('/results');
        return;
      }

      // Set profile data for the reading guide card
      const mbtiData = mbtiDescriptions[mbti];
      const enneagramData = enneagramDescriptions[enneagram.mainType];
      const wingData = enneagramDescriptions[enneagram.subtype];
      
      setProfile({
        mbti,
        mbtiName: mbtiData?.title || '',
        mbtiIcon: mbtiData?.icon || '🧩', // Fallback icon
        enneagram: String(enneagram.mainType),
        enneagramName: enneagramData?.title || '',
        enneagramIcon: enneagramData?.avatar || '🌟', // Fallback icon
        wing: String(enneagram.subtype),
        wingName: wingData?.title || ''
      });

      // Check cache first
      if (language === 'zh' && reportCache.current.zh) {
        setReportData(reportCache.current.zh);
        setLoading(false);
        return;
      }
      if (language === 'en' && reportCache.current.en) {
        setReportData(reportCache.current.en);
        setLoading(false);
        return;
      }

      if (!aiEnabled) {
        // Use Mock Data
        const mockData = language === 'zh' ? mockAiReportZh : mockAiReportEn;
        
        // Replace placeholders in prompt
        const filledPrompt = mockData.prompt
          ?.replace('[MBTI]', mbti)
          .replace('[MainType]', String(enneagram.mainType))
          .replace('[Wing]', String(enneagram.subtype));
          
        const finalMockData = { ...mockData, prompt: filledPrompt };
        
        setReportData(finalMockData);
        
        // Update cache
        if (language === 'zh') reportCache.current.zh = finalMockData;
        else reportCache.current.en = finalMockData;
        
        setLoading(false);
      } else {
        // Fetch Real Data
        try {
            const report = await fetchAiAnalysis(
                mbti,
                String(enneagram.mainType),
                String(enneagram.subtype),
                language as 'zh' | 'en',
                undefined,
                'qwen'
            );
            
            if (report) {
                 const guide = language === 'zh' ? mockAiReportZh.guide : mockAiReportEn.guide;
                 const promptTemplate = language === 'zh' ? mockAiReportZh.prompt : mockAiReportEn.prompt;
                 const filledPrompt = promptTemplate
                    ?.replace('[MBTI]', mbti)
                    .replace('[MainType]', String(enneagram.mainType))
                    .replace('[Wing]', String(enneagram.subtype));

                 const baseMock = language === 'zh' ? mockAiReportZh : mockAiReportEn;
                 const finalReport: AIReportData = {
                   ...baseMock,
                   ...report,
                   guide,
                   prompt: filledPrompt
                 };
                 setReportData(finalReport);
                 
                 if (language === 'zh') reportCache.current.zh = finalReport;
                 else reportCache.current.en = finalReport;
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
      }
    };

    initPage();
  }, [language, navigate]);

  const handleCopyPrompt = () => {
    if (reportData?.prompt) {
      navigator.clipboard.writeText(reportData.prompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  if (loading) {
    return (
      <LoadingOverlay>
        <h2>{t('common.loading')}...</h2>
        <p>{t('results.aiReport')}</p>
      </LoadingOverlay>
    );
  }

  if (!reportData) return null;

  return (
    <Container>
      <Header>
        {/* Title removed as requested */}
      </Header>

      {/* 1. Reading Guide */}
      {reportData.guide && profile && (
        <Section>
          <SectionTitle>📖 {reportData.guide.title}</SectionTitle>
          <GuideGrid>
            {/* Left Column: Profile Card */}
            <ProfileCard>
              <ProfileTitle>
                {profile.mbtiName} × {profile.enneagramName}
              </ProfileTitle>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <BigType>{profile.mbti}-{profile.enneagram}</BigType>
                
                <IconsRow>
                  <span title="MBTI">{profile.mbtiIcon}</span>
                  <span title="Enneagram">{profile.enneagramIcon}</span>
                </IconsRow>
              </div>
              
              <InfoBlockContainer>
                <InfoBlock>
                  <h4>{language === 'zh' ? '主型人格' : 'Main Type'}</h4>
                  <p>
                    {language === 'en' ? `Type ${profile.enneagram}: ${profile.enneagramName}` : `${profile.enneagram} 号 ${profile.enneagramName}`}
                  </p>
                </InfoBlock>
                
                <InfoBlock>
                  <h4>{language === 'zh' ? '亚型 / 侧翼' : 'Wing Type'}</h4>
                  <p>
                    {language === 'en' ? `Type ${profile.wing}: ${profile.wingName}` : `${profile.wing} 号 ${profile.wingName}`}
                  </p>
                </InfoBlock>
              </InfoBlockContainer>
            </ProfileCard>

            {/* Right Column: Guide Content */}
            <GuideContent>
              {reportData.guide.intro && <GuideIntro>{reportData.guide.intro}</GuideIntro>}
              
              {reportData.guide.sections?.map((section, idx) => (
                <GuideSection key={idx}>
                  <h3>{section.title}</h3>
                  {idx === 0 ? (
                    <ol>
                      {section.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ol>
                  ) : (
                    <ul>
                      {section.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </GuideSection>
              ))}

              {reportData.guide.outro && <GuideOutro>{reportData.guide.outro}</GuideOutro>}
            </GuideContent>
          </GuideGrid>
        </Section>
      )}

      {/* Prompt Generator */}
      {reportData.prompt && (
        <Section>
          {/* SectionTitle and Intro Paragraph removed as requested */}
          
          <CenteredPromptTitle>
            {language === 'zh' ? '基于测试结果，获取ChatGPT深度分析' : 'Get Deep Analysis from ChatGPT Based on Results'}
          </CenteredPromptTitle>

          <PromptSection>
            <CopyButton onClick={handleCopyPrompt}>
              {copySuccess ? <FaCheck /> : <FaCopy />}
              {copySuccess ? (language === 'zh' ? '已复制' : 'Copied') : (language === 'zh' ? '复制' : 'Copy')}
            </CopyButton>
            
            <PromptContent>
              {`My 16 Type is ${profile?.mbti}, my Enneagram Type is ${profile?.enneagram}, and my subtype is ${profile?.wing}.\nBased on these results, please provide a comprehensive and deep psychological analysis:\n\n`}
              <strong>1. **Core Personality Analysis**:</strong>
              {`\n   - The unique chemistry between ${profile?.mbti} and Enneagram Type ${profile?.enneagram} (Wing ${profile?.wing}).\n   - Key strengths and hidden talents.\n   - Deep-seated motivations and fears.\n\n`}
              <strong>2. **Inner Conflicts & Struggles**:</strong>
              {`\n   - Contradictions between my MBTI cognitive functions and Enneagram motivations.\n   - The specific type of loneliness or misunderstanding I often experience.\n   - Common stress triggers and unhealthy coping mechanisms.\n\n`}
              <strong>3. **Growth & Development**:</strong>
              {`\n   - Practical advice for personal growth and self-transcendence.\n   - How to balance my conflicting traits.\n   - Recommendations for career path and work style.\n\n`}
              <strong>4. **Relationships & Social Dynamics**:</strong>
              {`\n   - My typical role in relationships (romantic, friendship, professional).\n   - Potential blind spots in social interactions.\n   - What kind of partner/environment suits me best.\n\n`}
              <strong>5. **Subjective Evaluation**:</strong>
              {`\n   - Provide a metaphorical summary for this MBTI + Enneagram (${profile?.enneagram} with Wing ${profile?.wing}) combination among 1152 possibilities.\n   - Give 2 numbered interaction observations referencing my MBTI and Enneagram traits.\n   - Conclude with a core uniqueness analysis focusing on paradoxical productivity (how contradictions become output).\n\n`}
              {`Please provide a empathetic, insightful, and structured response in ${language === 'zh' ? 'Chinese' : 'English'}.`}
            </PromptContent>
          </PromptSection>
          
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#999', marginTop: '0.5rem' }}>
            {language === 'zh' ? '点击上方按钮复制提示词，然后发送给ChatGPT' : 'Click the button above to copy the prompt, then send it to ChatGPT'}
          </p>
        </Section>
      )}

      {/* Placeholder for other sections */}
      <div style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
        <p>Phase 1 Complete: Reading Guide & Prompt Generator</p>
        <p>(Other sections coming soon...)</p>
      </div>
    </Container>
  );
};

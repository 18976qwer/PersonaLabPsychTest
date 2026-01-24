import React, { useEffect, useState, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { StorageManager } from '../utils/storage';
import { useAi } from '../context/AiContext';
import { mockAnalysisData } from '../data/mockAnalysisData';
import { AnalysisResult } from '../types/report';
import { useLanguage } from '../context/LanguageContext';
import { AIReportData, fetchAiAnalysis, subscribeAiAnalysisStream } from '../utils/ai';
import { mbtiDescriptionsEn, mbtiDescriptionsZh } from '../data/mbti';
import { enneagramDescriptionsZh, enneagramDescriptionsEn } from '../data/enneagram';

import { ReportLayout } from '../components/report/ReportLayout';
import { ReadingGuideSection } from '../components/report/ReadingGuideSection';
import { DataVisualizationSection } from '../components/report/DataVisualizationSection';
import { PersonalityTraitsSection } from '../components/report/PersonalityTraitsSection';
import { PersonalGrowthSection } from '../components/report/PersonalGrowthSection';
import { CareerPathSection } from '../components/report/CareerPathSection';
import { RelationshipsSection } from '../components/report/RelationshipsSection';
import { ReportSummarySection } from '../components/report/ReportSummarySection';
import { ShareModal } from '../components/report/ShareModal';
import { ChatGPTPromptSection } from '../components/report/ChatGPTPromptSection';
import { FaDownload, FaShareAlt, FaRedo } from 'react-icons/fa';

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.5rem;
    font-weight: 800;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 1.1rem;
  }
`;

const FooterActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(0,0,0,0.05);

  @media print {
    display: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem 1rem;
  }
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $primary, theme }) => ($primary ? theme.colors.primary : 'white')};
  color: ${({ $primary, theme }) => ($primary ? 'white' : theme.colors.text)};
  box-shadow: ${({ $primary, theme }) => ($primary ? theme.shadows.hover : theme.shadows.card)};
  border: ${({ $primary }) => ($primary ? 'none' : '1px solid rgba(0,0,0,0.05)')};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.hover};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: center;
    padding: 1rem;
  }
`;

const buildDynamicChatgptPrompt = (mbti: string, mainType: number, subtype: number, identity: string) => {
  return (
    `My 16 Type is ${mbti}-${identity}, my Enneagram Type is ${mainType}, and my subtype is ${subtype}. ` +
    'Based on these results, please provide a comprehensive and deep psychological analysis:\n\n' +
    '1. **Core Personality Analysis**:\n' +
    `   - The unique chemistry between ${mbti}-${identity} and Enneagram Type ${mainType} (Wing ${subtype}).\n` +
    '   - Key strengths and hidden talents.\n' +
    '   - Deep-seated motivations and fears.\n\n' +
    '2. **Inner Conflicts & Struggles**:\n' +
    `   - Contradictions between my MBTI (${mbti}-${identity}) cognitive functions and Enneagram motivations.\n` +
    '   - The specific type of loneliness or misunderstanding I often experience.\n' +
    '   - Common stress triggers and unhealthy coping mechanisms.\n\n' +
    '3. **Growth & Development**:\n' +
    '   - Practical advice for personal growth and self-transcendence.\n' +
    '   - How to balance my conflicting traits.\n' +
    '   - Recommendations for career path and work style.\n\n' +
    '4. **Relationships & Social Dynamics**:\n' +
    '   - My typical role in relationships (romantic, friendship, professional).\n' +
    '   - Potential blind spots in social interactions.\n' +
    '   - What kind of partner/environment suits me best.\n\n' +
    '5. **Subjective Evaluation**:\n' +
    `   - Provide a metaphorical summary for this MBTI + Enneagram (${mainType} with Wing ${subtype}) combination among 1152 possibilities.\n` +
    '   - Give 2 numbered interaction observations referencing my MBTI and Enneagram traits.\n' +
    '   - Conclude with a core uniqueness analysis focusing on paradoxical productivity (how contradictions become output).\n\n' +
    'Please provide an empathetic, insightful, and structured response in Chinese.'
  );
};

const replaceTypePlaceholders = (text: string, mbti: string, mainType: number, subtype: number) => {
  if (!text) return text;
  let result = text.replace(/INTJ/g, mbti);
  result = result.replace(/2号/g, `${mainType}号`);
  result = result.replace(/1号/g, `${subtype}号`);
  result = result.replace(/2 号/g, `${mainType} 号`);
  result = result.replace(/1 号/g, `${subtype} 号`);
  return result;
};

const buildDynamicReportData = (
  base: AnalysisResult,
  mbti: string | null,
  enneagram: any,
  language: string,
  identity: string = 'A'
): AnalysisResult => {
  if (!mbti || !enneagram) return base;

  const mainType = Number(enneagram.mainType);
  const subtype = Number(enneagram.subtype);

  if (!mainType || !subtype) return base;

  const mbtiInfoZh = mbtiDescriptionsZh[mbti] || null;
  const mbtiInfoEn = mbtiDescriptionsEn[mbti] || null;
  const mainInfoZh = enneagramDescriptionsZh[mainType] || null;
  const wingInfoZh = enneagramDescriptionsZh[subtype] || null;
  const mainInfoEn = enneagramDescriptionsEn[mainType] || null;

  const characterTypeCn = `${mbtiInfoZh ? mbtiInfoZh.title : mbti} × ${
    mainInfoZh ? mainInfoZh.title : `${mainType}号`
  }`;
  const characterTypeEn = `${mbti}-${identity}-${mainType}`;

  const summaryMbti = `${mbti}：${
    mbtiInfoZh ? mbtiInfoZh.description : '你的思维方式兼具独特的优势和挑战。'
  }`;
  const summaryMain = `${mainType}号：${
    mainInfoZh && mainInfoZh.trait
      ? mainInfoZh.trait.zh
      : mainInfoZh
      ? mainInfoZh.title
      : '你的核心动机塑造了你与世界的互动方式。'
  }`;
  const summaryWing = `${subtype}号：${
    wingInfoZh && wingInfoZh.trait
      ? wingInfoZh.trait.zh
      : wingInfoZh
      ? wingInfoZh.title
      : '你的侧翼为性格增加了额外的倾向和风格。'
  }`;

  // Build oneLiner and keywords
  const useChinese = language === 'zh';

  const mbtiDesc = useChinese
    ? mbtiInfoZh?.description || ''
    : mbtiInfoEn?.description || '';
  const enneagramDesc = useChinese
    ? mainInfoZh?.description || ''
    : mainInfoEn?.description || '';
  const oneLiner = `${mbtiDesc} ${enneagramDesc}`.trim();

  const mbtiKeywords = useChinese
    ? mbtiInfoZh
      ? mbtiInfoZh.strengths.slice(0, 2)
      : []
    : mbtiInfoEn
    ? mbtiInfoEn.strengths.slice(0, 2)
    : [];
  const enneagramKeywords = useChinese
    ? mainInfoZh
      ? mainInfoZh.strengths.slice(0, 1)
      : []
    : mainInfoEn
    ? mainInfoEn.strengths.slice(0, 1)
    : [];
  const keywords = [...mbtiKeywords, ...enneagramKeywords];

  const updatedDetailAnalysis = {
    ...base.personalityTraits.detailAnalysis,
    chemistry: `当你的 MBTI 类型为 ${mbti}，九型人格主型为 ${mainType} 号、侧翼为 ${subtype} 号时，你的思维方式与内在驱动力叠加，形成了独特而复杂的性格组合。`,
    strengths: base.personalityTraits.detailAnalysis.strengths.map(item => ({
      ...item,
      desc: replaceTypePlaceholders(item.desc, mbti, mainType, subtype)
    })),
    conflicts: base.personalityTraits.detailAnalysis.conflicts.map(item => ({
      ...item,
      desc: replaceTypePlaceholders(item.desc, mbti, mainType, subtype)
    }))
  };

  const updatedRelationships = {
    ...base.relationships,
    communicationTable: base.relationships.communicationTable.map(row => ({
      ...row,
      reason: replaceTypePlaceholders(row.reason, mbti, mainType, subtype)
    }))
  };

  const dynamicChatgptPrompt = buildDynamicChatgptPrompt(mbti, mainType, subtype, identity);

  return {
    ...base,
    readingGuide: {
      ...base.readingGuide,
      characterType: {
        ...base.readingGuide.characterType,
        cn: characterTypeCn,
        en: characterTypeEn
      },
      oneLiner,
      keywords
    },
    personalityTraits: {
      ...base.personalityTraits,
      summary: {
        mbti: summaryMbti,
        enneagramMain: summaryMain,
        enneagramWing: summaryWing
      },
      detailAnalysis: updatedDetailAnalysis
    },
    relationships: updatedRelationships,
    chatgptPrompt: dynamicChatgptPrompt
  };
};

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAiEnabled, setIsAiEnabled, aiLoading, setAiLoading, provider, streamEnabled } = useAi();
  const { t, language } = useLanguage();
  const [reportData, setReportData] = useState<AnalysisResult>(mockAnalysisData);
  const [aiReport, setAiReport] = useState<AIReportData | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [reportId] = useState(() => Math.random().toString(36).substr(2, 9).toUpperCase());
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const aiReportCache = useRef<{ zh?: AIReportData | null; en?: AIReportData | null }>({});
  const inFlightKeyRef = useRef<string | null>(null);
  const subscribedRef = useRef<boolean>(false);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    setIsAiEnabled(true);
    setAiLoading(false);
    setAiError(null);
    subscribedRef.current = false;
    inFlightKeyRef.current = null;
  }, []);

  // Trigger AI fetch when enabled globally
  useEffect(() => {
    if (isAiEnabled) {
      const currentLang = language === 'zh' ? 'zh' : 'en';
      const mbtiResult = StorageManager.getItem<string>('mbti_result');
      const enneagramResult = StorageManager.getItem<any>('enneagram_result');
      const mbtiIdentity = StorageManager.getItem<string>('mbti_identity') || 'A';
      const mbtiFull = mbtiResult ? `${mbtiResult}-${mbtiIdentity}` : '';
      const requestKey = `${mbtiFull}|${String(enneagramResult?.mainType || '')}|${String(enneagramResult?.subtype || '')}|${currentLang}`;
      const lastKey = StorageManager.getItem<string>('last_ai_request_key') || '';
      if (requestKey && requestKey !== lastKey) {
        aiReportCache.current = {};
        setAiReport(null);
        StorageManager.setItem('last_ai_request_key', requestKey);
      }
      // Check if we already have data
      const cached = aiReportCache.current[currentLang] || null;
      const hasFullData = Boolean(
        (cached && cached.traits && cached.growth && cached.career && cached.relationships && cached.summary) ||
        (aiReport && aiReport.traits && aiReport.growth && aiReport.career && aiReport.relationships && aiReport.summary)
      );

      // If we have cached full data for current language but aiReport is not set, restore from cache
      if (cached && !aiReport) {
        setAiReport(cached);
        return;
      }

      if (!hasFullData && !aiLoading && !aiError) {
        const mbtiResult = StorageManager.getItem<string>('mbti_result');
        const enneagramResult = StorageManager.getItem<any>('enneagram_result');
        const mbtiIdentity = StorageManager.getItem<string>('mbti_identity') || 'A';
        const mbtiFull = mbtiResult ? `${mbtiResult}-${mbtiIdentity}` : '';
        
        if (!mbtiResult || !enneagramResult) {
          return;
        }

        const lang = currentLang;
        const requestKey = `${mbtiFull}|${String(enneagramResult.mainType)}|${String(enneagramResult.subtype)}|${lang}`;
        if (streamEnabled) {
          // Guard against duplicate subscriptions (e.g., React StrictMode double-invocation)
          if (subscribedRef.current && inFlightKeyRef.current === requestKey) {
            setAiLoading(false);
            return;
          }
          inFlightKeyRef.current = requestKey;
          subscribedRef.current = true;
        }

        if (streamEnabled) {
          if (!esRef.current) {
            setAiLoading(true);
            const es = subscribeAiAnalysisStream(
            {
              mbti: mbtiFull,
              mainType: String(enneagramResult.mainType),
              subtype: String(enneagramResult.subtype),
              lang,
              provider
            },
            (_m, data) => {
              setAiReport(prev => {
                const merged = prev ? { ...prev, ...data } : (data as AIReportData);
                // Update language cache incrementally
                const prevCache = aiReportCache.current[lang] || null;
                aiReportCache.current[lang] = prevCache ? { ...prevCache, ...data } : merged;
                return merged;
              });
            },
            () => {
              setAiLoading(false);
              setAiError(null);
              subscribedRef.current = false;
                esRef.current?.close();
                esRef.current = null;
            },
            () => {
              setAiLoading(false);
              setAiError(t('results.aiError'));
              subscribedRef.current = false;
                esRef.current?.close();
                esRef.current = null;
            }
            );
            esRef.current = es;
          }
        } else {
          setAiLoading(true);
          fetchAiAnalysis(
            mbtiFull,
            String(enneagramResult.mainType),
            String(enneagramResult.subtype),
            lang,
            undefined,
            provider
          )
            .then(data => {
              if (data) {
                setAiReport(prev => {
                  const merged = prev ? { ...prev, ...data } : (data as AIReportData);
                  aiReportCache.current[lang] = merged;
                  return merged;
                });
                setAiError(null);
              } else {
                setAiError(t('results.aiNoData'));
              }
            })
            .catch(() => {
              setAiError(t('results.aiError'));
            })
            .finally(() => {
              setAiLoading(false);
            });
        }
      }
    }
  }, [isAiEnabled, language, t, aiReport, aiLoading, aiError]);

  useEffect(() => {
    return () => {
      try {
        esRef.current?.close();
      } catch {}
      subscribedRef.current = false;
      inFlightKeyRef.current = null;
      esRef.current = null;
    };
  }, []);

  const mbtiLetterCounts = StorageManager.getItem<Record<string, number>>('mbti_letter_counts') || {};
  const mbtiIdentityCounts = StorageManager.getItem<Record<string, number>>('mbti_identity_counts') || {};

  const buildDimensionValue = (leftKey: string, rightKey: string) => {
    const left = mbtiLetterCounts[leftKey] || 0;
    const right = mbtiLetterCounts[rightKey] || 0;
    const total = left + right;
    if (!total) return 50;
    return Math.round((right / total) * 100);
  };

  const buildIdentityValue = () => {
    const a = mbtiIdentityCounts['A'] || 0;
    const tVal = mbtiIdentityCounts['T'] || 0;
    const total = a + tVal;
    if (!total) return 50;
    return Math.round((tVal / total) * 100);
  };

  const testDimensions = [
    {
      label: 'E / I',
      leftLabel: t('report.dimension.extravert'),
      rightLabel: t('report.dimension.introvert'),
      value: buildDimensionValue('E', 'I'),
      color: theme.colors.mbti.I
    },
    {
      label: 'S / N',
      leftLabel: t('report.dimension.sensing'),
      rightLabel: t('report.dimension.intuition'),
      value: buildDimensionValue('S', 'N'),
      color: theme.colors.mbti.S
    },
    {
      label: 'T / F',
      leftLabel: t('report.dimension.thinking'),
      rightLabel: t('report.dimension.feeling'),
      value: buildDimensionValue('T', 'F'),
      color: theme.colors.mbti.T
    },
    {
      label: 'J / P',
      leftLabel: t('report.dimension.judging'),
      rightLabel: t('report.dimension.perceiving'),
      value: buildDimensionValue('J', 'P'),
      color: theme.colors.mbti.P
    },
    {
      label: 'A / T',
      leftLabel: language === 'zh' ? '坚决' : 'Assertive',
      rightLabel: language === 'zh' ? '动荡' : 'Turbulent',
      value: buildIdentityValue(),
      color: '#4fd1c5' // Teal-like color
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);

    const mbtiResult = StorageManager.getItem<string>('mbti_result');
    const enneagramResult = StorageManager.getItem<any>('enneagram_result');

    if (!mbtiResult || !enneagramResult) {
      // navigate('/mbti'); // Commented out for dev convenience
    }

    const mbtiIdentity = StorageManager.getItem<string>('mbti_identity') || 'A';
    const baseData = mockAnalysisData;
    const dynamicData = buildDynamicReportData(baseData, mbtiResult, enneagramResult, language, mbtiIdentity);
    setReportData(dynamicData);
    
    // Restore AI report from cache when switching language (if available)
    const currentLang = language === 'zh' ? 'zh' : 'en';
    const cached = aiReportCache.current[currentLang] || null;
    setAiReport(cached);
    setAiError(null);
  }, [language, t]);

  const handleRetest = () => {
    if (window.confirm(t('report.retestConfirm'))) {
      StorageManager.clear();
      navigate('/');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const mbtiResult = StorageManager.getItem<string>('mbti_type_full') || 
    `${StorageManager.getItem<string>('mbti_result') || 'ISTP'}-${StorageManager.getItem<string>('mbti_identity') || 'A'}`;
  const enneagramResult = StorageManager.getItem<any>('enneagram_result') || { mainType: 5, subtype: 6 };
  const mainType = Number(enneagramResult.mainType);
  const wingType = Number(enneagramResult.subtype);

  const buildEnneagramRadar = () => {
    const scores = (enneagramResult && enneagramResult.scores) || null;
    if (!scores) return [];
    const vals = Object.values(scores).map(v => Number(v));
    const max = Math.max(...vals);
    const min = Math.min(...vals);
    const range = max - min;
    const normalize = (v: number) => {
      if (range === 0) return 50;
      return Math.round(((v - min) / range) * 100);
    };
    const data = [];
    for (let i = 1; i <= 9; i++) {
      const v = normalize(scores[i] || 0);
      const subject =
        language === 'zh'
          ? `${i}号`
          : `Type ${i}`;
      data.push({ subject, value: v });
    }
    return data;
  };

  const buildEnneagramLabel = (type: number) => {
    if (!type) return '';
    if (language === 'zh') {
      const info = enneagramDescriptionsZh[type];
      const traitZh = info?.trait?.zh;
      return traitZh ? `${type}号 ${traitZh}` : `${type}号`;
    }
    const infoEn = enneagramDescriptionsEn[type];
    if (!infoEn) return `Type ${type}`;
    const traitEn = infoEn.trait?.en;
    return traitEn ? `Type ${type}: ${traitEn}` : `Type ${type}: ${infoEn.title}`;
  };

  const primaryEnneagramLabel = buildEnneagramLabel(mainType);
  const wingEnneagramLabel = buildEnneagramLabel(wingType);
  const enneagramRadarData = buildEnneagramRadar();
  
  const mainInfo =
    language === 'zh'
      ? {
          title: primaryEnneagramLabel,
          desc: enneagramDescriptionsZh[mainType]?.description || ''
        }
      : {
          title: primaryEnneagramLabel,
          desc: enneagramDescriptionsEn[mainType]?.description || ''
        };
  const wingInfo =
    language === 'zh'
      ? {
          title: wingEnneagramLabel,
          desc: enneagramDescriptionsZh[wingType]?.description || ''
        }
      : {
          title: wingEnneagramLabel,
          desc: enneagramDescriptionsEn[wingType]?.description || ''
        };
  
  const shareData = {
    mbti: mbtiResult,
    type: `Type ${enneagramResult.mainType}w${enneagramResult.subtype}`,
    keywords: reportData.readingGuide.keywords || [],
    oneLiner: reportData.readingGuide.oneLiner || ''
  };

  return (
    <ReportLayout>
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        data={shareData}
      />
      <Header>
        <h1>{t('report.pageTitle')}</h1>
        <p>
          {language === 'zh'
            ? `${new Date().toLocaleDateString('zh-CN')} · ${t('report.idLabel')}: ${reportId}`
            : `${new Date().toLocaleDateString('en-US')} · ${t('report.idLabel')}: ${reportId}`}
        </p>
      </Header>

      {isAiEnabled && !aiLoading && aiError && (
        <div style={{
          background: '#fff5f5',
          border: '1px solid #feb2b2',
          color: '#c53030',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <span style={{ fontWeight: 500 }}>⚠️ {aiError} (已降级为标准报告)</span>
          <button 
            onClick={() => setAiError(null)} 
            style={{
              background: '#c53030',
              color: 'white',
              border: 'none',
              padding: '0.4rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            {t('common.retry') || '重试 / Retry'}
          </button>
        </div>
      )}

      <ReadingGuideSection 
        data={reportData.readingGuide} 
        primaryEnneagram={primaryEnneagramLabel}
        wingEnneagram={wingEnneagramLabel}
      />

      <DataVisualizationSection 
        mbtiType={mbtiResult} 
        dimensions={testDimensions}
        enneagramRadarData={enneagramRadarData}
        mainInfo={mainInfo}
        wingInfo={wingInfo}
      />

      <PersonalityTraitsSection
        data={reportData.personalityTraits}
        aiReport={aiReport}
        isAiEnabled={isAiEnabled}
        aiLoading={aiLoading}
      />
      <PersonalGrowthSection 
        data={reportData.personalGrowth}
        aiReport={aiReport}
        isAiEnabled={isAiEnabled}
        aiLoading={aiLoading}
      />
      <CareerPathSection 
        data={reportData.careerPath}
        aiReport={aiReport}
        isAiEnabled={isAiEnabled}
        aiLoading={aiLoading}
      />
      <RelationshipsSection 
        data={reportData.relationships}
        aiReport={aiReport}
        isAiEnabled={isAiEnabled}
        aiLoading={aiLoading}
      />
      <ReportSummarySection 
        data={reportData.reportSummary}
        aiReport={aiReport}
        isAiEnabled={isAiEnabled}
        aiLoading={aiLoading}
      />

      <ChatGPTPromptSection prompt={reportData.chatgptPrompt} />

      <FooterActions>
        <ActionButton onClick={handlePrint} $primary>
          <FaDownload /> {t('report.downloadPdf')}
        </ActionButton>
        <ActionButton onClick={() => setIsShareModalOpen(true)}>
          <FaShareAlt /> {t('report.shareReport')}
        </ActionButton>
        <ActionButton onClick={handleRetest} style={{ color: '#e53e3e', borderColor: '#fed7d7' }}>
          <FaRedo /> {t('report.retest')}
        </ActionButton>
      </FooterActions>
    </ReportLayout>
  );
};

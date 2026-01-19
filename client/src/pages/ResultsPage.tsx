import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { StorageManager } from '../utils/storage';
import { useAi } from '../context/AiContext';
import { mockAnalysisData } from '../data/mockAnalysisData';
import { AnalysisResult } from '../types/report';
import { useLanguage } from '../context/LanguageContext';
import { AIReportData, fetchDeepSeekAnalysis } from '../utils/ai';
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
`;

const buildDynamicChatgptPrompt = (mbti: string, mainType: number, subtype: number) => {
  return (
    `My 16 Type is ${mbti}, my Enneagram Type is ${mainType}, and my subtype is ${subtype}. ` +
    'Based on these results, please provide a comprehensive and deep psychological analysis:\n\n' +
    '1. **Core Personality Analysis**:\n' +
    `   - The unique chemistry between ${mbti} and Enneagram Type ${mainType} (Wing ${subtype}).\n` +
    '   - Key strengths and hidden talents.\n' +
    '   - Deep-seated motivations and fears.\n\n' +
    '2. **Inner Conflicts & Struggles**:\n' +
    '   - Contradictions between my MBTI cognitive functions and Enneagram motivations.\n' +
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
  language: string
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
  const characterTypeEn = `${mbti}-${mainType}`;

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

  const dynamicChatgptPrompt = buildDynamicChatgptPrompt(mbti, mainType, subtype);

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

type SectionKey = 'traits' | 'growth' | 'career' | 'relationships' | 'summary';

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAiEnabled, aiLoading, setAiLoading } = useAi();
  const { t, language } = useLanguage();
  const [reportData, setReportData] = useState<AnalysisResult>(mockAnalysisData);
  const [aiReport, setAiReport] = useState<AIReportData | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [reportId] = useState(() => Math.random().toString(36).substr(2, 9).toUpperCase());
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Track which sections have AI enabled
  const [sectionAiEnabled, setSectionAiEnabled] = useState<Record<SectionKey, boolean>>({
    traits: false,
    growth: false,
    career: false,
    relationships: false,
    summary: false
  });

  const [sectionLoading, setSectionLoading] = useState<Record<SectionKey, boolean>>({
    traits: false,
    growth: false,
    career: false,
    relationships: false,
    summary: false
  });

  const mbtiLetterCounts = StorageManager.getItem<Record<string, number>>('mbti_letter_counts') || {};

  const buildDimensionValue = (leftKey: string, rightKey: string) => {
    const left = mbtiLetterCounts[leftKey] || 0;
    const right = mbtiLetterCounts[rightKey] || 0;
    const total = left + right;
    if (!total) return 50;
    return Math.round((right / total) * 100);
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
    }
  ];

  // Toggle AI for a specific section
  const toggleSectionAi = (section: SectionKey) => {
    setSectionAiEnabled(prev => {
      const newState = { ...prev, [section]: !prev[section] };
      if (newState[section]) {
        const moduleMap: Record<string, string> = {
          traits: 'traits',
          growth: 'growth',
          career: 'career',
          relationships: 'relationships',
          summary: 'summary'
        };
        
        const hasData = aiReport && (aiReport as any)[moduleMap[section]] && 
                        (Array.isArray((aiReport as any)[moduleMap[section]]) 
                          ? (aiReport as any)[moduleMap[section]].length > 0 
                          : Object.keys((aiReport as any)[moduleMap[section]]).length > 0);

        if (!hasData) {
           triggerAiFetch([moduleMap[section]], section);
        }
      }
      return newState;
    });
  };

  const triggerAiFetch = (modules: string[] = [], section?: SectionKey) => {
    const mbtiResult = StorageManager.getItem<string>('mbti_result');
    const enneagramResult = StorageManager.getItem<any>('enneagram_result');
    
    if (!mbtiResult || !enneagramResult) return;

    if (section) {
      setSectionLoading(prev => ({ ...prev, [section]: true }));
    }
    setAiLoading(true);
    const lang = language === 'zh' ? 'zh' : 'en';

    fetchDeepSeekAnalysis(
      mbtiResult,
      String(enneagramResult.mainType),
      String(enneagramResult.subtype),
      lang,
      modules.length > 0 ? modules : undefined
    )
      .then(data => {
        if (data) {
          setAiReport(prev => {
            if (!prev) return data as AIReportData;
            return {
              ...prev,
              ...data
            };
          });
          setAiError(null);
        } else {
          setAiError(t('results.aiNoData'));
        }
      })
      .catch((err) => {
        console.error(err);
        setAiError(t('results.aiError'));
      })
      .finally(() => {
        if (section) {
          setSectionLoading(prev => {
            const updated = { ...prev, [section]: false };
            const anyLoading = Object.values(updated).some(v => v);
            if (!anyLoading) {
              setAiLoading(false);
            }
            return updated;
          });
        } else {
          setAiLoading(false);
        }
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const mbtiResult = StorageManager.getItem<string>('mbti_result');
    const enneagramResult = StorageManager.getItem<any>('enneagram_result');

    if (!mbtiResult || !enneagramResult) {
      // navigate('/mbti'); // Commented out for dev convenience
    }

    const baseData = mockAnalysisData;
    const dynamicData = buildDynamicReportData(baseData, mbtiResult, enneagramResult, language);
    setReportData(dynamicData);
    
    setAiReport(null);
    setAiError(null);
    setSectionLoading({
      traits: false,
      growth: false,
      career: false,
      relationships: false,
      summary: false
    });
    setAiLoading(false);
    
    if (isAiEnabled) {
       // Optional: could auto-enable all sections if global is true
    }
  }, [isAiEnabled, language, t]);

  const handleRetest = () => {
    if (window.confirm(t('report.retestConfirm'))) {
      StorageManager.clear();
      navigate('/');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const mbtiResult = StorageManager.getItem<string>('mbti_result') || 'ISTP';
  const enneagramResult = StorageManager.getItem<any>('enneagram_result') || { mainType: 5, subtype: 6 };
  const mainType = Number(enneagramResult.mainType);
  const wingType = Number(enneagramResult.subtype);

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

      <ReadingGuideSection 
        data={reportData.readingGuide} 
        primaryEnneagram={primaryEnneagramLabel}
        wingEnneagram={wingEnneagramLabel}
      />

      <DataVisualizationSection 
        mbtiType={mbtiResult} 
        dimensions={testDimensions} 
      />

      <PersonalityTraitsSection
        data={reportData.personalityTraits}
        aiReport={aiReport}
        isAiEnabled={sectionAiEnabled.traits}
        aiLoading={sectionLoading.traits}
        onToggleAi={() => toggleSectionAi('traits')}
        showAiToggle={true}
      />
      <PersonalGrowthSection 
        data={reportData.personalGrowth}
        aiReport={aiReport}
        isAiEnabled={sectionAiEnabled.growth}
        aiLoading={sectionLoading.growth}
        onToggleAi={() => toggleSectionAi('growth')}
        showAiToggle={true}
      />
      <CareerPathSection 
        data={reportData.careerPath}
        aiReport={aiReport}
        isAiEnabled={sectionAiEnabled.career}
        aiLoading={sectionLoading.career}
        onToggleAi={() => toggleSectionAi('career')}
        showAiToggle={true}
      />
      <RelationshipsSection 
        data={reportData.relationships}
        aiReport={aiReport}
        isAiEnabled={sectionAiEnabled.relationships}
        aiLoading={sectionLoading.relationships}
        onToggleAi={() => toggleSectionAi('relationships')}
        showAiToggle={true}
      />
      <ReportSummarySection 
        data={reportData.reportSummary}
        aiReport={aiReport}
        isAiEnabled={sectionAiEnabled.summary}
        aiLoading={sectionLoading.summary}
        onToggleAi={() => toggleSectionAi('summary')}
        showAiToggle={true}
      />

      <ChatGPTPromptSection prompt={reportData.chatgptPrompt} />

      {isAiEnabled && !aiReport && !aiLoading && aiError && (
        <div
          style={{
            marginTop: '2rem',
            textAlign: 'center',
            color: '#e53e3e',
            fontSize: '0.9rem'
          }}
        >
          {aiError}
        </div>
      )}

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

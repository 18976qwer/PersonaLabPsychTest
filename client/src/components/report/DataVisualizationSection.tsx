import React from 'react';
import styled, { useTheme } from 'styled-components';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const SectionContainer = styled(motion.section)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: 2rem 2rem;
  margin-bottom: 1.2rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
  text-align: center;
  
  span {
    color: ${({ theme }) => theme.colors.primary};
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 100%;
      height: 4px;
      background: ${({ theme }) => `${theme.colors.primary}33`};
      border-radius: 2px;
    }
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.2rem;
  padding-left: 0.25rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 0.9fr 1.1fr;
    align-items: flex-start;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding-left: 0;
    max-width: 560px;
    margin: 0 auto;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: 1.5rem;
    margin-bottom: -1.5rem;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ChartContainer = styled.div`
  width: 100%;
  position: relative;
  min-width: 0;
  display: flex;
  flex-direction: column;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    /* Height is determined by content now */
  }
`;

const VerticalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Card = styled.div<{ $bg?: string }>`
  background: ${({ $bg }) => $bg || '#F7FAFC'};
  border-radius: 16px;
  padding: 0.8rem 0.8rem 0.5rem;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: ${({ theme }) => theme.shadows.card};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 0.6rem;
`;

const TraitPair = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-weight: 700;
  font-size: 0.95rem;
  
  span:first-child { color: #4A5568; }
  span:last-child { color: #2B6CB0; }
`;

const PercentRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.25rem;
`;

const Track = styled.div`
  width: 100%;
  height: 12px;
  background: #EDF2F7;
  border-radius: 999px;
  position: relative;
  overflow: hidden;
`;

const CenterMarker = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #FFF;
  transform: translateX(-50%);
  z-index: 10;
`;

const Fill = styled(motion.div)<{ $color: string; $isRight: boolean }>`
  position: absolute;
  top: 0;
  height: 100%;
  background: ${({ $color }) => $color};
  border-radius: ${({ $isRight }) => $isRight ? '0 999px 999px 0' : '999px 0 0 999px'};
`;

const TriangleButton = styled.button`
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid #000;
  background: transparent;
  cursor: pointer;
  transform-origin: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const CollapsePanel = styled(motion.div)<{ $light: string }>`
  background: ${({ $light }) => $light};
  border-radius: 12px;
  padding: 0.8rem 1rem;
  margin-top: 0.8rem;
  border: 1px solid rgba(0,0,0,0.04);
`;

const CollapseTitle = styled.div<{ $color: string }>`
  font-weight: 800;
  color: ${({ $color }) => $color};
  margin-bottom: 0.4rem;
`;

const CollapseText = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  line-height: 1.6;
`;

  const ChartCaption = styled.div`
    text-align: center;
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 0.9rem;
    margin-top: 1rem;
    margin-bottom: 0;
    font-weight: 600;

    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      margin-top: 0.25rem;
    }
  `;

  const InfoBlock = styled.div`
    margin-top: 0.6rem;
    background: #F7FAFC;
    border: 1px solid rgba(0,0,0,0.04);
    border-radius: 12px;
    padding: 0.8rem 0.9rem;
  `;

  const InfoTitle = styled.div`
    font-weight: 800;
    color: #2B6CB0;
    margin-bottom: 0.25rem;
  `;

  const InfoText = styled.div`
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
    font-size: 0.95rem;
  `;

interface DimensionData {
  label: string;
  value: number; // 0-100
  color: string;
  leftLabel: string;
  rightLabel: string;
}

interface Props {
  mbtiType: string;
  dimensions: DimensionData[];
  enneagramRadarData?: Array<{ subject: string; value: number }>;
  mainInfo?: { title: string; desc: string };
  wingInfo?: { title: string; desc: string };
}


export const DataVisualizationSection: React.FC<Props> = ({ mbtiType, dimensions, enneagramRadarData, mainInfo, wingInfo }) => {
  const { t, language } = useLanguage();
  const theme = useTheme();
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const rect = entries[0]?.contentRect;
      setReady(Boolean(rect && rect.width > 0 && rect.height > 0));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const radarData = dimensions.map(d => ({
    subject: d.label,
    A: d.value,
    B: 50, // Average line
    fullMark: 100
  }));

  const palette = {
    EI: { base: '#2BA5B9', light: 'rgba(43,165,185,0.08)' },
    SN: { base: '#F6AD55', light: 'rgba(246,173,85,0.10)' },
    TF: { base: '#38A169', light: 'rgba(56,161,105,0.10)' },
    JP: { base: '#805AD5', light: 'rgba(128,90,213,0.10)' },
    AT: { base: '#ED64A6', light: 'rgba(237,100,166,0.10)' }
  } as const;

  const getKind = (label: string) => {
    if (label.includes('E') && label.includes('I')) return 'EI' as const;
    if (label.includes('S') && label.includes('N')) return 'SN' as const;
    if (label.includes('T') && label.includes('F')) return 'TF' as const;
    if (label.includes('J') && label.includes('P')) return 'JP' as const;
    if (label.includes('A') && label.includes('T')) return 'AT' as const;
    return 'EI' as const;
  };

  const getCopy = (kind: keyof typeof palette) => {
    const zh = {
      EI: {
        title: (dominant: string) => `能量来源：${dominant}`,
        left: '内向型 (Introverted)：善于独立思考，关注内心世界，倾向于有意义的社交，享受独处恢复精力。',
        right: '外向型 (Extraverted)：活力充沛，善于与外界互动，通过社交获得能量，喜欢热闹与刺激。'
      },
      SN: {
        title: (dominant: string) => `认知方式：${dominant}`,
        left: '实感型 (Sensing)：关注具体细节和现实信息，重视实际经验，擅长观察与按部就班。',
        right: '直觉型 (Intuitive)：关心意义与可能性，善于发现联系，喜欢运用想象力与创造力。'
      },
      TF: {
        title: (dominant: string) => `决策方式：${dominant}`,
        left: '思维型 (Thinking)：关注原因、逻辑与结果，倾向理性与客观评估，注重公正与一致。',
        right: '情感型 (Feeling)：重视价值观与情感因素，善于共情与理解他人，关注决策对他人的影响。'
      },
      JP: {
        title: (dominant: string) => `生活方式：${dominant}`,
        left: '判断型 (Judging)：擅长做决策与制定计划，重视条理与可预测性，偏好有秩序的生活。',
        right: '知觉型 (Perceiving)：灵活开放，善于即兴与随机应变，喜欢保持选择开放与自由。'
      },
      AT: {
        title: (dominant: string) => `自我认同：${dominant}`,
        left: '坚决型 (Assertive)：自信果断，不易焦虑，能承受压力，倾向稳定务实，自我认可度高。',
        right: '谨慎型 (Turbulent)：追求完美，容易自我反思，敏感于压力与挫折，渴望进步与认可。'
      }
    } as const;
    const en = {
      EI: {
        title: (dominant: string) => `Energy Source: ${dominant}`,
        left: 'Introverted: Thinks independently, focuses on inner world, prefers meaningful socializing, restores energy alone.',
        right: 'Extraverted: Energetic, interacts with the outside world, gains energy from social events, enjoys excitement.'
      },
      SN: {
        title: (dominant: string) => `Cognitive Style: ${dominant}`,
        left: 'Sensing: Focuses on concrete details and reality, values practical experience, observes and proceeds step by step.',
        right: 'Intuitive: Cares about meaning and possibilities, finds connections, enjoys imagination and creativity.'
      },
      TF: {
        title: (dominant: string) => `Decision Style: ${dominant}`,
        left: 'Thinking: Logic and results oriented, prefers rational and objective evaluation, values fairness and consistency.',
        right: 'Feeling: Values personal ideals and empathy, considers impact on others in decisions.'
      },
      JP: {
        title: (dominant: string) => `Lifestyle: ${dominant}`,
        left: 'Judging: Good at decisions and planning, prefers clarity and predictability, orderly life.',
        right: 'Perceiving: Flexible and open, improvises and adapts, keeps options open and enjoys spontaneity.'
      },
      AT: {
        title: (dominant: string) => `Identity: ${dominant}`,
        left: 'Assertive: Confident and decisive, low anxiety, stress-resilient, pragmatic, high self-acceptance.',
        right: 'Turbulent: Strives for perfection, self-reflective, sensitive to stress and setbacks, desires progress and recognition.'
      }
    } as const;
    return language === 'zh' ? zh[kind] : en[kind];
  };

  

  return (
    <SectionContainer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <SectionTitle>
        <span>{mbtiType}</span> {t('report.visualization.energyTitle')}
      </SectionTitle>

      <GridContainer>
        <LeftColumn>
          <ChartContainer ref={containerRef}>
          {ready ? (
            <ResponsiveContainer width="100%" height={340} minWidth={0} minHeight={260}>
              <RadarChart cx="50%" cy="50%" outerRadius="90%" data={radarData}>
                <PolarGrid stroke={theme.colors.textLight} strokeOpacity={0.2} />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: theme.colors.text, fontSize: 14, fontWeight: 700 }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                
                <Radar
                  name={t('report.visualization.averageLine')}
                  dataKey="B"
                  stroke="#CBD5E0"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="transparent"
                  fillOpacity={0}
                />

                <Radar
                  name={mbtiType}
                  dataKey="A"
                  stroke={theme.colors.primary}
                  strokeWidth={3}
                  fill={theme.colors.primary}
                  fillOpacity={0.4}
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-out"
                  label={{ position: 'top', fill: theme.colors.primary, fontSize: 12, fontWeight: 700 }}
                />

                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }}
                  itemStyle={{ fontWeight: 600 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#f7fafc', borderRadius: 12 }} />
          )}
         <ChartCaption>
           {language === 'zh' ? 'MBTI 能量分布雷达图' : 'MBTI Energy Radar'}
         </ChartCaption>
        </ChartContainer>

         {/* Enneagram Radar below */}
         <ChartContainer>
         {ready && enneagramRadarData && enneagramRadarData.length ? (
           <ResponsiveContainer width="100%" height={340} minWidth={0} minHeight={260}>
             <RadarChart cx="50%" cy="50%" outerRadius="90%" data={enneagramRadarData}>
               <PolarGrid stroke={theme.colors.textLight} strokeOpacity={0.2} />
               <PolarAngleAxis 
                 dataKey="subject" 
                 tick={{ fill: theme.colors.text, fontSize: 12, fontWeight: 600 }} 
               />
               <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
               
               <Radar
                 name="Enneagram"
                 dataKey="value"
                 stroke={theme.colors.secondary}
                 strokeWidth={3}
                 fill={theme.colors.secondary}
                 fillOpacity={0.35}
                 isAnimationActive={true}
                 animationDuration={1500}
                 animationEasing="ease-out"
               />
               <Tooltip 
                 contentStyle={{ 
                   background: 'rgba(255, 255, 255, 0.95)', 
                   borderRadius: '12px', 
                   border: 'none', 
                   boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                 }}
                 itemStyle={{ fontWeight: 600 }}
               />
             </RadarChart>
           </ResponsiveContainer>
         ) : (
           <div style={{ width: '100%', height: '100%', background: '#f7fafc', borderRadius: 12 }} />
         )}
         <ChartCaption>
           {language === 'zh' ? '九型人格结构雷达图' : 'Enneagram Structure Radar'}
         </ChartCaption>
         </ChartContainer>
        </LeftColumn>

        <RightColumn>
        <VerticalList>
          {dimensions.map((dim, index) => {
            const kind = getKind(dim.label);
            const copy = getCopy(kind);
            const isExpanded = expandedIndex === index;
            const themeColor = palette[kind].base;
            
            const rawPercent = dim.value;
            const rightPercent = Math.round(rawPercent);
            const leftPercent = 100 - rightPercent;
            
            const isRightDominant = rightPercent > 50;
            // Calculate distance from center (50%)
            const distance = Math.abs(rightPercent - 50);
            // Width is the distance (e.g. if 80%, dist is 30, width is 30%)
            // We clamp min width to 2% so it's visible if very close to center but not exactly 50
            const barWidth = distance === 0 ? 0 : Math.max(2, distance);
            const barLeft = isRightDominant ? 50 : (50 - barWidth);

            const title = copy.title(isRightDominant ? dim.rightLabel : dim.leftLabel);
            const desc = isRightDominant ? copy.right : copy.left;

            return (
              <Card key={index} $bg="#F7FAFC">
                <HeaderRow>
                  <TraitPair>
                    <span>{dim.leftLabel} ({dim.label.split('/')[0].trim()})</span>
                    <span>{dim.rightLabel} ({dim.label.split('/')[1]?.trim()})</span>
                  </TraitPair>
                  <TriangleButton 
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </HeaderRow>

                <PercentRow>
                  <span style={{ 
                    fontWeight: !isRightDominant ? 800 : 400, 
                    color: !isRightDominant ? themeColor : undefined 
                  }}>{leftPercent}%</span>
                  <span style={{ 
                    fontWeight: isRightDominant ? 800 : 400, 
                    color: isRightDominant ? themeColor : undefined 
                  }}>{rightPercent}%</span>
                </PercentRow>

                <Track>
                  <CenterMarker />
                  <Fill
                    $color={themeColor}
                    $isRight={isRightDominant}
                    initial={{ width: 0, left: '50%' }}
                    animate={{ 
                      width: `${barWidth}%`, 
                      left: `${barLeft}%` 
                    }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
                  />
                </Track>

                <AnimatePresence>
                  {isExpanded && (
                    <CollapsePanel
                      $light={palette[kind].light}
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: '0.8rem' }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <CollapseTitle $color={themeColor}>
                        {title}
                      </CollapseTitle>
                      <CollapseText>
                        {desc}
                      </CollapseText>
                    </CollapsePanel>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}

         {/* Primary & Wing analysis blocks */}
         {mainInfo && (
           <InfoBlock>
             <InfoTitle>{language === 'zh' ? '主型人格' : 'Primary Type'}</InfoTitle>
             <InfoText>
               <strong style={{ color: '#2B6CB0' }}>{mainInfo.title}</strong>
               <div>{mainInfo.desc}</div>
             </InfoText>
           </InfoBlock>
         )}
         {wingInfo && (
           <InfoBlock>
             <InfoTitle>{language === 'zh' ? '侧翼人格' : 'Wing Type'}</InfoTitle>
             <InfoText>
               <strong style={{ color: '#2B6CB0' }}>{wingInfo.title}</strong>
               <div>{wingInfo.desc}</div>
             </InfoText>
           </InfoBlock>
         )}
        </VerticalList>
        </RightColumn>
      </GridContainer>
    </SectionContainer>
  );
};

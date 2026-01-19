import React from 'react';
import styled, { useTheme } from 'styled-components';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Customized } from 'recharts';
import { motion } from 'framer-motion';
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
    grid-template-columns: 0.65fr 1.35fr;
    align-items: flex-start;
  }
`;

const ChartContainer = styled.div`
  height: 260px;
  width: 100%;
  position: relative;
`;

const BarsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const SliderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 1.1rem 1.3rem 1rem;
  border-radius: 18px;
  background: #fff7f2;
  box-shadow: 0 6px 18px rgba(249, 115, 129, 0.06);
`;

const SliderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 0.92rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  gap: 0.75rem;
`;

const DimensionLabel = styled.span`
  opacity: 0.85;
  white-space: nowrap;
`;

const DominantResult = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.95rem;
  white-space: nowrap;
`;

const SliderTrackWrapper = styled.div`
  width: 100%;
`;

const SliderTrack = styled.div<{ $color: string }>`
  width: 100%;
  height: 10px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 999px;
  position: relative;
`;

const SliderCenterMarker = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 100%;
  background: rgba(0,0,0,0.08);
  z-index: 1;
`;

const SliderTrackFill = styled(motion.div)<{ $color: string; $percent: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ $percent }) => `${$percent}%`};
  background: ${({ $color }) => $color};
  border-radius: 999px;
  z-index: 0;
`;

const SliderThumb = styled(motion.div)<{ $color: string; $percent: number }>`
  position: absolute;
  top: 50%;
  left: ${({ $percent }) => `${$percent}%`};
  transform: translate(-50%, -60%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ $color }) => $color};
  box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.white}cc`}, 0 4px 10px rgba(0, 0, 0, 0.12);
  z-index: 2;
  margin-top: -1px;
`;

const AxisLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin-top: 0.3rem;
  color: ${({ theme }) => theme.colors.textLight};
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
}

const renderCustomizedLabel = (props: any) => {
  const { payload, x, y, cx, cy, ...rest } = props;
  const dataValue = payload.value; 
  // We need to access the actual data point value. Recharts passes payload object which contains coordinate info.
  // The 'value' in payload is the axis tick label (e.g. "E / I"). 
  // To get the numeric value, we might need to look at the data passed to RadarChart or find another way.
  // A simpler way for RadarChart labels is to render a separate layer if Recharts doesn't support value labels easily on Radar.
  // However, PolarAngleAxis supports custom tick.
  
  return (
    <text x={x} y={y} textAnchor="middle" fill="#666" fontSize={12}>
      {payload.value}
    </text>
  );
};

export const DataVisualizationSection: React.FC<Props> = ({ mbtiType, dimensions }) => {
  const theme = useTheme();
  const { t, language } = useLanguage();

  const radarData = dimensions.map(d => ({
    subject: d.label,
    A: d.value,
    B: 50, // Average line
    fullMark: 100
  }));

  const getDominantInfo = (dim: DimensionData) => {
    const isRight = dim.value >= 50;
    const percent = isRight ? dim.value : 100 - dim.value;
    const label = isRight ? dim.rightLabel : dim.leftLabel;
    return { label, percent: Math.round(percent) };
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
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
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

              {/* User Data (Primary Color) */}
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
        </ChartContainer>

        <BarsContainer>
          {dimensions.map((dim, index) => {
            const info = getDominantInfo(dim);
            const rawPercent = dim.value;
            const thumbPercent = Math.min(96, Math.max(4, rawPercent));
            const pairTitleZh = `${dim.label.replace('/', '-')} ${dim.leftLabel}与${dim.rightLabel}`;
            const pairTitleEn = `${dim.label} ${dim.leftLabel} vs ${dim.rightLabel}`;
            const dominantTextZh = `${info.label}型 (${info.percent}%)`;
            const dominantTextEn = `${info.label} (${info.percent}%)`;

            return (
              <SliderRow key={index}>
                <SliderHeader>
                  <DimensionLabel>
                    {language === 'zh' ? pairTitleZh : pairTitleEn}
                  </DimensionLabel>
                  <DominantResult>
                    {language === 'zh' ? dominantTextZh : dominantTextEn}
                  </DominantResult>
                </SliderHeader>
                <SliderTrackWrapper>
                  <SliderTrack $color={dim.color}>
                    <SliderTrackFill
                      $color={dim.color}
                      $percent={thumbPercent}
                      initial={{ width: 0 }}
                      animate={{ width: `${thumbPercent}%` }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
                    />
                  </SliderTrack>
                </SliderTrackWrapper>
                <AxisLabels>
                  <span>{dim.leftLabel}</span>
                  <span>{dim.rightLabel}</span>
                </AxisLabels>
              </SliderRow>
            );
          })}
        </BarsContainer>
      </GridContainer>
    </SectionContainer>
  );
};

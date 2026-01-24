import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaBriefcase, FaCheckCircle, FaExclamationCircle, FaUserTie, FaHandshake, FaBuilding, FaUserPlus, FaBug } from 'react-icons/fa';
import { ReportSection } from './ReportSection';
import { AnalysisResult } from '../../types/report';
import { useLanguage } from '../../context/LanguageContext';
import { AIReportData } from '../../utils/ai';
import { filterDuplicates, sanitizeZh } from '../../utils/textSimilarity';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const SkeletonBlock = styled.div<{ width?: string; height?: string }>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '1.5rem'};
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
 
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 22px rgba(0,0,0,0.06);
    border-color: #cbd5e0;
  }
`;

const CardHeader = styled.h3`
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2d3748;
  font-size: 1.1rem;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ListItem = styled.li`
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
  
  &:last-child { margin-bottom: 0; }
`;

const ItemTitle = styled.span`
  font-weight: 600;
  color: #2c5282;
  display: block;
  margin-bottom: 0.2rem;
`;

const ItemDesc = styled.span`
  color: #718096;
`;

interface Props {
  data: AnalysisResult['careerPath'];
  aiReport?: AIReportData | null;
  isAiEnabled?: boolean;
  aiLoading?: boolean;
  onToggleAi?: () => void;
  showAiToggle?: boolean;
}

export const CareerPathSection: React.FC<Props> = ({ 
  data, 
  aiReport, 
  isAiEnabled = false, 
  aiLoading = false,
  onToggleAi,
  showAiToggle = false
}) => {
  const { t, language } = useLanguage();
  const titleMap: Record<string, string> = {
    '宏观视野': 'Macro Vision',
    '服务精神': 'Service Mindset',
    '逻辑闭环': 'Logical Closure',
    '过度干涉': 'Over-involvement',
    '忽视细节': 'Neglecting Details',
    '固执己见': 'Stubbornness',
    '战略顾问': 'Strategy Consultant',
    '产品经理': 'Product Manager',
    '人力资源总监': 'HR Director',
    '明确边界': 'Clear Boundaries',
    '结果导向': 'Results-Oriented',
    '定期复盘': 'Regular Retrospective',
    '扁平化管理': 'Flat Management',
    '鼓励创新': 'Encourage Innovation',
    '人文关怀': 'Humanistic Care',
    '讨好型工作': 'People-Pleasing Work',
    '完美主义陷阱': 'Perfectionism Trap',
    '孤芳自赏': 'Self-Admiration',
    // Additional mappings for AI/fallback mixed content
    '直面冲突': 'Direct Confrontation',
    '维护掌控': 'Maintain Control',
    '希望更和谐': 'Desire for Harmony',
    '缓和矛盾': 'Mitigate Conflicts',
    '让大家都舒服': 'Prioritize Comfort',
    '领导者': 'Leader',
    '调解者': 'Mediator',
    '支持者': 'Supporter',
    '直接沟通': 'Direct Communication',
    '灵活调整': 'Flexible Adjustment',
    '结构清晰': 'Clear Structure',
    '目标明确': 'Clear Goals',
    '积极反馈': 'Positive Feedback',
    '过度承担': 'Over-commitment',
    '忽视自我': 'Neglecting Self',
    '回避冲突': 'Avoiding Conflict'
  };
  const partnerMap: Record<string, string> = {
    'ENTP (辩论家)': 'ENTP (Debater)',
    'ISFJ (守卫者)': 'ISFJ (Defender)',
    'ESTJ (总经理)': 'ESTJ (Executive)'
  };
  const descMap: Record<string, string> = {
    '能跳出具体事务，看到行业发展的趋势。': 'Able to step beyond tasks and see industry trends.',
    '真心实意地想为客户解决问题，赢得信任。': 'Genuinely aims to solve client problems and earn trust.',
    '做事有始有终，方案严谨周全。': 'Works end-to-end with rigorous, thorough plans.',
    '出于好意而过度介入同事的工作，可能招致反感。': 'Over-involves in colleagues’ work with good intentions, which may cause friction.',
    '在宏大构想中可能忽略了落地的具体困难。': 'May overlook practical constraints within grand ideas.',
    '一旦认定某个方案，很难听进反对意见。': 'Once committed to a plan, finds it hard to accept opposing views.',
    '为企业提供长期的发展建议。': 'Provide long-term strategic advice to organizations.',
    '结合用户需求（感性）与技术实现（理性）。': 'Combine user needs (emotional) with technical implementation (rational).',
    '规划人才体系，关注员工成长。': 'Design talent systems and focus on employee growth.',
    '事先约定好各自的职责范围。': 'Agree on clear role boundaries in advance.',
    '用数据和结果说话，而非情绪。': 'Use data and outcomes rather than emotion.',
    '及时总结经验教训，不断优化流程。': 'Summarize lessons in time and keep optimizing processes.',
    '减少层级束缚，能够直接沟通。': 'Reduce hierarchy constraints to enable direct communication.',
    '允许尝试新方法，包容试错。': 'Allow new methods and tolerate trial-and-error.',
    '重视员工的个人感受和成长。': 'Value employees’ feelings and personal growth.',
    '能提供源源不断的创意，弥补你的思维定势。': 'Offer continuous ideas that counter fixed thinking patterns.',
    '能处理好细节落地，让你无后顾之忧。': 'Handle detailed execution well, removing worries.',
    '强大的执行力能帮你把蓝图变为现实。': 'Strong execution turns blueprints into reality.',
    '为了维持关系而承接不合理的需求。': 'Take on unreasonable requests to maintain relationships.',
    '在细节上纠结过久，拖慢整体进度。': 'Over-fixate on details and slow overall progress.',
    '因为无人理解自己的深谋远虑而感到失落。': 'Feel frustrated when long-term vision is not understood.'
  };
  const toDesc = (s: string) => language === 'en' ? (descMap[s] || s) : s;
  const toTitle = (s: string) => language === 'en' ? (titleMap[s] || s) : s;
  const toPartner = (s: string) => {
    if (language !== 'en') return s;
    if (partnerMap[s]) return partnerMap[s];
    const code = s.split(' ')[0];
    return code || s;
  };
  const zhFixRole = (s: string) => {
    if (language !== 'zh') return s;
    const m: Record<string, string> = {
      '主动回应他人需求': '协调员',
      '希望被需要': '支持者',
      '推动进展': '推进专员'
    };
    const t = (m[s] || s).trim();
    const nounLike = /(者|师|经理|顾问|主管|总监|负责人|协调员|分析师|专员|架构师|工程师)$/.test(t);
    return nounLike ? t : `${t}专员`;
  };

  const useAiCareer = Boolean(isAiEnabled && aiReport && (aiReport as any).career);

  const strengthsAi = useAiCareer && Array.isArray((aiReport as any).career.strengths)
    ? (aiReport as any).career.strengths.map((item: any) => ({ title: item.point, desc: item.desc }))
    : data.strengths;

  const blindSpotsAi = useAiCareer && Array.isArray((aiReport as any).career.blindSpots)
    ? (aiReport as any).career.blindSpots.map((item: any) => ({ title: item.point, desc: item.desc }))
    : data.blindSpots;

  const rolesAi = useAiCareer && Array.isArray((aiReport as any).career.teamRole)
    ? (aiReport as any).career.teamRole.map((item: any) => ({ title: item.point, desc: item.desc }))
    : data.roles;

  const collaborationAi = useAiCareer && Array.isArray((aiReport as any).career.collaborationStyle)
    ? (aiReport as any).career.collaborationStyle.map((item: any) => ({ title: item.point, desc: item.desc }))
    : data.collaboration;

  const environmentAi = useAiCareer && Array.isArray((aiReport as any).career.environment)
    ? (aiReport as any).career.environment.map((item: any) => ({ title: item.point, desc: item.desc }))
    : data.environment;

  const partnersAi = useAiCareer && Array.isArray((aiReport as any).career.companions)
    ? (aiReport as any).career.companions.map((item: any) => ({ type: item.mbti, desc: item.desc }))
    : data.partners;

  const trapsAi = useAiCareer && Array.isArray((aiReport as any).career.traps)
    ? (aiReport as any).career.traps.map((item: any) => ({ title: item.point, desc: item.desc }))
    : data.traps;

  const nonEmpty = (list: any) => Array.isArray(list) && list.length > 0;
  let strengths = nonEmpty(strengthsAi) ? strengthsAi : data.strengths;
  let blindSpots = nonEmpty(blindSpotsAi) ? blindSpotsAi : data.blindSpots;
  let roles = nonEmpty(rolesAi) ? rolesAi : data.roles;
  let collaboration = nonEmpty(collaborationAi) ? collaborationAi : data.collaboration;
  let environment = nonEmpty(environmentAi) ? environmentAi : data.environment;
  let partners = nonEmpty(partnersAi) ? partnersAi : data.partners;
  let traps = nonEmpty(trapsAi) ? trapsAi : data.traps;

  // Cross-list dedupe
  strengths = filterDuplicates(strengths, [blindSpots, roles, collaboration, environment, traps], 0.8);
  blindSpots = filterDuplicates(blindSpots, [strengths, roles, collaboration, environment, traps], 0.8);
  roles = filterDuplicates(roles, [strengths, blindSpots, collaboration, environment, traps], 0.8);
  collaboration = filterDuplicates(collaboration, [strengths, blindSpots, roles, environment, traps], 0.8);
  environment = filterDuplicates(environment, [strengths, blindSpots, roles, collaboration, traps], 0.8);
  traps = filterDuplicates(traps, [strengths, blindSpots, roles, collaboration, environment], 0.8);

  const norm = (s: string) => String(s || '').toLowerCase().trim();
  const ensureMin = (
    current: Array<{ title: string; desc: string }>,
    fallback: Array<{ title: string; desc: string }>,
    min = 3
  ): Array<{ title: string; desc: string }> => {
    const seen = new Set(current.map(x => norm(x.title)));
    let out = [...current];
    for (const fb of fallback) {
      if (out.length >= min) break;
      const key = norm(fb.title);
      if (!seen.has(key)) {
        out.push(fb);
        seen.add(key);
      }
    }
    // If仍不足，用基础数据补齐
    if (out.length < min) {
      for (const fb of data.strengths.concat(data.blindSpots).concat(data.roles).concat(data.collaboration).concat(data.environment).concat(data.traps)) {
        if (out.length >= min) break;
        const key = norm(fb.title);
        if (!seen.has(key)) {
          out.push(fb);
          seen.add(key);
        }
      }
    }
    return out.slice(0, Math.max(min, out.length));
  };

  strengths = ensureMin(strengths, data.strengths, 3);
  blindSpots = ensureMin(blindSpots, data.blindSpots, 3);
  roles = ensureMin(roles, data.roles, 3);
  collaboration = ensureMin(collaboration, data.collaboration, 3);
  environment = ensureMin(environment, data.environment, 3);
  traps = ensureMin(traps, data.traps, 3);

  // Sanitize English tokens in Chinese and fix teamRole titles
  if (language === 'zh') {
    strengths = strengths.map((it: { title: string; desc: string }) => ({ ...it, desc: sanitizeZh(it.desc) }));
    blindSpots = blindSpots.map((it: { title: string; desc: string }) => ({ ...it, desc: sanitizeZh(it.desc) }));
    roles = roles.map((it: { title: string; desc: string }) => ({ ...it, title: zhFixRole(it.title), desc: sanitizeZh(it.desc) }));
    collaboration = collaboration.map((it: { title: string; desc: string }) => ({ ...it, desc: sanitizeZh(it.desc) }));
    environment = environment.map((it: { title: string; desc: string }) => ({ ...it, desc: sanitizeZh(it.desc) }));
    traps = traps.map((it: { title: string; desc: string }) => ({ ...it, desc: sanitizeZh(it.desc) }));
  }

  return (
    <ReportSection 
      id="career" 
      title={t('report.career')} 
      icon={FaBriefcase}
      onToggleAi={onToggleAi}
      isAiEnabled={isAiEnabled}
      showAiToggle={showAiToggle}
    >
      <GridContainer>
        <Card>
          <CardHeader><FaCheckCircle color="#38a169" /> {t('report.careerSection.strengthsTitle')}</CardHeader>
          {isAiEnabled && aiLoading && !useAiCareer ? (
            <List>
              <ListItem>
                <SkeletonBlock width="40%" />
                <SkeletonBlock width="90%" />
                <SkeletonBlock width="80%" />
              </ListItem>
              <ListItem>
                <SkeletonBlock width="50%" />
                <SkeletonBlock width="85%" />
                <SkeletonBlock width="75%" />
              </ListItem>
            </List>
          ) : (
            <List>
              {strengths.map(
                (item: { title: string; desc: string }, idx: number) => (
                  <ListItem key={idx}>
                    <ItemTitle>{toTitle(item.title)}</ItemTitle>
                    <ItemDesc>{toDesc(item.desc)}</ItemDesc>
                  </ListItem>
                )
              )}
            </List>
          )}
        </Card>

        <Card>
          <CardHeader><FaExclamationCircle color="#e53e3e" /> {t('report.careerSection.blindSpotsTitle')}</CardHeader>
          {isAiEnabled && aiLoading && !useAiCareer ? (
            <List>
              <ListItem>
                <SkeletonBlock width="40%" />
                <SkeletonBlock width="90%" />
                <SkeletonBlock width="80%" />
              </ListItem>
              <ListItem>
                <SkeletonBlock width="50%" />
                <SkeletonBlock width="85%" />
                <SkeletonBlock width="75%" />
              </ListItem>
            </List>
          ) : (
            <List>
              {blindSpots.map(
                (item: { title: string; desc: string }, idx: number) => (
                  <ListItem key={idx}>
                    <ItemTitle>{toTitle(item.title)}</ItemTitle>
                    <ItemDesc>{toDesc(item.desc)}</ItemDesc>
                  </ListItem>
                )
              )}
            </List>
          )}
        </Card>

        <Card>
          <CardHeader><FaUserTie color="#3182ce" /> {t('report.careerSection.rolesTitle')}</CardHeader>
          {isAiEnabled && aiLoading && !useAiCareer ? (
            <List>
              <ListItem>
                <SkeletonBlock width="40%" />
                <SkeletonBlock width="90%" />
                <SkeletonBlock width="80%" />
              </ListItem>
              <ListItem>
                <SkeletonBlock width="50%" />
                <SkeletonBlock width="85%" />
                <SkeletonBlock width="75%" />
              </ListItem>
            </List>
          ) : (
            <List>
              {roles.map(
                (item: { title: string; desc: string }, idx: number) => (
                  <ListItem key={idx}>
                    <ItemTitle>{toTitle(item.title)}</ItemTitle>
                    <ItemDesc>{toDesc(item.desc)}</ItemDesc>
                  </ListItem>
                )
              )}
            </List>
          )}
        </Card>

        <Card>
          <CardHeader><FaHandshake color="#805ad5" /> {t('report.careerSection.collaborationTitle')}</CardHeader>
          {isAiEnabled && aiLoading && !useAiCareer ? (
            <List>
              <ListItem>
                <SkeletonBlock width="40%" />
                <SkeletonBlock width="90%" />
                <SkeletonBlock width="80%" />
              </ListItem>
              <ListItem>
                <SkeletonBlock width="50%" />
                <SkeletonBlock width="85%" />
                <SkeletonBlock width="75%" />
              </ListItem>
            </List>
          ) : (
            <List>
              {collaboration.map(
                (item: { title: string; desc: string }, idx: number) => (
                  <ListItem key={idx}>
                    <ItemTitle>{toTitle(item.title)}</ItemTitle>
                    <ItemDesc>{toDesc(item.desc)}</ItemDesc>
                  </ListItem>
                )
              )}
            </List>
          )}
        </Card>

        <Card>
          <CardHeader><FaBuilding color="#d69e2e" /> {t('report.careerSection.environmentTitle')}</CardHeader>
          {isAiEnabled && aiLoading && !useAiCareer ? (
            <List>
              <ListItem>
                <SkeletonBlock width="40%" />
                <SkeletonBlock width="90%" />
                <SkeletonBlock width="80%" />
              </ListItem>
              <ListItem>
                <SkeletonBlock width="50%" />
                <SkeletonBlock width="85%" />
                <SkeletonBlock width="75%" />
              </ListItem>
            </List>
          ) : (
            <List>
              {environment.map(
                (item: { title: string; desc: string }, idx: number) => (
                  <ListItem key={idx}>
                    <ItemTitle>{toTitle(item.title)}</ItemTitle>
                    <ItemDesc>{toDesc(item.desc)}</ItemDesc>
                  </ListItem>
                )
              )}
            </List>
          )}
        </Card>

        <Card>
          <CardHeader><FaUserPlus color="#dd6b20" /> {t('report.careerSection.partnersTitle')}</CardHeader>
          {isAiEnabled && aiLoading && !useAiCareer ? (
            <List>
              <ListItem>
                <SkeletonBlock width="40%" />
                <SkeletonBlock width="90%" />
                <SkeletonBlock width="80%" />
              </ListItem>
              <ListItem>
                <SkeletonBlock width="50%" />
                <SkeletonBlock width="85%" />
                <SkeletonBlock width="75%" />
              </ListItem>
            </List>
          ) : (
            <List>
              {partners.map(
                (item: { type: string; desc: string }, idx: number) => (
                  <ListItem key={idx}>
                    <ItemTitle>{toPartner(item.type)}</ItemTitle>
                    <ItemDesc>{item.desc}</ItemDesc>
                  </ListItem>
                )
              )}
            </List>
          )}
        </Card>

        <Card style={{ gridColumn: '1 / -1' }}>
          <CardHeader><FaBug color="#718096" /> {t('report.careerSection.trapsTitle')}</CardHeader>
          {isAiEnabled && aiLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i}>
                  <SkeletonBlock width="60%" />
                  <SkeletonBlock width="100%" />
                  <SkeletonBlock width="90%" />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {traps.map(
                (item: { title: string; desc: string }, idx: number) => (
                  <div key={idx}>
                    <ItemTitle style={{ color: '#c53030' }}>{toTitle(item.title)}</ItemTitle>
                    <ItemDesc>{toDesc(item.desc)}</ItemDesc>
                  </div>
                )
              )}
            </div>
          )}
        </Card>
      </GridContainer>
    </ReportSection>
  );
};

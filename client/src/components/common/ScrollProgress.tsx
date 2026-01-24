import styled from 'styled-components';
import { motion, useScroll, useSpring } from 'framer-motion';

const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: ${({ theme }) => theme.colors.primary};
  transform-origin: 0%;
  z-index: 1001;
`;

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return <ProgressBar style={{ scaleX }} />;
};

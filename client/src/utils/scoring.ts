import { enneagramTypeMapping, enneagramSubtypeMapping } from '../data/enneagram';

export interface EnneagramScore {
  [key: number]: number;
}

export interface EnneagramResult {
  scores: EnneagramScore;
  mainType: number;
  subtype: number; // wing
  mainTypeScore: number;
  subtypeScore: number;
}

export const calculateEnneagramScores = (answers: Record<number, number>): EnneagramScore => {
  const scores: EnneagramScore = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
  };

  for (const typeStr in enneagramTypeMapping) {
    const type = parseInt(typeStr);
    const questions = enneagramTypeMapping[type];
    
    questions.forEach(questionId => {
      if (answers[questionId] !== undefined) {
        // Option index 0-6 -> Score -3 to 3
        const score = answers[questionId] - 3;
        scores[type] += score;
      }
    });
  }

  return scores;
};

export const analyzeEnneagramResults = (answers: Record<number, number>): EnneagramResult => {
  const scores = calculateEnneagramScores(answers);
  
  let mainType = 1;
  let highestScore = scores[1];

  for (let i = 2; i <= 9; i++) {
    if (scores[i] > highestScore) {
      highestScore = scores[i];
      mainType = i;
    }
  }

  const wings = enneagramSubtypeMapping[mainType];
  const leftScore = scores[wings.left] || 0;
  const rightScore = scores[wings.right] || 0;
  const subtype = leftScore > rightScore ? wings.left : wings.right;

  return {
    scores,
    mainType,
    subtype,
    mainTypeScore: highestScore,
    subtypeScore: scores[subtype]
  };
};

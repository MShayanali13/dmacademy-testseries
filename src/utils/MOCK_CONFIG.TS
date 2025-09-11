
/** ================= MOCK CONFIG ================= **/
const MOCK_CONFIG = {
  JEE: {
    mockTest: { questions: 200, duration: 180 }, // 3 hrs
    subjectWise: {
      Physics: { questions: 60, duration: 70 },
      Chemistry: { questions: 60, duration: 70 },
      Maths: { questions: 60, duration: 70 },
    },
    chapterWise: { questions: 45, duration: 60 },
  },
  NEET: {
    mockTest: { questions: 200, duration: 180 },
    subjectWise: {
      Physics: { questions: 60, duration: 70 },
      Chemistry: { questions: 60, duration: 70 },
      Biology: { questions: 80, duration: 80 },
    },
    chapterWise: {
      Physics: { questions: 45, duration: 60 },
      Chemistry: { questions: 45, duration: 60 },
      Biology: { questions: 60, duration: 60 },
    },
  },
  CET: {
    mockTest: { questions: 120, duration: 120 },
    subjectWise: {
      Maths: { questions: 50, duration: 50 },
      Physics: { questions: 45, duration: 60 },
      Chemistry: { questions: 45, duration: 60 },
      Biology: { questions: 45, duration: 60 }, // optional if PCB
    },
    chapterWise: { questions: 45, duration: 60 },
  },
  Foundation: {
    mockTest: { questions: 120, duration: 120 },
    subjectWise: {
      Maths: { questions: 40, duration: 60 },
      Physics: { questions: 40, duration: 60 },
      Chemistry: { questions: 40, duration: 60 },
      Biology: { questions: 40, duration: 60 },
    },
    chapterWise: { questions: 40, duration: 60 },
  },
} as const;

export default MOCK_CONFIG;
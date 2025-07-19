export interface QuestionPaper {
  _id: string;
  title: string;
  course: string;
  subject: string;
  chapter: string;
  level: string;
  questionIds: string[];
  totalMarks: number;
  duration: number; // in minutes
  createdAt: Date;
}

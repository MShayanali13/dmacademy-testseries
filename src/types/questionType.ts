// types/question.ts

export interface Option {
  text?: string;
  imgUrl?: string;
}

export interface Question {
  _id: string;
  questionType: 'text' | 'image'; // whether question is text or image
  optionType: 'text' | 'image';   // whether options are text or image
  question: {
    text?: string;
    imgUrl?: string;
  };
  options: Option[];  // always 4 options
  answer: 'A' | 'B' | 'C' | 'D';
  level: 'Easy' | 'Medium' | 'Difficult'; // typo in Difficult but keep as per your model
  course: string;
   subject: string;
  chapter: string;
  uploadedBy?: string;
   hintType: 'text' | 'image'; 
  hint: {
     text?: string;
    imgUrl?: string;
  };
    
}

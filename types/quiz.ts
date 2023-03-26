export type QuizType = "original" | "builtin";

export type Question = {
  id: string;
  isRemoved: boolean;
  question: string;
  answer: string;
};

export type QuizList = {
  title: string;
  description: string;
  questions: Question[];
}

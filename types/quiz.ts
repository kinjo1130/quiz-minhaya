export type QuizType = 'original' | 'builtin';

export type Question = {
  id: string;
  isRemoved: boolean;
  question: string;
  answer: string;
};

export type QuizList = {
  id: string;
  title: string;
  description: string;
}

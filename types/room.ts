import type { User } from '.'

export interface Room {
  currentQuestionIndex: number;
  questionsIds: string[];
  isQuizStarted: boolean;
  respondents: string[];
  respondentLimit: number;
  users: User[];
  isFinished: boolean;
}

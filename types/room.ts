import type { User } from ".";

export interface Room {
  activeQuestion: string;
  answeredQuestions: string[];
  isQuizStarted: boolean;
  respondents: User[];
  respondentLimit: number;  
  users: User[];
}

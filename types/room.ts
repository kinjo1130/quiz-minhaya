import type { User } from ".";

export interface Room {
  activeQuestion: string;
  answeredQuestions: string[];
  isQuizStarted: boolean;
  respondents: string[];
  respondentLimit: number;  
  users: User[];
}

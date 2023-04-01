export interface User {
  uid: string;
  name: string;
}

export interface AuthUser extends User {
  token: string;
}

export interface QuizPlayer extends User {
  isOwner: boolean;
  score: number;
  state: 'neutral' | 'respondent' | 'correct' | 'incorrect';
}

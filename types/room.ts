import type { QuizPlayer } from '.'

export type RoomState = 'waiting' | 'playing' | 'finished';

export interface Room {
  currentQuestionIndex: number;
  quizId: string,
  questionIds: string[];
  respondentLimit: number;
  players: Record<string, QuizPlayer>;
  state: RoomState;
}

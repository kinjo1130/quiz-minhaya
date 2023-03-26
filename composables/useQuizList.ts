export type Quiz = {
  id: string;
  question: string;
  answer: string;
};
export const useQuizList = () => {
  const quizList = useState<Quiz[]>("quizList", () => []);
  const setQuizList = (setQuizList: Quiz[]) => {
    quizList.value = setQuizList;
  };
  return {
    quizList,
    setQuizList,
  };
};

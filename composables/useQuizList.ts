import type { Question } from "~/types";

export const useQuizList = () => {
  const quizList = useState<Question[]>("quizList", () => []);
  const setQuizList = (setQuizList: Question[]) => {
    quizList.value = setQuizList;
  };
  return {
    quizList,
    setQuizList,
  };
};

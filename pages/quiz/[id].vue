<template>
  <p>クイズ個別:{{ useRoute().params.id }}</p>
  <p>問題: {{ getQuiz?.question }}</p>
</template>
<script setup lang="ts">
import { Quiz } from "../../composables/useQuizList";
const getQuiz = ref<Quiz | undefined>({
  id: "",
  question: "",
  answer: "",
});
onMounted(async () => {
  await useNuxtApp().$getQuestions();
  const { quizList } = useQuizList();
  const quizId = useRoute().params.id as string;
  console.log("quizList", quizList.value);
  const quiz = quizList.value.find((quiz) => quiz.id === quizId);
  console.log("quiz", quiz);
  getQuiz.value = quiz;
});
// 使用してない問題idがある場合は、その問題idを取得する
</script>

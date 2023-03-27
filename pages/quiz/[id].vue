<template>
  <p>クイズ個別:{{ useRoute().params.id }}</p>
  <p>問題: {{ currentQuiz?.question }}</p>
  <button type="button" @click="answeredQuiz" :disabled="answeredQuizFlag">
    わかった！！
  </button>
  <p>回答者: {{ respondent.name }}</p>
  <p>回答者uid:{{ respondent.uid }}</p>
  <p>ログインしているゆーざーのuid:{{ user?.uid }}</p>
  <form v-if="respondent.uid === user?.uid" @submit.prevent="judgeAnswer">
    <label>解答欄</label>
    <input type="text" v-model="answerValue" />
    <button>回答する</button>
  </form>
</template>
<script setup lang="ts">
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import type { User, Question } from "~/types";

definePageMeta({
  middleware: "auth"
})

const currentQuiz = ref<Question>({
  id: "",
  isRemoved: false,
  question: "",
  answer: "",
});
const answeredQuizFlag = ref(false);
const respondent = ref<User>({
  name: "",
  uid: "",
});

const answerValue = ref("");

const roomId = localStorage.getItem("roomId")!;
const { room, roomRef } = useRoom(roomId)

const { user } = useAuth();

onMounted(async () => {
  await useNuxtApp().$getQuestions();
  console.log("====================================");
  const { quizList } = useQuizList();
  const quizId = useRoute().params.id as string;
  console.log("quizList", quizList.value);
  const quiz = quizList.value.find((quiz) => quiz.id === quizId);
  if (!quiz) {
    // クイズがないのは困る
    // TODO: 適当な処理を書く
    return;
  }
  console.log("quiz", quiz);
  
  currentQuiz.value = quiz;
  console.log("getQuiz", quiz);
  console.log("====================================");
  
  console.log("roomId", roomId);
  
  watch(room, (room) => {
    console.log("Current data: ", room);
    if (!room) {
      // TODO: returnする前に適当な場所にリダイレクトすべき
      return;
    }
    // activeQuestionが変更されたら次の問題に行く
    if (room.activeQuestion !== quizId) {
      if(room.activeQuestion === ""){
        const router = useRouter();
        console.log("activeQuestionが空なので、結果画面に行く");
        router.push(`/result`);
        return;
      }
      const router = useRouter();
      console.log("activeQuestionが変更されたので、次の問題に行く");
      router.push(`/quiz/${room.activeQuestion}`);
    }
    if (room.respondents.length >= room.respondentLimit) {
      answeredQuizFlag.value = true;
      // 回答者の名前を取得する
      console.log("回答者の名前取得");

      console.log("usersInRoom", room.users);
      // todo: ここの処理が少し重いので、改善したい
      respondent.value = room.users.find(
        (user) => user.uid === room!.respondents[0]
      )!;

      console.log("answerPerson", respondent.value);
    }
  }, { immediate: true });
});
// クイズに回答する
const answeredQuiz = async () => {
  console.log("answeredQuiz");

  console.log("回答者の名前を保存する", user.value!.name);
  await updateDoc(roomRef.value, {
    respondents: arrayUnion(user.value!.uid),
  })
};

const judgeAnswer = async () => {
  console.log("judgeAnswer");
  if (!answerValue) return;
  if (answerValue.value === currentQuiz.value.answer) {
    console.log("正解");

    await updateDoc(roomRef.value, {
      answeredQuestions: arrayUnion(currentQuiz.value?.id),
    });
    // 次の問題に行く
    // 回答したクイズから削除して、次のクイズに行く
    const quizList = useQuizList().quizList.value;
    const getRoomInfo = await useNuxtApp().$getRoomInfo();
    if (!getRoomInfo) return;
    const quizListId = quizList.map((quiz) => quiz.id);
    // すでに回答した問題idと、クイズリストのidを結合して、重複しているものを取得する
    const filterAlreadyAnsweredQuiz = getRoomInfo.answeredQuestions
      .concat(quizListId)
      .filter(function (x, i, self) {
        return self.indexOf(x) === i && i !== self.lastIndexOf(x);
      });
    console.log("====================================");
    console.log("getRoomInfo", getRoomInfo);
    console.log("quizList", quizList);
    console.log("alreadtAnsweredQuiz", filterAlreadyAnsweredQuiz);
    // すでに回答した問題idと重複してないものを取得する
    const nextQuizId = quizListId.filter(
      (id) => !filterAlreadyAnsweredQuiz.includes(id)
    );
    if (nextQuizId && nextQuizId.length > 0) {
      console.log("nextQuiz", nextQuizId);
      const router = useRouter();
      const randomNum = Math.floor(Math.random() * nextQuizId.length);
      // 次の問題に行く前に、回答者を初期化する
      await updateDoc(roomRef.value, {
        activeQuestion: nextQuizId[randomNum],
        respondents: [],
      });
      router.push(`/quiz/${nextQuizId[randomNum]}`);
    } else {
      await updateDoc(roomRef.value, {
        activeQuestion: "",
        respondents: [],
      });
      console.log("すべての問題を回答しました");
      const router = useRouter();
      router.push(`/result`);
    }
  } else {
    console.log("不正解");
  }
};
// 使用してない問題idがある場合は、その問題idを取得する
</script>

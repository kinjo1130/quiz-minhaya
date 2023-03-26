<template>
  <p>クイズ個別:{{ useRoute().params.id }}</p>
  <p>問題: {{ currentQuiz?.question }}</p>
  <button type="button" @click="answeredQuiz" :disabled="answeredQuizFlag">
    わかった！！
  </button>
  <p>回答者: {{ answerPerson.name }}</p>
  <p>回答者uid:{{ answerPerson.uid }}</p>
  <p>ログインしているゆーざーのuid:{{ loginUser.uid }}</p>
  <form v-if="answerPerson.uid === loginUser.uid" @submit.prevent="judgeAnswer">
    <label>解答欄</label>
    <input type="text" v-model="answerValue" />
    <button>回答する</button>
  </form>
</template>
<script setup lang="ts">
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import type { User, Question } from "~/types";
const currentQuiz = ref<Question>({
  id: "",
  isRemoved: false,
  question: "",
  answer: "",
});
const answeredQuizFlag = ref(false);
const answerPerson = ref<User>({
  name: "",
  uid: "",
});
const loginUser = ref<User>({
  name: "",
  uid: "",
});

const answerValue = ref("");
onMounted(async () => {
  await useNuxtApp().$getQuestions();
  console.log("====================================");
  const { quizList } = useQuizList();
  const quizId = useRoute().params.id as string;
  console.log("quizList", quizList.value);
  const quiz = quizList.value.find((quiz) => quiz.id === quizId);
  if(!quiz) {
    // クイズがないのは困る
    // TODO: 適当な処理を書く
    return;
  }
  console.log("quiz", quiz);
  const user = await useNuxtApp().$existCurrentUser();
  loginUser.value = {
    name: user?.name || "",
    uid: user?.uid || "",
  };
  currentQuiz.value = quiz;
  console.log("getQuiz", quiz);
  console.log("====================================");
  const { $firebaseDB } = useNuxtApp();
  const roomId = localStorage.getItem("roomId")!;
  console.log("roomId", roomId);
  const roomRef = doc($firebaseDB, "rooms", roomId).withConverter(firestoreRoomConverter);
  onSnapshot(roomRef, (doc) => {
    const room = doc.data();    
    console.log("Current data: ", room);
    if(!room) {
      // TODO: returnする前に適当な場所にリダイレクトすべき
      return;
    }
    if (room.respondents.length >= room.respondentLimit) {
      answeredQuizFlag.value = true;
      // 回答者の名前を取得する
      console.log("回答者の名前取得");

      console.log("usersInRoom", room.users);
      // todo: ここの処理が少し重いので、改善したい
      answerPerson.value = room.users.find(
        (user) => user.uid === room.respondents[0].uid
      )!;

      console.log("answerPerson", answerPerson.value);
    }
  });
});
// クイズに回答する
const answeredQuiz = async () => {
  console.log("answeredQuiz");
  const user = await useNuxtApp().$existCurrentUser();
  const { $firebaseDB } = useNuxtApp();
  const roomId = localStorage.getItem("roomId")!;
  const roomRef = doc($firebaseDB, "rooms", roomId).withConverter(firestoreRoomConverter);
  console.log("回答者の名前を保存する", user?.name);
  await updateDoc(roomRef, {
    respondents: arrayUnion({
      uid: user?.uid,
      name: user?.name,
    }),
  });
};

const judgeAnswer = async () => {
  console.log("judgeAnswer");
  if (!answerValue) return;
  if (answerValue.value === currentQuiz.value.answer) {
    console.log("正解");
    const roomId = localStorage.getItem("roomId")!;
    const { $firebaseDB } = useNuxtApp();
    const roomRef = doc($firebaseDB, "rooms", roomId).withConverter(firestoreRoomConverter);
    await updateDoc(roomRef, {
      answeredQuestions: arrayUnion(currentQuiz.value?.id),
    });
  } else {
    console.log("不正解");
  }
};
// 使用してない問題idがある場合は、その問題idを取得する
</script>

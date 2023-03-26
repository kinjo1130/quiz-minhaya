<template>
  <p>クイズ個別:{{ useRoute().params.id }}</p>
  <p>問題: {{ getQuiz?.question }}</p>
  <button type="button" @click="answeredQuiz" :disabled="answeredQuizFlag">
    わかった！！
  </button>
  <p>回答者: {{ answerPerson.name }}</p>
  <p>回答者uid:{{ answerPerson.uid }}</p>
  <p>ログインしているゆーざーのuid:{{ loginUser.uid }}</p>
  <form v-if="answerPerson.uid === loginUser.uid">
    <label>解答欄</label>
    <input type="text" >
  </form>
</template>
<script setup lang="ts">
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Quiz } from "../../composables/useQuizList";
const getQuiz = ref<Quiz | undefined>({
  id: "",
  question: "",
  answer: "",
});
const answeredQuizFlag = ref(false);
const answerPerson = ref({
    name: "",
    uid: "",
});
const loginUser = ref({
  name: "",
  uid: "",
});
onMounted(async () => {
  await useNuxtApp().$getQuestions();
  const { quizList } = useQuizList();
  const quizId = useRoute().params.id as string;
  console.log("quizList", quizList.value);
  const quiz = quizList.value.find((quiz) => quiz.id === quizId);
  console.log("quiz", quiz);
  const user = await useNuxtApp().$existCurrentUser();
  loginUser.value = {
    name: await user?.displayName || "",
    uid: await user?.uid || "",
  };
  getQuiz.value = quiz;
  const { $firebaseDB } = useNuxtApp();
  const roomId = localStorage.getItem("roomId") as string;
  const collectionRef = doc($firebaseDB, "rooms", roomId);
  onSnapshot(collectionRef, (doc) => {
    console.log("Current data: ", doc.data());
    if (doc.data()?.firstRespondent.length > 0) {
      answeredQuizFlag.value = true;
      // 回答者の名前を取得する
      console.log("回答者の名前取得");
      useNuxtApp()
        .$getRoomInfo()
        .then((res) => {
          console.log("usersInRoom", res);
          // todo: ここの処理が少し重いので、改善したい
          const answerPersonInfo = res?.usersInRoom.find(
            (user: any) => user.uid === doc.data()?.firstRespondent[0].uid
          );
          answerPerson.value = {
            name: answerPersonInfo?.name,
            uid: answerPersonInfo?.uid,
          };
          console.log("answerPersonInfo", answerPersonInfo);
          console.log("answerPerson", answerPerson.value);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  });
});
// クイズに回答する
const answeredQuiz = async () => {
  console.log("answeredQuiz");
  const user = await useNuxtApp().$existCurrentUser();
  const { $firebaseDB } = useNuxtApp();
  const roomId = localStorage.getItem("roomId") as string;
  const roomRef = await doc($firebaseDB, "rooms", roomId);
  console.log("回答者の名前を保存する", await user?.displayName);
  await updateDoc(roomRef, {
    firstRespondent: arrayUnion({
      uid: user?.uid,
      name: user?.displayName,
    }),
  });
};

const judgeAnswer = () => {
  console.log("judgeAnswer");
};
// 使用してない問題idがある場合は、その問題idを取得する
</script>

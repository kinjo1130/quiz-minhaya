<template>
  <p>RoomId:{{ useRoute().params.id }}</p>
  <p>参加しているユーザーリスト</p>
  <ul>
    <li v-for="user in usersInRoom" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
  <button type="button" @click="startQuiz">クイズをスタートする</button>
  <!-- こいつはランダムの時にしか出ないようにする -->
  <!-- <label>問題数設定</label>
  <input
    type="number"
    placeholder="問題数を決めてね"
    v-model.number="quizCount"
    required
  /> -->
  <!-- <label>出題問題選択</label>
  <select v-model="quizType" @change="getMyCreateQuizList">
    <option value="random">ランダム</option>
    <option value="MyCreateQuiz">自作問題</option>
  </select> -->
  <!-- <div v-if="myCreateQuizList.length > 0">
    <h4>自作問題一覧</h4>
    <select>
      <option v-for="quiz in myCreateQuizList" :key="quiz.title">
        {{ quiz.title }}
      </option>
    </select>
  </div> -->
  <button type="button" @click="publishInviteCode">招待コード発行</button>
  <p>招待コード:{{ invitationCode }}</p>
</template>
<script setup lang="ts">
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
type UserInRoom = {
  id: string;
  name: string;
};
type MyCreateQuizList = {
  title: string;
  description: string;
};
const router = useRouter();
// ルームに参加しているユーザーの情報
const usersInRoom = ref<UserInRoom[]>([]);
// クイズする問題数
const quizCount = ref(2);
// クイズに使用する問題の種類
const quizType = ref("random");
// 自作問題リスト
const myCreateQuizList = ref<MyCreateQuizList[]>([]);
// 自作問題の中で選択した問題の種類
const selectedQuiz = ref("random");

onMounted(async () => {
  const { $firebaseDB } = useNuxtApp();
  const roomId = useRoute().params.id as string;
  // localStorageにroomIdを保存する
  localStorage.setItem("roomId", roomId);
  const collectionRef = doc($firebaseDB, "rooms", roomId);
  onSnapshot(collectionRef, async (doc) => {
    console.log("Current data: ", doc.data());
    usersInRoom.value = doc.data()?.usersInRoom;
    // ここで、他のブラウザとfirestoreが同期している
    if (doc.data()?.isQuizStarted === true && doc.data()?.activeQuestion) {
      // todo: ここで無限ループ的なことが起きてるので修正
      router.push(`/quiz/${doc.data()?.activeQuestion}`);
    }
  });
});
// TODO:クイズをスタートしたら異なるブラウザ間でリアルタイムにクイズの情報を取得する
const startQuiz = async () => {
  console.log("startQuiz");
  const { $firebaseDB } = useNuxtApp();
  const { quizList, setQuizList } = useQuizList();
  const roomId = useRoute().params.id as string;
  const roomRef = doc($firebaseDB, "rooms", roomId);
  // スタートさせるときに、クイズの情報を取得してくる
  const quizRef = collection(
    $firebaseDB,
    "quiz",
    // ここで、クイズの種類を指定する
    "金城クイズ",
    "question"
  );
  const quizSnapshot = await getDocs(quizRef);
  console.log("quizSnapshot", quizSnapshot.docs);
  const quizData = quizSnapshot.docs
    .filter((doc) => doc.data().isRemoved === false)
    .map((doc) => {
      return {
        id: doc.id,
        question: doc.data().question as string,
        answer: doc.data().answer as string,
      };
    });
  console.log(quizData);
  // composablesにクイズの情報を保存する
  setQuizList(quizData);
  // ランダムな数字生成(クイズの問題数を超えないようにする)
  const randomNum = Math.floor(Math.random() * quizCount.value);
  // 取得したきたクイズのidから、クイズの個別画面に飛ばす
  router.push(`/quiz/${quizData[randomNum].id}`);
  // 今出題されているクイズのidを保存する
  await updateDoc(roomRef, {
    isQuizStarted: true,
    activeQuestion: quizData[randomNum].id,
  });
};
// 自作問題リストを取得する
// const getMyCreateQuizList = async () => {
//   if (quizType.value !== "MyCreateQuiz") return;
//   const { $firebaseDB } = useNuxtApp();
//   const quizRef = collection($firebaseDB, "quiz");
//   const quizSnapshot = await getDocs(quizRef);
//   const quizData = quizSnapshot.docs.map((doc) => doc.data());
//   console.log(quizData);
//   myCreateQuizList.value = quizData;
// };

// 招待をする側の処理
const invitationCode = ref("");
const publishInviteCode = async () => {
  console.log(useRoute().params.id);
  invitationCode.value = useRoute().params.id as string;
};
</script>

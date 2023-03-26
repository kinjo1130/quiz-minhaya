<template>
  <p>RoomId:{{ useRoute().params.id }}</p>
  <p>参加しているユーザーリスト</p>
  <ul>
    <li v-for="user in usersInRoom" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
  <button type="button" @click="startQuiz">クイズをスタートする</button>

  <label>問題数設定</label>
  <input
    type="number"
    placeholder="問題数を決めてね"
    v-model.number="quizCount"
    required
  />

  <button type="button" @click="publishInviteCode">招待コード発行</button>
  <p v-if="invitationCode">招待コード:{{ invitationCode }}</p>
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
// ルームに参加しているユーザーの情報を取得する
type UserInRoom = {
  id: string;
  name: string;
};
const router = useRouter();
const usersInRoom = ref<UserInRoom[]>([]);
const quizCount = ref(2);
onMounted(async () => {
  const { $firebaseDB } = useNuxtApp();
  const roomId = useRoute().params.id as string;
  const collectionRef = doc($firebaseDB, "rooms", roomId);
  onSnapshot(collectionRef, (doc) => {
    console.log("Current data: ", doc.data());
    usersInRoom.value = doc.data()?.usersInRoom;
    if (doc.data()?.isQuizStarted === true) {
      router.push("/quiz/1");
    }
  });
});
// TODO:クイズをスタートしたら異なるブラウザ間でリアルタイムにクイズの情報を取得する
const startQuiz = async () => {
  console.log("startQuiz");
  const { $firebaseDB } = useNuxtApp();
  const roomId = useRoute().params.id as string;
  const roomRef = doc($firebaseDB, "rooms", roomId);
  await updateDoc(roomRef, {
    isQuizStarted: true,
  });
  // スタートさせるときに、クイズの情報を取得してくる
  // const quizRef = collection($firebaseDB, "quizzes");
  // const quizSnapshot = await getDocs(quizRef);
  // const quizData = quizSnapshot.docs.map((doc) => doc.data());
  // console.log(quizData);
};

// 招待をする側の処理
const invitationCode = ref("");
const publishInviteCode = async () => {
  console.log(useRoute().params.id);
  invitationCode.value = useRoute().params.id as string;
};
</script>

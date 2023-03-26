<template>
  <p>RoomId:{{ useRoute().params.id }}</p>
  <p>参加しているユーザーリスト</p>
  <ul>
    <li v-for="user in roomInUsers" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
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
} from "firebase/firestore";
// ルームに参加しているユーザーの情報を取得する
type RoomInUser = {
  id: string;
  name: string;
};
const roomInUsers = ref<RoomInUser[]>([]);
onMounted(async () => {
  const { $firebaseDB } = useNuxtApp();
  const roomId = useRoute().params.id as string;
  const collectionRef = doc($firebaseDB, "rooms", roomId);
  onSnapshot(collectionRef, (doc) => {
    console.log("Current data: ", doc.data());
    roomInUsers.value = doc.data()?.roomInUsers;
  });
});
// TODO:クイズをスタートしたら異なるブラウザ間でリアルタイムにクイズの情報を取得する
const startQuiz = async () => {
  console.log("startQuiz");
  const { $firebaseDB } = useNuxtApp();
  const roomId = useRoute().params.id as string;
  const collectionRef = doc($firebaseDB, "quiz", roomId);
  onSnapshot(collectionRef, (doc) => {
    console.log("Current data: ", doc.data());
    roomInUsers.value = doc.data()?.roomInUsers;
  });
};


// 招待をする側の処理
const invitationCode = ref("");
const publishInviteCode = async () => {
  console.log(useRoute().params.id);
  invitationCode.value = useRoute().params.id as string;
};
</script>

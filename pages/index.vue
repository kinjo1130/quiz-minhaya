<template>
  <h1 class="font-bold">みんはや自作</h1>
  <button type="button" @click="createRoom">ルームを作る</button>
  <form @submit.prevent="joinRoom">
    <label>招待を受ける</label>
    <input type="text" placeholder="招待コードを入力" v-model="invitedCode" required />
    <button type="submit">参加</button>
  </form>
</template>
<script lang="ts" setup>
import { useAuth } from "~/composables/useAuth";
const router = useRouter();
// リアルタイムにログインしているユーザーの情報を取得する

onMounted(async () => {
  const user = await useNuxtApp().$existCurrentUser();
  if (!user) {
    router.push("/login");
  }
});

const invitedCode = ref("");
// クイズをする部屋を作成する
const createRoom = async () => {
  console.log("createRoom");
  const { loginUser } = await useAuth();
  console.log("現在ログインしているユーザーの情報", await loginUser.value?.uid);
  const createdRoomId = await useNuxtApp().$createRoom(
    loginUser.value?.uid as string,
    loginUser.value?.displayName as string
  );
  router.push(`/room/${createdRoomId}`);
};
const joinRoom = async () => {
  console.log("joinRoom");
  const { loginUser } = await useAuth();
  console.log("現在ログインしているユーザーの情報", await loginUser.value?.uid);
  const joinedRoomId = await useNuxtApp().$joinRoom(
    loginUser.value?.uid as string,
    loginUser.value?.displayName as string,
    invitedCode.value
  );
  router.push(`/room/${joinedRoomId}`);
};
</script>

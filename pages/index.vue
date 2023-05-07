<template>
  <h1 class="">
    みんはや自作
  </h1>
  <button type="button" @click="createRoom">
    ルームを作る
  </button>
  <form @submit.prevent="joinRoom">
    <label>招待を受ける</label>
    <input v-model="invitedCode" type="text" placeholder="招待コードを入力" required>
    <button type="submit">
      参加
    </button>
    <Button type="button" button-type="normal">
      ルームを作る
    </Button>
  </form>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: 'auth'
})

const router = useRouter()
// リアルタイムにログインしているユーザーの情報を取得する

const invitedCode = ref('')

// クイズをする部屋を作成する
const createRoom = async () => {
  console.log('createRoom')
  const { user } = useAuth()
  console.log('現在ログインしているユーザーの情報', user.value!.uid)
  const createdRoomId = await useNuxtApp().$createRoom(user.value!)
  router.push(`/room/${createdRoomId}`)
}

const joinRoom = async () => {
  console.log('joinRoom')
  const { user } = useAuth()
  console.log('現在ログインしているユーザーの情報', user.value?.uid)
  const joinedRoomId = await useNuxtApp().$joinRoom(user.value!, invitedCode.value)
  router.push(`/room/${joinedRoomId}`)
}
</script>

<template>
  <h1 class="">
    みんはや自作
  </h1>
  <Button type="button" button-type="normal" @click="createRoom">
    ルームを作る
  </Button>
  <form @submit.prevent="joinRoom">
    <label>招待を受ける</label>
    <input v-model="invitedCode" type="text" placeholder="招待コードを入力" required class="border border-indigo-100">
    <Button type="submit" button-type="normal">
      参加
    </Button>
    <!-- <Button
      type="button"
      button-type="normal"
      @click="pushTest"
    >
      ルームを作る
    </Button> -->
  </form>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: 'auth'
})

// const pushTest = ()=>{
//   console.log("pushTest")
// }
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
  return true
}

const joinRoom = async () => {
  console.log('joinRoom')
  const { user } = useAuth()
  console.log('現在ログインしているユーザーの情報', user.value?.uid)
  const joinedRoomId = await useNuxtApp().$joinRoom(user.value!, invitedCode.value)
  router.push(`/room/${joinedRoomId}`)
}
</script>

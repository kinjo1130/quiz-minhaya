<template>
  <p>RoomId:{{ useRoute().params.id }}</p>
  <p>参加しているユーザーリスト</p>
  <ul>
    <li v-for="user in usersInRoom" :key="user.uid">
      {{ user.name }}
    </li>
  </ul>
  <button type="button" @click="startQuiz">
    クイズをスタートする
  </button>
  <!-- こいつはランダムの時にしか出ないようにする -->
  <!-- <label>問題数設定</label>
  <input
    type="number"
    placeholder="問題数を決めてね"
    v-model.number="quizCount"
    required
  /> -->
  <!-- <label>出題問題選択</label>
  <select v-model="quizType" @change="getOriginalQuizList">
    <option value="random">ランダム</option>
    <option value="MyCreateQuiz">自作問題</option>
  </select> -->
  <!-- <div v-if="originalQuizList.length > 0">
    <h4>自作問題一覧</h4>
    <select>
      <option v-for="quiz in originalQuizList" :key="quiz.title">
        {{ quiz.title }}
      </option>
    </select>
  </div> -->
  <button type="button" @click="publishInviteCode">
    招待コード発行
  </button>
  <p>招待コード:{{ invitationCode }}</p>
</template>
<script setup lang="ts">
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc
} from 'firebase/firestore'

import type { User, QuizList, QuizType, Question } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const router = useRouter()
// ルームに参加しているユーザーの情報
const usersInRoom = ref<User[]>([])
// クイズする問題数
const quizCount = ref(2)
// クイズに使用する問題の種類
const quizType = ref<QuizType>('builtin')
// 自作問題リスト
const originalQuizList = ref<QuizList[]>([])
// 自作問題の中で選択した問題の種類
const selectedQuiz = ref('random')

const roomId = useRoute().params.id as string
const { room, roomRef } = useRoom(roomId)

onMounted(() => {
  // localStorageにroomIdを保存する
  localStorage.setItem('roomId', roomId)

  watch(room, (room) => {
    console.log('Current data: ', room)
    if (!room) {
      // TODO: returnする前に適当な場所にリダイレクトすべき
      return
    }
    usersInRoom.value = room.users
    // ここで、他のブラウザとfirestoreが同期している
    if (room.isQuizStarted === true && room.activeQuestion) {
      // todo: ここで無限ループ的なことが起きてるので修正
      router.push(`/quiz/${room.activeQuestion}`)
    }
  })
})

// TODO:クイズをスタートしたら異なるブラウザ間でリアルタイムにクイズの情報を取得する
const startQuiz = async () => {
  console.log('startQuiz')
  const { $firestore } = useNuxtApp()
  const { quizList, setQuizList } = useQuizList()
  // スタートさせるときに、クイズの情報を取得してくる
  const quizRef = collection(
    $firestore,
    'quiz',
    // ここで、クイズの種類を指定する
    '金城クイズ',
    'questions'
  ).withConverter(firestoreQuestionConverter)
  const quizSnapshot = await getDocs(quizRef)
  console.log('quizSnapshot', quizSnapshot.docs)
  const quizData: Question[] = quizSnapshot.docs
    .filter(doc => !doc.data().isRemoved)
    .map(doc => doc.data())
  console.log(quizData)
  // composablesにクイズの情報を保存する
  setQuizList(quizData)
  // ランダムな数字生成(クイズの問題数を超えないようにする)
  const randomNum = Math.floor(Math.random() * quizCount.value)

  // 今出題されているクイズのidを保存する
  await updateDoc(roomRef.value, {
    isQuizStarted: true,
    activeQuestion: quizData[randomNum].id
  })

  // 取得したきたクイズのidから、クイズの個別画面に飛ばす
  router.push(`/quiz/${quizData[randomNum].id}`)
}
// 自作問題リストを取得する
// const getOriginalQuizList = async () => {
//   if (quizType.value !== "MyCreateQuiz") return;
//   const { $firestore } = useNuxtApp();
//   const quizRef = collection($firestore, "quiz");
//   const quizSnapshot = await getDocs(quizRef);
//   const quizData = quizSnapshot.docs.map((doc) => doc.data());
//   console.log(quizData);
//   originalQuizList.value = quizData;
// };

// 招待をする側の処理
const invitationCode = ref('')
const publishInviteCode = () => {
  console.log(useRoute().params.id)
  invitationCode.value = useRoute().params.id as string
}
</script>

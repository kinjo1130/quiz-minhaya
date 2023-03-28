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
  updateDoc,
  query,
  limit,
  where,
  arrayUnion,
  getDoc
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
    if (room.isQuizStarted === true && room.currentQuestionIndex) {
      // todo: ここで無限ループ的なことが起きてるので修正
      router.push(`/quiz/${room.currentQuestionIndex}`)
    }
  })
})

// TODO:クイズをスタートしたら異なるブラウザ間でリアルタイムにクイズの情報を取得する
const startQuiz = async () => {
  console.log('startQuiz')
  const { room } = useRoom(roomId)
  await getQuestionIds()
  // 今出題されているクイズのidを保存する
  await updateDoc(roomRef.value, {
    isQuizStarted: true,
    currentQuestionIndex: 1
  })
  if (!room.value) {
    // ルームがなかった時の処理
    return
  }
  const nextQuestionIndex = room.value?.currentQuestionIndex
  router.push(`/quiz/${nextQuestionIndex}`)
}
// クイズをスタートする前に、クイズの情報を取得する
const getQuestionIds = async () => {
  const { $firestore } = useNuxtApp()
  const { setQuizList } = useQuizList()
  const quizRef = collection(
    $firestore,
    'quiz',
    '金城クイズ',
    'questions'
  ).withConverter(firestoreQuestionConverter)
  // ドキュメントから二問だけ取得する
  const q = query(quizRef, where('isRemoved', '==', false), limit(2))
  const quizSnapshot = await getDocs(q)
  const quizData = quizSnapshot.docs.map(doc => doc.data())
  setQuizList(quizData)
  const filterQuestionIds = quizData.map(quiz => quiz.id)
  console.log({ filterQuestionIds })
  // questionIdsにクイズのidを保存する
  await updateDoc(roomRef.value, {
    questionsIds: arrayUnion(...filterQuestionIds)
  })
  // 保存したquestionsIdsを取得して、quizListに保存する
  const roomSnapshot = await getDoc(roomRef.value)
  const roomData = roomSnapshot.data()
  console.log({ roomData })
  const questionIds = roomData?.questionsIds
  console.log({ questionIds })
  const filterQuizData = quizData.filter((quiz) => {
    return questionIds?.includes(quiz.id)
  })
  setQuizList(filterQuizData)
  console.log({ filterQuizData })
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

<template>
  <p>RoomId:{{ useRoute().params.id }}</p>
  <p>参加しているユーザーリスト</p>
  <ul>
    <li v-for="user in room?.players" :key="user.uid">
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

<script lang="ts" setup>
import {
  collection,
  getDocs,
  updateDoc,
  query,
  limit,
  where,
  arrayUnion,
  getDoc
} from 'firebase/firestore'

import type { QuizList, QuizType } from '~/types'

interface Props {
  roomId: string;
}

const props = defineProps<Props>()
const { roomId } = useVModels(props)
const { room, roomRef } = useRoom()

// 招待をする側の処理

const invitationCode = ref('')
const publishInviteCode = () => {
  invitationCode.value = roomId.value
}

const quizCount = ref(2)
// クイズに使用する問題の種類
const quizType = ref<QuizType>('builtin')
// 自作問題リスト
const originalQuizList = ref<QuizList[]>([])
// 自作問題の中で選択した問題の種類
const selectedQuiz = ref('random')

// TODO:クイズをスタートしたら異なるブラウザ間でリアルタイムにクイズの情報を取得する
const startQuiz = async () => {
  console.log('startQuiz')
  await getQuestionIds()
  // 今出題されているクイズのidを保存する
  console.log(roomRef.value)
  await updateDoc(roomRef.value, {
    state: 'playing'
  })
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
</script>

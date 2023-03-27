<template>
  <h1>クイズページ</h1>
  <p>問題: {{ currentQuiz?.question }}</p>
  <p v-if="room">
    今は{{ room?.currentQuestionIndex }}問目
  </p>
  <p v-if="room">
    残り問題数:{{ room?.questionsIds.length - room!.currentQuestionIndex }}
  </p>
  <button type="button" :disabled="answeredQuizFlag" @click="answeredQuiz">
    わかった！！
  </button>
  <p>回答者: {{ respondent.name }}</p>
  <p>回答者uid:{{ respondent.uid }}</p>
  <p>ログインしているゆーざーのuid:{{ user?.uid }}</p>
  <form v-if="respondent.uid === user?.uid" @submit.prevent="judgeAnswer">
    <label>解答欄</label>
    <input v-model="answerValue" type="text">
    <button>回答する</button>
  </form>
</template>
<script setup lang="ts">
import { arrayUnion, updateDoc } from 'firebase/firestore'
import type { User, Question } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const currentQuiz = ref<Question>({
  id: '',
  isRemoved: false,
  question: '',
  answer: ''
})
const answeredQuizFlag = ref(false)
const respondent = ref<User>({
  name: '',
  uid: ''
})

const answerValue = ref('')

const roomId = localStorage.getItem('roomId')!
const { room, roomRef } = useRoom(roomId)

const { user } = useAuth()

onMounted(async () => {
  await useNuxtApp().$getQuestions()
  const { quizList } = useQuizList()
  const currentQuestionIndex = useRoute().params.id
  // questionsIdsから取得してくる
  const quizId = room.value?.questionsIds[Number(currentQuestionIndex) - 1]
  const quiz = quizList.value.find(quiz => quiz.id === quizId)
  if (!quiz) {
    // クイズがないのは困る
    // TODO: 適当な処理を書く
    console.log('クイズないよーー')
    return
  }

  currentQuiz.value = quiz

  watch(room, (room) => {
    if (!room) {
      // TODO: returnする前に適当な場所にリダイレクトすべき
      return
    }
    // activeQuestionが変更されたら次の問題に行く
    if (room.currentQuestionIndex.toString() !== quizId) {
      if (room.currentQuestionIndex.toString() === '') {
        const router = useRouter()
        console.log('activeQuestionが空なので、結果画面に行く')
        router.push('/result')
        return
      }
      const router = useRouter()
      console.log('activeQuestionが変更されたので、次の問題に行く')
      router.push(`/quiz/${room.currentQuestionIndex}`)
    }
    if (room.respondents.length >= room.respondentLimit) {
      answeredQuizFlag.value = true
      // 回答者の名前を取得する
      console.log('回答者の名前取得')

      // todo: ここの処理が少し重いので、改善したい
      respondent.value = room.users.find(
        user => user.uid === room!.respondents[0]
      )!
    }
  })
})
// クイズに回答する
const answeredQuiz = async () => {
  console.log('回答者の名前を保存する', user.value!.name)
  await updateDoc(roomRef.value, {
    respondents: arrayUnion(user.value!.uid)
  })
}

const judgeAnswer = async () => {
  if (!answerValue) {
    return
  }
  if (answerValue.value === currentQuiz.value.answer) {
    console.log('正解')
    // 残りの問題数がある場合は、次の問題に行く
    if (room.value!.currentQuestionIndex < room.value!.questionsIds.length) {
      await updateDoc(roomRef.value, {
        currentQuestionIndex: room.value!.currentQuestionIndex + 1,
        respondents: []
      })
      console.log('次の問題に行く')
    } else {
      console.log('すべての問題を回答しました')
      const router = useRouter()
      router.push('/result')
    }
  } else {
    console.log('不正解')
  }
}
// 使用してない問題idがある場合は、その問題idを取得する
</script>

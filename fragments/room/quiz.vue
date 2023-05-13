<template>
  <h1>クイズページ</h1>
  <p>問題: {{ currentQuiz.question }}</p>
  <p v-if="room">
    今は{{ room.currentQuestionIndex + 1 }}問目
  </p>
  <p v-if="room">
    残り問題数:{{ room.questionIds.length - room.currentQuestionIndex }}
  </p>
  <Button type="button" button-type="normal" :disabled="isUserRespondent || !canBeRespondent" @click="answeredQuiz">
    わかった！！
  </Button>
  <QuizPlayerCard v-for="player of room?.players" :key="player.uid" :player="player" />
  <form v-if="isUserRespondent" class="flex flex-col" @submit.prevent="judgeAnswer">
    <label class="text-sm">解答欄</label>
    <input v-model="answerValue" type="text" required placeholder="解答をどうぞ" class="border border-black p-3 rounded-lg mb-6">
    <Button type="submit" button-type="normal">
      回答する
    </Button>
  </form>
</template>
<script setup lang="ts">
import { increment, updateDoc } from 'firebase/firestore'
import type { Question, QuizPlayer } from '~/types'

const currentQuiz = ref<Question>({
  id: '',
  isRemoved: false,
  question: '',
  answer: ''
})

const answerValue = ref('')

const { room, roomRef } = useRoom()
const { user } = useAuth()

const respondents = computed(() => Object.values(room.value?.players ?? {}).filter(({ state }) => state !== 'neutral'))
const isUserRespondent = computed(() => respondents.value.some(respondent => respondent.uid === user.value?.uid))
const canBeRespondent = computed(() => respondents.value.length < (room.value?.respondentLimit || 0))

await useNuxtApp().$getQuestions()
const { quizList } = useQuizList()

watch(room, async (room) => {
  if (!room) {
    // TODO: returnする前に適当な場所にリダイレクトすべき
    return
  }
  // questionsIdsから取得してくる
  console.log('取得している問題のID', room.questionIds)
  const quizId = room.questionIds[room.currentQuestionIndex]
  console.log(quizList.value)
  const quiz = quizList.value.find(quiz => quiz.id === quizId)
  console.log('quiz', quiz)
  if (!quiz) {
    // クイズがないなら終わり
    await updateDoc(roomRef.value, {
      state: 'finished'
    })
    return
  }

  currentQuiz.value = quiz

// immediateないと最初の問題が出てこない
}, { immediate: true })

watch(respondents, (respondents) => {
  // 解答者が揃うまでは次に進まない
  // タイムアウト設定とかは別の場所でする
  if (canBeRespondent.value) { return }

  // すべての解答者の正誤が確定したら
  if (respondents.every(respondent => respondent.state.includes('correct'))) {
    console.log('update')
    setTimeout(async () => {
      await updateDoc(roomRef.value, {
        currentQuestionIndex: room.value!.currentQuestionIndex + 1,
        players: Object.fromEntries(
          Object.entries(room.value?.players ?? {})
            .map(([uid, player]) => {
              return [uid, { ...player, state: 'neutral' }] as [string, QuizPlayer]
            }))
      })
    }, 3000)
  }
})

// クイズに回答する
const answeredQuiz = async () => {
  answerValue.value = ''
  // @ts-expect-error ドット表記の型が当たらない
  await updateDoc(roomRef.value, {
    [`players.${user.value!.uid}.state`]: 'respondent'
  })
}

const judgeAnswer = async () => {
  if (!answerValue) {
    return
  }
  console.log('judgeAnswer', answerValue.value, currentQuiz.value.answer)
  if (answerValue.value === currentQuiz.value.answer) {
    console.log('正解')

    // @ts-expect-error ドット表記の型が当たらない
    await updateDoc(roomRef.value, {
      [`players.${user.value!.uid}.score`]: increment(1),
      [`players.${user.value!.uid}.state`]: 'correct'
    })
  } else {
    console.log('不正解')
    // @ts-expect-error ドット表記の型が当たらない
    await updateDoc(roomRef.value, {
      [`players.${user.value!.uid}.state`]: 'incorrect'
    })
  }
}
// 使用してない問題idがある場合は、その問題idを取得する
</script>

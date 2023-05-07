<template>
  <p>RoomId:{{ useRoute().params.id }}</p>
  <p>参加しているユーザーリスト</p>
  <ul>
    <li v-for="user in room?.players" :key="user.uid">
      {{ user.name }}
    </li>
  </ul>
  <div>
    <select v-model="selectedQuizListId">
      <option v-for="quiz of quizLists" :key="quiz.id" :value="quiz.id">
        {{ quiz.title }}
      </option>
    </select>
    から
    <input v-model.number="quizCount" type="number" min="1" :max="selectedQuizListQuestions?.length">
    問
    <Button type="button" button-type="normal" @click="startQuiz">
      クイズをスタートする
    </Button>
  </div>
  <pre>
    {{ selectedQuizListQuestions }}
  </pre>
  <Button type="button" button-type="normal" @click="publishInviteCode">
    招待コード発行
  </Button>
  <p>招待コード:{{ invitationCode }}</p>
</template>

<script lang="ts" setup>
import {
  collection,
  updateDoc,
  query,
  where
} from 'firebase/firestore'

interface Props {
  roomId: string;
}

const props = defineProps<Props>()
const { roomId } = useVModels(props)
const { room, roomRef } = useRoom()

const { $firestore } = useNuxtApp()

// 招待をする側の処理

const invitationCode = ref('')
const publishInviteCode = () => {
  invitationCode.value = roomId.value
}

const quizCount = ref(2)

const selectedQuizListId = ref('random')
const quizLists = useFirestore(computed(() => collection($firestore, 'quiz').withConverter(firestoreQuizListConverter)))
const selectedQuizList = computed(() => quizLists.value?.find(quiz => quiz.id === selectedQuizListId.value))
const selectedQuizListQuestions = useFirestore(computed(() =>
  selectedQuizList.value && query(
    collection($firestore, 'quiz', selectedQuizListId.value, 'questions')
      .withConverter(firestoreQuestionConverter),
    where('isRemoved', '==', false))
))

const startQuiz = async () => {
  console.log('startQuiz')
  if (!selectedQuizListQuestions.value) { return }
  const { setQuizList } = useQuizList()

  const questionIds = shuffleArray(selectedQuizListQuestions.value.map(question => question.id)).slice(0, quizCount.value)

  const filterQuizData = selectedQuizListQuestions.value.filter(quiz => questionIds?.includes(quiz.id))
  setQuizList(filterQuizData)

  await updateDoc(roomRef.value, {
    state: 'playing',
    quizId: selectedQuizListId.value,
    questionIds
  })
}
</script>

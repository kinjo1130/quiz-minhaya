import { defineNuxtPlugin } from '#app'
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import { User } from '~/types'
export default defineNuxtPlugin(() => ({
  provide: {
    async createRoom (user: User) {
      console.log('createRoom')
      const { $firestore } = useNuxtApp()
      const roomsRef = collection($firestore, 'rooms').withConverter(
        firestoreRoomConverter
      )
      const docRef = await addDoc(roomsRef, {
        currentQuestionIndex: 0,
        questionsIds: [],
        respondents: [],
        respondentLimit: 1,
        users: [user],
        isQuizStarted: false,
        isFinished: false
      })
      console.log('Document written with ID: ', docRef.id)
      return docRef.id
    },
    async joinRoom (user: User, roomId: string) {
      const { $firestore } = useNuxtApp()
      const querySnapshot = await getDocs(
        collection($firestore, 'rooms').withConverter(firestoreRoomConverter)
      )
      const isRoomExist = querySnapshot.docs.some(doc => doc.id === roomId)

      if (!isRoomExist) {
        console.log('ルームが存在しません')
        return false
      }

      console.log('joinRoom')
      const roomRef = doc($firestore, 'rooms', roomId).withConverter(
        firestoreRoomConverter
      )
      await updateDoc(roomRef, {
        users: arrayUnion(user)
      })
      return roomId
    },
    async getRoomInfo () {
      const { $firestore } = useNuxtApp()
      const roomId = localStorage.getItem('roomId') || ''
      if (!roomId) {
        console.log('ルームが存在しません')
        return
      }
      const querySnapshot = await getDoc(
        doc($firestore, 'rooms', roomId).withConverter(firestoreRoomConverter)
      )
      console.log('ルーム情報を取得', querySnapshot.data())
      return querySnapshot.data()
    },
    async getQuestions () {
      const { $firestore } = useNuxtApp()
      const { setQuizList } = useQuizList()
      const roomId = localStorage.getItem('roomId') || ''
      const { roomRef } = useRoom(roomId)
      if (!roomId) {
        console.log('ルームが存在しません')
        return
      }
      const quizRef = collection(
        $firestore,
        'quiz',
        '金城クイズ',
        'questions'
      ).withConverter(firestoreQuestionConverter)
      const q = query(quizRef, where('isRemoved', '==', false))
      const quizSnapshot = await getDocs(q)
      const quizData = quizSnapshot.docs.map(doc => doc.data())
      const roomSnapshot = await getDoc(roomRef.value)
      const roomData = roomSnapshot.data()
      console.log({ roomData })
      const questionIds = roomData?.questionsIds
      console.log({ questionIds })
      const filterQuizData = quizData.filter((quiz) => {
        return questionIds?.includes(quiz.id)
      })
      setQuizList(filterQuizData)
    }
  }
}))

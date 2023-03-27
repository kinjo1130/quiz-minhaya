import { defineNuxtPlugin } from '#app'
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc
} from 'firebase/firestore'
import { User } from '~/types'
export default defineNuxtPlugin(() => ({
  provide: {
    async createRoom (user: User) {
      console.log('createRoom')
      const { $firestore } = useNuxtApp()
      const roomsRef = collection($firestore, 'rooms').withConverter(firestoreRoomConverter)
      const docRef = await addDoc(roomsRef, {
        activeQuestion: '',
        answeredQuestions: [],
        respondents: [],
        respondentLimit: 1,
        users: [user],
        isQuizStarted: false
      })
      console.log('Document written with ID: ', docRef.id)
      return docRef.id
    },
    async joinRoom (user: User, roomId: string) {
      const { $firestore } = useNuxtApp()
      const querySnapshot = await getDocs(collection($firestore, 'rooms').withConverter(firestoreRoomConverter))
      const isRoomExist = querySnapshot.docs.some(doc => doc.id === roomId)

      if (!isRoomExist) {
        console.log('ルームが存在しません')
        return false
      }

      console.log('joinRoom')
      const roomRef = doc($firestore, 'rooms', roomId).withConverter(firestoreRoomConverter)
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
      const querySnapshot = await getDoc(doc($firestore, 'rooms', roomId).withConverter(firestoreRoomConverter))
      console.log('ルーム情報を取得', querySnapshot.data())
      return querySnapshot.data()
    },
    async getQuestions () {
      const { $firestore } = useNuxtApp()
      const { setQuizList } = useQuizList()
      console.log('aaa')
      const roomInfo = await useNuxtApp().$getRoomInfo()
      const querySnapshot = await getDocs(
        collection($firestore, 'quiz', '金城クイズ', 'questions').withConverter(firestoreQuestionConverter)
      )
      console.log('取得', querySnapshot.docs)
      console.log('ccc')
      const quizData = querySnapshot.docs
        .filter(doc => doc.data().isRemoved === false)
        .map(doc => doc.data())
      console.log('クイズデータを取得', quizData)
      setQuizList(quizData)
    }
  }
}))

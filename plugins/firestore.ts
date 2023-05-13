import { defineNuxtPlugin } from '#app'
import {
  addDoc,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore'
import { User } from '~/types'
export default defineNuxtPlugin(() => ({
  provide: {
    createRandomId () {
      // 五桁のランダムな数字の文字列を返す
      return Math.floor(Math.random() * 100000).toString().padStart(5)
    },
    async createRoom (user: User) {
      console.log('createRoom')
      const { $firestore } = useNuxtApp()
      const roomId = useNuxtApp().$createRandomId()
      const roomsRef = doc($firestore, 'rooms', roomId).withConverter(
        firestoreRoomConverter
      )
      await setDoc(roomsRef, {
        currentQuestionIndex: 0,
        quizId: 'random',
        questionIds: [],
        respondentLimit: 1,
        players: { [user.uid]: { ...user, isOwner: true, score: 0, state: 'neutral' } },
        state: 'waiting'
      })
      console.log('Document written with ID: ', roomId)
      return roomId
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
      // @ts-expect-error ドット表記の型が当たらない
      await updateDoc(roomRef, {
        [`players.${user.uid}`]: { ...user, isOwner: false, score: 0, state: 'neutral' }
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
      const { room } = useRoom()
      const quizRef = query(collection(
        $firestore,
        'quiz',
        room.value!.quizId,
        'questions'
      ), where(documentId(), 'in', room.value!.questionIds)).withConverter(firestoreQuestionConverter)
      const quizSnapshot = await getDocs(quizRef)
      const quizData = quizSnapshot.docs.map(doc => doc.data())
      setQuizList(quizData)
    }
  }
}))

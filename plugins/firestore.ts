import { defineNuxtPlugin } from "#app";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
export default defineNuxtPlugin(() => ({
  provide: {
    async createRoom(uid: string, name: string) {
      console.log("createRoom");
      const { $firebaseDB } = useNuxtApp();
      const roomsRef = collection($firebaseDB, "rooms").withConverter(firestoreRoomConverter);
      const docRef = await addDoc(roomsRef, {
        activeQuestion: "",
        answeredQuestions: [],
        respondents: [],
        respondentLimit: 1,
        users: [
          {
            uid: uid,
            name: name,
          },
        ],
        isQuizStarted: false,
      });
      console.log("Document written with ID: ", docRef.id);
      return docRef.id;
    },
    async joinRoom(uid: string, name: string, roomId: string) {
      const { $firebaseDB } = useNuxtApp();
      const querySnapshot = await getDocs(collection($firebaseDB, "rooms").withConverter(firestoreRoomConverter));
      const isRoomExist = querySnapshot.docs.some((doc) => doc.id === roomId);
      
      if (!isRoomExist) {
        console.log("ルームが存在しません");
        return false;
      }

      console.log("joinRoom");
      const roomRef = doc($firebaseDB, "rooms", roomId).withConverter(firestoreRoomConverter);
      await updateDoc(roomRef, {
        users: arrayUnion({
          uid: uid,
          name: name,
        }),
      });
      return roomId;
    },
    async getRoomInfo() {
      const { $firebaseDB } = useNuxtApp();
      const roomId = localStorage.getItem("roomId") || "";
      if (!roomId) {
        console.log("ルームが存在しません");
        return;
      }
      const querySnapshot = await getDoc(doc($firebaseDB, "rooms", roomId).withConverter(firestoreRoomConverter));
      console.log("ルーム情報を取得", querySnapshot.data());
      return querySnapshot.data();
    },
    async getQuestions() {
      const { $firebaseDB } = useNuxtApp();
      const { setQuizList } = useQuizList();
      console.log("aaa")
      const roomInfo = await useNuxtApp().$getRoomInfo();
      const querySnapshot = await getDocs(
        collection($firebaseDB, "quiz", "金城クイズ", "questions").withConverter(firestoreQuestionConverter)
      );
      console.log("ccc")
      const quizData = querySnapshot.docs
        .filter((doc) => doc.data().isRemoved === false)
        .map((doc) => doc.data());
      console.log("クイズデータを取得", quizData);
      setQuizList(quizData);
    },
  },
}));

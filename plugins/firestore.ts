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
      const roomsRef = collection($firebaseDB, "rooms");
      const docRef = await addDoc(roomsRef, {
        usersInRoom: [
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
      const querySnapshot = await getDocs(collection($firebaseDB, "rooms"));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        if (doc.id !== roomId) {
          console.log("ルームが存在しません");
          return false;
        }
      });

      console.log("joinRoom");
      const roomRef = doc($firebaseDB, "rooms", roomId);
      await updateDoc(roomRef, {
        usersInRoom: arrayUnion({
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
      const querySnapshot = await getDoc(doc($firebaseDB, "rooms", roomId));
      console.log(querySnapshot.data());
      return querySnapshot.data();
    },
    async getQuestions() {
      const { $firebaseDB } = useNuxtApp();
      const { setQuizList } = useQuizList();
      const roomInfo = await useNuxtApp().$getRoomInfo();
      const querySnapshot = await getDocs(
        collection($firebaseDB, "quiz", roomInfo!.quizType, "questions")
      );
      const quizData = querySnapshot.docs.filter((doc) => doc.data().isRemoved === false).map((doc) => {
        return {
          id: doc.id,
          question: doc.data().question as string,
          answer: doc.data().answer as string,
        }});
      setQuizList(quizData);
    },
  },
}));

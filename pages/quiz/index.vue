<template></template>
<script setup lang="ts">
import { doc, onSnapshot } from "firebase/firestore";

definePageMeta({
  middleware: "auth"
})

const { $firestore } = useNuxtApp();
const roomId = useRoute().params.id as string;
const roomRef = doc($firestore, "rooms", roomId).withConverter(firestoreRoomConverter);
const router = useRouter();

onSnapshot(roomRef, (doc) => {
  const room = doc.data();    
    console.log("Current data: ", room);
    if(!room) {
      // TODO: returnする前に適当な場所にリダイレクトすべき
      return;
    }
  if (room.isQuizStarted === true && room.activeQuestion) {
    router.push(`/quiz/${room.activeQuestion}`);
  }
});
</script>

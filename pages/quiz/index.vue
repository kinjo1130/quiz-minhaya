<template></template>
<script setup lang="ts">
import { doc, onSnapshot } from "firebase/firestore";
const { $firebaseDB } = useNuxtApp();
const roomId = useRoute().params.id as string;
const collectionRef = doc($firebaseDB, "rooms", roomId);
const router = useRouter();
onSnapshot(collectionRef, (doc) => {
  console.log("Current data: ", doc.data());
  if (doc.data()?.isQuizStarted === true && doc.data()?.activeQuestion) {
    router.push(`/quiz/${doc.data()?.activeQuestion}`);
  }
});
</script>

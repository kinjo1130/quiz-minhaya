<template>
  <FragmentRoomHome v-if="room?.state === 'waiting'" :room-id="roomId" />
  <FragmentRoomQuiz v-if="room?.state === 'playing'" />
  <FragmentRoomResult v-if="room?.state === 'finished'" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()

const roomId = route.params.id as string

const { room } = useRoom(roomId)
</script>

<template>
  <h1>終わり</h1>
  <p>正答数: {{ score }}問</p>
  <NuxtLink type="button" :to="'/'">
    トップに戻る
  </NuxtLink>
</template>
<script setup lang="ts">
const { room } = useRoom()
const { user } = useAuth()

const score = computed(() => room.value?.players[user.value!.uid]!.score)
</script>

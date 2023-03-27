<template>
  <h1>終わり</h1>
  <NuxtLink type="button" :to="'/'">
    トップに戻る
  </NuxtLink>
</template>
<script setup lang="ts">
onMounted(() => {
  localStorage.removeItem('roomId')
})
</script>

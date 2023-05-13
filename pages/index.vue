<script setup lang="ts">
const { isAuthenticated } = useAuth()
onMounted(() => {
  if (isAuthenticated.value) {
    // /homeにリダイレクト
    return navigateTo('/home')
  }
})
</script>
<template>
  <div>
    <h1>hello world</h1>
  </div>
</template>

<script setup lang="ts">
const openLoginModal = ref(false)
const openModal = () => {
  openLoginModal.value = true
}
const closeModal = () => {
  openLoginModal.value = false
}
defineExpose({
  openModal,
  closeModal
})
</script>
<template>
  <div v-if="openLoginModal" id="modal" class="hidden fixed z-50 top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50">
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-xl font-bold mb-4">
        Google Sign-in
      </h2>
      <p class="text-gray-700 mb-4">
        Please sign in with your Google account to continue.
      </p>
      <div id="google-signin" />
      <p class="text-gray-700 mt-4 text-sm">
        By signing in, you agree to our <a href="#" class="underline">Terms of Service</a> and <a href="#" class="underline">Privacy Policy</a>.
      </p>
    </div>
  </div>
</template>

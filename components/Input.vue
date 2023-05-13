<script setup lang="ts">
const props = defineProps<{
    type: 'text' | 'password' | 'email' | 'number'
    placeholder: string
    required: boolean
    }>()
</script>
<template>
  <input :type="props.type" class="border border-black p-3 rounded-lg mb-6" :required="props.required" :placeholder="props.placeholder">
</template>

<script setup lang="ts">
const props = defineProps<{
  type: 'button' | 'submit' | 'reset';
  // class: string;
}>()
</script>
<template>
  <button :type="props.type" class="rounded-full p-2 text-white">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">

const props = defineProps<{
  type: 'button' | 'submit' | 'reset';
  // class: string;
  buttonType: 'normal' | 'outline' | 'text';
  disabled?: boolean;
  isLoading?: boolean;
  onClick?:() => void;
}>()
</script>
<template>
  <button
    :type="props.type"
    class="rounded-md p-2 border bg-primary text-white"
    :class="{
      'bg-primary hover:bg-[#003EFF] text-white': !props.disabled && props.buttonType === 'normal',
      'bg-white hover:bg-gray-100 text-gray-700 border-gray-300': !props.disabled && props.buttonType === 'outline',
      'bg-white hover:bg-gray-100 text-gray-700': !props.disabled && props.buttonType === 'text',
      'bg-gray-500 cursor-not-allowed': props.disabled || props.isLoading,
    }"
    :disabled="props.disabled || props.isLoading"
    @click="props.onClick"
  >
    <div class="flex flex-row">
      <IconLoading v-if="props.isLoading" />
      <slot />
    </div>
  </button>
</template>

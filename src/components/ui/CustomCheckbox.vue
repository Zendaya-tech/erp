<template>
  <label class="flex items-center cursor-pointer group">
    <div class="relative">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
        class="sr-only"
      />
      <div 
        :class="[
          'w-5 h-5 border-2 rounded-md transition-all duration-300 ease-in-out',
          'border-primary-300 dark:border-primary-600',
          'group-hover:border-primary-400 dark:group-hover:border-primary-500',
          'group-hover:shadow-sm group-active:scale-95',
          'flex items-center justify-center',
          modelValue ? 'border-primary-500 dark:border-primary-400 bg-primary-500 dark:bg-primary-400' : ''
        ]"
      >
        <CheckIcon 
          :class="[
            'w-3.5 h-3.5 text-white transform transition-all duration-300',
            'motion-safe:animate-checkmark',
            modelValue ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          ]"
        />
      </div>
      <div 
        class="absolute inset-0 rounded-md
               focus-within:ring-2 focus-within:ring-primary-500/70
               focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-800
               transition-all duration-300"
      ></div>
    </div>
    <span 
      v-if="$slots.default"
      class="ml-3 text-gray-700 dark:text-gray-300 select-none
             group-hover:text-primary-600 dark:group-hover:text-primary-400
             transition-colors duration-200"
    >
      <slot />
    </span>
  </label>
</template>

<style>
@keyframes checkmark {
  0% {
    transform: scale(0.75) rotate(-45deg);
    opacity: 0;
  }
  40% {
    transform: scale(1.2) rotate(-45deg);
  }
  80% {
    transform: scale(0.95) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.animate-checkmark {
  animation: checkmark 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>

<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/solid'

defineProps<{
  modelValue: boolean
}>()


</script> 
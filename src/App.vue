<template>
  <router-view />
</template>

<script setup>
import { useHead } from '@unhead/vue'

useHead({
  titleTemplate: title => title ? `${title} - 西大脸面` : '西大脸面',
  meta: [
  ],
})
</script>

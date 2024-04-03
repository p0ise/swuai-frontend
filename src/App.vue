<template>
  <router-view />
</template>

<script setup>
import { useHead } from '@unhead/vue'

useHead({
  titleTemplate: title => title ? `${title} - SWU X FACE` : 'SWU X FACE',
  meta: [
  ],
})
</script>

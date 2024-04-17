<template>
  <router-view />
</template>

<script setup>
import { useHead } from '@unhead/vue'

useHead({
  titleTemplate: title => title ? `${title} - SWU X AI` : 'SWU X AI',
  meta: [
  ],
})
</script>

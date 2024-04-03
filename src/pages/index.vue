<template>
    <!-- 欢迎区域 -->
    <HomeWelcome />

    <!-- 如何使用 -->
    <HomeHowToUse />

    <HomeAbout />
</template>

<script setup>
import { useHead } from '@unhead/vue'

useHead({
    title: '首页',
    meta: [
    ],
})
</script>

<route>
{
    meta: {
        layout: 'home'
    }
}
</route>
<template>
    <v-app-bar flat border="b">
        <v-container class="mx-auto d-flex align-center justify-center">

            <v-app-bar-title>我的应用</v-app-bar-title>

            <!-- 空间分隔 -->
            <v-spacer></v-spacer>

            <!-- 导航链接 -->
            <v-btn v-for="link in links" :key="link.text" text :to="link.to">
                {{ link.text }}
            </v-btn>

            <app-vertical-divider></app-vertical-divider>


        </v-container>
    </v-app-bar>
</template>

<script>
export default {
    name: 'AppBar',
    data() {
        return {
            links: [
                { text: '首页', to: '/' },
                { text: '科大讯飞API', to: '/ifly' },
                { text: '实时人脸识别', to: '/real-time'},
            ],
        };
    },
};
</script>
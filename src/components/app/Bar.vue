<template>
    <v-app-bar flat border="b">
        <v-container class="mx-auto d-flex align-center justify-center">

            <v-app-bar-title>西大脸面</v-app-bar-title>

            <!-- 空间分隔 -->
            <v-spacer></v-spacer>

            <!-- 首页 -->
            <router-link to="/" class="nav-link">
                <v-btn text>首页</v-btn>
            </router-link>

            <!-- 讯飞API -->
            <v-menu bottom left>
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" text>
                        讯飞API
                        <v-icon right>mdi-chevron-down</v-icon>
                    </v-btn>
                </template>

                <v-list>
                    <router-link to="/xunfei/FaceCompare" class="nav-link">
                        <v-list-item>人脸比对</v-list-item>
                    </router-link>
                    <router-link to="/xunfei/FaceFeatures" class="nav-link">
                        <v-list-item>人脸特征分析</v-list-item>
                    </router-link>
                </v-list>
            </v-menu>

            <!-- 实时人脸识别 -->
            <router-link to="/RTFaceRecognition" class="nav-link">
                <v-btn text>实时人脸识别</v-btn>
            </router-link>


        </v-container>
    </v-app-bar>
</template>

<script setup>
</script>

<style scoped>
.nav-link {
    text-decoration: none;
    color: inherit;
}
</style>
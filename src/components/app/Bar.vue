<template>
    <v-app-bar flat border="b">
        <v-container class="mx-auto d-flex align-center justify-center">

            <v-app-bar-title class="d-flex align-center font-weight-bold">
                SWU X AI
            </v-app-bar-title>

            <!-- 空间分隔 -->
            <v-spacer></v-spacer>

            <!-- 首页 -->
            <v-btn to="/">首页</v-btn>

            <!-- 讯飞API -->
            <v-menu bottom left open-on-hover>
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props">
                        讯飞API
                        <v-icon right>mdi-chevron-down</v-icon>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item><v-btn block to="/xunfei/FaceCompare">人脸比对</v-btn></v-list-item>

                    <v-list-item><v-btn block to="/xunfei/FaceFeatures">人脸特征分析</v-btn></v-list-item>
                </v-list>
            </v-menu>

            <!-- 实时人脸识别 -->
            <v-btn to="/RTFaceRecognition">实时人脸识别</v-btn>

            <v-divider vertical class="mx-4 my-auto" style="height: 20px;" inset></v-divider>

            <v-btn href="/login" color="primary" variant="flat">登录</v-btn>

        </v-container>
    </v-app-bar>
</template>

<script setup>
</script>

<style scoped></style>

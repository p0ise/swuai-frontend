<template>
    <v-app-bar flat border="b">
        <v-container class="mx-auto d-flex align-center justify-center">

            <v-app-bar-title class="d-flex align-center font-weight-bold">
                SWU X FACE
            </v-app-bar-title>

            <!-- 空间分隔 -->
            <v-spacer></v-spacer>

            <!-- 首页 -->
            <v-btn text to="/">首页</v-btn>

            <!-- 讯飞API -->
            <v-menu bottom left open-on-hover>
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" text>
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
            <v-btn text to="/RTFaceRecognition">实时人脸识别</v-btn>

            <div class="v-toolbar__append">
              <hr class="v-divider v-divider--vertical v-theme--light mx-4 align-self-center h-100" aria-orientation="vertical" role="separator" style="max-height: 25px;">
            </div>

            <button type="button" class="v-btn v-btn--active v-theme--light bg-primary v-btn--density-default v-btn--size-default v-btn--variant-flat text-none font-weight-regular vo-auth-btn" aria-haspopup="menu" aria-expanded="false" aria-owns="v-menu-48" style="transition: all 0.2s ease 0s;" @click="this.$router.push('/Login')">
              <span class="v-btn__overlay"></span>
              <span class="v-btn__underlay"></span>
              <!---->
              <span class="v-btn__content" data-no-activator="">
                <span >登录</span>
                <!---->
              </span>
              <!---->
              <!---->
            </button>

        </v-container>
    </v-app-bar>
</template>

<script setup>
</script>

<style scoped>
</style>

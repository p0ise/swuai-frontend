<template>
    <v-app id="inspire">
        <v-navigation-drawer image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg" theme="dark" permanent
            v-model="drawer">
            <v-list nav>
                <v-list-item to="/" prepend-icon="mdi-home" title="首页" value="首页"></v-list-item>
                <v-list-group value="人脸识别">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" prepend-icon="mdi-face-recognition" title="人脸识别"></v-list-item>
                    </template>
                    <v-list-item to="/face/compare" prepend-icon="mdi-compare" title="人脸比对" value="人脸比对"></v-list-item>
                    <v-list-item to="/face/features" prepend-icon="mdi-image-search" title="人脸特征分析"
                        value="人脸特征分析"></v-list-item>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

            <v-app-bar-title>基于讯飞开放平台的人脸识别</v-app-bar-title>
        </v-app-bar>

        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            drawer: true,
        };
    },
};
</script>
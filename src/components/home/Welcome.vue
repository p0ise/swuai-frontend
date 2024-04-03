<template>
    <v-container fluid class="pa-0">
        <!-- Hero Section with Welcome Text and Features Cards -->
        <v-row justify="center" align="center" class="hero-background">

            <v-col cols="12" class="welcome-text text-center">
                <h1 class="text-h3 mb-4">欢迎使用 SWU X FACE</h1>
                <p class="mb-6">领先的人脸识别技术，保障您的安全与便捷</p>
                <v-btn large class="mb-6 rounded-pill" href="#features" color="white">
                    了解更多
                </v-btn>
            </v-col>

            <!-- Features Cards -->
            <v-row id="features" justify="center" class="pa-2">
                <v-col cols="auto" v-for="(feature, index) in features" :key="index" class="my-2 d-flex">
                    <v-card class="mx-auto feature-card rounded-xl" style="max-width: 341px;" hover>
                        <!-- Card Image -->
                        <v-img height="200px" :src="feature.image" style="width: 100%;" cover>
                        </v-img>
                        <v-card-title class="headline text font-weight-bold">{{ feature.title }}</v-card-title>
                        <!-- Card Text -->
                        <v-card-text>{{ feature.description }}</v-card-text>
                        <!-- Card Actions -->
                        <v-card-actions>
                            <v-btn class="font-weight-medium" color="primary" text :href="feature.link">了解更多</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>

        </v-row>
    </v-container>
</template>

<script>
import speed from "@/assets/img/speed.png"
import integration from "@/assets/img/integration.png"
import security from "@/assets/img/security.png"
export default {
    data() {
        return {
            features: [
                {
                    title: '快速识别',
                    description: '使用最新的算法，我们的系统能够在几秒钟内准确识别出个人。',
                    image: speed,
                    link: '#'
                },
                {
                    title: '易于集成',
                    description: '我们提供的API和SDK可以轻松集成到您现有的软件或系统中。',
                    image: integration,
                    link: '#'
                },
                {
                    title: '安全可靠',
                    description: '我们的解决方案通过最严格的安全测试，确保您的数据安全。',
                    image: security,
                    link: '#'
                }
            ]
        };
    }
};
</script>

<style scoped>
.hero-background {
    padding: 128px 24px 80px;
    gap: 104px;
    background-image: url('@/assets/img/hero-background.svg');
    background-size: cover;
    background-position: center;
    min-height: 60vh;
    color: #fff;
}

.welcome-text {
    margin-bottom: 2rem;
}

.feature-card {
    max-width: 340px;
    background-color: white;
}

.v-card-title {
    font-size: 1.25rem;
}
</style>
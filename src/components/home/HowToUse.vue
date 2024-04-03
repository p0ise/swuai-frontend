<template>
    <v-container class="how-to-use">
        <v-row>
            <v-col cols="12">
                <h2 class="text-center text-h3" style="padding-bottom: 64px;">如何使用</h2>
                <v-timeline>
                    <v-timeline-item v-for="(step, index) in steps" :key="index" :color="step.color || 'primary'">
                        <template v-slot:icon>
                            <v-icon>{{ step.icon }}</v-icon>
                        </template>
                        <v-card>
                            <v-card-title class="headline">{{ step.title }}</v-card-title>
                            <v-card-text>{{ step.text }}</v-card-text>
                            <v-card-actions>
                                <v-btn v-if="step.buttonText" color="primary" :href="step.link" text>
                                    {{ step.buttonText }}
                                </v-btn>
                            </v-card-actions>
                            <v-img v-if="step.image" :src="step.image" class="white--text align-end"
                                aspect-ratio="1.7"></v-img>
                        </v-card>
                    </v-timeline-item>
                </v-timeline>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            steps: [
                {
                    title: '注册账户',
                    text: '输入你的个人信息以注册新账户。',
                    icon: 'mdi-account-circle',
                    color: 'teal',
                    buttonText: '了解更多',
                    link: '#register'
                },
                {
                    title: '上传照片',
                    text: '上传你的人脸照片以进行识别。',
                    icon: 'mdi-upload',
                    color: 'purple',
                    buttonText: '上传',
                    link: '#upload'
                },
                {
                    title: '等待结果',
                    text: '系统将处理你的照片并识别人脸。',
                    icon: 'mdi-clock',
                    color: 'orange'
                },
                {
                    title: '获取结果',
                    text: '查看并下载你的人脸识别结果。',
                    icon: 'mdi-checkbox-marked-circle-outline',
                    color: 'green',
                    buttonText: '查看结果',
                    link: '#results'
                }
            ]
        };
    }
};
</script>

<style scoped>
.how-to-use {
    max-width: 1200px;
    margin: auto;
    padding-top: 128px;
}
</style>
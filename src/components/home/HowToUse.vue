<template>
    <v-container class="how-to-use">
        <v-row>
            <v-col cols="12">
                <h2 class="text-center text-h3" style="padding-bottom: 64px;">如何使用</h2>
                <v-stepper alt-labels :items="steps">
                    <template v-for="(step, index) in steps" v-slot:item.index>
                        <v-card :title="step.title" flat>{{step.text}}</v-card>
                    </template>
                </v-stepper>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            e1: 1,
            steps: [
                {
                    title: '选择模块',
                    text: '选择要使用的功能模块（人脸比对、特征分析或实时人脸识别）。',
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
<template>
    <v-container class="how-to-use">
        <v-row>
            <v-col cols="12">
                <h2 class="text-center text-h3" style="padding-bottom: 64px;">如何使用</h2>
                  <v-stepper :items="['Step 1', 'Step 2', 'Step 3']">
                    <template v-slot:item.1>
                      <v-card title="Step One" flat>...</v-card>
                    </template>

                    <template v-slot:item.2>
                      <v-card title="Step Two" flat>...</v-card>
                    </template>

                    <template v-slot:item.3>
                      <v-card title="Step Three" flat>...</v-card>
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
            steps: [
                {
                    title: '选择模块',
                    text: '选择要使用的功能模块。',
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

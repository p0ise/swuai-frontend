<template>
    <v-container class="how-to-use">
        <v-row>
            <v-col cols="12">
                <h2 class="text-center text-h3" style="padding-bottom: 64px;">如何使用</h2>
                <v-stepper :items="['步骤一', '步骤二', '步骤三', '步骤四']">
                    <template v-slot:item.1>
                        <v-card title="选择模块" flat text="选择要使用的功能模块。"></v-card>
                    </template>

                    <template v-slot:item.2>
                        <v-card title="上传照片" flat text="上传你的人脸照片以进行识别。"></v-card>
                    </template>

                    <template v-slot:item.3>
                        <v-card title="等待结果" flat text="系统将处理你的照片并识别人脸。"></v-card>
                    </template>
                    <template v-slot:item.4>
                        <v-card title="获取结果" flat text="查看并下载你的人脸识别结果。"></v-card>
                    </template>
                </v-stepper>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.how-to-use {
    max-width: 1200px;
    margin: auto;
    padding-top: 128px;
}
</style>

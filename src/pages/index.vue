<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
                <div class="text-h5 text-center mb-4">欢迎来到我们的人脸识别系统</div>
                <div class="text-body-1">
                    本系统基于最先进的人脸识别技术，提供人脸比对和人脸特征分析等功能。
                    你可以上传图片进行人脸比对，或者分析人脸的年龄、性别、颜值和表情等特征。
                </div>
                <v-row justify="center" class="my-4">
                    <v-btn to="/xunfei/FaceCompare" color="primary" class="mr-2">尝试人脸比对</v-btn>
                    <v-btn to="/xunfei/FaceFeatures" color="secondary">开始人脸特征分析</v-btn>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
</script>

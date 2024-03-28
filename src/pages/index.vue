<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title class="headline">欢迎来到我们的人脸识别系统</v-card-title>
                    <v-card-text>
                        本系统基于最先进的人脸识别技术，提供人脸比对和人脸特征分析等功能。
                        你可以上传图片进行人脸比对，或者分析人脸的年龄、性别、颜值和表情等特征。
                    </v-card-text>
                    <v-card-actions>
                        <v-btn to="/face/compare" color="primary">尝试人脸比对</v-btn>
                        <v-btn to="/face/features" color="secondary">开始人脸特征分析</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: 'index',
};
</script>
<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8" lg="6">
                <div class="text-h5 text-center mb-4">人脸比对</div>
                <v-row align="center" justify="space-around">
                    <v-col cols="12" sm="8" md="6">
                        <!-- 为图片预览设置最小高度 -->
                        <image-upload v-model="image1"></image-upload>
                    </v-col>
                    <v-col cols="12" sm="8" md="6">
                        <image-upload v-model="image2"></image-upload>
                    </v-col>
                </v-row>
                <v-row class="my-0" justify="center">
                    <v-btn color="primary" @click="compareFaces" :disabled="loading">
                        {{ loading ? '分析中...' : '开始比对' }}
                    </v-btn>
                </v-row>
                <v-row class="my-0" justify="center" v-if="loading">
                    <v-progress-circular indeterminate color="primary" class="mt-3"></v-progress-circular>
                </v-row>
                <!-- 提示信息或比对结果 -->
                <v-row class="my-0" v-if="result && !loading">
                    <v-alert :type="resultType" class="mt-3">
                        {{ resultMessage }}
                    </v-alert>
                </v-row>
                <v-row class="info-box mt-3">
                    <p><strong>注意事项：</strong></p>
                    <ul>
                        <li>图片文件仅支持 .jpg/.jpeg/.png/.bmp 格式，图片大小不超过 2M。</li>
                        <li>请提供清晰的人脸照片，人脸大小不小于 30*30 像素，其中人脸俯仰角、左右偏航角、人脸反转角 60°以内识别效果最好。</li>
                        <li>人脸比对只可对比图片中主体部分人脸。</li>
                        <li>建议使用仅包含一张人脸的照片进行比对，若照片中含有多张人脸，引擎会选择其中人脸置信度最高的人脸进行比较，可能会影响比对结果。</li>
                    </ul>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            image1: null,
            image2: null,
            result: false,
            resultMessage: '',
            resultType: 'info',
            loading: false,
        };
    },
    methods: {
        async compareFaces() {
            if (!this.image1 || !this.image2) {
                this.result = true;
                this.resultMessage = '请上传两张图片进行比对。';
                this.resultType = 'warning';
                return;
            }

            this.loading = true;
            const formData = new FormData();
            formData.append('image1', this.image1);
            formData.append('image2', this.image2);

            try {
                const response = await axios.post('http://localhost:5000/api/face-compare', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                // 假设 response.data.data 包含比对结果分数
                const score = parseFloat(response.data.data);
                let resultText = `相似度分数：${(score * 100).toFixed(2)}。\n`;

                if (score > 0.67) {
                    resultText += '高度相似，极有可能是同一个人。';
                } else {
                    resultText += '相似度较低，可能不是同一个人。';
                }

                this.result = true;
                this.resultMessage = resultText;
                this.resultType = 'success';
            } catch (error) {
                this.result = true;
                this.resultMessage = '比对过程中出现错误：' + (error.response.data.error || error.message);
                this.resultType = 'error';
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
.info-box {
    background-color: #f5f5f5;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
    font-size: 0.9rem;
}

.info-box ul {
    padding-left: 20px;
}
</style>
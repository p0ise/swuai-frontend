<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8" lg="6">
                <div class="text-h5 text-center mb-4">人脸比对</div>
                <div class="my-4">
                    <v-row align="center" justify="space-around">
                        <v-col cols="12" sm="8" md="6">
                            <!-- 为图片预览设置最小高度 -->
                            <image-upload v-model="image1"></image-upload>
                        </v-col>
                        <v-col cols="12" sm="8" md="6">
                            <image-upload v-model="image2"></image-upload>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-btn color="primary" @click="compareFaces" :disabled="loading">
                            开始比对
                        </v-btn>
                    </v-row>
                </div>
                <!-- 提示信息或比对结果 -->
                <div v-if="result">
                    <v-alert :type="resultType">
                        {{ resultMessage }}
                    </v-alert>
                </div>
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
                this.result = true;
                this.resultMessage = '比对结果：' + response.data.data;
                this.resultType = 'success';
            } catch (error) {
                this.result = true;
                this.resultMessage = '比对过程中出现错误：' + error.response.data.error;
                this.resultType = 'error';
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>
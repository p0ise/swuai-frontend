<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8" lg="6">
                <div class="text-h5 text-center mb-4">人脸比对</div>
                <div class="my-4">
                    <v-row align="center" justify="space-around">
                        <v-col cols="12" sm="8" md="6">
                            <!-- 为图片预览设置最小高度 -->
                            <div style="min-height: 200px; background-color: #EEE;">
                                <v-img :src="image1Preview" aspect-ratio="1" cover></v-img>
                            </div>
                            <v-file-input v-model="image1" label="选择图片1" prepend-icon="mdi-camera"
                                accept="image/png, image/jpeg, image/bmp" @change="previewImage('image1')" outlined
                                dense></v-file-input>
                        </v-col>
                        <v-col cols="12" sm="8" md="6">
                            <div style="min-height: 200px; background-color: #EEE;">
                                <v-img :src="image2Preview" aspect-ratio="1" cover></v-img>
                            </div>
                            <v-file-input v-model="image2" label="选择图片2" prepend-icon="mdi-camera"
                                accept="image/png, image/jpeg, image/bmp" @change="previewImage('image2')" outlined
                                dense></v-file-input>
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


<style>
.v-field__input {
    overflow: hidden;
}
</style>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            image1: null,
            image2: null,
            image1Preview: null,
            image2Preview: null,
            result: false,
            resultMessage: '',
            resultType: 'info',
            loading: false,
        };
    },
    methods: {
        previewImage(imageId) {
            const imageFile = this[imageId][0]; // 获取文件对象数组的第一个元素
            if (imageFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this[imageId + 'Preview'] = e.target.result; // 更新对应的预览图
                };
                reader.readAsDataURL(imageFile); // 读取文件内容
            } else {
                this[imageId + 'Preview'] = null; // 清空预览图
            }
        },
        async compareFaces() {
            if (!this.image1 || !this.image2) {
                this.result = true;
                this.resultMessage = '请上传两张图片进行比对。';
                this.resultType = 'warning';
                return;
            }

            this.loading = true;
            const formData = new FormData();
            formData.append('image1', this.image1[0]);
            formData.append('image2', this.image2[0]);

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
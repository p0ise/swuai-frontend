<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="6">
                <v-card>
                    <v-card-title class="text-h5 text-center">人脸特征分析</v-card-title>
                    <v-card-text>
                        <v-form ref="form" @submit.prevent="submit">
                            <v-file-input v-model="image" label="选择图片" prepend-icon="mdi-camera"
                                accept="image/png, image/jpeg, image/bmp" @change="previewImage"></v-file-input>
                            <v-img v-if="imagePreview" :src="imagePreview" aspect-ratio="1.7"></v-img>
                            <v-row justify="center" class="my-3">
                                <v-btn color="primary" type="submit" :disabled="loading">分析</v-btn>
                            </v-row>
                        </v-form>
                        <v-row justify="center" class="mt-3">
                            <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
                        </v-row>
                        <v-row class="mt-3">
                            <v-col cols="12" sm="6" offset-sm="3">
                                <v-alert v-if="result && !loading" type="info" dense>
                                    <div v-for="(value, key) in result" :key="key">
                                        {{ translateResult(key, value) }}
                                    </div>
                                </v-alert>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            image: null,
            imagePreview: null,
            result: null,
            loading: false,
        };
    },
    methods: {
        previewImage() {
            if (this.image) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreview = e.target.result;
                };
                reader.readAsDataURL(this.image[0]);
            }
        },
        async submit() {
            if (!this.image) return;

            this.loading = true; // 开始加载
            const formData = new FormData();
            formData.append('image', this.image[0]);
            try {
                const response = await axios.post('http://localhost:5000/api/face-features', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                this.result = response.data.results; // 假设后端返回的是一个包含分析结果的对象
                console.log('分析结果:', this.result);
            } catch (error) {
                console.error('分析失败:', error);
                this.result = { error: '分析过程中出现错误，请稍后再试。' };
            } finally {
                this.loading = false; // 结束加载
            }
        },
        translateResult(key, value) {
            const translations = {
                age: `年龄：${this.translateAge(value)}`,
                sex: `性别：${this.translateSex(value)}`,
                expression: `表情：${this.translateExpression(value)}`,
                face_score: `颜值：${this.translateFaceScore(value)}`,
            };
            return translations[key] || `${key}: ${value}`;
        },
        translateAge(label) {
            const ageRanges = {
                0: '0-1岁',
                1: '2-5岁',
                2: '6-10岁',
                3: '11-15岁',
                4: '16-20岁',
                5: '21-25岁',
                6: '31-40岁',
                7: '41-50岁',
                8: '51-60岁',
                9: '61-80岁',
                10: '80岁以上',
                11: '其他',
                12: '26-30岁',
            };
            return ageRanges[label] || '未知';
        },
        translateFaceScore(label) {
            const faceScores = {
                0: '漂亮',
                1: '好看',
                2: '普通',
                3: '难看',
                4: '其他',
                5: '半人脸',
                6: '多人',
            };
            return faceScores[label] || '未知';
        },
        translateSex(label) {
            const sexes = {
                0: '男',
                1: '女',
                2: '难以辨认',
                3: '多人',
            };
            return sexes[label] || '未知';
        },
        translateExpression(label) {
            const expressions = {
                0: '其他(非人脸表情图片)',
                1: '其他表情',
                2: '喜悦',
                3: '愤怒',
                4: '悲伤',
                5: '惊恐',
                6: '厌恶',
                7: '中性',
            };
            return expressions[label] || '未知';
        },
    },
};
</script>
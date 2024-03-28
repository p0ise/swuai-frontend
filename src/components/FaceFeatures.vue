<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <div class="text-h5 text-center mb-4">人脸特征分析</div>
                <v-form ref="form" @submit.prevent="submit" class="mx-auto" style="max-width: 500px;">
                    <v-img :src="imagePreview" aspect-ratio="1" class="mb-2 elevation-2" cover
                        style="background-color: #EEE;"></v-img>
                    <v-file-input v-model="image" label="选择图片" prepend-icon="mdi-camera"
                        accept="image/png, image/jpeg, image/bmp" @change="previewImage" outlined dense></v-file-input>
                    <v-row justify="center" class="my-3">
                        <v-btn color="primary" type="submit" :disabled="loading">{{ loading ? '分析中...' : '分析' }}</v-btn>
                    </v-row>
                </v-form>
                <v-row justify="center" class="mt-3" v-if="loading">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </v-row>
                <v-row class="mt-3" v-if="result && !loading">
                    <v-col cols="12" sm="8" offset-sm="2">
                        <v-alert type="info" dense>
                            <template v-for="(value, key) in result">
                                <div>{{ translateResult(key, value) }}</div>
                            </template>
                        </v-alert>
                    </v-col>
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

<style scoped>
/* 适当调整样式以适应新的布局 */
</style>
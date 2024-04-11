<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <div class="text-h5 text-center mb-4">人脸特征分析</div>
                <v-form ref="form" @submit.prevent="submit" class="mx-auto" style="max-width: 500px;">
                    <image-upload v-model="image"></image-upload>
                    <v-row justify="center" class="my-0">
                        <v-btn color="primary" type="submit" :disabled="loading">{{ loading ? '分析中...' : '分析' }}</v-btn>
                    </v-row>
                </v-form>
                <v-row justify="center" class="mb-0 mt-3" v-if="loading">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </v-row>
                <v-row class="mb-0 mt-3" v-if="result && !loading">
                    <v-alert type="info" dense>
                        <template v-for="(value, key) in result">
                            <div>{{ translateResult(key, value) }}</div>
                        </template>
                    </v-alert>
                </v-row>
                <v-row class="info-box mt-3">
                    <p><strong>注意事项：</strong></p>
                    <ul>
                        <li>图片文件仅支持 .jpg/.jpeg/.png/.bmp 格式，图片大小不超过 2M。</li>
                        <li>请提供清晰的人脸照片，人脸大小不小于 30*30 像素，其中人脸俯仰角、左右偏航角、人脸反转角 60°以内识别效果最好。</li>
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
            image: null,
            result: null,
            loading: false,
        };
    },
    methods: {
        async submit() {
            if (!this.image) return;

            this.loading = true; // 开始加载
            const formData = new FormData();
            formData.append('image', this.image);
            try {
                const response = await axios.post('http://localhost:5000/api/xunfei/face-features', formData, {
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
.background-image {
    padding: 128px 24px 80px;
    gap: 104px;
    background-image: url('@/assets/img/hero-background.svg');
    background-size: cover;
    background-position: center;
    min-height: 60vh;
    color: #fff;
}
/* 适当调整样式以适应新的布局 */
</style>

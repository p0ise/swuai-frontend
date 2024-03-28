<template>
    <div>
        <v-img :src="imagePreview" aspect-ratio="1" class="mb-2 elevation-2" cover
            style="background-color: #EEE;"></v-img>
        <v-file-input label="选择图片" prepend-icon="mdi-camera" accept="image/png, image/jpeg, image/bmp"
            @update:modelValue="onImageChange" outlined dense>
        </v-file-input>
    </div>
</template>

<script>
export default {
    name: 'ImageUpload',
    props: ['modelValue'],
    emits: ['update:modelValue'],
    data() {
        return {
            imageFile: null,
            imagePreview: null,
        };
    },
    methods: {
        onImageChange(fileInputEvent) {
            // fileInputEvent 是 v-file-input 触发的原生事件对象，包含选中的文件列表
            if (fileInputEvent) {
                if (fileInputEvent.length == 0) {
                    this.imageFile = null;
                } else if (fileInputEvent.length > 0) {
                    this.imageFile = fileInputEvent[0]; // 获取第一个文件对象
                }
                this.previewImage();
            }
            this.$emit('update:modelValue', this.imageFile);
        },
        previewImage() {
            const reader = new FileReader();
            reader.onload = e => {
                this.imagePreview = e.target.result; // 更新图片预览
            };
            reader.readAsDataURL(this.imageFile); // 读取文件内容作为DataURL
        },
    }
};
</script>

<style>
.v-field__input {
    overflow: hidden;
}
</style>
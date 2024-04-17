<template>
    <div class="d-flex flex-column justify-space-between">
        <div>
            <div class="text-h6 message-role">{{ message.role }}</div>
            <!-- 判断是否处于编辑状态 -->
            <div v-if="editing" class="text-body-1 message-content">
                <input v-model="editingContent" @keyup.enter="saveEdit">
                <div class="d-flex justify-center py-3">
                    <v-btn @click="saveEdit" color="primary" class="mx-1">
                        保存并提交
                    </v-btn>
                    <v-btn @click="cancelEdit" class="mx-1">
                        取消
                    </v-btn>
                </div>
            </div>
            <div v-else-if="message.role === 'assistant'" class="text-body-1 message-content" ref="contentElm"
                v-html="contentHtml">
            </div>
            <div v-else class="text-body-1 message-content">
                {{ message.content }}
            </div>
        </div>
        <div class="message-actions">
            <v-btn icon :disabled="!canNavigate('prev')" @click="navigateTo('prev')" variant="text" density="compact">
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <span>
                {{ getSiblingsInfo() }}
            </span>
            <v-btn icon :disabled="!canNavigate('next')" @click="navigateTo('next')" variant="text" density="compact">
                <v-icon size="x-small">mdi-chevron-right</v-icon>
            </v-btn>

            <v-tooltip text="复制" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon variant="text" density="compact" @click="copyMessage">
                        <v-icon size="x-small" icon="mdi-content-copy"></v-icon>
                    </v-btn>
                </template>
            </v-tooltip>

            <template v-if="message.role === 'user'">
                <v-tooltip text="编辑" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon variant="text" density="compact" @click="editMessage">
                            <v-icon size="x-small" icon="mdi-file-edit-outline"></v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>

                <v-tooltip text="删除" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon variant="text" density="compact" @click="removeMessage">
                            <v-icon size="x-small" icon="mdi-trash-can-outline"></v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
            </template>
            <template v-else-if="message.role === 'assistant'">
                <v-tooltip text="重新生成" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon variant="text" density="compact" @click="regenerateMessage">
                            <v-icon size="x-small" icon="mdi-reload"></v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
            </template>

            <v-snackbar v-model="snackbar" location="top" timeout="2000">
                {{ snackbarText }}
            </v-snackbar>
        </div>
    </div>
</template>

<script setup>
import hljs from "highlight.js"
import MarkdownIt from 'markdown-it'
import copy from 'copy-to-clipboard'
import mathjax3 from 'markdown-it-mathjax3'
import { Node } from '@/models/conversation.js';

const md = new MarkdownIt({
    linkify: true,
    highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return `<pre class="hljs-code-container my-3"><div class="hljs-code-header d-flex align-center justify-space-between bg-grey-darken-3 pa-1"><span class="pl-2 text-caption">${language}</span><button class="hljs-copy-button" data-copied="false">Copy</button></div><code class="hljs language-${language}">${hljs.highlight(code, { language: language, ignoreIllegals: true }).value}</code></pre>`
    },
})
md.use(mathjax3)

const emit = defineEmits(['edit', 'remove', 'prompt', 'navigateTo']);
const props = defineProps({
    message: {
        type: Node,
        required: true
    }
});

const contentHtml = ref('')

const contentElm = ref(null)

watchEffect(async () => {
    contentHtml.value = props.message.content ? md.render(props.message.content) : ''
    await nextTick()
    bindCopyCodeToButtons()
})

const bindCopyCodeToButtons = () => {
    if (!contentElm.value) {
        return
    }
    contentElm.value.querySelectorAll('.hljs-code-container').forEach((codeContainer) => {
        const copyButton = codeContainer.querySelector('.hljs-copy-button');
        const codeBody = codeContainer.querySelector('code');
        copyButton.onclick = function () {
            copy(codeBody.textContent ?? '');

            copyButton.innerHTML = "Copied!";
            copyButton.dataset.copied = 'true';

            setTimeout(() => {
                copyButton.innerHTML = "Copy";
                copyButton.dataset.copied = 'false';
            }, 2000);
        };
    })
}

onMounted(() => {
    bindCopyCodeToButtons()
})

const snackbar = ref(false)
const snackbarText = ref('')
const showSnackbar = (text) => {
    snackbarText.value = text
    snackbar.value = true
}

// 定义一个状态对象来存储是否编辑和当前编辑的内容
const editing = ref(false);
const editingContent = ref('');
// 处理点击事件，激活编辑状态
function activateEdit() {
    editing.value = true;
    editingContent.value = props.message.content; // 将当前内容复制到编辑用的变量中
}

// 保存编辑后的内容
function saveEdit() {
    const newNode = new Node(props.message.role, editingContent.value); // 创建一个新节点
    emit('edit', newNode, props.message); // 触发编辑事件
    editing.value = false; // 退出编辑状态
}

// 取消编辑
function cancelEdit() {
    editingContent.value = ''; // 清空编辑内容
    editing.value = false; // 退出编辑状态
}

const canNavigate = (direction) => {
    if (direction === 'prev')
        return props.message.prevSibling() !== null;
    else if (direction === 'next')
        return props.message.nextSibling() !== null;
    else
        return false;
}

const navigateTo = (direction) => {
    if (direction === 'prev')
        emit('navigateTo', props.message.prevSibling());
    else if (direction === 'next')
        emit('navigateTo', props.message.nextSibling());
}

const copyMessage = () => {
    copy(props.message.content)
    showSnackbar('已复制！')
}

const editMessage = () => {
    activateEdit();
}

const removeMessage = () => {
    emit('remove', props.message);
}

const getSiblingsInfo = () => {
    const siblings = props.message.getSiblings();
    const index = siblings.indexOf(props.message);

    return `${index + 1}/${siblings.length}`;
}

const regenerateMessage = () => {
    emit('prompt', props.message.parent);
}
</script>


<style scoped>
.message-role {
    text-transform: capitalize !important;
}

.message-content {
    font-size: 1rem !important;
    font-weight: 400;
    line-height: 1.25rem;
}

.message-content input {
    width: 100%;
    /* 使输入框宽度填满容器 */
    border: none;
    /* 去除输入框的边框 */
    color: inherit;
    /* 输入文字颜色继承父元素 */
    font-size: inherit;
    /* 字体大小继承父元素 */
    padding: 0;
    /* 移除输入框的内边距 */
}

.message-content input:focus {
    outline: none;
}


.message-actions {
    display: flex;
    align-items: center;
}

.message-content p,
.message-content table,
.message-content ul,
.message-content ol,
.message-content h1,
.message-content h2,
.message-content h3,
.message-content h4,
.message-content h5,
.message-content h6 {
    margin-bottom: 1rem;
}

.message-content table {
    width: 100%;
    border-collapse: collapse;
    border-radius: .5rem;
}

.message-content table th,
.message-content table td {
    padding: .5rem 1rem;
    border: 1px solid gray;
}

.message-content ol,
.message-content ul {
    padding-left: 2em;
}

.hljs-code-container {
    border-radius: 3px;
    overflow: hidden;
}

.hljs-copy-button {
    width: 2rem;
    height: 2rem;
    text-indent: -9999px;
    color: #fff;
    border-radius: .25rem;
    border: 1px solid #ffffff22;
    background-image: url('data:image/svg+xml;utf-8,<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 5C5.73478 5 5.48043 5.10536 5.29289 5.29289C5.10536 5.48043 5 5.73478 5 6V20C5 20.2652 5.10536 20.5196 5.29289 20.7071C5.48043 20.8946 5.73478 21 6 21H18C18.2652 21 18.5196 20.8946 18.7071 20.7071C18.8946 20.5196 19 20.2652 19 20V6C19 5.73478 18.8946 5.48043 18.7071 5.29289C18.5196 5.10536 18.2652 5 18 5H16C15.4477 5 15 4.55228 15 4C15 3.44772 15.4477 3 16 3H18C18.7956 3 19.5587 3.31607 20.1213 3.87868C20.6839 4.44129 21 5.20435 21 6V20C21 20.7957 20.6839 21.5587 20.1213 22.1213C19.5587 22.6839 18.7957 23 18 23H6C5.20435 23 4.44129 22.6839 3.87868 22.1213C3.31607 21.5587 3 20.7957 3 20V6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3H8C8.55228 3 9 3.44772 9 4C9 4.55228 8.55228 5 8 5H6Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7 3C7 1.89543 7.89543 1 9 1H15C16.1046 1 17 1.89543 17 3V5C17 6.10457 16.1046 7 15 7H9C7.89543 7 7 6.10457 7 5V3ZM15 3H9V5H15V3Z" fill="white"/></svg>');
    background-repeat: no-repeat;
    background-position: center;
    transition: background-color 200ms ease, transform 200ms ease-out
}

.hljs-copy-button:hover {
    border-color: #ffffff44
}

.hljs-copy-button:active {
    border-color: #ffffff66
}

.hljs-copy-button[data-copied="true"] {
    text-indent: 0;
    width: auto;
    background-image: none
}

@media(prefers-reduced-motion) {
    .hljs-copy-button {
        transition: none
    }
}

/*MathJax*/
.MathJax svg {
    max-width: 100%;
    overflow: auto;
}
</style>
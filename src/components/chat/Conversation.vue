<template>
    <v-container class="chat-window">
        <v-list>
            <v-list-item v-for="(node, index) in getCurrentPath()" :key="index">
                <ChatMessage :message="node" @prompt="prompt" @edit="edit" @remove="remove" @navigateTo="navigateTo" />
            </v-list-item>
        </v-list>
    </v-container>
</template>

<script setup>
import { Conversation } from '@/models/conversation.js';

const emit = defineEmits(['prompt']);
const props = defineProps({
    conversation: {
        type: Conversation,
        required: true
    }
});

const getCurrentPath = () => {
    return props.conversation.getPath();
}

const remove = (node) => {
    props.conversation.removeNode(node);
}

const edit = (node, sibling) => {
    props.conversation.addSibling(node, sibling);
    prompt(node);
}

const prompt = (node) => {
    emit('prompt', node);
}

const navigateTo = (node) => {
    props.conversation.navigateTo(node);
}
</script>

<style scoped>
</style>
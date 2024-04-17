<template>
    <v-app>
        <v-navigation-drawer app permanent class="sidebar-background">
            <v-list nav>
                <v-list-subheader>历史对话</v-list-subheader>
                <v-list-item v-if="conversations.length === 0">
                    <v-list-item-title>没有对话</v-list-item-title>
                </v-list-item>
                <v-list-item v-for="(conversation, index) in conversations" :key="index" :value="conversation"
                    @click="selectConversation(conversation)" :active="currentConversation === conversation">
                    <v-list-item-title>{{ conversation.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
            <template v-slot:append>
                <v-divider></v-divider>
                <v-list>
                    <v-list-item :title="user">
                        <template v-slot:prepend>
                            <v-icon icon="mdi-account-circle" size="x-large"></v-icon>
                        </template>
                        <template v-slot:append>
                            <v-menu location="top">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" size="small" variant="text" icon="mdi-chevron-up"></v-btn>
                                </template>
                                <v-list>
                                    <v-list-item prepend-icon="mdi-logout" title="退出登录" @click="signOut">
                                    </v-list-item>
                                </v-list>
                            </v-menu>

                        </template>
                    </v-list-item>
                </v-list>
                <v-expansion-panels style="flex-direction: column;" color="#f9f9f9">
                    <v-expansion-panel rounded="rounded-pill">
                        <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-close">
                            <v-icon icon="mdi-cog" class="mr-4"></v-icon> 配置
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <div class="px-1">
                                <v-list density="compact" nav>

                                    <v-dialog v-model="clearConfirmDialog" persistent max-width="500">
                                        <template v-slot:activator="{ props }">
                                            <v-list-item v-bind="props" prepend-icon="mdi-delete-circle-outline"
                                                title="清除对话"></v-list-item>
                                        </template>
                                        <v-card>
                                            <v-card-title class="text-h5">
                                                你确定要删除所有对话吗？
                                            </v-card-title>
                                            <v-card-text>
                                                这会是一个永久性的删除，一旦删除就无法恢复。请谨慎操作。
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn color="green-darken-1" variant="text"
                                                    @click="clearConfirmDialog = false" class="text-none">
                                                    取消删除
                                                </v-btn>
                                                <v-btn color="green-darken-1" variant="text" @click="clearConversations"
                                                    class="text-none" :loading="deletingConversations">
                                                    确认删除
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>

                                    <v-list-item prepend-icon="mdi-help-circle-outline" title="反馈"
                                        @click="feedback"></v-list-item>

                                </v-list>
                            </div>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </template>
        </v-navigation-drawer>

        <v-app-bar flat class="appbar-background">
            <v-toolbar-title class="font-weight-bold">SWU X CHAT</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn title="新的对话" icon="mdi-plus" @click="createNewConversation" class="d-md-none ma-3"></v-btn>
            <v-btn variant="outlined" class="text-none d-none d-md-block" @click="createNewConversation">
                新的对话
            </v-btn>

        </v-app-bar>

        <v-main>
            <ChatWelcome v-if="!currentConversation || currentConversation.root.children.length === 0" />
            <ChatConversation v-else :conversation="currentConversation" @prompt="prompt" />
            <v-footer app>
                <v-row>
                    <v-textarea v-model="newMessage" label="输入您的消息..." density="compact" variant="outlined" single-line
                        auto-grow rows="1" clearable clear-icon="mdi-close-circle-outline"
                        @keydown.enter.exact="enterOnly">
                        <template v-slot:append-inner>
                            <v-tooltip text="发送消息" location="top">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" color="primary" icon="mdi-arrow-up-bold" @click="sendMessage"
                                        density="compact" :disabled="!newMessage || onMessaging">
                                    </v-btn>
                                </template>
                            </v-tooltip>

                        </template>
                    </v-textarea>
                </v-row>
            </v-footer>
        </v-main>
    </v-app>
</template>

<script>
import io from 'socket.io-client';
import { useUserStore } from '@/stores/userStore';
import { Conversation, Node } from '@/models/conversation.js';

export default {
    data: () => ({
        socket: null,
        conversations: [
        ],
        currentConversation: null,
        deletingConversations: false,
        clearConfirmDialog: false,
        newMessage: '',
        onMessaging: false,
        currentPrompt: null,
        currentAnswer: null
    }),
    computed: {
        user() {
            const userStore = useUserStore();
            return userStore.currentUser;
        }
    },
    mounted() {
        this.socket = io('ws://localhost:5000/api/chat');

        this.socket.on('connect', () => {
            console.log("Connected to Chat");
        });

        this.socket.on('message_response', (data) => {
            if (!this.onMessaging) {
                console.log("Not on messaging");
                return;
            }
            if (data.status == 0) {
                let newMessage = data.text;
                this.currentAnswer = new Node(newMessage.role, newMessage.content);
                this.currentConversation.addChild(this.currentAnswer, this.currentPrompt);
                console.log("currentAnswer", this.currentAnswer);
                console.log("currentPrompt", this.currentPrompt);
                console.log("currentConversation", this.currentConversation);
                this.currentPrompt = null;
            }
            else if (data.status == 1) {
                this.currentAnswer.content += data.text.content;
            }
            else if (data.status == 2) {
                this.currentAnswer.content += data.text.content;
                this.currentAnswer = null;
                this.onMessaging = false;
            }
        });
    },
    methods: {
        signOut() {
            const userStore = useUserStore();
            try {
                userStore.logout();
                setTimeout(() => {
                    this.$router.replace({ name: '/login' }); // Assuming 'Chat' is the route name for your chat page
                }, 3000); // Wait for 3 seconds before redirecting
            } catch (error) {
                alert(error.message);
            }
        },
        clearConversations() {
            this.deletingConversations = true;
            this.conversations = [];
            this.currentConversation = null;
            this.deletingConversations = false;
        },
        feedback() {
            window.open('https://github.com/p0ise/swuface-frontend/issues', '_blank')
        },
        createNewConversation() {
            const newConversation = new Conversation(`对话 ${this.conversations.length + 1}`);
            this.conversations.push(newConversation);
            this.selectConversation(newConversation);
        },
        enterOnly(event) {
            event.preventDefault();
            this.sendMessage()
        },
        selectConversation(conversation) {
            this.currentConversation = conversation;
        },
        prompt(node) {
            if (this.onMessaging) {
                console.log("Still on messaging");
                return;
            }
            this.currentPrompt = node;
            this.currentAnswer = null;
            this.onMessaging = true;

            const messages = this.currentConversation.getMessages(node);
            this.socket.emit('send_message', { messages: messages });
            console.log("Prompt", node);
            console.log("Messages", messages);
        },
        sendMessage() {
            console.log("Sending message");
            if (this.newMessage.trim() !== '') {
                if (!this.currentConversation) {
                    this.createNewConversation();
                }
                const newNode = new Node('user', this.newMessage);
                this.currentConversation.addChild(newNode);
                this.prompt(newNode);
            }
            this.newMessage = '';
        }
    },
    beforeUnmount() {
        // 清理工作
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
</script>

<style scoped>
.sidebar-background {
    background-color: #f9f9f9;
}

.appbar-background {
    background-color: #fff;
}
</style>

<route>
    {
        meta: {
            layout: false,
            requiresAuth: true
        }
    }
</route>
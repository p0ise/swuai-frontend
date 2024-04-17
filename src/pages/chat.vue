<template>
    <v-app>
        <v-navigation-drawer app permanent>
            <v-btn @click="createNewConversation" variant="outlined" block>创建新对话</v-btn>
            <v-divider></v-divider> <!-- 分割线 -->
            <v-list nav>
                <v-list-subheader>历史对话</v-list-subheader>
                <v-list-item v-for="(conversation, index) in conversations" :key="index" :value="conversation"
                    @click="selectConversation(conversation)">
                    <v-list-item-title>{{ conversation.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
            <template v-slot:append></template>
        </v-navigation-drawer>

        <v-main>
            <v-container>
                <div id="chat-window" style="height: 500px; overflow-y: auto;">
                    <v-list>
                        <v-list-item v-for="(msg, index) in getCurrentMessages()" :key="index">
                            <div class="d-flex flex-column justify-space-between">
                                <div>
                                    <div class="text-h6 message-role">{{ msg.role }}</div>
                                    <div class="text-body-1 message-content">{{ msg.content }}</div>
                                </div>
                                <div class="navigation-buttons">
                                    <v-btn icon :disabled="!canNavigate(msg, 'prev')"
                                        @click="navigateMessage(msg, 'prev')" variant="text" density="compact">
                                        <v-icon>mdi-chevron-left</v-icon>
                                    </v-btn>
                                    <span>
                                        {{ getSiblingsIndex(msg) + 1 }}/{{ countSiblings(msg) }}
                                    </span>
                                    <v-btn icon :disabled="!canNavigate(msg, 'next')"
                                        @click="navigateMessage(msg, 'next')" variant="text" density="compact">
                                        <v-icon>mdi-chevron-right</v-icon>
                                    </v-btn>
                                </div>
                            </div>
                        </v-list-item>
                    </v-list>
                </div>
                <v-footer app>
                    <v-row>
                        <v-textarea v-model="newMessage" label="输入您的消息..." density="compact" variant="outlined"
                            single-line>
                            <template v-slot:append-inner>
                                <v-btn color="primary" @click="sendMessage">发送</v-btn>
                            </template>
                        </v-textarea>
                    </v-row>
                </v-footer>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import io from 'socket.io-client';
import { useUserStore } from '@/stores/userStore';

export default {
    data: () => ({
        socket: null,
        conversations: [
        ],
        currentConversation: null,
        newMessage: '',
        onMessaging: false
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
            if (data.status == 0) {
                this.onMessaging = true;
                let newMessageNode = data.text;
                newMessageNode.parent = this.currentConversation.currentLeaf;
                if (this.currentConversation.currentLeaf) {
                    this.currentConversation.currentLeaf.children.push(newMessageNode);
                } else {
                    this.currentConversation.root.push(newMessageNode);
                }
                this.currentConversation.currentLeaf = newMessageNode;
            }
            else if (data.status == 1) {
                this.currentConversation.currentLeaf.content += data.text.content;
            }
            else if (data.status == 2) {
                this.currentConversation.currentLeaf.content += data.text.content;
                this.onMessaging = false;
            }
        });
    },
    methods: {
        getCurrentLeaf(node) {
            while (node && node.children && node.children.length > 0) {
                node = node[node.children.length - 1];
            }
            return node;
        },
        selectConversation(conversation) {
            this.currentConversation = conversation;
            if (!conversation.currentLeaf) {
                conversation.currentLeaf = conversation.root.length > 0 ? this.getCurrentLeaf(conversation.root) : null;
            }
        },
        getSiblings(msg) {
            const siblings = msg.parent ? msg.parent.children : this.currentConversation.root;
            return siblings;
        },
        countSiblings(msg) {
            return this.getSiblings(msg).length;
        },
        getSiblingsIndex(msg) {
            return this.getSiblings(msg).indexOf(msg);
        },
        getCurrentMessages() {
            let messages = [];
            let node = this.currentConversation ? this.currentConversation.currentLeaf : null;
            while (node) {
                messages.unshift(node);
                node = node.parent;
            }
            return messages;
        },
        sendMessage() {
            if (this.newMessage.trim() !== '') {
                if (!this.currentConversation) {
                    this.createNewConversation();
                }
                const newMessageNode = { role: 'user', content: this.newMessage, children: [], parent: this.currentConversation.currentLeaf };
                if (this.currentConversation.currentLeaf) {
                    this.currentConversation.currentLeaf.children.push(newMessageNode);
                } else {
                    this.currentConversation.root.push(newMessageNode);
                }
                this.currentConversation.currentLeaf = newMessageNode;
                this.newMessage = '';

                let messages = this.getCurrentMessages().map(msg => {
                    const { parent, children, ...cleanMsg } = msg;
                    return cleanMsg;
                });
                this.socket.emit('send_message', { messages: messages });
                this.$nextTick(() => {
                    const container = document.getElementById('chat-window');
                    container.scrollTop = container.scrollHeight;
                });
            }
        },
        canNavigate(msg, direction) {
            const siblings = this.getSiblings(msg);
            const index = siblings.indexOf(msg);
            return (direction === 'prev' && index > 0) || (direction === 'next' && index < siblings.length - 1);
        },
        navigateMessage(msg, direction) {
            const siblings = this.getSiblings(msg);
            const index = siblings.indexOf(msg);
            if (direction === 'prev' && index > 0) {
                this.currentConversation.currentLeaf = this.getCurrentLeaf(siblings[index - 1]);
            } else if (direction === 'next' && index < siblings.length - 1) {
                this.currentConversation.currentLeaf = this.getCurrentLeaf(siblings[index + 1]);
            }
            this.$nextTick(() => {
                const container = document.getElementById('chat-window');
                container.scrollTop = container.scrollHeight;
            });
        },
        createNewConversation() {
            const newConversationTitle = `对话 ${this.conversations.length + 1}`;
            const newConversation = {
                title: newConversationTitle,
                root: [],
                currentLeaf: null
            };
            this.conversations.push(newConversation);
            this.selectConversation(newConversation);
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
.message-role {
    text-transform: capitalize !important;
}


.message-content {
    flex-grow: 1;
    padding-right: 16px;
}

.message-navigation {
    display: flex;
    align-items: center;
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
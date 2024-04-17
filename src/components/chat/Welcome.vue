<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <div class="text-center">
                    <h2 class="text-h2">欢迎来到<span class="text-primary">SWU X CHAT</span></h2>
                    <p class="text-caption my-5">
                        SWU X CHAT 是基于讯飞星火的新一代认知智能模型。
                        <br>
                    </p>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="10" offset-md="1">
                <v-row>
                    <v-col cols="12" md="4">
                        <v-row>
                            <v-col>
                                <div class="d-flex flex-column align-center">
                                    <v-icon icon="mdi-white-balance-sunny"></v-icon>
                                    <h3 class="text-h6">例子</h3>
                                </div>
                            </v-col>
                        </v-row>
                        <ChatWelcomeCard v-for="example in examples" :content="example" />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-row>
                            <v-col>
                                <div class="d-flex flex-column align-center">
                                    <v-icon icon="mdi-lightning-bolt"></v-icon>
                                    <h3 class="text-h6">能力</h3>
                                </div>
                            </v-col>
                        </v-row>
                        <ChatWelcomeCard v-for="capabilitie in capabilities" :content="capabilitie" />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-row>
                            <v-col>
                                <div class="d-flex flex-column align-center">
                                    <v-icon icon="mdi-alert"></v-icon>
                                    <h3 class="text-h6">局限</h3>
                                </div>
                            </v-col>
                        </v-row>
                        <ChatWelcomeCard v-for="limitation in limitations" :content="limitation" />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const examples = ref([
    '"Explain quantum computing in simple terms"',
    '"Got any creative ideas for a 10 year old’s birthday?"',
    '"How do I make an HTTP request in Javascript?"'
])
const capabilities = ref([
    'Remembers what user said earlier in the conversation',
    'Allows user to provide follow-up corrections',
    'Trained to decline inappropriate requests'
])
const limitations = ref([
    'May occasionally generate incorrect information',
    'May occasionally produce harmful instructions or biased content',
    'Limited knowledge of world and events after 2021'
])
</script>
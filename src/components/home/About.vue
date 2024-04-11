<template>
    <v-container class="about-us" style="padding-top: 128px;">
        <h2 class="text-center text-h3" style="padding-bottom: 64px;">关于我们</h2>
        <p>{{ description }}</p>
        <v-row>
            <v-col v-for="(member, index) in teamMembers" :key="index" cols="12" md="6">
                <v-card>
                    <v-card-title>{{ member.name }}</v-card-title>
                    <v-card-text>{{ member.role }}</v-card-text>
                    <v-card-actions>
                        <v-btn :href="member.profileLink" text>查看资料</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            description: 'SWU X FACE 是一个致力于利用人工智能技术来解决实际问题的团队。',
            teamMembers: [
                {
                    name: '张三',
                    role: '项目经理',
                    profileLink: '#'
                },
                {
                    name: '李四',
                    role: '前端开发',
                    profileLink: '#'
                },
                // 更多团队成员...
            ]
        };
    }
};
</script>

<style scoped>
.about-us {
    max-width: 900px;
    margin: auto;
}
</style>

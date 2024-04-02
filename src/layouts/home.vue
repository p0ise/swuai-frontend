<template>
    <v-app id="inspire">
        <AppBar />
        <v-main>
            <router-view />
        </v-main>
        <HomeFooter />
    </v-app>
</template>

<script>
export default {
    data: () => ({
    }),
}

</script>
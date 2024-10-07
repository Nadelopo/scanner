<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { VThemeProvider, VContainer, VBtn } from 'vuetify/components'

const route = useRoute()
const router = useRouter()

const onLogout = () => {
  router.push({ name: 'Auth' })
}
</script>

<template>
  <v-theme-provider theme="dark" with-background>
    <v-container>
      <div v-if="route.name && route.name !== 'Auth'" class="text-end mb-5">
        <v-btn @click="onLogout">Выйти</v-btn>
      </div>
      <RouterView />
    </v-container>
  </v-theme-provider>
</template>

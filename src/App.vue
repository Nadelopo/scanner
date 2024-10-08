<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VThemeProvider, VContainer, VBtn, VSnackbar } from 'vuetify/components'
import { useNetworkStatus } from './shared/composables/useNetworkStatus'

const route = useRoute()
const router = useRouter()

const onLogout = () => {
  router.push({ name: 'Auth' })
}

const snackbar = ref(false)
const snackbarMessage = ref('')

const { isOnline } = useNetworkStatus()
watch(isOnline, () => {
  if (isOnline.value) {
    snackbarMessage.value = 'Соеденение восстановлено.\nНе синхронизированные данные будут утеряны.'
  } else {
    snackbarMessage.value = 'Соеденение прервано. Приложение находится в оффлайн режиме.'
  }
  snackbar.value = true
})

const onSynchronize = () => {
  snackbar.value = false
}
</script>

<template>
  <v-theme-provider theme="dark" with-background>
    <v-container>
      <v-snackbar v-model="snackbar" multi-line timeout="-1">
        <div style="white-space: pre-wrap">{{ snackbarMessage }}</div>
        <!-- @vue-expect-error v-if="isOnline && isAuth" -->
        <template v-if="isOnline">
          <v-btn color="red" variant="text" @click="onSynchronize"> синхронизировать </v-btn>
          <v-btn color="red" class="px-0" variant="text" @click="snackbar = false"> закрыть </v-btn>
        </template>
        <!-- @vue-expect-error v-if="!isOnline || !isAuth" -->
        <template v-if="!isOnline" #actions>
          <v-btn color="red" variant="text" @click="snackbar = false"> закрыть </v-btn>
        </template>
      </v-snackbar>
      <div v-if="route.name && route.name !== 'Auth'" class="text-end mb-5">
        <v-btn @click="onLogout">Выйти</v-btn>
      </div>
      <RouterView />
    </v-container>
  </v-theme-provider>
</template>

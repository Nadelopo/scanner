<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { VThemeProvider, VContainer, VBtn, VSnackbar } from 'vuetify/components'
import { useAuthStore } from './stores/authStore'
import { useTariffStore } from './stores/tariffStore'
import { useNetworkStatus } from './shared/composables/useNetworkStatus'

const route = useRoute()
const router = useRouter()
const { logout } = useAuthStore()

const onLogout = () => {
  logout()
  router.push({ name: 'Auth' })
}

const { isAuth } = storeToRefs(useAuthStore())
const snackbar = ref(false)
const snackbarMessage = ref('')
const { isOnline } = useNetworkStatus()

watch(isOnline, () => {
  if (isOnline.value) {
    snackbarMessage.value =
      'Соеденение восстановлено.' +
      (isAuth.value ? '\nНе синхронизированные данные будут утеряны.' : '')
  } else {
    snackbarMessage.value = 'Соеденение прервано. Приложение находится в оффлайн режиме.'
  }
  snackbar.value = true
})

const { syncTariffs, clearTariffs, setTariffs } = useTariffStore()

const onSynchronize = () => {
  syncTariffs()
  snackbar.value = false
}

watchEffect(() => {
  ;(isAuth.value ? setTariffs : clearTariffs)()
})
</script>

<template>
  <v-theme-provider theme="dark" with-background>
    <v-container>
      <v-snackbar v-model="snackbar" multi-line timeout="-1">
        <div style="white-space: pre-wrap">{{ snackbarMessage }}</div>
        <template v-if="isOnline && isAuth">
          <v-btn color="red" variant="text" @click="onSynchronize"> синхронизировать </v-btn>
          <v-btn color="red" class="px-0" variant="text" @click="snackbar = false"> закрыть </v-btn>
        </template>
        <template v-if="!isOnline || !isAuth" #actions>
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

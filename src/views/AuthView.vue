<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { VForm, VTextField, VBtn } from 'vuetify/components'
import type { SubmitEventPromise } from 'vuetify'
import { useAuthStore } from '@/stores/authStore'

const username = ref('')
const password = ref('')
const router = useRouter()

const passwordRules = [
  (value: string) => {
    if (value) return true
    return 'Обязательное поле'
  },
  (value: string) => {
    if (value.length >= 8) return true
    return 'Пароль должен содержать не менее 8 символов'
  }
]
const { login, signup } = useAuthStore()
const loading = ref(false)
const isRegister = ref(false)

const auth = async (event: SubmitEventPromise) => {
  const { valid } = await event
  if (!valid) return
  loading.value = true
  const success = await (isRegister.value ? signup : login)(username.value, password.value)
  if (success) {
    router.push({ name: 'Tariffs' })
  }
}

const visible = ref(false)
</script>

<template>
  <div class="auth-form">
    <v-form @submit.prevent="auth">
      <h2 class="mb-5 text-md-h5 text-h6">
        <span
          class="cursor-pointer"
          :class="{ 'opacity-60': isRegister }"
          @click="isRegister = false"
        >
          Войти
        </span>
        /
        <span
          class="cursor-pointer"
          :class="{ 'opacity-60': !isRegister }"
          @click="isRegister = true"
        >
          Зарегистрироваться
        </span>
      </h2>
      <v-text-field
        v-model="username"
        :rules="[(v) => Boolean(v) || 'Обязательное поле']"
        label="Username"
        class="mb-4"
      />
      <v-text-field
        v-model="password"
        :type="visible ? 'text' : 'password'"
        :rules="passwordRules"
        label="Password"
      />
      <v-btn class="mt-4" type="submit" :loading block>
        {{ isRegister ? 'Зарегистрироваться' : 'Войти' }}
      </v-btn>
    </v-form>
  </div>
</template>

<style scoped>
.auth-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px);
  form {
    max-width: 500px;
    width: 100%;
  }
}
</style>

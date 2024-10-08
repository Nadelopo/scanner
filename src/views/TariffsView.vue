<script setup lang="ts">
import { useTariffStore } from '@/stores/tariffStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { VBtn, VCard, VCardText, VChip, VCol, VRow, VProgressCircular } from 'vuetify/components'

const { tariffs } = storeToRefs(useTariffStore())

const router = useRouter()
const addTariff = () => {
  router.push({ name: 'SetTariff' })
}
</script>

<template>
  <div class="d-flex justify-space-between align-center flex-md-row flex-column">
    <h1 class="my-5 text-center">Примененные тарифы</h1>
    <v-btn class="mb-5" @click="addTariff">Добавить тариф</v-btn>
  </div>
  <div v-if="!tariffs.length" class="d-flex justify-center">
    <v-progress-circular indeterminate />
  </div>
  <v-row>
    <v-col v-for="tariff in tariffs" :key="tariff.id" cols="12" xl="3" lg="4" md="6">
      <v-card class="mx-auto fill-height d-flex flex-column" width="100%" max-width="380">
        <template #title>
          <span class="font-weight-black">Тариф - {{ tariff.val }}</span>
        </template>

        <v-card-text class="bg-surface-light pt-4 d-flex flex-column ga-2">
          <div>Создан: {{ new Date(tariff.created).toLocaleString() }}</div>
          <div>
            <div>QRs:</div>
            <ul style="list-style-position: inside">
              <li v-for="qr in tariff.qrs" :key="qr">{{ qr }}</li>
            </ul>
          </div>
          <div class="mt-auto">
            <v-chip :color="tariff.processed ? 'red' : 'green'">
              {{ tariff.processed ? 'Не обработан' : 'Обработан' }}
            </v-chip>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { QrcodeStream } from 'vue-qrcode-reader'
import { VSelect, VBtn, VProgressCircular, VSnackbar } from 'vuetify/components'
import { type TariffValue, useTariffStore } from '@/stores/tariffStore'

type Point = {
  x: number
  y: number
}

type BoundingBox = {
  x: number
  y: number
  width: number
  height: number
  top: number
  right: number
  bottom: number
  left: number
}

type QRCodeData = {
  boundingBox: BoundingBox
  rawValue: string
  format: string
  cornerPoints: Point[]
}

const selectedTariff = ref<TariffValue>('T1')
const scannedQr = ref<QRCodeData[]>([])
const router = useRouter()

const onDetect = (result: QRCodeData[]) => {
  scannedQr.value = result
}

const { createTariff } = useTariffStore()
const isQrUndetected = ref(false)
const applyTariff = async () => {
  if (!scannedQr.value.length) {
    isQrUndetected.value = true
    return
  }

  createTariff({
    id: crypto.randomUUID(),
    created: new Date().toISOString(),
    processed: true,
    qrs: scannedQr.value.map((qr) => qr.rawValue),
    val: selectedTariff.value
  })

  router.push({ name: 'Tariffs' })
}

function paintOutline(detectedCodes: any[], ctx: any) {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

    ctx.strokeStyle = 'red'

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y)
    }
    ctx.lineTo(firstPoint.x, firstPoint.y)
    ctx.closePath()
    ctx.stroke()
  }
}

const error = ref('')

const onError = (err: any) => {
  if (err.name === 'NotAllowedError') {
    error.value += 'вам нужно предоставить разрешение на доступ к камере'
  } else if (err.name === 'NotFoundError') {
    error.value += 'на этом устройстве нет камеры'
  } else if (err.name === 'NotSupportedError') {
    error.value += 'необходим безопасный контекст (HTTPS, localhost)'
  } else if (err.name === 'NotReadableError') {
    error.value += 'камера уже используется?'
  } else if (err.name === 'OverconstrainedError') {
    error.value += 'установленные камеры не подходят'
  } else if (err.name === 'StreamApiNotSupportedError') {
    error.value += 'Stream API не поддерживается в этом браузере'
  } else if (err.name === 'InsecureContextError') {
    error.value +=
      'Доступ к камере разрешен только в безопасном контексте. Используйте HTTPS или localhost вместо HTTP.'
  } else {
    error.value += err.message
  }
}

const isCameraLoad = ref(true)
</script>

<template>
  <div class="set-tariff">
    <v-btn :to="{ name: 'Tariffs' }" class="mb-4">назад</v-btn>
    <div class="error">{{ error }}</div>
    <div v-if="isCameraLoad && !error" class="d-flex justify-center">
      <v-progress-circular :size="40" :width="4" indeterminate />
    </div>
    <div v-show="!isCameraLoad">
      <v-select v-model="selectedTariff" label="Select tariff" :items="['T1', 'T2', 'T3']" />
      <qrcode-stream
        v-if="!error"
        :track="paintOutline"
        :formats="['qr_code', 'rm_qr_code', 'micro_qr_code']"
        style="aspect-ratio: 1"
        @error="onError"
        @detect="onDetect"
        @camera-on="isCameraLoad = false"
      />
      <div>
        <div v-for="qr in scannedQr" :key="qr.rawValue">{{ qr.rawValue }}</div>
      </div>
      <v-btn class="mt-2" :disabled="Boolean(error)" @click="applyTariff">Применить Тариф</v-btn>
    </div>
    <v-snackbar v-model="isQrUndetected" :timeout="2000" color="red">
      QR-код не определен
    </v-snackbar>
  </div>
</template>

<style scoped>
.set-tariff {
  max-width: 500px;
  padding: 10px;
  margin: 0 auto;
}

:global(.set-tariff video) {
  border-radius: 8px;
}

.error {
  font-weight: bold;
  color: red;
}
</style>

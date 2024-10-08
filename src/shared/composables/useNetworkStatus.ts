import { ref } from 'vue'

const isOnline = ref(navigator.onLine)

const updateNetworkStatus = () => {
  isOnline.value = navigator.onLine
}

const startListeningNetworkStatus = () => {
  window.addEventListener('online', updateNetworkStatus)
  window.addEventListener('offline', updateNetworkStatus)
}
startListeningNetworkStatus()

const stopListeningNetworkStatus = () => {
  window.removeEventListener('online', updateNetworkStatus)
  window.removeEventListener('offline', updateNetworkStatus)
}

export const useNetworkStatus = () => ({
  isOnline,
  startListeningNetworkStatus,
  stopListeningNetworkStatus
})

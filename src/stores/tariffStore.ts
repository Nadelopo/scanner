import { readonly, ref, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { openDB } from 'idb'
import { addTariff, getTariffs } from '@/api/services/tariffs'

export type TariffValue = 'T1' | 'T2' | 'T3'

export type Tariff = {
  id: string
  val: TariffValue
  qrs: string[]
  processed: boolean
  created: string
}

export const useTariffStore = defineStore('tariffs', () => {
  const tariffs = ref<Tariff[]>([])

  const createTariff = async (tariff: Tariff) => {
    tariffs.value.unshift(tariff)

    const { data, error } = await addTariff(tariff)
    if (error) {
      tariffs.value = tariffs.value.filter((t) => t.id !== tariff.id)
    } else {
      tariffs.value = tariffs.value.map((t) => (t.created === tariff.created ? data : t))
    }
  }

  const syncTariffs = async () => {
    const responses = await Promise.all(
      tariffs.value.filter((t) => t.processed).map((t) => addTariff(t))
    )
    const data = responses.map((r) => r.data).filter((d) => d !== null)

    const db = await openDB('app-db', 1)
    tariffs.value = tariffs.value.map((t) => {
      db.put('tariffs', { ...toRaw(t), processed: false })
      return data.find((d) => d.created === t.created) ?? t
    })
  }

  const setTariffs = async () => {
    if (tariffs.value.length) return
    const { data, error } = await getTariffs()
    if (error) return
    tariffs.value.unshift(
      ...data.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    )
  }

  const clearTariffs = () => (tariffs.value = [])

  return { tariffs: readonly(tariffs), createTariff, syncTariffs, setTariffs, clearTariffs }
})

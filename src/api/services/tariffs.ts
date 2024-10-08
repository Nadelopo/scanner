import { openDB } from 'idb'
import { delay, myFetch, type ApiResponse } from '..'
import type { Tariff } from '@/stores/tariffStore'

const saveTariffsInDB = async (tariffs: Tariff[]) => {
  const db = await openDB('app-db', 1)
  db.clear('tariffs')
  tariffs.forEach(async (t) => await db.put('tariffs', t))
}

export const getTariffs = async (): Promise<ApiResponse<Tariff[]>> => {
  if (!navigator.onLine) {
    const db = await openDB('app-db', 1)
    const savedTariffs: Tariff[] = await db.getAll('tariffs')
    return { data: savedTariffs, error: null }
  }
  await delay(2000)
  try {
    const response = await myFetch('tariffs.json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return { data: null, error: new Error('Неизвестная ошибка') }
    }

    const data: Tariff[] = await response.json()
    saveTariffsInDB(data)

    return { data, error: null }
  } catch (error: any) {
    console.error(error)
    return { data: null, error: error.message || 'Неизвестная ошибка' }
  }
}

export const addTariffInDB = async (tariff: Tariff) => {
  const db = await openDB('app-db', 1)
  await db.put('tariffs', tariff)
}

export const addTariff = async (tariff: Tariff): Promise<ApiResponse<Tariff>> => {
  if (!navigator.onLine) {
    addTariffInDB(tariff)
    return { data: tariff, error: null }
  }
  await delay(3000)
  try {
    const response = await myFetch('tariffs.json', {
      // method: 'POST',
      // body: JSON.stringify(tariff),
    })

    if (!response.ok) {
      return { data: null, error: new Error('Неизвестная ошибка') }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = await response.json()

    const id = crypto.randomUUID()
    const newTariff = { ...tariff, processed: false, id }
    addTariffInDB(newTariff)
    return { data: newTariff, error: null }
  } catch (error: any) {
    console.error(error)
    return { data: null, error: error }
  }
}

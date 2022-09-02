import { MMKV } from 'react-native-mmkv'
import { CustomRootState } from '../types'
import { initializeMMKVFlipper } from 'react-native-mmkv-flipper-plugin'

/**
 * Implementation of the StorageManagerI interface for mobile
 */
export default class StorageManager {
  private excludedProps: Array<keyof CustomRootState>
  private storage: MMKV

  constructor(excludedProps: Array<keyof CustomRootState>) {
    this.excludedProps = excludedProps
    this.storage = new MMKV()
    if (__DEV__) {
      initializeMMKVFlipper({ default: this.storage })
    }
  }

  public write(storageKey: string, state: unknown): boolean | Error {
    try {
      if (typeof state === 'object') {
        const data = Array.isArray(state) ? [...state] : { ...state }
        if (!data || Object.keys(data).length === 0) {
          return new Error('Empty data')
        }

        this.excludedProps.forEach((prop: keyof CustomRootState | string) => {
          if (data.hasOwnProperty(prop)) {
            delete data[prop]
          }
        })
        if (Object.keys(data).length > 0) {
          this.storage.set(storageKey, JSON.stringify(data))
          return true
        } else {
          return Error('Can not write sensitive data')
        }
      } else {
        this.storage.set(storageKey, JSON.stringify(state))
        return true
      }
    } catch (e) {
      return false
    }
  }

  public read<T>(storageKey: string, defaultValue: T): T {
    try {
      if (this.storage.contains(storageKey)) {
        const result = this.storage.getString(storageKey)
        return JSON.parse(result) as T
      }

      return defaultValue
    } catch (e) {
      throw new Error('Failed to read from storage: ' + e)
    }
  }

  public clearAll(): void {
    this.storage.clearAll()
  }

  public remove(storageKey: string): void {
    this.storage.delete(storageKey)
  }
}

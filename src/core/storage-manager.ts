import AsyncStorage from '@react-native-async-storage/async-storage'
import { CustomRootState } from '../reducers'

/**
 * Implementation of the StorageManagerI interface for mobile
 */
export default class StorageManager {
  private excludedProps: Array<keyof CustomRootState>
  private storageKey: string

  constructor(storageKey: string, excludedProps: Array<keyof CustomRootState>) {
    this.storageKey = storageKey
    this.excludedProps = excludedProps
  }

  public async write(data: CustomRootState): Promise<boolean | Error> {
    if (!data || Object.keys(data).length === 0) {
      return new Error('Empty data')
    }
    try {
      this.excludedProps.forEach((prop: keyof CustomRootState) => {
        if (data.hasOwnProperty(prop)) {
          delete data[prop]
        }
      })
      if (Object.keys(data).length > 0) {
        await AsyncStorage.setItem(this.storageKey, JSON.stringify(data))
        return true
      } else {
        return Error('Can not write sensitive data')
      }
    } catch (e) {
      return false
    }
  }

  public async read(): Promise<CustomRootState> {
    try {
      const result = await AsyncStorage.getItem(this.storageKey)
      return JSON.parse(result || '') as CustomRootState
    } catch (e) {
      throw new Error('Failed to read from storage')
    }
  }
}

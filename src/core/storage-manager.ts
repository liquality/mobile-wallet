import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Implementation of the StorageManagerI interface for mobile
 */
export default class StorageManager {
  private excludedProps: Array<keyof any>
  private storageKey: string

  constructor(storageKey: string, excludedProps: Array<keyof any>) {
    this.storageKey = storageKey
    this.excludedProps = excludedProps
  }

  public async write(data: any): Promise<boolean | Error> {
    if (!data || Object.keys(data).length === 0) {
      return new Error('Empty data')
    }
    try {
      this.excludedProps.forEach((prop: keyof any) => {
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

  public async read(): Promise<any> {
    try {
      const result = await AsyncStorage.getItem(this.storageKey)
      return JSON.parse(result || '') as any
    } catch (e) {
      return {}
    }
  }
}

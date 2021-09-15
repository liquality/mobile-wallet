import AsyncStorage from '@react-native-async-storage/async-storage'
import { StorageManagerI } from './types'

export default class StorageManager implements StorageManagerI {
  async persist(key: string, data: any): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, data)
      return true
    } catch (e) {
      return false
    }
  }

  async read(key: string): Promise<any> {
    try {
      return await AsyncStorage.getItem(key)
    } catch (e) {
      return new Error('Unable to read from storage')
    }
  }
}

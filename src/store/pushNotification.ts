import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { Platform } from 'react-native'

const showNotification = async (title: string, body: string) => {
  if (Platform.OS === 'ios') {
    PushNotificationIOS.addNotificationRequest({
      id: Date.now().toString(),
      title: title,
      body: body,
      category: 'notification',
    })
  } else {
    PushNotification.localNotification({
      id: Date.now().toString(),
      title: title,
      body: body,
      category: 'notification',
    })
  }
}

export { showNotification }

import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { Platform } from 'react-native'

const showNotification = (title: string, body: string) => {
  let payload = {
    id: Date.now().toString(),
    title: title,
    body: body,
  }
  if (Platform.OS === 'ios') {
    PushNotificationIOS.addNotificationRequest(payload)
  } else {
    PushNotification.localNotification(payload)
  }
}

export { showNotification }

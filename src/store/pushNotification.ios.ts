import PushNotificationIOS from '@react-native-community/push-notification-ios'

const showNotification = async (title: string, body: string) => {
  PushNotificationIOS.addNotificationRequest({
    id: Date.now().toString(),
    title: title,
    body: body,
    category: 'notification',
  })
}

export { showNotification }

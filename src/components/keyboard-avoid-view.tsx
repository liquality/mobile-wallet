import * as React from 'react'
import {
  KeyboardAvoidingView as KAV,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native'
import { FLEX_1 } from '../theme'

export const KeyboardAvoidingView = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <KAV
      behavior={Platform.OS === 'ios' ? 'position' : 'height'}
      style={FLEX_1}
      contentContainerStyle={FLEX_1}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </KAV>
  )
}

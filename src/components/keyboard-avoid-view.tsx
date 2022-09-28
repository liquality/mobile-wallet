import * as React from 'react'
import {
  KeyboardAvoidingView as KAV,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native'
import { FLEX_1 } from '../theme'
import { scale } from 'react-native-size-matters'

export const KeyboardAvoidingView = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <KAV
      keyboardVerticalOffset={scale(60)}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={FLEX_1}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </KAV>
  )
}

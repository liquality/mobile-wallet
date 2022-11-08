import * as React from 'react'
import {
  KeyboardAvoidingView as KAV,
  KeyboardAvoidingViewProps,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native'
import { FLEX_1 } from '../theme'

export const KeyboardAvoidingView = ({
  children,
  ...rest
}: KeyboardAvoidingViewProps) => {
  return (
    <KAV
      behavior={Platform.OS === 'ios' ? 'position' : 'height'}
      style={FLEX_1}
      contentContainerStyle={FLEX_1}
      {...rest}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </KAV>
  )
}

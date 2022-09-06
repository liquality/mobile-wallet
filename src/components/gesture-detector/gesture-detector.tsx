import * as React from 'react'
import {
  GestureDetector as GestDect,
  Gesture,
} from 'react-native-gesture-handler'

type GestDectProps = {
  children: React.ReactNode
  onSingleTap?: () => void
  doubleOrLongPress: () => void
}

const GestureDetector: React.FC<GestDectProps> = ({
  children,
  onSingleTap,
  doubleOrLongPress,
}) => {
  const longPress = Gesture.LongPress()
    .runOnJS(true)
    .onEnd((_event, success) => {
      if (success) {
        doubleOrLongPress()
      }
    })

  const singleTap = Gesture.Tap()
    .runOnJS(true)
    .onEnd((_event, success) => {
      if (success) {
        if (onSingleTap) {
          onSingleTap()
        }
      }
    })

  const doubleTap = Gesture.Tap()
    .runOnJS(true)
    .numberOfTaps(2)
    .onEnd((_event, success) => {
      if (success) {
        doubleOrLongPress()
      }
    })

  const taps = Gesture.Exclusive(longPress, doubleTap, singleTap)

  return <GestDect gesture={taps}>{children}</GestDect>
}

export default GestureDetector

import * as React from 'react'
import {
  GestureDetector as GestDect,
  Gesture,
} from 'react-native-gesture-handler'

type GestDectProps = {
  children: React.ReactNode
}

const GestureDetector: React.FC<GestDectProps> = ({ children }) => {
  const singleTap = Gesture.Tap().onEnd((_event, success) => {
    if (success) {
    }
  })
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((_event, success) => {
      if (success) {
      }
    })

  const taps = Gesture.Exclusive(doubleTap, singleTap)

  return <GestDect gesture={taps}>{children}</GestDect>
}

export default GestureDetector

import { View } from 'react-native'
import React from 'react'
import { render } from '@testing-library/react-native'
import GestureDetector from '../src/components/gesture-detector/gesture-detector'
import {
  getByGestureTestId,
  fireGestureHandler,
} from 'react-native-gesture-handler/jest-utils'
import { PanGesture } from 'react-native-gesture-handler'

describe('<GestureDetector />', () => {
  it('GestureDetector Rendered and send events', async () => {
    const onSingleTap = jest.fn()
    const onDoubleTapOrLongPress = jest.fn()

    render(
      <GestureDetector
        onSingleTap={onSingleTap}
        doubleOrLongPress={onDoubleTapOrLongPress}>
        <View />
      </GestureDetector>,
    )
    fireGestureHandler<PanGesture>(getByGestureTestId('singleTap'))
    fireGestureHandler<PanGesture>(getByGestureTestId('doubleTap'))
    fireGestureHandler<PanGesture>(getByGestureTestId('longPress'))
    expect(onSingleTap).toBeCalled()
    expect(onDoubleTapOrLongPress).toBeCalledTimes(2)
    expect(onDoubleTapOrLongPress).toBeCalled()
  })
})

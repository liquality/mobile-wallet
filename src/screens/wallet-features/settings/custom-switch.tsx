import React, { FC } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { Box } from '../../../theme'
import { scale } from 'react-native-size-matters'

interface CustomSwitchProps {
  width: number
  height?: number
  firstItemValue: boolean
  secondItemValue: boolean
  firstItemPress: () => void
  secondItemPress: () => void
  firstItemElement: React.ReactElement
  secondItemElement: React.ReactElement
}

export const CustomSwitch: FC<CustomSwitchProps> = (props) => {
  const {
    width,
    height = 32,
    firstItemValue,
    secondItemValue,
    firstItemPress,
    secondItemPress,
    firstItemElement: FirstItemElement,
    secondItemElement: SecondItemElement,
  } = props
  return (
    <Box
      flexDirection={'row'}
      alignItems="center"
      height={scale(height - 2)}
      borderWidth={scale(1)}
      borderRadius={scale(15)}
      borderColor={'activeButton'}
      width={scale(width)}>
      <TouchableWithoutFeedback onPress={firstItemPress}>
        <Box
          justifyContent={'center'}
          alignItems="center"
          height={'100%'}
          borderTopLeftRadius={scale(15)}
          borderBottomLeftRadius={scale(15)}
          backgroundColor={firstItemValue ? 'activeButton' : 'transparent'}
          width={'50%'}>
          {FirstItemElement}
        </Box>
      </TouchableWithoutFeedback>
      <Box height={'100%'} backgroundColor={'activeButton'} />
      <TouchableWithoutFeedback onPress={secondItemPress}>
        <Box
          justifyContent={'center'}
          alignItems="center"
          height={'100%'}
          borderTopRightRadius={scale(50)}
          borderBottomRightRadius={scale(50)}
          backgroundColor={secondItemValue ? 'activeButton' : 'transparent'}
          width={'50%'}>
          {SecondItemElement}
        </Box>
      </TouchableWithoutFeedback>
    </Box>
  )
}

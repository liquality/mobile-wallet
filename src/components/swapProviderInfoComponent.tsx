import { TouchableOpacity } from 'react-native'
import React from 'react'
import { Box, Text } from '../theme'
import { AppIcons } from '../assets'
import { useNavigation, NavigationProp } from '@react-navigation/core'
import { scale } from 'react-native-size-matters'
import { MainStackParamList } from '../types'

const { BuyCryptoCloseLight } = AppIcons

type Props = {
  headerHeight: number
  isScrolledUp: boolean
}

const SwapProviderInfoComponent: React.FC<Props> = ({
  headerHeight,
  isScrolledUp,
}) => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>()

  return (
    <>
      {!isScrolledUp ? (
        <Box
          marginTop={'xl'}
          alignItems="flex-end"
          paddingBottom={'l'}
          paddingHorizontal={'screenPadding'}>
          <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
            <BuyCryptoCloseLight />
          </TouchableOpacity>
        </Box>
      ) : null}
      <Box
        flex={1}
        backgroundColor="mainBackground"
        style={{ paddingTop: isScrolledUp ? scale(10) : headerHeight / 2 }}
        paddingHorizontal={'screenPadding'}>
        <Text
          marginTop={'m'}
          tx="swapTypesInfo.whenTradingAssets"
          variant={'h7'}
        />
      </Box>
    </>
  )
}

export default SwapProviderInfoComponent

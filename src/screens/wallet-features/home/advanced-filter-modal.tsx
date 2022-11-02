import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import { Box, Text } from '../../../theme'
import { useHeaderHeight } from '@react-navigation/elements'
import { ScrollView, TouchableOpacity } from 'react-native'
import { scale } from 'react-native-size-matters'
import { SCREEN_HEIGHT } from '../../../utils'
import { AppIcons } from '../../../assets'
const { BuyCryptoCloseLight } = AppIcons

type Props = NativeStackScreenProps<MainStackParamList, 'AdvancedFilterModal'>
const AdvancedFilterModal = (props: Props) => {
  const { navigation } = props

  const headerHeight = useHeaderHeight()

  const calculatedHeight = SCREEN_HEIGHT + headerHeight

  return (
    <Box flex={1} backgroundColor={'transparent'}>
      <ScrollView
        style={{ height: SCREEN_HEIGHT }}
        contentContainerStyle={{
          paddingBottom: scale(20),
          height: calculatedHeight,
        }}>
        <Box
          flex={1}
          style={{ paddingTop: headerHeight }}
          backgroundColor="semiTransparentGrey">
          <Box marginTop={'xl'} alignItems="flex-end" padding={'screenPadding'}>
            <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
              <BuyCryptoCloseLight />
            </TouchableOpacity>
          </Box>
          <Box
            flex={1}
            backgroundColor="mainBackground"
            paddingHorizontal={'screenPadding'}>
            <Text onPress={navigation.goBack}>Advanced Filter</Text>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  )
}

export default AdvancedFilterModal

import * as React from 'react'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { scale } from 'react-native-size-matters'
import { Box, Text } from '../../../theme'
import { LARGE_TITLE_HEADER_HEIGHT } from '../../../utils'
import { AppIcons } from '../../../assets'
import I18n from 'i18n-js'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import { useHeaderHeight } from '@react-navigation/elements'

const { ChevronUp } = AppIcons

type ActivityFilterModalProps = NativeStackScreenProps<
  MainStackParamList,
  'ActivityFilterModal'
>

const ActivityFilterModal = ({ navigation }: ActivityFilterModalProps) => {
  const headerHeight = useHeaderHeight()

  const ActivtyHeaderComponent = React.useCallback(() => {
    const resultLength = 1
    const resultString = I18n.t(resultLength > 1 ? 'nosResult' : 'oneResult', {
      count: resultLength,
    })
    return (
      <Box flexDirection={'row'} justifyContent="space-between">
        <Box flexDirection={'row'}>
          <Text variant={'h7'} lineHeight={scale(20)} color="black">
            {resultString}
          </Text>
          <Box
            width={1}
            marginHorizontal="m"
            height={scale(15)}
            backgroundColor="inactiveText"
          />
          <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
            <Text
              variant={'h7'}
              lineHeight={scale(20)}
              color="defaultButton"
              marginRight={'s'}
              tx="sort"
            />
          </TouchableOpacity>
          <Box marginTop={'s'}>
            <ChevronUp width={scale(10)} />
          </Box>
        </Box>
        <Text
          variant={'h7'}
          lineHeight={scale(20)}
          color="defaultButton"
          marginRight={'s'}
          tx="advanced"
        />
      </Box>
    )
  }, [navigation.goBack])

  return (
    <Box
      flex={1}
      backgroundColor={'popMenuColor'}
      paddingHorizontal="screenPadding">
      <TouchableWithoutFeedback onPress={navigation.goBack}>
        <Box flex={1}>
          <Box height={headerHeight} />
          <Box height={LARGE_TITLE_HEADER_HEIGHT} />
          <Box flex={1} marginTop="mxxl">
            <ActivtyHeaderComponent />
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </Box>
  )
}

export default ActivityFilterModal

import * as React from 'react'
import {
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import { scale } from 'react-native-size-matters'
import { Box, Text, ThemeIcon, ThemeType } from '../../../theme'
import {
  labelTranslateFn,
  LARGE_TITLE_HEADER_HEIGHT,
  SCREEN_WIDTH,
  SortRadioButtonProp,
  sortRadioButtons,
} from '../../../utils'
import { AppIcons } from '../../../assets'
import I18n from 'i18n-js'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import { useHeaderHeight } from '@react-navigation/elements'
import { useRecoilState } from 'recoil'
import { activityFilterState, sortingOptionState } from '../../../atoms'
import { useTheme } from '@shopify/restyle'
import { useFilteredHistory } from '../../../custom-hooks'

const { ChevronUp, ActivityFilterDarkIcon, ActivityFilterLightIcon } = AppIcons

type IconName = 'InactiveRadioButton' | 'ActiveRadioButton'

type SortingModalProps = NativeStackScreenProps<
  MainStackParamList,
  'SortingModal'
>

const SortingModal = ({ navigation }: SortingModalProps) => {
  const headerHeight = useHeaderHeight()
  const [selectedOpt, setSelectedOpt] = useRecoilState(sortingOptionState)
  const historyItems = useFilteredHistory()
  const [assetFilter, setAssetFilter] = useRecoilState(activityFilterState)

  const theme = useTheme<ThemeType>()

  const handleUpdateFilter = React.useCallback(
    (payload: any) => {
      setAssetFilter({ ...payload })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assetFilter],
  )

  const handletSortPress = React.useCallback(
    (item: SortRadioButtonProp) => {
      setSelectedOpt(item)
      handleUpdateFilter({ sorter: item.key })
      navigation.goBack()
    },
    [handleUpdateFilter, navigation, setSelectedOpt],
  )

  const ActivtyHeaderComponent = React.useCallback(() => {
    const resultLength = historyItems.length
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
      </Box>
    )
  }, [historyItems.length, navigation.goBack])

  const renderSortingOptions = ({ item }: { item: SortRadioButtonProp }) => {
    const sureIcon: IconName =
      selectedOpt.key === item.key ? 'ActiveRadioButton' : 'InactiveRadioButton'
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handletSortPress(item)}>
        <Box flexDirection={'row'} marginTop={'m'}>
          <ThemeIcon iconName={sureIcon} width={scale(22)} height={scale(22)} />
          <Text variant={'radioText'} color="darkGrey" marginLeft={'m'}>
            {labelTranslateFn(item.value)}
          </Text>
        </Box>
      </TouchableOpacity>
    )
  }

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
            <Box
              width={SCREEN_WIDTH * 0.75}
              height={SCREEN_WIDTH * 0.85}
              marginTop="m">
              <Box flex={1} paddingHorizontal="mxxl">
                <FlatList
                  data={sortRadioButtons}
                  renderItem={renderSortingOptions}
                  style={{ marginTop: theme.spacing.xl }}
                  keyExtractor={(item) => item.key}
                  scrollEnabled={false}
                  extraData={selectedOpt}
                />
              </Box>
              <Box
                position={'absolute'}
                zIndex={-2}
                top={scale(10)}
                left={scale(9)}>
                <ActivityFilterDarkIcon
                  height={SCREEN_WIDTH * 0.83}
                  width={SCREEN_WIDTH * 0.7}
                />
              </Box>
              <Box position={'absolute'} zIndex={-1}>
                <ActivityFilterLightIcon
                  height={SCREEN_WIDTH * 0.84}
                  width={SCREEN_WIDTH * 0.75}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </Box>
  )
}

export default SortingModal

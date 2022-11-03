import * as React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { scale } from 'react-native-size-matters'
import { Box, Text } from '../../../theme'
import { AppIcons } from '../../../assets'
import I18n from 'i18n-js'
import { MainStackParamList } from '../../../types'
import { NavigationProp, useNavigation } from '@react-navigation/core'
import { Network } from '@liquality/wallet-core/dist/src/store/types'
import { useFilteredHistory } from '../../../custom-hooks'
import { useRecoilState } from 'recoil'
import { activityFilterState } from '../../../atoms'

const { ChevronDown, ResetIcon } = AppIcons

type ActivityHeaderComponent = {
  chainCode: string
  network: Network
}

const ActivtyHeaderComponent = ({
  chainCode,
  network,
}: ActivityHeaderComponent) => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>()
  const historyItems = useFilteredHistory()
  const [assetFilter, setAssetFilter] = useRecoilState(activityFilterState)

  const resultLength = historyItems.length
  const resultString = I18n.t(resultLength > 1 ? 'nosResult' : 'oneResult', {
    count: resultLength,
  })

  const handleUpdateFilter = React.useCallback(
    (payload: any) => {
      setAssetFilter({ ...payload })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assetFilter],
  )

  const handleResetPress = React.useCallback(() => {
    handleUpdateFilter({ sorter: 'by_date' })
  }, [handleUpdateFilter])

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
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('SortingModal', {})}>
          <Text
            variant={'h7'}
            lineHeight={scale(20)}
            color="defaultButton"
            marginRight={'s'}
            tx="sort"
          />
        </TouchableOpacity>
        <Box marginTop={'s'}>
          <ChevronDown width={scale(10)} />
        </Box>
      </Box>
      <Box flexDirection={'row'}>
        <Text
          onPress={() =>
            navigation.navigate('AdvancedFilterModal', {
              code: chainCode,
              network,
            })
          }
          variant={'h7'}
          lineHeight={scale(20)}
          color="defaultButton"
          marginRight={'s'}
          tx="advanced"
        />
        <Box
          width={1}
          marginHorizontal="m"
          height={scale(15)}
          backgroundColor="inactiveText"
        />
        <Text variant={'h7'} color={'darkGrey'} lineHeight={scale(20)}>
          3
        </Text>
        <Box marginLeft={'s'} style={styles.iconAdjustment}>
          <TouchableOpacity activeOpacity={0.7} onPress={handleResetPress}>
            <ResetIcon width={scale(20)} />
          </TouchableOpacity>
        </Box>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  iconAdjustment: {
    marginTop: -scale(2),
  },
})

export default ActivtyHeaderComponent

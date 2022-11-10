import * as React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  ActionEnum,
  ActivityStatusEnum,
  MainStackParamList,
} from '../../../types'
import { Box, Text, Pressable } from '../../../theme'
import { useHeaderHeight } from '@react-navigation/elements'
import { FlatList, TouchableOpacity } from 'react-native'
import { scale } from 'react-native-size-matters'
import { AppIcons } from '../../../assets'
import { getAsset } from '@liquality/cryptoassets'
import AssetIcon from '../../../components/asset-icon'
import {
  activityFilterState,
  statusFilterBtnState,
  transFilterBtnState,
} from '../../../atoms'
import { useRecoilState } from 'recoil'
import {
  ButtonProps,
  downloadAssetAcitivity,
  labelTranslateFn,
  SCREEN_HEIGHT,
} from '../../../utils'
import I18n from 'i18n-js'
import DatePicker from '../../../components/activity-filter/date-picker'
import { useFilteredHistory } from '../../../custom-hooks'

const { BuyCryptoCloseLight, ExportIcon } = AppIcons

type FilterButtonProps = {
  item: ButtonProps
  onPress: () => void
}

const FilterButton = (props: FilterButtonProps) => {
  const { item, onPress } = props
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Box
        height={scale(40)}
        paddingHorizontal="l"
        alignSelf={'flex-start'}
        alignItems="center"
        justifyContent={'center'}
        flexDirection="row"
        backgroundColor={
          item.status ? 'selectedBackgroundColor' : 'transparent'
        }
        marginRight={'m'}
        borderRadius={scale(20)}
        borderWidth={1}
        borderColor="activeButton">
        <Text
          variant={'transLink'}
          color="activeButton"
          paddingRight={'m'}
          marginTop="s"
          fontWeight={'400'}
          tx={item.value}
        />
        <item.icon />
      </Box>
    </TouchableOpacity>
  )
}

type Props = NativeStackScreenProps<MainStackParamList, 'AdvancedFilterModal'>
const AdvancedFilterModal = (props: Props) => {
  const { navigation, route } = props
  const { code, network, specificAsset } = route.params
  const historyItems = useFilteredHistory()

  const [transFilterBtn, setTransFilterBtn] =
    useRecoilState(transFilterBtnState)
  const [statusFilterBtn, setStatusFilterBtn] =
    useRecoilState(statusFilterBtnState)
  const [assetFilter, setAssetFilter] = useRecoilState(activityFilterState)
  const assetInfo = specificAsset
    ? getAsset(network!, specificAsset!)
    : getAsset(network!, code!)
  const headerHeight = useHeaderHeight()
  const [startDatePickerVisible, setStartDatePickerVisible] =
    React.useState(false)
  const [endDatePickerVisible, setEndDatePickerVisible] = React.useState(false)
  const handleOpenStartDate = React.useCallback(() => {
    setStartDatePickerVisible(true)
  }, [])
  const handleCloseStartDate = React.useCallback(() => {
    setStartDatePickerVisible(false)
  }, [])
  const handleOpenPickEndDate = React.useCallback(() => {
    setEndDatePickerVisible(true)
  }, [])
  const handleCloseEndDate = React.useCallback(() => {
    setEndDatePickerVisible(false)
  }, [])

  let countOfTransFilterBtn = 0

  for (let btn of transFilterBtn) {
    if (btn.status) {
      countOfTransFilterBtn += 1
    }
  }
  let countOfStatusFilterBtn = 0

  for (let btn of statusFilterBtn) {
    if (btn.status) {
      countOfStatusFilterBtn += 1
    }
  }

  const handleUpdateFilter = React.useCallback(
    (payload: any) => {
      setAssetFilter((currVal) => ({ ...currVal, ...payload }))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assetFilter],
  )

  const handleChangeDateRange = React.useCallback(
    (start: string, end: string) => {
      handleUpdateFilter({
        dateRange: {
          start,
          end,
        },
      })
    },
    [handleUpdateFilter],
  )

  const handleChangeStartDate = React.useCallback(
    (date) => {
      handleChangeDateRange(date, assetFilter?.dateRange?.end || '')
      setStartDatePickerVisible(false)
    },
    [assetFilter?.dateRange?.end, handleChangeDateRange],
  )

  const handleChangeEndDate = React.useCallback(
    (date) => {
      handleChangeDateRange(assetFilter?.dateRange?.start || '', date)
      setEndDatePickerVisible(false)
    },
    [assetFilter?.dateRange?.start, handleChangeDateRange],
  )

  const handleResetPress = React.useCallback(() => {
    setTransFilterBtn(
      transFilterBtn.map((item) => ({ ...item, status: false })),
    )
    setStatusFilterBtn(
      statusFilterBtn.map((item) => ({ ...item, status: false })),
    )
    if (specificAsset) {
      setAssetFilter({ codeSort: specificAsset })
    } else {
      setAssetFilter({ sorter: 'by_date' })
    }
    navigation.goBack()
  }, [
    navigation,
    setAssetFilter,
    setStatusFilterBtn,
    setTransFilterBtn,
    specificAsset,
    statusFilterBtn,
    transFilterBtn,
  ])

  const handleChangeActionTypes = React.useCallback(
    (value: ActionEnum[]) => {
      handleUpdateFilter({ actionTypes: value })
    },
    [handleUpdateFilter],
  )

  const handleChangeActivityStatuses = React.useCallback(
    (value: ActivityStatusEnum[]) => {
      handleUpdateFilter({ activityStatuses: value })
    },
    [handleUpdateFilter],
  )

  const onExportIconPress = async () => {
    try {
      await downloadAssetAcitivity(historyItems)
    } catch (error) {}
  }

  const onTransactionFilterButtonPress = (item: ButtonProps, index: number) => {
    let tempAction: ActionEnum[] = []
    const tempTransFilterBtnState = transFilterBtn.map(
      (transBtn, innerIndex) => {
        if (index === innerIndex) {
          return { ...transBtn, status: !item.status }
        }
        return transBtn
      },
    )
    for (let transBtn of tempTransFilterBtnState) {
      if (transBtn.status) {
        tempAction.push(transBtn.key as ActionEnum)
      }
    }
    handleChangeActionTypes(tempAction)
    setTransFilterBtn(tempTransFilterBtnState)
  }

  const onStatusFilterButtonPress = (item: ButtonProps, index: number) => {
    let tempActivityStatus: ActivityStatusEnum[] = []

    const tempStatusFilterBtnState = statusFilterBtn.map(
      (transBtn, innerIndex) => {
        if (index === innerIndex) {
          return { ...transBtn, status: !item.status }
        }
        return transBtn
      },
    )
    for (let transBtn of tempStatusFilterBtnState) {
      if (transBtn.status) {
        tempActivityStatus.push(transBtn.key as ActivityStatusEnum)
        if (transBtn.key === ActivityStatusEnum.PENDING) {
          tempActivityStatus.push(ActivityStatusEnum.WAITING_FOR_CONFIRMATIONS)
        }
      }
    }
    handleChangeActivityStatuses(tempActivityStatus)
    setStatusFilterBtn(tempStatusFilterBtnState)
  }

  const renderTransactionFilterItem = ({
    item,
    index,
  }: {
    item: ButtonProps
    index: number
  }) => {
    return (
      <FilterButton
        item={item}
        onPress={() => onTransactionFilterButtonPress(item, index)}
      />
    )
  }

  const renderStatusFilterItem = ({
    item,
    index,
  }: {
    item: ButtonProps
    index: number
  }) => {
    return (
      <FilterButton
        item={item}
        onPress={() => onStatusFilterButtonPress(item, index)}
      />
    )
  }

  const resultCount = historyItems.length

  const addExtraheight = SCREEN_HEIGHT > 700 ? 40 : 0

  return (
    <Box
      flex={1}
      style={{ paddingTop: headerHeight + scale(addExtraheight) }}
      backgroundColor="semiTransparentGrey">
      <Box alignItems="flex-end" padding={'drawerPadding'}>
        <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
          <BuyCryptoCloseLight />
        </TouchableOpacity>
      </Box>
      <Box
        flex={1}
        backgroundColor="mainBackground"
        paddingTop="mxxl"
        paddingHorizontal={'drawerPadding'}>
        <Box flex={0.75}>
          {assetInfo ? (
            <Box flexDirection={'row'} alignItems="center">
              <AssetIcon asset={specificAsset || code} size={scale(30)} />
              <Text paddingLeft={'m'} variant="chainLabel" color={'greyMeta'}>
                {specificAsset || code}
              </Text>
            </Box>
          ) : (
            <Text variant="chainLabel" color={'greyMeta'}>
              {specificAsset || code}
            </Text>
          )}
          <Box
            flexDirection={'row'}
            justifyContent="space-between"
            alignItems={'center'}
            paddingTop={'s'}>
            <Text
              variant={'onScreenHeader'}
              color="darkGrey"
              tx="advancedFilter"
            />
            <TouchableOpacity activeOpacity={0.7} onPress={onExportIconPress}>
              <ExportIcon />
            </TouchableOpacity>
          </Box>
          <Box marginTop={'m'}>
            <Text
              tx="common.dateRange"
              variant={'transLink'}
              color={'black2'}
            />
            <Box flexDirection={'row'} justifyContent="space-between">
              <Box
                flex={0.48}
                borderBottomWidth={1}
                borderBottomColor="mediumGrey"
                paddingTop="m"
                paddingBottom="s">
                <TouchableOpacity
                  onPress={handleOpenStartDate}
                  activeOpacity={0.7}>
                  <Text variant={'normalText'} color={'black2'}>
                    {assetFilter?.dateRange?.start
                      ? assetFilter?.dateRange?.start
                      : labelTranslateFn('common.start')}
                  </Text>
                </TouchableOpacity>
              </Box>
              <Box
                flex={0.48}
                borderBottomWidth={1}
                borderBottomColor="mediumGrey"
                paddingTop="m"
                paddingBottom="s">
                <TouchableOpacity
                  onPress={handleOpenPickEndDate}
                  activeOpacity={0.7}>
                  <Text variant={'normalText'} color={'black2'}>
                    {assetFilter?.dateRange?.end
                      ? assetFilter?.dateRange?.end
                      : labelTranslateFn('common.end')}
                  </Text>
                </TouchableOpacity>
              </Box>
            </Box>
          </Box>
          <Box marginTop={'xl'} flexDirection="row">
            <Text tx="transaction" variant={'transLink'} color={'black2'} />
            <Box
              alignSelf={'flex-start'}
              width={1}
              marginHorizontal="m"
              height={scale(20)}
              backgroundColor="inactiveText"
            />
            <Text variant={'transLink'} color={'black2'}>
              {countOfTransFilterBtn}
            </Text>
          </Box>
          <Box marginTop={'s'}>
            <FlatList
              data={transFilterBtn}
              renderItem={renderTransactionFilterItem}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(item) => `${item.key}`}
            />
          </Box>
          <Box marginTop={'xl'} flexDirection="row">
            <Text tx="common.status" variant={'transLink'} color={'black2'} />
            <Box
              alignSelf={'flex-start'}
              width={1}
              marginHorizontal="m"
              height={scale(20)}
              backgroundColor="inactiveText"
            />
            <Text variant={'transLink'} color={'black2'}>
              {countOfStatusFilterBtn}
            </Text>
          </Box>
          <Box marginTop={'s'}>
            <FlatList
              data={statusFilterBtn}
              renderItem={renderStatusFilterItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `${item.key}`}
            />
          </Box>
        </Box>
        <Box flex={0.25}>
          <Box marginTop={'s'}>
            <Pressable
              label={I18n.t(
                resultCount > 1 ? 'showOneResult' : 'showMultipleResult',
                { count: resultCount },
              )}
              onPress={navigation.goBack}
              variant="solid"
            />
          </Box>
          <Text
            onPress={handleResetPress}
            textAlign={'center'}
            variant="transLink"
            marginTop={'xl'}
            color="greyMeta"
            tx="common.reset"
          />
        </Box>
      </Box>
      <DatePicker
        title={labelTranslateFn('common.startDate')!}
        open={startDatePickerVisible}
        onClose={handleCloseStartDate}
        date={assetFilter?.dateRange?.start || ''}
        onChange={handleChangeStartDate}
      />
      <DatePicker
        title={labelTranslateFn('common.endDate')!}
        open={endDatePickerVisible}
        onClose={handleCloseEndDate}
        date={assetFilter?.dateRange?.end || ''}
        onChange={handleChangeEndDate}
      />
    </Box>
  )
}

export default AdvancedFilterModal

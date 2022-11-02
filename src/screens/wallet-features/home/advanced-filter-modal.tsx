import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import { Box, Text, Pressable } from '../../../theme'
import { useHeaderHeight } from '@react-navigation/elements'
import { FlatList, TouchableOpacity } from 'react-native'
import { scale } from 'react-native-size-matters'
import { AppIcons } from '../../../assets'
import { getAsset } from '@liquality/cryptoassets'
import AssetIcon from '../../../components/asset-icon'
import { statusFilterBtnState, transFilterBtnState } from '../../../atoms'
import { useRecoilState } from 'recoil'
import { ButtonProps } from '../../../utils'

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
        <Text paddingRight={'m'} tx={item.value} />
        <item.icon />
      </Box>
    </TouchableOpacity>
  )
}

type Props = NativeStackScreenProps<MainStackParamList, 'AdvancedFilterModal'>
const AdvancedFilterModal = (props: Props) => {
  const { navigation, route } = props
  const { code, network } = route.params
  const [transFilterBtn, setTransFilterBtn] =
    useRecoilState(transFilterBtnState)

  const [statusFilterBtn, setStatusFilterBtn] =
    useRecoilState(statusFilterBtnState)

  const assetInfo = getAsset(network!, code!)

  const headerHeight = useHeaderHeight()

  const onTransactionFilterButtonPress = (item: ButtonProps, index: number) => {
    const tempTransFilterBtnState = transFilterBtn.map(
      (transBtn, innerIndex) => {
        if (index === innerIndex) {
          return { ...transBtn, status: !item.status }
        }
        return transBtn
      },
    )
    setTransFilterBtn(tempTransFilterBtnState)
  }

  const onStatusFilterButtonPress = (item: ButtonProps, index: number) => {
    const tempStatusFilterBtnState = statusFilterBtn.map(
      (transBtn, innerIndex) => {
        if (index === innerIndex) {
          return { ...transBtn, status: !item.status }
        }
        return transBtn
      },
    )
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

  return (
    <Box flex={1} backgroundColor={'transparent'}>
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
          paddingTop="mxxl"
          paddingHorizontal={'screenPadding'}>
          {assetInfo ? (
            <Box flexDirection={'row'} alignItems="center">
              <AssetIcon asset={code} size={scale(30)} />
              <Text paddingLeft={'m'}>{code}</Text>
            </Box>
          ) : (
            <Text onPress={navigation.goBack}>{code}</Text>
          )}
          <Box
            flexDirection={'row'}
            justifyContent="space-between"
            paddingTop={'s'}>
            <Text>Advanced Filter</Text>
            <ExportIcon />
          </Box>
          <Box marginTop={'xl'}>
            <Text>DATE RANGE</Text>
            <Box flexDirection={'row'} justifyContent="space-between">
              <Box
                flex={0.48}
                borderBottomWidth={1}
                paddingTop="xl"
                paddingBottom="m">
                <Text>Start</Text>
              </Box>
              <Box
                flex={0.48}
                borderBottomWidth={1}
                paddingTop="xl"
                paddingBottom="m">
                <Text>End</Text>
              </Box>
            </Box>
          </Box>
          <Box marginTop={'xl'} flexDirection="row">
            <Text>Transaction</Text>
            <Box
              alignSelf={'flex-start'}
              width={1}
              marginHorizontal="m"
              height={scale(15)}
              backgroundColor="inactiveText"
            />
            <Text>0</Text>
          </Box>
          <Box marginTop={'l'}>
            <FlatList
              data={transFilterBtn}
              renderItem={renderTransactionFilterItem}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(item) => `${item.key}`}
            />
          </Box>
          <Box marginTop={'xl'} flexDirection="row">
            <Text>Status</Text>
            <Box
              alignSelf={'flex-start'}
              width={1}
              marginHorizontal="m"
              height={scale(15)}
              backgroundColor="inactiveText"
            />
            <Text>0</Text>
          </Box>
          <Box marginTop={'l'}>
            <FlatList
              data={statusFilterBtn}
              renderItem={renderStatusFilterItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `${item.key}`}
            />
          </Box>
          <Box marginTop={'xxl'}>
            <Pressable
              label="Show results"
              onPress={() => {}}
              variant="solid"
            />
          </Box>
          <Text
            onPress={navigation.goBack}
            textAlign={'center'}
            variant="link"
            marginTop={'xl'}
            tx="termsScreen.cancel"
          />
        </Box>
      </Box>
    </Box>
  )
}

export default AdvancedFilterModal

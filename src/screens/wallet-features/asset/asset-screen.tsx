import React, { useCallback, useEffect } from 'react'
import {
  Pressable,
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
} from 'react-native'
import {
  prettyBalance,
  prettyFiatBalance,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import ActivityFlatList from '../../../components/activity-flat-list'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AccountType, MainStackParamList } from '../../../types'
import { BigNumber } from '@liquality/types'
import {
  Text,
  Box,
  Card,
  faceliftPalette,
  TouchableOpacity,
} from '../../../theme'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  activityFilterState,
  addressStateFamily,
  assetScreenPopupMenuVisible,
  balanceStateFamily,
  fiatRatesState,
  networkState,
  statusFilterBtnState,
  swapPairState,
  totalFiatBalanceState,
  transFilterBtnState,
} from '../../../atoms'
import { getAsset } from '@liquality/cryptoassets'
import I18n from 'i18n-js'
import {
  ASSET_SCREEN_HEIGHT,
  downloadAssetAcitivity,
  labelTranslateFn,
  SCREEN_WIDTH,
} from '../../../utils'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
import { AppIcons, Images } from '../../../assets'
const { Refresh } = AppIcons
import { scale } from 'react-native-size-matters'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { populateWallet } from '../../../store/store'
import { useFilteredHistory } from '../../../custom-hooks'
import CombinedChainAssetIcons from '../../../components/ui/CombinedChainAssetIcons'
const {
  Filter,
  ExportIcon,
  ManageAssetsDarkIcon,
  AccountDetailsIcon,
  SendHex,
  SwapHex,
  ReceiveHex,
  BuyHex,
} = AppIcons

type AssetScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'AssetScreen'
>

const AssetScreen = ({ route, navigation }: AssetScreenProps) => {
  const { id, code }: AccountType = route.params.assetData!
  const swapPair = useRecoilValue(swapPairState)
  const address = useRecoilValue(addressStateFamily(id))
  const balance = useRecoilValue(
    balanceStateFamily({ asset: code, assetId: id }),
  )
  const activeNetwork = useRecoilValue(networkState)
  const [isAssetScreenPopupMenuVisible, setAssetScreenPopuMenuVisible] =
    useRecoilState(assetScreenPopupMenuVisible)
  const totalFiatBalance = useRecoilValue(totalFiatBalanceState)
  const fiatRates = useRecoilValue(fiatRatesState)
  const historyItems = useFilteredHistory()
  const setAssetFilter = useSetRecoilState(activityFilterState)
  const [transFilterBtn, setTransFilterBtn] =
    useRecoilState(transFilterBtnState)
  const [statusFilterBtn, setStatusFilterBtn] =
    useRecoilState(statusFilterBtnState)

  React.useEffect(() => {
    setAssetFilter({ sorter: 'by_date', codeSort: code })
  }, [code, setAssetFilter])

  const resetFilterToByDate = React.useCallback(
    () => {
      setAssetFilter({ sorter: 'by_date' })
      setTransFilterBtn(
        transFilterBtn.map((item) => ({ ...item, status: false })),
      )
      setStatusFilterBtn(
        statusFilterBtn.map((item) => ({ ...item, status: false })),
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  React.useEffect(() => {
    return () => {
      // Cleanup and reset filter to old state
      resetFilterToByDate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onExportIconPress = async () => {
    try {
      await downloadAssetAcitivity(historyItems)
    } catch (error) {}
  }

  const handleSendPress = useCallback(() => {
    navigation.navigate('SendScreen', {
      assetData: route.params.assetData,
      screenTitle: I18n.t('assetScreen.sendCode', { code }),
    })
  }, [code, navigation, route.params.assetData])

  const handleReceivePress = useCallback(() => {
    navigation.navigate('ReceiveScreen', {
      assetData: route.params.assetData,
      includeBackBtn: true,
      screenTitle: I18n.t('assetScreen.receiveCode', { code }),
    })
  }, [code, navigation, route.params.assetData])

  const handleSwapPress = useCallback(() => {
    navigation.navigate('SwapScreen', {
      swapAssetPair: swapPair,
      screenTitle: labelTranslateFn('assetScreen.swap')!,
    })
  }, [navigation, swapPair])

  const handleBuyPress = () => {
    const showIntro = Number(totalFiatBalance) <= 0
    navigation.navigate('BuyCryptoDrawer', {
      isScrolledUp: false,
      token: '',
      showIntro,
      screenTitle: labelTranslateFn(
        showIntro ? 'gettingStartedTitle' : 'buyCrypto',
      )!,
    })
  }

  const handleManageAssetsBtnPress = () => {
    setAssetScreenPopuMenuVisible(false)
    navigation.navigate('AssetManagementScreen', {
      screenTitle: 'Manage Assets',
      includeBackBtn: true,
    })
  }

  const appFeatures = [
    {
      Icon: SendHex,
      name: labelTranslateFn('summaryBlockComp.send'),
      navigateTo: handleSendPress,
    },
    {
      Icon: SwapHex,
      name: labelTranslateFn('summaryBlockComp.swap'),
      navigateTo: handleSwapPress,
    },
    {
      Icon: ReceiveHex,
      name: labelTranslateFn('summaryBlockComp.receive'),
      navigateTo: handleReceivePress,
    },
    {
      Icon: BuyHex,
      name: labelTranslateFn('summaryBlockComp.buy'),
      navigateTo: handleBuyPress,
    },
  ]

  const handleAccountDetailsPress = () => {
    setAssetScreenPopuMenuVisible(false)
    navigation.navigate('AccountDetailScreen', {
      assetData: route.params.assetData,
    })
  }

  useEffect(() => {
    setAssetScreenPopuMenuVisible(false)
  }, [setAssetScreenPopuMenuVisible])

  const refreshAssetData = async () => {
    if (route.params.assetData?.id)
      await populateWallet([route.params.assetData.id])
  }

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <React.Suspense
        fallback={
          <View>
            <Text tx="assetScreen.loadingAsset" />
          </View>
        }>
        {isAssetScreenPopupMenuVisible && (
          <Box
            flex={1}
            backgroundColor={'popMenuColor'}
            paddingHorizontal={'xl'}
            position="absolute"
            height={'100%'}
            width={'100%'}
            zIndex={3000}
            top={scale(5)}
            right={0}
            onTouchStart={() => setAssetScreenPopuMenuVisible(false)}>
            <Box flex={1} alignItems={'flex-end'}>
              <Box height={scale(120)} width={scale(230)}>
                <ImageBackground
                  style={styles.lowerBgImg}
                  resizeMode="contain"
                  source={Images.popUpDark}>
                  <ImageBackground
                    style={styles.upperBgImg}
                    resizeMode="contain"
                    source={Images.popUpWhite}>
                    <Box
                      flex={1}
                      justifyContent="center"
                      padding={'onboardingPadding'}
                      onTouchStart={(evt) => {
                        evt.stopPropagation()
                      }}>
                      <TouchableWithoutFeedback
                        onPress={handleManageAssetsBtnPress}>
                        <Box
                          flexDirection="row"
                          justifyContent="center"
                          alignItems="center"
                          height={scale(20)}
                          marginBottom={'xl'}>
                          <ManageAssetsDarkIcon />
                          <Text
                            variant={'normalText'}
                            color="textColor"
                            tx="manageAssets"
                            marginLeft={'l'}
                          />
                        </Box>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback
                        onPress={handleAccountDetailsPress}>
                        <Box
                          flexDirection="row"
                          justifyContent="center"
                          alignItems="center"
                          height={scale(20)}>
                          <AccountDetailsIcon />
                          <Text
                            variant={'normalText'}
                            color="textColor"
                            tx="accountDetails"
                            marginLeft={'l'}
                          />
                        </Box>
                      </TouchableWithoutFeedback>
                    </Box>
                  </ImageBackground>
                </ImageBackground>
              </Box>
            </Box>
          </Box>
        )}
        <Box flex={1}>
          <Card
            variant={'headerCard'}
            paddingHorizontal="xl"
            height={ASSET_SCREEN_HEIGHT}>
            <Box justifyContent="center" flex={0.6} paddingTop="l">
              <Box flexDirection={'row'} alignItems={'center'}>
                <CombinedChainAssetIcons
                  chain={getAsset(activeNetwork, code).chain}
                  code={code}
                />
                <Text variant={'addressLabel'} color={'greyMeta'}>
                  {shortenAddress(address)}{' '}
                </Text>
              </Box>
              <Text color={'darkGrey'} variant="totalAsset" marginTop={'l'}>
                {`${prettyBalance(
                  new BigNumber(balance),
                  code,
                ).toString()} ${code}`}
              </Text>
              <Box
                flexDirection="row"
                justifyContent={'space-between'}
                alignItems={'center'}>
                <Text variant="totalAsset" color={'nestedColor'}>
                  {`$${prettyFiatBalance(
                    prettyBalance(new BigNumber(balance), code),
                    fiatRates[code],
                  ).toString()}`}
                </Text>
                <Pressable onPress={refreshAssetData} style={styles.refreshBtn}>
                  <Refresh />
                </Pressable>
              </Box>
            </Box>
            <Box flex={0.4} marginTop="l">
              <Box flexDirection={'row'} justifyContent="space-evenly">
                {appFeatures.map((item, index) => (
                  <Box
                    key={index}
                    alignItems={'center'}
                    width={SCREEN_WIDTH / 4.1}>
                    <TouchableWithoutFeedback onPress={item.navigateTo}>
                      <item.Icon />
                    </TouchableWithoutFeedback>
                    <Text
                      marginTop={'m'}
                      variant="addressLabel"
                      color={'darkGrey'}>
                      {item.name}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </Card>
          <Box
            marginHorizontal={'xl'}
            marginBottom={'xl'}
            justifyContent="space-between"
            flexDirection="row">
            <Box>
              <Text
                marginTop={'mxxl'}
                variant={'tabLabel'}
                color={'tablabelActiveColor'}
                tx={'activity'}
              />
              <Box
                height={scale(2)}
                width={scale(20)}
                marginTop="m"
                backgroundColor={'activeLink'}
              />
            </Box>
            {historyItems.length ? (
              <Box
                flexDirection={'row'}
                marginTop={'mxxl'}
                height={scale(40)}
                width={'20%'}
                justifyContent="space-between">
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ActivityFilterScreen', { code })
                  }>
                  <Filter />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onExportIconPress()}>
                  <ExportIcon height={scale(25)} />
                </TouchableOpacity>
              </Box>
            ) : null}
          </Box>
          {/* For some reason ActivityFlatList started throwing undefined errors upon SEND navigation and flow.
        Should be fixed, can be commented out to bypass that error for now */}
          <ScrollView
            contentContainerStyle={{
              paddingBottom: scale(20),
              paddingHorizontal: scale(20),
            }}>
            <ActivityFlatList selectedAsset={code} />
          </ScrollView>
        </Box>
      </React.Suspense>
    </Box>
  )
}

const styles = StyleSheet.create({
  refreshBtn: {
    width: 37,
    height: 37,
    backgroundColor: faceliftPalette.mediumWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lowerBgImg: {
    height: '100%',
  },
  upperBgImg: {
    height: '100%',
    width: '100%',
    marginTop: scale(-5),
    marginLeft: scale(-5),
  },
})
export default AssetScreen

import React, { useCallback, useEffect } from 'react'
import {
  Pressable,
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
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
  IMAGE_BACKGROUND_STYLE,
} from '../../../theme'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  activityFilterState,
  addressStateFamily,
  assetScreenPopupMenuVisible,
  balanceStateFamily,
  fiatRatesState,
  networkState,
  swapPairState,
  totalFiatBalanceState,
} from '../../../atoms'
import { getAsset } from '@liquality/cryptoassets'
import I18n from 'i18n-js'
import { downloadAssetAcitivity, labelTranslateFn } from '../../../utils'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
import { AppIcons, Images } from '../../../assets'
import AssetIcon from '../../../components/asset-icon'
const { Refresh } = AppIcons
const adjustLineHeight = -scale(30)
import { scale } from 'react-native-size-matters'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { populateWallet } from '../../../store/store'
import { useFilteredHistory } from '../../../custom-hooks'
const {
  Exchange: DoubleArrowThick,
  DownIcon,
  UpIcon,
  Filter,
  ExportIcon,
  DollarSign,
  ManageAssetsDarkIcon,
  AccountDetailsIcon,
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

  React.useEffect(() => {
    setAssetFilter({ codeSort: code })
  }, [code, setAssetFilter])

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
        showIntro ? 'gettingStartedWithCrypto' : 'buyCrypto',
      )!,
    })
  }

  const handleManageAssetsBtnPress = () => {
    navigation.goBack()
    navigation.navigate('AssetManagementScreen', {
      screenTitle: 'Manage Assets',
      includeBackBtn: true,
    })
  }

  const appFeatures = [
    {
      Icon: UpIcon,
      name: labelTranslateFn('summaryBlockComp.send'),
      navigateTo: handleSendPress,
    },
    {
      Icon: DoubleArrowThick,
      name: labelTranslateFn('summaryBlockComp.swap'),
      navigateTo: handleSwapPress,
    },
    {
      Icon: DownIcon,
      name: labelTranslateFn('summaryBlockComp.receive'),
      navigateTo: handleReceivePress,
    },
    {
      Icon: DollarSign,
      name: labelTranslateFn('summaryBlockComp.buy'),
      navigateTo: handleBuyPress,
    },
  ]

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
            style={{ top: scale(5), right: 0 }}
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
                      <TouchableWithoutFeedback onPress={handleSwapPress}>
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
            paddingBottom={'mxxl'}>
            <Box marginTop="mxxl" justifyContent="space-between">
              <Box
                marginBottom={'l'}
                flexDirection={'row'}
                alignItems={'center'}>
                <AssetIcon
                  size={scale(25)}
                  chain={getAsset(activeNetwork, code).chain}
                />
                <AssetIcon
                  size={scale(25)}
                  styles={{ right: scale(10) }}
                  asset={code}
                />
                <Text variant={'addressLabel'} color={'greyMeta'}>
                  {shortenAddress(address)}{' '}
                </Text>
              </Box>
              <Text color={'darkGrey'} variant="totalBalance">
                {`${prettyBalance(
                  new BigNumber(balance),
                  code,
                ).toString()} ${code}`}
              </Text>
              <Box
                flexDirection="row"
                justifyContent={'space-between'}
                alignItems={'center'}
                paddingBottom={'m'}>
                <Text
                  style={{ marginTop: adjustLineHeight }}
                  variant="totalAsset"
                  color={'nestedColor'}>
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
            <Box flexDirection={'row'} justifyContent="space-evenly">
              {appFeatures.map((item, index) => (
                <Box key={index} alignItems={'center'}>
                  <TouchableWithoutFeedback onPress={item.navigateTo}>
                    <ImageBackground
                      style={IMAGE_BACKGROUND_STYLE}
                      resizeMode="cover"
                      source={Images.hexoNav}>
                      <Box
                        flex={1}
                        justifyContent="center"
                        alignItems={'center'}>
                        <item.Icon height={scale(14)} />
                      </Box>
                    </ImageBackground>
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
          </Card>

          <Box
            marginHorizontal={'xl'}
            marginBottom={'xl'}
            justifyContent="space-between"
            alignItems={'center'}
            flexDirection="row">
            <Box>
              <Text
                marginTop={'mxxl'}
                variant={'tabLabel'}
                color={'tablabelActiveColor'}
                tx={'assetScreen.activity'}
              />
              <Box
                borderBottomWidth={2}
                borderBottomColor={'activeLink'}
                width={scale(15)}
              />
            </Box>
            <Box
              flexDirection={'row'}
              marginTop={'mxxl'}
              width={scale(50)}
              justifyContent="space-between"
              alignItems="center">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('ActivityFilterScreen', { code })
                }>
                <Filter />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onExportIconPress()}>
                <ExportIcon />
              </TouchableOpacity>
            </Box>
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
    marginBottom: 10,
    position: 'relative',
    bottom: 20,
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

import React, { useCallback, useEffect } from 'react'
import {
  Pressable,
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
} from 'react-native'
import { prettyBalance } from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import ActivityFlatList from '../../../components/activity-flat-list'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AccountType, MainStackParamList } from '../../../types'
import { BigNumber } from '@liquality/types'
import { Text, Box, palette, Card, faceliftPalette } from '../../../theme'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  addressStateFamily,
  assetScreenPopupMenuVisible,
  balanceStateFamily,
  networkState,
  swapPairState,
} from '../../../atoms'
import { getAsset } from '@liquality/cryptoassets'
import I18n from 'i18n-js'
import { GRADIENT_BACKGROUND_HEIGHT, labelTranslateFn } from '../../../utils'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
import { AppIcons, Fonts, Images } from '../../../assets'
import AssetIcon from '../../../components/asset-icon'
const { Eye, Refresh } = AppIcons
const adjustLineHeight = -scale(30)
import { scale } from 'react-native-size-matters'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

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

  useEffect(() => {
    setAssetScreenPopuMenuVisible(false)
  }, [setAssetScreenPopuMenuVisible])

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
            zIndex={3000}
            style={{ top: 5, right: 0 }}>
            <Box flex={1} alignItems={'flex-end'}>
              <Box height={scale(100)} width={scale(180)}>
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
                      padding={'onboardingPadding'}>
                      <TouchableWithoutFeedback onPress={handleSendPress}>
                        <Text
                          variant={'normalText'}
                          color="textColor"
                          tx="assetScreen.send"
                        />
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback onPress={handleSwapPress}>
                        <Text
                          variant={'normalText'}
                          color="textColor"
                          tx="assetScreen.swap"
                        />
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback onPress={handleReceivePress}>
                        <Text
                          variant={'normalText'}
                          color="textColor"
                          tx="assetScreen.receive"
                        />
                      </TouchableWithoutFeedback>
                    </Box>
                  </ImageBackground>
                </ImageBackground>
              </Box>
            </Box>
          </Box>
        )}
        <Box flex={1} onTouchStart={() => setAssetScreenPopuMenuVisible(false)}>
          <Card
            variant={'headerCard'}
            height={GRADIENT_BACKGROUND_HEIGHT}
            paddingHorizontal="xl">
            <Box marginTop="xl" justifyContent="space-between">
              <Box marginBottom={'xl'} flexDirection={'row'}>
                <AssetIcon
                  size={scale(25)}
                  chain={getAsset(activeNetwork, code).chain}
                />
                <AssetIcon
                  size={scale(25)}
                  styles={{ right: scale(10) }}
                  asset={code}
                />
                <Text style={styles.addressText}>
                  {shortenAddress(address)}{' '}
                </Text>
                <Eye width={scale(20)} height={scale(10)} style={styles.eye} />
              </Box>
              <Text color={'darkGrey'} variant="totalBalance">
                {getAsset(activeNetwork, code).chain.toUpperCase()}
              </Text>
              <Box style={styles.textContainer}>
                <Text
                  style={{ marginTop: adjustLineHeight }}
                  variant="totalAsset"
                  color={'nestedColor'}>
                  {`${prettyBalance(
                    new BigNumber(balance),
                    code,
                  ).toString()} ${code}`}
                </Text>
                <Pressable onPress={() => ({})} style={styles.refreshBtn}>
                  <Refresh />
                </Pressable>
              </Box>
            </Box>
          </Card>
          <View style={styles.tabBlack}>
            <Pressable style={[styles.leftHeader, styles.headerFocused]}>
              <Text variant="tabHeader" tx="assetScreen.activity" />
            </Pressable>
          </View>
          {/* For some reason ActivityFlatList started throwing undefined errors upon SEND navigation and flow.
        Should be fixed, can be commented out to bypass that error for now */}
          <ScrollView
            contentContainerStyle={{
              paddingBottom: scale(20),
            }}>
            <ActivityFlatList selectedAsset={code} />
          </ScrollView>
        </Box>
      </React.Suspense>
    </Box>
  )
}

const styles = StyleSheet.create({
  tabBlack: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignContent: 'stretch',
    width: '50%',
    borderBottomWidth: 1,
    borderBottomColor: palette.gray,
  },
  leftHeader: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  headerFocused: {
    borderBottomWidth: 1,
    borderBottomColor: palette.black,
  },
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
  eye: { marginTop: 10 },
  addressText: {
    fontFamily: Fonts.JetBrainsMono,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.5,
    marginTop: 7,
    color: faceliftPalette.greyMeta,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
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

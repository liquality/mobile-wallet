import * as React from 'react'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native'
import { useAppSelector, useWalletState } from '../../../hooks'
import { formatFiat } from '../../../core/utils/coin-formatter'
import AssetFlatList from '../../../components/overview/asset-flat-list'
import ActivityFlatList from '../../../components/activity-flat-list'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ActionEnum, RootStackParamList, StackPayload } from '../../../types'
import { populateWallet } from '../../../store/store'
import ErrorBoundary from 'react-native-error-boundary'
import Text from '../../../theme/text'
import ErrorFallback from '../../../components/error-fallback'
import Box from '../../../theme/box'
import RoundButton from '../../../theme/round-button'

type OverviewProps = NativeStackScreenProps<
  RootStackParamList,
  'OverviewScreen'
>

const OverviewScreen = ({ navigation }: OverviewProps) => {
  enum ViewKind {
    ASSETS,
    ACTIVITY,
  }
  const [selectedView, setSelectedView] = useState(ViewKind.ASSETS)
  const { assets, assetCount, totalFiatBalance, loading, error } =
    useWalletState()
  const { activeNetwork } = useAppSelector((state) => ({
    activeNetwork: state.activeNetwork,
  }))

  const handleSendBtnPress = useCallback(() => {
    navigation.navigate('AssetChooserScreen', {
      screenTitle: 'Select asset for Send',
      action: ActionEnum.SEND,
    })
  }, [navigation])

  const handleReceiveBtnPress = useCallback(() => {
    navigation.navigate('AssetChooserScreen', {
      screenTitle: 'Select asset for receive',
      action: ActionEnum.RECEIVE,
    })
  }, [navigation])

  const handleSwapBtnPress = useCallback(() => {
    navigation.navigate('AssetChooserScreen', {
      screenTitle: 'Select asset for swap',
      action: ActionEnum.SWAP,
    })
  }, [navigation])

  const onAssetSelected = useCallback(
    (params: StackPayload) => {
      const fromAsset = params.assetData
      let toAsset = params.assetData
      if (fromAsset?.code === 'ETH') {
        toAsset = assets.filter((item) => item.code === 'BTC')[0]
      } else {
        toAsset = assets.filter((item) => item.code === 'ETH')[0]?.assets?.[0]
      }
      navigation.navigate('AssetScreen', {
        ...params,
        swapAssetPair: {
          fromAsset,
          toAsset,
        },
      })
    },
    [assets, navigation],
  )

  useEffect(() => {
    populateWallet()
  }, [activeNetwork])

  if (error) {
    return (
      <ErrorFallback
        error={new Error('Failed to load assets')}
        resetError={() => navigation.navigate('LoginScreen')}
      />
    )
  }

  return (
    <View style={styles.container}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ImageBackground
          style={styles.overviewBlock}
          source={require('../../../assets/bg/action-block-bg.png')}>
          {loading ? (
            <Text style={styles.loading}>Loading...</Text>
          ) : (
            <Fragment>
              <View style={styles.totalValueSection}>
                <Text style={styles.totalValue} numberOfLines={1}>
                  {formatFiat(totalFiatBalance)}
                </Text>
                <Text style={styles.currency}>USD</Text>
              </View>
              <Text style={styles.assets}>
                {assetCount}
                {assetCount === 1 ? ' Asset' : ' Assets'}
              </Text>

              <Box flexDirection="row" justifyContent="center" marginTop="l">
                <RoundButton
                  onPress={handleSendBtnPress}
                  label="Send"
                  type="SEND"
                  variant="smallPrimary"
                />
                <RoundButton
                  onPress={handleSwapBtnPress}
                  label="Swap"
                  type="SWAP"
                  variant="largePrimary"
                />
                <RoundButton
                  onPress={handleReceiveBtnPress}
                  label="Receive"
                  type="RECEIVE"
                  variant="smallPrimary"
                />
              </Box>
            </Fragment>
          )}
        </ImageBackground>
        <View style={styles.tabsBlock}>
          <Pressable
            style={[
              styles.tabHeader,
              selectedView === ViewKind.ASSETS && styles.headerFocused,
            ]}
            onPress={() => setSelectedView(ViewKind.ASSETS)}>
            <Text style={styles.headerText}>ASSET</Text>
          </Pressable>
          <Pressable
            style={[
              styles.tabHeader,
              selectedView === ViewKind.ACTIVITY && styles.headerFocused,
            ]}
            onPress={() => setSelectedView(ViewKind.ACTIVITY)}>
            <Text style={styles.headerText}>ACTIVITY</Text>
          </Pressable>
        </View>
        <Box flex={1}>
          {selectedView === ViewKind.ACTIVITY &&
            (assets.length > 0 ? (
              <ActivityFlatList navigate={navigation.navigate} />
            ) : (
              <Text style={styles.noActivityMessageBlock}>
                Once you start using your wallet you will see the activity here.
              </Text>
            ))}
          {selectedView === ViewKind.ASSETS && (
            <AssetFlatList assets={assets} onAssetSelected={onAssetSelected} />
          )}
        </Box>
      </ErrorBoundary>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  overviewBlock: {
    justifyContent: 'center',
    width: '100%',
    height: 225,
    paddingVertical: 10,
  },
  assets: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 20,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  totalValueSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 15,
  },
  totalValue: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontSize: 36,
    marginTop: 15,
    textAlignVertical: 'bottom',
  },
  currency: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontSize: 18,
    paddingBottom: 3,
    paddingLeft: 5,
    textAlignVertical: 'bottom',
  },
  tabsBlock: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignContent: 'stretch',
  },
  tabHeader: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D9DFE5',
  },
  headerFocused: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  headerText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  contentBlock: {
    flex: 1,
  },
  noActivityMessageBlock: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 14,
    marginHorizontal: 20,
    marginTop: 15,
    lineHeight: 20,
  },
  loading: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 28,
    color: '#FFF',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 15,
    lineHeight: 28,
  },
})

export default OverviewScreen

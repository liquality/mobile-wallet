import * as React from 'react'
import { FC, Fragment, useCallback, useEffect, useState } from 'react'
import { Dimensions, Platform, Pressable, StyleSheet, View } from 'react-native'
import AssetFlatList from '../../../components/overview/asset-flat-list'
import ActivityFlatList from '../../../components/activity-flat-list'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ActionEnum, RootStackParamList } from '../../../types'
import { populateWallet } from '../../../store/store'
import ErrorBoundary from 'react-native-error-boundary'
import Text from '../../../theme/text'
import ErrorFallback from '../../../components/error-fallback'
import Box from '../../../theme/box'
import RoundButton from '../../../theme/round-button'
import GradientBackground from '../../../components/gradient-background'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  accountsIdsState,
  swapPairState,
  totalFiatBalanceState,
} from '../../../atoms'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PushNotificationIOS from '@react-native-community/push-notification-ios'

type SummaryBlockProps = {
  navigation: OverviewProps['navigation']
}

const SummaryBlock: FC<SummaryBlockProps> = (props) => {
  const { navigation } = props
  const accountsIds = useRecoilValue(accountsIdsState)
  const totalFiatBalance = useRecoilValue(totalFiatBalanceState)
  const setSwapPair = useSetRecoilState(swapPairState)

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
    setSwapPair({})
    navigation.navigate('AssetChooserScreen', {
      screenTitle: 'Select asset for swap',
      action: ActionEnum.SWAP,
    })
  }, [navigation, setSwapPair])

  useEffect(() => {
    populateWallet()
  }, [totalFiatBalance])

  useEffect(() => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
        critical: true,
      })
    }
    //Android considers push notifications as a normal permission
    //and automatically collects this permission on the first app session
  }, [])

  return (
    <Box style={styles.overviewBlock}>
      <GradientBackground width={Dimensions.get('screen').width} height={225} />
      <Fragment>
        <View style={styles.totalValueSection}>
          <Text style={styles.totalValue} numberOfLines={1}>
            {totalFiatBalance}
          </Text>
          <Text style={styles.currency}>USD</Text>
        </View>
        <Text style={styles.assets}>
          {accountsIds.length}
          {accountsIds.length === 1 ? ' Asset' : ' Assets'}
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
    </Box>
  )
}

const ContentComponent = () => {
  enum ViewKind {
    ASSETS,
    ACTIVITY,
  }
  const [selectedView, setSelectedView] = useState(ViewKind.ASSETS)
  const accountsIds = useRecoilValue(accountsIdsState)

  return (
    <Fragment>
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
          (accountsIds.length > 0 ? (
            <ActivityFlatList />
          ) : (
            <Text style={styles.noActivityMessageBlock}>
              Once you start using your wallet you will see the activity here.
            </Text>
          ))}
        {selectedView === ViewKind.ASSETS && accountsIds && (
          <AssetFlatList accounts={accountsIds} />
        )}
      </Box>
    </Fragment>
  )
}

export type OverviewProps = NativeStackScreenProps<
  RootStackParamList,
  'OverviewScreen'
>

const OverviewScreen = ({ navigation }: OverviewProps) => {
  useEffect(() => {
    AsyncStorage.getItem('BTC').then((result) => {
      if (result) {
        setTimeout(populateWallet, 3000)
      } else {
        populateWallet()
      }
    })
  }, [])

  return (
    <View style={styles.container}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <React.Suspense
          fallback={
            <Box style={styles.overviewBlock}>
              <GradientBackground
                width={Dimensions.get('screen').width}
                height={225}
              />
              <Text style={styles.loading}>Loading...</Text>
            </Box>
          }>
          <SummaryBlock navigation={navigation} />
        </React.Suspense>
        <React.Suspense
          fallback={
            <View>
              <Text>Loading...</Text>
            </View>
          }>
          <ContentComponent />
        </React.Suspense>
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
    borderTopWidth: 1,
    borderBottomColor: '#D9DFE5',
    borderTopColor: '#D9DFE5',
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

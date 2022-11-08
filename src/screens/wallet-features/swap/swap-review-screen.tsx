import React, { FC, useState } from 'react'
import { StyleSheet, Alert } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AccountType, MainStackParamList, SwapInfoType } from '../../../types'
import SwapReviewAssetSummary from '../../../components/swap/swap-review-asset-summary'
import { Box, Pressable, Text } from '../../../theme'
import { BigNumber } from '@liquality/types'
import { performSwap } from '../../../store/store'
import { labelTranslateFn, Log, SCREEN_WIDTH } from '../../../utils'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { SwapHistoryItem } from '@liquality/wallet-core/dist/src/store/types'
import {
  fiatRatesState,
  historyIdsState,
  historyStateFamily,
  networkState,
  swapQuoteState,
} from '../../../atoms'
import { CommonActions } from '@react-navigation/native'
import { AppIcons } from '../../../assets'
import { getAsset } from '@liquality/cryptoassets'
import { useHeaderHeight } from '@react-navigation/elements'
import { scale } from 'react-native-size-matters'
import { dpUI } from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { calculateQuoteRate } from '@liquality/wallet-core/dist/src/utils/quotes'
import AssetIcon from '../../../components/asset-icon'

const { Clock, DoubleArrowThick } = AppIcons

type SwapReviewScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'SwapReviewScreen'
>

const SwapReviewScreen: FC<SwapReviewScreenProps> = (props) => {
  const { navigation, route } = props
  const headerHeight = useHeaderHeight()

  const {
    params: { swapTransaction, assetsAreSameChain },
  } = route
  const fiatRates = useRecoilValue(fiatRatesState)
  const ids = useRecoilValue(historyIdsState)
  const activeNetwork = useRecoilValue(networkState)
  const quote = useRecoilValue(swapQuoteState)

  const addTransaction = useRecoilCallback(
    ({ set }) =>
      (transactionId: string, historyItem: SwapHistoryItem) => {
        set(historyIdsState, [...ids, transactionId])
        set(historyStateFamily(transactionId), historyItem)
      },
  )

  const [isLoading, setIsLoading] = useState(false)

  const handleInitiateSwap = async () => {
    setIsLoading(true)
    if (swapTransaction) {
      const {
        fromAsset,
        toAsset,
        fromAmount,
        toAmount,
        fromNetworkFee,
        toNetworkFee,
      }: SwapInfoType = swapTransaction

      try {
        const transaction = await performSwap(
          activeNetwork,
          fromAsset,
          toAsset,
          new BigNumber(fromAmount),
          new BigNumber(toAmount),
          quote,
          fromNetworkFee.value,
          //If assets are on the same chain, they have the same fee
          assetsAreSameChain && !toNetworkFee
            ? fromNetworkFee.value
            : toNetworkFee.value,
          fromNetworkFee.speed,
          assetsAreSameChain && !toNetworkFee
            ? fromNetworkFee.speed
            : toNetworkFee.speed,
        )

        if (transaction) {
          /*This code made non-BTC swaps throw error. 
            Swaps work as expected without it. Could be deleted?

          delete transaction.quote
          delete transaction.fromFundTx._raw */

          addTransaction(transaction.id, transaction)

          const tempAsset = getAsset(activeNetwork, transaction.from)
          const assetData: AccountType = {
            ...tempAsset,
            id: transaction.fromAccountId,
            balance: 0,
            assets: {},
          }

          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                { name: 'MainNavigator' },
                { name: 'AssetScreen', params: { assetData } },
                {
                  name: 'SwapDetailsScreen',
                  params: {
                    swapTransactionConfirmation: transaction,
                    screenTitle: `Swap ${transaction.from} to ${transaction.to} Details`,
                  },
                },
              ],
            }),
          )
        } else {
          setIsLoading(false)
          Alert.alert(labelTranslateFn('swapReviewScreen.swapRespNull')!)
        }
      } catch (error) {
        setIsLoading(false)
        Log(`Failed to perform swap: ${error}`, 'error')
        Alert.alert(labelTranslateFn('swapReviewScreen.failedToPerfSwap')!)
      }
    } else {
      setIsLoading(false)
      Alert.alert(labelTranslateFn('swapReviewScreen.invalidParams')!)
    }
  }

  if (!swapTransaction) {
    return (
      <Box
        width={SCREEN_WIDTH}
        padding="xl"
        backgroundColor={'mainBackground'}
      />
    )
  }

  const {
    fromAsset,
    toAsset,
    fromAmount,
    toAmount,
    fromNetworkFee,
    toNetworkFee,
  }: SwapInfoType = swapTransaction

  return (
    <Box
      flex={1}
      style={{ paddingTop: headerHeight }}
      backgroundColor="semiTransparentGrey">
      <Box
        flex={1}
        backgroundColor="mainBackground"
        paddingTop="xl"
        paddingHorizontal={'drawerPadding'}>
        <Box flex={0.8}>
          <Text
            marginTop={'s'}
            variant={'buyCryptoHeader'}
            color="darkGrey"
            tx="reviewSwap"
          />
          <SwapReviewAssetSummary
            type={'SEND'}
            amount={new BigNumber(fromAmount)}
            asset={fromAsset}
            fiatRates={fiatRates}
            networkFee={new BigNumber(fromNetworkFee.value)}
          />
          <Box
            height={1}
            backgroundColor="mediumGrey"
            marginTop="m"
            marginBottom="l"
          />
          <SwapReviewAssetSummary
            type={'RECEIVE'}
            amount={new BigNumber(toAmount)}
            asset={toAsset}
            fiatRates={fiatRates}
            networkFee={
              assetsAreSameChain && !toNetworkFee
                ? new BigNumber(fromNetworkFee.value)
                : new BigNumber(toNetworkFee.value)
            }
          />
          <Box
            height={1}
            backgroundColor="mediumGrey"
            marginTop="m"
            marginBottom="l"
          />
          {quote ? (
            <Box flexDirection="row">
              <Text variant={'addressLabel'} color="darkGrey">
                1 {fromAsset.code} ={' '}
                {dpUI(calculateQuoteRate(quote!), 5).toString()} {toAsset.code}
              </Text>
              <Box
                alignSelf={'flex-start'}
                width={1}
                marginHorizontal="m"
                height={scale(15)}
                backgroundColor="inactiveText"
              />
              <Box flexDirection="row">
                <AssetIcon asset={quote.provider} size={scale(15)} />
                <Text
                  marginLeft={'m'}
                  lineHeight={scale(16)}
                  variant={'addressLabel'}
                  color="darkGrey">
                  {quote.provider}
                </Text>
              </Box>
            </Box>
          ) : null}
          <Box flexDirection={'row'} marginTop={'m'}>
            <Clock width={15} height={15} style={styles.icon} />
            <Text
              variant={'normalText'}
              color="darkGrey"
              lineHeight={scale(20)}
              tx="common.maxSlippage"
            />
          </Box>
        </Box>
        <Box flex={0.2} justifyContent="center">
          <Pressable
            label={{ tx: 'swapReviewScreen.initiateSwap' }}
            onPress={() => handleInitiateSwap()}
            variant="solid"
            isLoading={isLoading}
            customView={
              <Box
                flexDirection={'row'}
                alignItems="center"
                justifyContent={'center'}>
                <DoubleArrowThick />
                <Text
                  marginLeft="m"
                  color={'white'}
                  variant={'h6'}
                  lineHeight={scale(25)}
                  tx="common.review"
                />
              </Box>
            }
          />
        </Box>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 5,
  },
})

export default SwapReviewScreen

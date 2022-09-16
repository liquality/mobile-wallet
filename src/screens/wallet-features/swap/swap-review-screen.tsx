import React, { FC, useState } from 'react'
import { Dimensions, StyleSheet, View, ScrollView, Alert } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList, SwapInfoType } from '../../../types'
import Warning from '../../../components/ui/warning'
import SwapReviewAssetSummary from '../../../components/swap/swap-review-asset-summary'
import { Button } from '../../../theme'
import { BigNumber } from '@liquality/types'
import { performSwap } from '../../../store/store'
import { labelTranslateFn, Log } from '../../../utils'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { SwapHistoryItem } from '@liquality/wallet-core/dist/src/store/types'
import {
  fiatRatesState,
  historyIdsState,
  historyStateFamily,
  networkState,
} from '../../../atoms'
import I18n from 'i18n-js'
import { AppIcons } from '../../../assets'

const { Clock, Exchange } = AppIcons

type SwapReviewScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SwapReviewScreen'
>

const SwapReviewScreen: FC<SwapReviewScreenProps> = (props) => {
  const { navigation, route } = props

  const {
    params: { swapTransaction, assetsAreSameChain },
  } = route
  const fiatRates = useRecoilValue(fiatRatesState)
  const ids = useRecoilValue(historyIdsState)
  const activeNetwork = useRecoilValue(networkState)

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
        quote,
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
          navigation.navigate('SwapConfirmationScreen', {
            swapTransactionConfirmation: transaction,
            screenTitle: I18n.t('swapReviewScreen.swapDetails', {
              fromCode: fromAsset.code,
              toCode: toAsset.code,
            }),
          })
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
    return <View style={styles.container} />
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
    <ScrollView contentContainerStyle={styles.container}>
      <SwapReviewAssetSummary
        type={'SEND'}
        amount={new BigNumber(fromAmount)}
        asset={fromAsset}
        fiatRates={fiatRates}
        networkFee={new BigNumber(fromNetworkFee.value)}
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
      {/* <SwapRates
        fromAsset={fromAsset.code}
        toAsset={toAsset.code}
        selectQuote={handleSelectQuote}
      /> */}
      <Warning
        text1={{ tx1: 'common.maxSlippage' }}
        text2={I18n.t('common.swapDoesnotComp', {
          date: `${new Date(
            new Date().getTime() + 3 * 60 * 60 * 1000,
          ).toTimeString()}`,
        })}>
        <Clock width={15} height={15} style={styles.icon} />
      </Warning>
      <View style={styles.buttonWrapper}>
        <Button
          type="secondary"
          variant="m"
          label={{ tx: 'common.edit' }}
          onPress={navigation.goBack}
          isBorderless={false}
          isActive={true}
        />
        <Button
          type="primary"
          variant="m"
          label={{ tx: 'swapReviewScreen.initiateSwap' }}
          onPress={handleInitiateSwap}
          isBorderless={false}
          isActive={true}
          isLoading={isLoading}>
          <Exchange style={styles.icon} />
        </Button>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width,
    backgroundColor: '#FFF',
    padding: 20,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icon: {
    marginRight: 5,
  },
})

export default SwapReviewScreen

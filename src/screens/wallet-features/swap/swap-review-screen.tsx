import React, { FC, useState } from 'react'
import { Dimensions, StyleSheet, View, ScrollView, Alert } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClock, faExchange } from '@fortawesome/pro-light-svg-icons'
import { RootStackParamList, SwapInfoType } from '../../../types'
import LiqualityButton from '../../../components/ui/button'
import Warning from '../../../components/ui/warning'
import SwapRates from '../../../components/swap-rates'
import { performSwap } from '../../../store/store'
import { useAppSelector } from '../../../hooks'
import SwapReviewAssetSummary from '../../../components/swap/swap-review-asset-summary'

type SwapReviewScreenProps = StackScreenProps<
  RootStackParamList,
  'SwapReviewScreen'
>

const SwapReviewScreen: FC<SwapReviewScreenProps> = (props) => {
  const { navigation, route } = props
  const swapTransaction = route.params.swapTransaction
  const { fiatRates = {}, activeNetwork } = useAppSelector((state) => ({
    fiatRates: state.fiatRates,
    activeNetwork: state.activeNetwork,
  }))
  const [isLoading, setIsLoading] = useState(false)

  const handleInitiateSwap = async () => {
    setIsLoading(true)
    if (swapTransaction && activeNetwork) {
      const {
        fromAsset,
        toAsset,
        fromAmount,
        toAmount,
        fromNetworkFee,
        toNetworkFee,
        swapProviderType,
      }: SwapInfoType = swapTransaction
      try {
        const transaction = await performSwap(
          swapProviderType?.toUpperCase(),
          fromAsset,
          toAsset,
          fromAmount,
          toAmount,
          fromNetworkFee,
          toNetworkFee,
          activeNetwork,
        )
        if (transaction) {
          navigation.navigate('SwapConfirmationScreen', {
            swapTransactionConfirmation: transaction,
            screenTitle: `Swap ${fromAsset.code} to ${toAsset.code} Details`,
          })
        } else {
          setIsLoading(false)
          Alert.alert('Failed to perform swap')
        }
      } catch (error) {
        setIsLoading(false)
        Alert.alert('Failed to perform swap')
      }
    } else {
      setIsLoading(false)
      Alert.alert('Can not perform swap')
    }
  }

  const handleSelectQuote = () => {}

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
        amount={fromAmount}
        asset={fromAsset}
        fiatRates={fiatRates}
        networkFee={fromNetworkFee}
      />
      <SwapReviewAssetSummary
        type={'RECEIVE'}
        amount={toAmount}
        asset={toAsset}
        fiatRates={fiatRates}
        networkFee={toNetworkFee}
      />
      <SwapRates
        fromAsset={fromAsset.code}
        toAsset={toAsset.code}
        selectQuote={handleSelectQuote}
      />
      <Warning
        text1="Max slippage is 0.5%."
        text2="If the swap doesn’t complete within 3 hours, you will be refunded in 6
          hours at 20:45 GMT"
        icon={faClock}
      />
      <View style={[styles.buttonWrapper]}>
        <LiqualityButton
          text="Edit"
          variant="medium"
          type="negative"
          action={() => navigation.goBack()}
        />
        <LiqualityButton
          text="Initiate Swap"
          variant="medium"
          type="positive"
          isLoading={isLoading}
          action={handleInitiateSwap}>
          <FontAwesomeIcon
            icon={faExchange}
            size={15}
            color={'#FFFFFF'}
            style={styles.icon}
          />
        </LiqualityButton>
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
    marginVertical: 5,
    marginHorizontal: 5,
  },
})

export default SwapReviewScreen

import React, { FC, useState } from 'react'
import { Dimensions, StyleSheet, View, ScrollView, Alert } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClock, faExchange } from '@fortawesome/pro-light-svg-icons'
import { RootStackParamList, SwapInfoType } from '../../../types'
import Warning from '../../../components/ui/warning'
import { useAppSelector } from '../../../hooks'
import SwapReviewAssetSummary from '../../../components/swap/swap-review-asset-summary'
import Button from '../../../theme/button'
import { BigNumber } from '@liquality/types'
import { performSwap } from '../../../store/store'
import { Log } from '../../../utils'

type SwapReviewScreenProps = NativeStackScreenProps<
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
        quote,
        fromNetworkFee,
        toNetworkFee,
      }: SwapInfoType = swapTransaction

      try {
        const transaction = await performSwap(
          fromAsset,
          toAsset,
          new BigNumber(fromAmount),
          new BigNumber(toAmount),
          quote,
          fromNetworkFee.value,
          toNetworkFee.value,
          fromNetworkFee.speed,
          toNetworkFee.speed,
        )

        if (transaction) {
          navigation.navigate('SwapConfirmationScreen', {
            swapTransactionConfirmation: transaction,
            screenTitle: `Swap ${fromAsset.code} to ${toAsset.code} Details`,
          })
        } else {
          setIsLoading(false)
          Alert.alert('Swap Response null')
        }
      } catch (error) {
        setIsLoading(false)
        Log(`Failed to perform swap: ${error}`, 'error')
        Alert.alert('Failed to perform swap')
      }
    } else {
      setIsLoading(false)
      Alert.alert('Invalid params. Please try again')
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
        networkFee={new BigNumber(toNetworkFee.value)}
      />
      {/* <SwapRates
        fromAsset={fromAsset.code}
        toAsset={toAsset.code}
        selectQuote={handleSelectQuote}
      /> */}
      <Warning
        text1="Max slippage is 0.5%."
        text2="If the swap doesn’t complete within 3 hours, you will be refunded in 6
          hours at 20:45 GMT"
        icon={faClock}
      />
      <View style={styles.buttonWrapper}>
        <Button
          type="secondary"
          variant="m"
          label="Edit"
          onPress={navigation.goBack}
          isBorderless={false}
          isActive={true}
        />
        <Button
          type="primary"
          variant="m"
          label="Initiate Swap"
          onPress={handleInitiateSwap}
          isBorderless={false}
          isActive={true}
          isLoading={isLoading}>
          <FontAwesomeIcon
            icon={faExchange}
            size={15}
            color={'#FFFFFF'}
            style={styles.icon}
          />
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
    marginVertical: 5,
    marginHorizontal: 5,
  },
})

export default SwapReviewScreen

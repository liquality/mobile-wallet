import React, { FC, useState } from 'react'
import { Dimensions, StyleSheet, View, ScrollView, Alert } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClock, faExchange } from '@fortawesome/pro-light-svg-icons'
import { RootStackParamList, SwapInfoType } from '../../../types'
import Warning from '../../../components/ui/warning'
import SwapRates from '../../../components/swap-rates'
import { useAppSelector } from '../../../hooks'
import SwapReviewAssetSummary from '../../../components/swap/swap-review-asset-summary'
import Button from '../../../theme/button'
import { BigNumber } from '@liquality/types'
import { performSwap } from '../../../store/store'

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
        fromNetworkFee,
        toNetworkFee,
      }: SwapInfoType = swapTransaction

      try {
        const transaction = await performSwap(
          fromAsset,
          toAsset,
          fromAmount,
          toAmount,
          fromNetworkFee,
          toNetworkFee,
          '',
          '',
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
        amount={new BigNumber(fromAmount)}
        asset={fromAsset}
        fiatRates={fiatRates}
        networkFee={new BigNumber(fromNetworkFee)}
      />
      <SwapReviewAssetSummary
        type={'RECEIVE'}
        amount={new BigNumber(toAmount)}
        asset={toAsset}
        fiatRates={fiatRates}
        networkFee={new BigNumber(toNetworkFee)}
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

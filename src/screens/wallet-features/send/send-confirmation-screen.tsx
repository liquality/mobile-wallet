import React from 'react'
import { StyleSheet, ScrollView, Pressable, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  unitToCurrency,
  ChainId,
  getChain,
  getAsset,
} from '@liquality/cryptoassets'
import { SendHistoryItem } from '@liquality/wallet-core/dist/src/store/types'
import { MainStackParamList } from '../../../types'
import SendTransactionDetails from '../../../components/send/send-transaction-details'
import ProgressCircle from '../../../components/animations/progress-circle'
import { Box, palette, Text } from '../../../theme'
import { formatDate } from '../../../utils'
import { useRecoilValue } from 'recoil'
import { historyStateFamily, networkState } from '../../../atoms'
import { isEIP1559Fees } from '@liquality/wallet-core/dist/src/utils/fees'
import { AppIcons } from '../../../assets'
import { cryptoToFiat } from '@liquality/wallet-core/dist/src/utils/coinFormatter'

const { CompletedIcon: SuccessIcon } = AppIcons

type SendConfirmationScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'SendConfirmationScreen'
>

const ConfirmationComponent: React.FC<SendConfirmationScreenProps> = React.memo(
  (props) => {
    const { navigation, route } = props
    const transaction = route.params.sendTransactionConfirmation!
    const historyItem = useRecoilValue(
      historyStateFamily(transaction.id),
    ) as SendHistoryItem
    const activeNetwork = useRecoilValue(networkState)

    //TODO is there a better way to deal with this?
    const { code = 'ETH', chain = ChainId.Ethereum } =
      route.params.assetData || {}

    const gasFeeToFiat = (fee: number, fiatRate: number) => {
      const currency = unitToCurrency(getAsset(activeNetwork, code), fee)
      return cryptoToFiat(currency, fiatRate)
    }

    const handleTransactionSpeedUp = () => {
      navigation.navigate(
        isEIP1559() ? 'CustomFeeEIP1559Screen' : 'CustomFeeScreen',
        {
          assetData: route.params.assetData,
          screenTitle: 'NETWORK SPEED/FEE',
          code,
          amountInput: route.params.amount,
          fee: route.params.fee,
          speedMode: 'average',
          speedUp: true,
          id: transaction.id,
          txHash: historyItem.txHash,
        },
      )
    }

    const isEIP1559 = () => {
      return isEIP1559Fees(chain)
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          paddingHorizontal="xl"
          marginTop={'lxxl'}>
          <Box>
            <Text
              variant="amountLabel"
              tx="sendConfirmationScreeen.status"
              textTransform={'capitalize'}
            />
            <Text variant="normalText">
              {historyItem.status === 'SUCCESS'
                ? `Completed / ${
                    getChain(
                      activeNetwork,
                      getAsset(activeNetwork, historyItem.from).chain,
                    ).safeConfirmations
                  } confirmations`
                : `Pending / ${
                    getChain(
                      activeNetwork,
                      getAsset(activeNetwork, historyItem.from).chain,
                    ).safeConfirmations - (historyItem.tx.confirmations || 0)
                  } confirmations`}
            </Text>
          </Box>
          {historyItem.status === 'SUCCESS' ? (
            <SuccessIcon />
          ) : (
            <ProgressCircle
              radius={17}
              current={historyItem.tx.confirmations || 0}
              total={
                getChain(
                  activeNetwork,
                  getAsset(activeNetwork, historyItem.from).chain,
                ).safeConfirmations
              }
            />
          )}
        </Box>
        <Box
          justifyContent="space-between"
          paddingHorizontal="xl"
          marginBottom="xl">
          <Text
            variant="amountLabel"
            tx="sendConfirmationScreeen.time"
            textTransform={'capitalize'}
          />
          <Text variant="normalText">{formatDate(historyItem.startTime)}</Text>
        </Box>
        <Box
          justifyContent="space-between"
          paddingHorizontal="xl"
          marginBottom="xl">
          <Text
            variant="amountLabel"
            tx="sendConfirmationScreeen.sent"
            textTransform={'capitalize'}
          />
          <Text variant="normalText">
            {historyItem.fee &&
              `${unitToCurrency(
                getAsset(activeNetwork, historyItem.from),
                historyItem.tx.value,
              ).toNumber()} ${historyItem.from}`}
          </Text>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          paddingHorizontal="xl">
          <Box>
            <Text
              variant="amountLabel"
              tx="sendConfirmationScreeen.networkSpeed"
              textTransform={'capitalize'}
            />
            <Text variant="normalText">
              {`${historyItem.feeLabel} ${historyItem.fee} ${
                getChain(
                  activeNetwork,
                  getAsset(activeNetwork, historyItem.from).chain,
                ).fees.unit
              } | ${gasFeeToFiat(historyItem.fee, historyItem.fiatRate)}`}
            </Text>
          </Box>
          {historyItem.status !== 'SUCCESS' && (
            <Pressable onPress={handleTransactionSpeedUp}>
              <Text variant="link" tx="sendConfirmationScreeen.speedUp" />
            </Pressable>
          )}
        </Box>
        <Box paddingHorizontal={'xl'}>
          {historyItem && <SendTransactionDetails historyItem={historyItem} />}
        </Box>
      </ScrollView>
    )
  },
)

const SendConfirmationScreen: React.FC<SendConfirmationScreenProps> = ({
  route,
  navigation,
}) => {
  return (
    <React.Suspense
      fallback={
        <View>
          <Text tx="sendConfirmationScreeen.load" />
        </View>
      }>
      <ConfirmationComponent navigation={navigation} route={route} />
    </React.Suspense>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.white,
    paddingVertical: 15,
  },
})

export default SendConfirmationScreen

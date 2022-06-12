import React from 'react'
import { StyleSheet, ScrollView, Pressable } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  chains,
  unitToCurrency,
  assets as cryptoassets,
} from '@liquality/cryptoassets'
import { SendHistoryItem } from '@liquality/wallet-core/dist/store/types'
import { RootStackParamList } from '../../../types'
import SendTransactionDetails from '../../../components/send/send-transaction-details'
import ProgressCircle from '../../../components/animations/progress-circle'
import SuccessIcon from '../../../assets/icons/activity-status/completed.svg'
import Text from '../../../theme/text'
import Box from '../../../theme/box'
import { formatDate } from '../../../utils'
import { useRecoilValue } from 'recoil'
import { historyStateFamily } from '../../../atoms'

type SendConfirmationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SendConfirmationScreen'
>

const SendConfirmationScreen: React.FC<SendConfirmationScreenProps> = ({
  route,
  navigation,
}) => {
  const transaction = route.params.sendTransactionConfirmation!
  const historyItem = useRecoilValue(
    historyStateFamily(transaction.id),
  ) as SendHistoryItem

  const handleTransactionSpeedUp = () => {
    navigation.navigate('CustomFeeScreen', {
      assetData: route.params.assetData,
      screenTitle: 'NETWORK SPEED/FEE',
    })
  }

  // useEffect(() => {
  //   const hash = transaction.hash || transaction.tx?.hash
  //
  //   fetchConfirmationByHash(historyItem.from, hash).then((confirmations) => {
  //     historyItem.tx.confirmations = confirmations
  //   })
  // }, [transaction])

  if (!historyItem)
    return (
      <Box style={styles.container}>
        <Text>Loading...</Text>
      </Box>
    )

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-end"
        paddingHorizontal="xl"
        marginBottom="xl">
        <Box>
          <Text variant="header">STATUS</Text>
          <Text variant="content">
            {historyItem.status === 'SUCCESS'
              ? `Completed / ${
                  chains[cryptoassets[historyItem.from].chain].safeConfirmations
                } confirmations`
              : `Pending / ${
                  chains[cryptoassets[historyItem.from].chain]
                    .safeConfirmations - (historyItem.tx.confirmations || 0)
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
              chains[cryptoassets[historyItem.from].chain].safeConfirmations
            }
          />
        )}
      </Box>
      <Box
        justifyContent="space-between"
        paddingHorizontal="xl"
        marginBottom="xl">
        <Text variant="header">TIME</Text>
        <Text variant="content">{formatDate(historyItem.startTime)}</Text>
      </Box>
      <Box
        justifyContent="space-between"
        paddingHorizontal="xl"
        marginBottom="xl">
        <Text variant="header">SENT</Text>
        <Text variant="content">
          {historyItem.fee &&
            `${unitToCurrency(
              cryptoassets[historyItem.from],
              historyItem.tx.value,
            ).toNumber()} ${historyItem.from}`}
        </Text>
      </Box>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-end"
        paddingHorizontal="xl"
        minHeight={60}
        paddingVertical="m"
        borderTopWidth={1}
        borderBottomWidth={1}
        borderColor="mainBorderColor">
        <Box>
          <Text variant="header">NETWORK SPEED/FEE</Text>
          <Text variant="content">
            {`${historyItem.from} Fee: ${historyItem.tx.fee} x ${
              chains[cryptoassets[historyItem.from].chain].fees.unit
            }`}
          </Text>
        </Box>
        {historyItem.status !== 'SUCCESS' && (
          <Pressable onPress={handleTransactionSpeedUp}>
            <Text variant="link">Speed Up</Text>
          </Pressable>
        )}
      </Box>
      {historyItem && <SendTransactionDetails historyItem={historyItem} />}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
  },
})

export default SendConfirmationScreen

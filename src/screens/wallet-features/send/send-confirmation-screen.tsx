import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, Pressable } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ChainId, chains, unitToCurrency } from '@liquality/cryptoassets'
import { assets as cryptoassets } from '@liquality/cryptoassets'
import {
  HistoryItem,
  SendHistoryItem,
  TransactionType,
} from '@liquality/wallet-core/dist/store/types'
import { AssetDataElementType, RootStackParamList } from '../../../types'
import SendTransactionDetails from '../../../components/send/send-transaction-details'
import ProgressCircle from '../../../components/animations/progress-circle'
import SuccessIcon from '../../../assets/icons/activity-status/completed.svg'
import { useAppSelector } from '../../../hooks'
import Text from '../../../theme/text'
import Box from '../../../theme/box'
import { fetchConfirmationByHash } from '../../../store/store'
import { formatDate } from '../../../utils'

type SendConfirmationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SendConfirmationScreen'
>

const SendConfirmationScreen: React.FC<SendConfirmationScreenProps> = ({
  route,
  navigation,
}) => {
  const transaction = route.params.sendTransactionConfirmation!
  const [historyItem, setHistoryItem] = useState<SendHistoryItem>()
  const { history = [], activeNetwork } = useAppSelector((state) => {
    const { activeNetwork, activeWalletId, history: historyObject } = state
    let historyItems: HistoryItem[] =
      historyObject?.[activeNetwork]?.[activeWalletId] || []
    return {
      history: historyItems,
      activeNetwork,
    }
  })

  const handleTransactionSpeedUp = () => {
    const { assetData } = route.params

    //console.log('ON PRESS')
    if (!assetData) {
      return
    }

    const { chain }: AssetDataElementType = assetData
    const isEIP1559Fees =
      chain === ChainId.Ethereum ||
      (chain === ChainId.Polygon && activeNetwork !== 'mainnet')

    navigation.navigate(
      isEIP1559Fees ? 'CustomFeeEIP1559Screen' : 'CustomFeeScreen',
      {
        assetData: assetData,
        screenTitle: 'NETWORK SPEED/FEE',
      },
    )
  }

  useEffect(() => {
    //console.log('Im in send-confirmation-screen.tsx!')
    const hash = transaction.hash || transaction.tx?.hash
    const historyItems = history.filter(
      (item) => item.type === TransactionType.Send && item.tx.hash === hash,
    )
    if (historyItems.length > 0) {
      const selectedHistoryItem = historyItems[0] as SendHistoryItem
      fetchConfirmationByHash(selectedHistoryItem.from, hash).then(
        (confirmations) => {
          selectedHistoryItem.tx.confirmations = confirmations
          setHistoryItem(selectedHistoryItem)
        },
      )
    }
  }, [history, transaction])

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
        {/*   {historyItem.status !== 'SUCCESS' && ( */}
        <Pressable onPress={handleTransactionSpeedUp}>
          <Text variant="link">Speed Up</Text>
        </Pressable>
        {/* )} */}
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

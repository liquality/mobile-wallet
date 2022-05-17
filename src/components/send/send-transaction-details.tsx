import { SendHistoryItem } from '@liquality/wallet-core/dist/store/types'
import React from 'react'
import { useAppSelector } from '../../hooks'
import Box from '../../theme/box'
import Text from '../../theme/text'
import { formatDate } from '../../utils'
import Label from '../ui/label'
import { StyleSheet, View } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import ConfirmationBlock from '../swap/confirmation-block'
import { EmptyBlock, Separator } from '../swap/swap-transaction-details'
import { getTransactionExplorerLink } from '@liquality/wallet-core/dist/utils/asset'

type SendTransactionDetailsProps = {
  historyItem: SendHistoryItem
}
const SendTransactionDetails: React.FC<SendTransactionDetailsProps> = (
  props,
): React.ReactElement => {
  const { historyItem } = props
  const { fiatRates } = useAppSelector((state) => ({
    fiatRates: state.fiatRates,
  }))

  if (!historyItem) {
    return (
      <Box justifyContent="space-between" paddingHorizontal="xl" marginTop="xl">
        <Text>Loading</Text>
      </Box>
    )
  }

  return (
    <Box justifyContent="space-between" paddingHorizontal="xl" marginTop="xl">
      <Box justifyContent="center" alignItems="center">
        <Text variant="timelineLabel">{formatDate(historyItem.startTime)}</Text>
        <Label text="Sent" variant="strong" />
      </Box>

      <Box
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        key={uuidv4()}>
        <ConfirmationBlock
          address={historyItem.toAddress}
          status="From"
          confirmations={historyItem.tx?.confirmations || 0}
          fee={historyItem.tx?.fee}
          asset={historyItem.from}
          fiatRates={fiatRates}
          url={getTransactionExplorerLink(
            historyItem.tx?.hash,
            historyItem.from,
            historyItem.network,
          )}
        />
        <Box
          justifyContent="flex-start"
          alignItems="center"
          width="4%"
          marginHorizontal="l">
          <View style={styles.start} />
          <Separator completed />
        </Box>
        <EmptyBlock />
      </Box>
      <Box
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        key={uuidv4()}>
        <ConfirmationBlock
          address={historyItem.toAddress}
          status="From"
          confirmations={historyItem.tx?.confirmations || 0}
          fee={historyItem.tx?.fee}
          asset={historyItem.from}
          fiatRates={fiatRates}
          url={getTransactionExplorerLink(
            historyItem.tx?.hash,
            historyItem.from,
            historyItem.network,
          )}
        />
        <Box
          justifyContent="flex-start"
          alignItems="center"
          width="4%"
          marginHorizontal="l">
          <View style={styles.start} />
          <Separator completed />
        </Box>
        <EmptyBlock />
      </Box>

      {['SUCCESS', 'REFUNDED'].includes(historyItem.status?.toUpperCase()) && (
        <Box justifyContent="center" alignItems="center">
          <Label text="Completed" variant="strong" />
          <Text variant="timelineLabel">
            {historyItem.endTime && formatDate(historyItem.endTime)}
          </Text>
        </Box>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  start: {
    width: 10,
    height: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#2CD2CF',
  },
})

export default SendTransactionDetails

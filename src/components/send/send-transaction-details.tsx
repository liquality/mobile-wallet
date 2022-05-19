import { SendHistoryItem } from '@liquality/wallet-core/dist/store/types'
import React, { memo } from 'react'
import { useAppSelector } from '../../hooks'
import Box from '../../theme/box'
import Text from '../../theme/text'
import { formatDate } from '../../utils'
import Label from '../ui/label'
import { v4 as uuidv4 } from 'uuid'
import ConfirmationBlock from '../swap/confirmation-block'
import { EmptyBlock, Separator, Step } from '../swap/swap-transaction-details'
import { getTransactionExplorerLink } from '@liquality/wallet-core/dist/utils/asset'
import { shortenAddress } from '@liquality/wallet-core/dist/utils/address'

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
      <Box flexDirection="row" justifyContent="center">
        <Text variant="timelineLabel">TRANSACTION ID</Text>
        <Text variant="link">{shortenAddress(historyItem.id)}</Text>
      </Box>

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
          address={historyItem.from}
          status={`From: ${shortenAddress(historyItem.tx._raw.from)}`}
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
          <Box
            width={10}
            height={1}
            borderStyle="solid"
            borderWidth={1}
            borderColor="progressDotColor"
          />
          <Separator completed={historyItem.status === 'SUCCESS'} />
          <Step completed={historyItem.status === 'SUCCESS'} />
        </Box>
        <EmptyBlock />
      </Box>
      <Box
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        key={uuidv4()}>
        <EmptyBlock />
        <Box
          justifyContent="flex-start"
          alignItems="center"
          width="4%"
          marginHorizontal="l">
          <Separator completed={historyItem.status === 'SUCCESS'} />
          <Step completed={historyItem.status === 'SUCCESS'} />
          <Separator completed={historyItem.status === 'SUCCESS'} />
          <Box
            width={10}
            height={1}
            borderStyle="solid"
            borderWidth={1}
            borderColor="progressDotColor"
          />
        </Box>
        <ConfirmationBlock
          address={historyItem.toAddress}
          status={`To: ${shortenAddress(historyItem.toAddress)}`}
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

export default memo(SendTransactionDetails)

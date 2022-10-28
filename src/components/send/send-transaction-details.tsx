import { SendHistoryItem } from '@liquality/wallet-core/dist/src/store/types'
import React, { memo } from 'react'
import { Text, Box } from '../../theme'
import { formatDate, labelTranslateFn } from '../../utils'
import { v4 as uuidv4 } from 'uuid'
import ConfirmationBlock from '../swap/confirmation-block'
import { Separator, Step } from '../swap/swap-transaction-details'
import { getTransactionExplorerLink } from '@liquality/wallet-core/dist/src/utils/asset'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
import { useRecoilValue } from 'recoil'
import { fiatRatesState, addressStateFamily } from '../../atoms'

type SendTransactionDetailsProps = {
  historyItem: SendHistoryItem
}
const SendTransactionDetails: React.FC<SendTransactionDetailsProps> = (
  props,
): React.ReactElement => {
  const { historyItem } = props
  const fiatRates = useRecoilValue(fiatRatesState)
  const address = useRecoilValue(addressStateFamily(historyItem.accountId))

  // Bitcoin send's historyItem props missing 'from' key
  // to avoid crash
  const fromAddress = historyItem.tx?.from?.toString() || address

  if (!historyItem) {
    return (
      <Box justifyContent="space-between" paddingHorizontal="xl" marginTop="xl">
        <Text>Loading</Text>
      </Box>
    )
  }

  return (
    <Box
      justifyContent="space-between"
      padding="xl"
      marginTop="xl"
      backgroundColor={'blockBackgroundColor'}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        marginBottom={'mxxl'}>
        <Text variant="timelineLabel" tx="sendTranDetailComp.transId" />
        <Box borderWidth={1} borderColor={'activeLink'} paddingHorizontal={'m'}>
          <Text variant="link">Link</Text>
        </Box>
      </Box>

      <Box flexDirection="row" alignItems="flex-start" key={uuidv4()}>
        <Box
          justifyContent="flex-start"
          alignItems="center"
          width="4%"
          marginHorizontal="l"
          paddingTop={'m'}>
          <Box
            width={15}
            height={1}
            borderStyle="solid"
            borderWidth={0.5}
            borderColor="greyBlack"
          />
          <Separator />
        </Box>
        <Box justifyContent="flex-start" alignItems="flex-start">
          <Text variant="amountLabel">{`${labelTranslateFn(
            'sendTranDetailComp.sent',
          )} ${formatDate(historyItem.startTime)}`}</Text>
        </Box>
      </Box>
      <Box flexDirection="row" alignItems="flex-start" key={uuidv4()}>
        <Box
          justifyContent="flex-start"
          alignItems="center"
          width="4%"
          marginHorizontal="l">
          <Step completed={historyItem.status === 'SUCCESS'} />
          <Separator />
        </Box>
        <ConfirmationBlock
          address={historyItem.from}
          status={`From: ${shortenAddress(fromAddress)}`}
          confirmations={historyItem.tx?.confirmations || 0}
          fee={historyItem.fee}
          asset={historyItem.from}
          fiatRate={historyItem.fiatRate}
          fiatRates={fiatRates}
          url={getTransactionExplorerLink(
            historyItem.tx?.hash,
            historyItem.from,
            historyItem.network,
          )}
        />
      </Box>
      <Box flexDirection="row" alignItems="stretch" key={uuidv4()}>
        <Box
          justifyContent="flex-start"
          alignItems="center"
          width="4%"
          marginHorizontal="l">
          <Step completed={historyItem.status === 'SUCCESS'} />
          <Separator />
          <Box
            width={15}
            height={1}
            borderStyle="solid"
            borderWidth={0.5}
            borderColor="greyBlack"
          />
        </Box>
        <Box justifyContent={'space-between'} alignContent={'space-between'}>
          <ConfirmationBlock
            address={historyItem.toAddress}
            status={`To: ${shortenAddress(historyItem.toAddress)}`}
            confirmations={historyItem.tx?.confirmations || 0}
            fee={historyItem.fee}
            asset={historyItem.from}
            fiatRates={fiatRates}
            url={getTransactionExplorerLink(
              historyItem.tx?.hash,
              historyItem.from,
              historyItem.network,
            )}
            fiatRate={historyItem.fiatRate}
          />
          {!historyItem.endTime && (
            <Text variant="amountLabel" lineHeight={21}>{`${labelTranslateFn(
              'sendTranDetailComp.completed',
            )} ${formatDate(historyItem.endTime)}`}</Text>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default memo(SendTransactionDetails)

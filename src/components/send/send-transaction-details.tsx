import { SendHistoryItem } from '@liquality/wallet-core/dist/src/store/types'
import React, { memo } from 'react'
import { Text, Box, palette, showCopyToast } from '../../theme'
import { formatDate, labelTranslateFn } from '../../utils'
import { v4 as uuidv4 } from 'uuid'
import { Separator, Step } from '../swap/swap-transaction-details'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
import { useRecoilValue } from 'recoil'
import { addressStateFamily } from '../../atoms'
import { Pressable } from 'react-native'
import { AppIcons } from '../../assets'
import Clipboard from '@react-native-clipboard/clipboard'
const { CopyIcon } = AppIcons

type SendTransactionDetailsProps = {
  historyItem: SendHistoryItem
}
const SendTransactionDetails: React.FC<SendTransactionDetailsProps> = (
  props,
): React.ReactElement => {
  const { historyItem } = props
  const address = useRecoilValue(addressStateFamily(historyItem.accountId))

  // Bitcoin send's historyItem props missing 'from' key
  // to avoid crash
  const fromAddress = historyItem.tx?.from?.toString() || address

  const handleCopyFromAddressPress = async () => {
    if (address) {
      Clipboard.setString(fromAddress)
      showCopyToast('copyToast', labelTranslateFn('receiveScreen.copied')!)
    }
  }

  const handleCopyToAddressPress = async () => {
    if (historyItem.tx?.to) {
      Clipboard.setString(historyItem.tx.to.toString())
      showCopyToast('copyToast', labelTranslateFn('receiveScreen.copied')!)
    }
  }

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
      <Text
        variant="timelineHeader"
        tx="sendTranDetailComp.transaction"
        marginBottom={'xl'}
      />
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
        <Box>
          <Text variant={'timelineLabel'}>From</Text>
          <Box flexDirection={'row'} alignItems={'center'}>
            <Text variant={'timelineSubLabel'}>
              {shortenAddress(fromAddress)}
            </Text>
            <Pressable onPress={handleCopyFromAddressPress}>
              <CopyIcon
                width={15}
                stroke={palette.blueVioletPrimary}
                strokeWidth={0.2}
              />
            </Pressable>
          </Box>
        </Box>
      </Box>
      <Box flexDirection="row" alignItems="stretch" key={uuidv4()}>
        <Box
          justifyContent="flex-start"
          alignItems="center"
          width="4%"
          marginHorizontal="l"
          paddingBottom={'m'}>
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
          <Box>
            <Text variant={'timelineLabel'}>To</Text>
            <Box flexDirection={'row'} alignItems={'center'}>
              <Text variant={'timelineSubLabel'}>
                {shortenAddress(historyItem.toAddress)}
              </Text>
              <Pressable onPress={handleCopyToAddressPress}>
                <CopyIcon
                  width={15}
                  strokeWidth={0.2}
                  stroke={palette.blueVioletPrimary}
                />
              </Pressable>
            </Box>
          </Box>
          {historyItem.endTime && (
            <Text variant="amountLabel" lineHeight={21}>{`${labelTranslateFn(
              'sendTranDetailComp.received',
            )} ${formatDate(historyItem.endTime)}`}</Text>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default memo(SendTransactionDetails)

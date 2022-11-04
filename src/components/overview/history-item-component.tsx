import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import { scale } from 'react-native-size-matters'
import { Box, Text, ThemeType } from '../../theme'
import { formatDate } from '../../utils'
import { BigNumber } from '@chainify/types'
import {
  HistoryItem,
  TransactionType,
} from '@liquality/wallet-core/dist/src/store/types'
import { networkState } from '../../atoms'
import { useRecoilValue } from 'recoil'
import { getAsset, unitToCurrency } from '@liquality/cryptoassets'
import { AppIcons } from '../../assets'
import { useTheme } from '@shopify/restyle'
import { getSwapProvider } from '@liquality/wallet-core/dist/src/factory/swap'
import { prettyFiatBalance } from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import ProgressCircle from '../../components/animations/progress-circle'

const {
  CompletedSwap,
  ChevronRightIcon,
  RefundedIcon,
  PendingSwap,
  SendIcon: Send,
  CompletedIcon: SuccessIcon,
} = AppIcons

type HistoryItemProps = {
  item: HistoryItem
  onPress: () => void
}

const HistoryItemComponent = (props: HistoryItemProps) => {
  const { item, onPress } = props
  const { type, startTime, from, to, status, network } = item

  const activeNetwork = useRecoilValue(networkState)
  const theme = useTheme<ThemeType>()

  let transactionLabel,
    amount,
    amountInUsd,
    totalSteps = 1,
    currentStep = 2
  if (item.type === TransactionType.Swap) {
    amount = unitToCurrency(
      getAsset(activeNetwork, from),
      new BigNumber(item.fromAmount),
    ).toNumber()
    amountInUsd = amount
    const swapProvider = getSwapProvider(network, item.provider)
    totalSteps = swapProvider.totalSteps
    currentStep = swapProvider.statuses[status].step + 1
  } else if (item.type === TransactionType.Send) {
    amount = unitToCurrency(
      getAsset(activeNetwork, from),
      new BigNumber(item.amount),
    ).toNumber()
    amountInUsd = prettyFiatBalance(amount, item.fiatRate)
  }

  if (type === TransactionType.Send) {
    transactionLabel = `Send ${from}`
  } else if (type === TransactionType.Swap) {
    transactionLabel = `${from} to ${to}`
  }

  const tapPaddingStyle = theme.spacing.m

  return (
    <Box height={scale(60)} flexDirection="row" alignItems={'center'}>
      {type === TransactionType.Swap ? (
        ['SUCCESS', 'REFUNDED'].includes(status) ? (
          <CompletedSwap width={23} height={24} />
        ) : (
          <PendingSwap width={23} height={24} />
        )
      ) : (
        <Send width={16} height={18} />
      )}
      <Box flex={1} alignItems={'center'}>
        <Box width={'90%'} alignItems={'center'}>
          <Box alignSelf="flex-start">
            <Text variant={'h6'} lineHeight={scale(20)} color="darkGrey">
              {transactionLabel}
            </Text>
          </Box>
          <Box flexDirection={'row'} alignSelf="flex-start">
            <Text variant={'h7'} lineHeight={scale(20)} color="greyMeta">
              {startTime && formatDate(startTime)}
            </Text>
            <Box
              width={1}
              marginHorizontal="m"
              height={scale(15)}
              backgroundColor="greyMeta"
            />
            <Box width={'35%'}>
              <Text
                variant={'h7'}
                lineHeight={scale(20)}
                color="greyMeta"
                numberOfLines={1}>
                {`$${amountInUsd}`}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box marginRight={'s'}>
        {status === 'REFUNDED' && <RefundedIcon width={28} height={28} />}
        {status === 'SUCCESS' && <SuccessIcon width={28} height={28} />}
        {!['SUCCESS', 'REFUNDED'].includes(status) && (
          <ProgressCircle
            radius={14}
            current={currentStep}
            total={totalSteps}
          />
        )}
      </Box>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={{ padding: tapPaddingStyle }}>
        <ChevronRightIcon />
      </TouchableOpacity>
    </Box>
  )
}

export default HistoryItemComponent

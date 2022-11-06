import { BigNumber } from '@liquality/types'
import { AccountType } from '../../types'
import React, { FC } from 'react'
import { View } from 'react-native'
import { getChain, getAsset, unitToCurrency } from '@liquality/cryptoassets'
import {
  cryptoToFiat,
  formatFiat,
  prettyFiatBalance,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { getSendFee } from '@liquality/wallet-core/dist/src/utils/fees'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../atoms'
import { Box, Text } from '../../theme'
import { scale } from 'react-native-size-matters'

type SwapReviewAssetSummaryProps = {
  type: 'SEND' | 'RECEIVE'
  amount: BigNumber
  asset: AccountType
  fiatRates: Record<string, number>
  networkFee: BigNumber
}

const Separator = ({ height = 15 }) => {
  return (
    <Box
      alignSelf={'flex-start'}
      width={1}
      marginHorizontal="m"
      height={scale(height)}
      backgroundColor="inactiveText"
    />
  )
}

const SwapReviewAssetSummary: FC<SwapReviewAssetSummaryProps> = (props) => {
  const { asset, fiatRates, networkFee, amount, type } = props
  const activeNetwork = useRecoilValue(networkState)

  return (
    <View>
      <Text variant={'speedUp'} color="darkGrey">
        {type}
      </Text>
      <Box flexDirection={'row'} alignItems="center">
        <Box flexShrink={0.1}>
          <Text
            variant={'reviewAmount'}
            color={'darkGrey'}
            numberOfLines={1}>{`${amount.dp(6)} ${asset.code}`}</Text>
        </Box>
        <Box
          width={1}
          marginHorizontal="m"
          height={scale(25)}
          backgroundColor="inactiveText"
        />
        <Box flexShrink={0.1}>
          <Text variant={'reviewAmount'} color={'darkGrey'} numberOfLines={1}>
            {amount &&
              `$${formatFiat(
                cryptoToFiat(
                  amount.toNumber(),
                  fiatRates[asset.code],
                ) as BigNumber,
              )}`}
          </Text>
        </Box>
      </Box>
      <Text
        variant={'transLink'}
        color="greyMeta"
        fontWeight={'400'}
        tx="swapRevAstSumComp.networkFee"
      />
      <Box flexDirection={'row'} alignItems="center">
        <Text
          variant={'h7'}
          lineHeight={scale(20)}
          color="greyBlack">{`~${networkFee.toNumber()} ${
          getChain(activeNetwork, getAsset(activeNetwork, asset.code)?.chain)
            .fees.unit
        }`}</Text>
        <Separator />
        <Text
          variant={'h7'}
          lineHeight={scale(20)}
          color="greyBlack">{`$${prettyFiatBalance(
          getSendFee(asset.code, networkFee.toNumber()).toNumber(),
          fiatRates[asset.code],
        ).toString()}`}</Text>
      </Box>
      <Text
        variant={'transLink'}
        color="greyMeta"
        fontWeight={'400'}
        tx="swapRevAstSumComp.amtFee"
      />
      <Box flexDirection={'row'}>
        <Box flexShrink={0.1}>
          <Text
            variant={'h7'}
            lineHeight={scale(20)}
            numberOfLines={1}
            color="greyBlack">{`~${amount
            .plus(
              unitToCurrency(
                getAsset(activeNetwork, asset.code),
                networkFee.toNumber(),
              ),
            )
            .dp(6)} ${asset.code}`}</Text>
        </Box>
        <Separator />
        <Box flexShrink={0.1}>
          <Text
            numberOfLines={1}
            variant={'h7'}
            lineHeight={scale(20)}
            color="greyBlack">{`$${formatFiat(
            cryptoToFiat(
              amount
                .plus(getSendFee(asset.code, networkFee.toNumber()))
                .toNumber(),
              fiatRates[asset.code],
            ) as BigNumber,
          )}`}</Text>
        </Box>
      </Box>
    </View>
  )
}

export default SwapReviewAssetSummary

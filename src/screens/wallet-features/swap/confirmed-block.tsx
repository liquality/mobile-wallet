import * as React from 'react'
import { Linking, TouchableOpacity } from 'react-native'
import { Box, faceliftPalette, Text, showCopyToast } from '../../../theme'
import {
  dpUI,
  prettyFiatBalance,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { getSendFee } from '@liquality/wallet-core/dist/src/utils/fees'
import Clipboard from '@react-native-clipboard/clipboard'
import { AppIcons } from '../../../assets'
import { labelTranslateFn } from '../../../utils'

const { CopyIcon } = AppIcons

type ConfirmedBlockProps = {
  address?: string
  status: string
  fee?: number
  confirmations: number
  asset: string
  fiatRates: any['fiatRates']
  url: string
  fiatRate: number
  txHash?: string
}

const ConfirmedBlock = ({
  status,
  txHash,
  fiatRates,
  fiatRate,
  fee,
  asset,
  url,
  address,
  confirmations,
}: ConfirmedBlockProps) => {
  const handleCopyAddressPress = async () => {
    if (address) {
      showCopyToast('copyToast', labelTranslateFn('receiveScreen.copied')!)
      Clipboard.setString(address)
    }
  }

  const handleLinkPress = () => {
    Linking.canOpenURL(url).then((canOpen) => {
      if (canOpen) Linking.openURL(url)
    })
  }

  const formatFeeAmountAndFiat = () => {
    if (fiatRates && fee && asset) {
      return {
        amount: dpUI(getSendFee(asset, fee), 9),
        fiat: prettyFiatBalance(getSendFee(asset, fee).toNumber(), fiatRate),
      }
    }
  }
  let displayFormattedFee = formatFeeAmountAndFiat()

  return (
    <Box marginLeft={'xl'}>
      <Box flexDirection={'row'}>
        <TouchableOpacity activeOpacity={0.7} onPress={handleLinkPress}>
          <Text marginRight={'m'} variant={'transLink'} color="link">
            {status}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={handleCopyAddressPress}>
          <CopyIcon stroke={faceliftPalette.linkTextColor} />
        </TouchableOpacity>
      </Box>
      {txHash ? (
        <>
          <Box flexDirection={'row'}>
            <Text
              variant={'subListText'}
              color="darkGrey"
              tx="confirmationBlockComp.fee"
              marginRight={'s'}
            />
            <Text variant={'subListText'} color="darkGrey">
              {fiatRates && fee && asset
                ? `${displayFormattedFee?.amount} ${asset} / $${displayFormattedFee?.fiat}`
                : ''}
            </Text>
          </Box>
          <Box flexDirection={'row'}>
            <Text
              variant={'subListText'}
              color="darkGrey"
              tx="confirmationBlockComp.confirmations"
            />
            <Text
              variant={'subListText'}
              color="darkGrey"
              tx="confirmationBlockComp.confirmations">
              {confirmations}
            </Text>
          </Box>
        </>
      ) : null}
    </Box>
  )
}

export default ConfirmedBlock

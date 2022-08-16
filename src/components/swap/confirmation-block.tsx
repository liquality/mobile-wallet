import React from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import { Linking, Pressable, StyleSheet } from 'react-native'
import Box from '../../theme/box'
import Text from '../../theme/text'
import {
  dpUI,
  prettyFiatBalance,
} from '@liquality/wallet-core/dist/utils/coinFormatter'

import CopyIcon from '../../assets/icons/copy.svg'
import { getSendFee } from '@liquality/wallet-core/dist/utils/fees'

type ConfirmationBlockProps = {
  address?: string
  status: string
  fee?: number
  confirmations: number
  asset: string
  fiatRates: any['fiatRates']
  url: string
  fiatRate: number
}

const ConfirmationBlock: React.FC<ConfirmationBlockProps> = (
  props,
): React.ReactElement => {
  const {
    address,
    status,
    fee,
    confirmations,
    asset,
    fiatRates,
    url,
    fiatRate,
  } = props

  const handleCopyAddressPress = async () => {
    if (address) {
      Clipboard.setString(address)
    }
    // setButtonPressed(true)
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
    <Box width={'45%'} paddingVertical="s">
      <Box flexDirection="row" justifyContent="center" alignItems="center">
        <Pressable onPress={handleLinkPress}>
          <Text variant="boldLink">{status}</Text>
        </Pressable>
        <Pressable style={styles.copyBtn} onPress={handleCopyAddressPress}>
          <CopyIcon width={10} stroke={'#9D4DFA'} />
        </Pressable>
      </Box>
      <Box flexDirection="row" justifyContent="center" alignItems="center">
        <Text variant="timelineLabel" tx="confirmationBlockComp.fee" />
        <Text variant="amount">
          {fiatRates && fee && asset
            ? `${displayFormattedFee?.amount} ${asset} / $${displayFormattedFee?.fiat}`
            : null}
        </Text>
      </Box>
      <Box flexDirection="row" justifyContent="center" alignItems="center">
        <Text
          variant="timelineLabel"
          tx="confirmationBlockComp.confirmations"
        />
        <Text variant="amount">{confirmations} </Text>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  copyBtn: {
    marginLeft: 5,
  },
})

export default ConfirmationBlock

import React from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import { Linking, Pressable, StyleSheet } from 'react-native'
import Box from '../../theme/box'
import Text from '../../theme/text'
import {
  prettyBalance,
  prettyFiatBalance,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { getNativeAsset } from '@liquality/wallet-core/dist/src/utils/asset'
import { unitToCurrency, assets as cryptoassets } from '@liquality/cryptoassets'
import CopyIcon from '../../assets/icons/copy.svg'

type ConfirmationBlockProps = {
  address?: string
  status: string
  fee?: number
  confirmations: number
  asset: string
  fiatRates: any['fiatRates']
  url: string
}

const ConfirmationBlock: React.FC<ConfirmationBlockProps> = (
  props,
): React.ReactElement => {
  const { address, status, fee, confirmations, asset, fiatRates, url } = props

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
          {fiatRates &&
            fee &&
            asset &&
            `${prettyBalance(fee, asset)} ${getNativeAsset(
              asset,
            )}/ $${prettyFiatBalance(
              unitToCurrency(cryptoassets[getNativeAsset(asset)], fee),
              fiatRates[getNativeAsset(asset)],
            )}`}
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

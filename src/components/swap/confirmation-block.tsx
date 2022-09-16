import React, { useCallback } from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import { Linking, Pressable, StyleSheet } from 'react-native'
import Box from '../../theme/box'
import Text from '../../theme/text'
import {
  dpUI,
  prettyFiatBalance,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { getSendFee } from '@liquality/wallet-core/dist/src/utils/fees'
import { FADE_IN_OUT_DURATION } from '../../utils'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
import Card from '../../theme/card'
import GestureDetector from '../gesture-detector/gesture-detector'
import { useRecoilState } from 'recoil'
import {
  swapScreenDoubleLongEvent as SSDLE,
  SwapScreenPopUpTypes,
} from '../../atoms'
import { AppIcons } from '../../assets'

const { CopyIcon } = AppIcons

type ConfirmationsPopUpCardProps = {
  txId: string
}

const ConfirmPopUpCard = ({ txId }: ConfirmationsPopUpCardProps) => {
  return (
    <Animated.View
      key={'networkSpeedFeePopUp'}
      entering={FadeIn.duration(FADE_IN_OUT_DURATION)}
      exiting={FadeOut.duration(FADE_IN_OUT_DURATION)}>
      <Card
        justifyContent={'center'}
        variant={'swapPopup'}
        flex={1}
        paddingHorizontal="s"
        alignItems={'center'}
        height={60}>
        <Text color="tertiaryForeground" tx="txId" />
        <Text color="tertiaryForeground">{shortenAddress(txId)}</Text>
      </Card>
    </Animated.View>
  )
}

type ConfirmationBlockProps = {
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
    txHash = '',
  } = props
  const [swapScreenPopTypes, setSwapScreenPopTypes] = useRecoilState(SSDLE)

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

  const onDoubleTapOrLongPress = useCallback(() => {
    setSwapScreenPopTypes(SwapScreenPopUpTypes.TransId)
    setTimeout(() => {
      setSwapScreenPopTypes(SwapScreenPopUpTypes.Null)
    }, 3000)
  }, [setSwapScreenPopTypes])

  let displayFormattedFee = formatFeeAmountAndFiat()

  const renderFeeConfirmationView = useCallback(() => {
    return (
      <>
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
      </>
    )
  }, [
    asset,
    confirmations,
    displayFormattedFee?.amount,
    displayFormattedFee?.fiat,
    fee,
    fiatRates,
  ])

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
      {txHash ? (
        <>
          <GestureDetector doubleOrLongPress={onDoubleTapOrLongPress}>
            <Box>{renderFeeConfirmationView()}</Box>
          </GestureDetector>
          {SwapScreenPopUpTypes.TransId === swapScreenPopTypes ? (
            <Box position={'absolute'} left={10} right={0} top={-60}>
              <ConfirmPopUpCard txId={txHash} />
            </Box>
          ) : null}
        </>
      ) : (
        renderFeeConfirmationView()
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  copyBtn: {
    marginLeft: 5,
  },
})

export default ConfirmationBlock

import { BigNumber } from '@liquality/types'
import { AccountType } from '../../types'
import React, { FC, useState } from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import Label from '../ui/label'
import { chainDefaultColors } from '../../core/config'
import {
  assets as cryptoassets,
  chains,
  unitToCurrency,
} from '@liquality/cryptoassets'
import {
  cryptoToFiat,
  formatFiat,
  prettyFiatBalance,
} from '@liquality/wallet-core/dist/utils/coinFormatter'
import { getSendFee } from '@liquality/wallet-core/src/utils/fees'
import CopyIcon from '../../assets/icons/copy.svg'
import CheckIcon from '../../assets/icons/swap-check.svg'
import { useRecoilValue } from 'recoil'
import { addressStateFamily } from '../../atoms'

type SwapReviewAssetSummaryProps = {
  type: 'SEND' | 'RECEIVE'
  amount: BigNumber
  asset: AccountType
  fiatRates: Record<string, number>
  networkFee: BigNumber
}

const SwapReviewAssetSummary: FC<SwapReviewAssetSummaryProps> = (props) => {
  const { asset, fiatRates, networkFee, amount, type } = props
  const [isCopied, setIsCopied] = useState(false)
  const address = useRecoilValue(addressStateFamily(asset.id))

  const handleCopyPress = () => {
    if (address) {
      Clipboard.setString(address)
      setIsCopied(true)
    } else {
      Alert.alert('Unable to copy address')
    }
  }

  return (
    <View>
      <Label text={type} variant="strong" />
      <View style={styles.row}>
        <Text
          style={[
            styles.font,
            styles.mainAmount,
            {
              color: chainDefaultColors[cryptoassets[asset.code]?.chain],
            },
          ]}>
          {`${amount} ${asset.code}`}
        </Text>
        <Text style={[styles.font, styles.amount]}>
          {amount &&
            `$${formatFiat(
              cryptoToFiat(
                amount.toNumber(),
                fiatRates[asset.code],
              ) as BigNumber,
            )}`}
        </Text>
      </View>
      <Label text="NETWORK FEE" variant="light" />
      <View style={styles.row}>
        <Text style={[styles.font, styles.amount]}>{`${networkFee.toNumber()} ${
          chains[cryptoassets[asset.code].chain].fees.unit
        }`}</Text>
        <Text style={[styles.font, styles.amount]}>{`${prettyFiatBalance(
          getSendFee(asset.code, networkFee.toNumber()).toNumber(),
          fiatRates[asset.code],
        ).toString()}`}</Text>
      </View>
      <Label text="AMOUNT + FEES" variant="light" />
      <View style={styles.row}>
        <Text style={[styles.font, styles.amountStrong]}>{`${amount.plus(
          unitToCurrency(cryptoassets[asset.code], networkFee.toNumber()),
        )} ${asset.code}`}</Text>
        <Text style={[styles.font, styles.amountStrong]}>{`$${formatFiat(
          cryptoToFiat(
            amount
              .plus(getSendFee(asset.code, networkFee.toNumber()))
              .toNumber(),
            fiatRates[asset.code],
          ) as BigNumber,
        )}`}</Text>
      </View>
      <Label
        text={type === 'SEND' ? 'SEND FROM' : 'RECEIVED AT'}
        variant="light"
      />
      <View style={styles.box}>
        <Text style={[styles.font, styles.address]}>
          External Wallet -{' '}
          {`${address?.substring(0, 4)}...${address?.substring(
            address?.length - 4,
          )}`}
        </Text>
        <Pressable onPress={handleCopyPress}>
          {isCopied ? (
            <CheckIcon
              width={15}
              height={15}
              stroke={'#9D4DFA'}
              style={styles.icon}
            />
          ) : (
            <CopyIcon width={10} stroke={'#9D4DFA'} />
          )}
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'Montserrat-Regular',
  },
  mainAmount: {
    fontWeight: '300',
    fontSize: 28,
    lineHeight: 42,
  },
  amount: {
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 24,
  },
  amountStrong: {
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 18,
  },
  address: {
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  icon: {
    marginVertical: 5,
    marginHorizontal: 5,
  },
})

export default SwapReviewAssetSummary

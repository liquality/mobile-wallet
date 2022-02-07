import { BigNumber } from '@liquality/types'
import { AssetDataElementType } from '../../types'
import React, { FC, useState } from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Label from '../ui/label'
import { chainDefaultColors } from '../../core/config'
import {
  assets as cryptoassets,
  chains,
  unitToCurrency,
} from '@liquality/cryptoassets'
import { cryptoToFiat, formatFiat } from '../../core/utils/coin-formatter'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheck, faClone } from '@fortawesome/pro-light-svg-icons'

type SwapReviewAssetSummaryProps = {
  type: 'SEND' | 'RECEIVE'
  amount: BigNumber
  asset: AssetDataElementType
  fiatRates: Record<string, number>
  networkFee: BigNumber
}

const SwapReviewAssetSummary: FC<SwapReviewAssetSummaryProps> = (props) => {
  const { asset, fiatRates, networkFee, amount, type } = props
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyPress = () => {
    if (asset.address) {
      Clipboard.setString(asset.address)
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
              cryptoToFiat(amount.toNumber(), fiatRates[asset.code]),
            )}`}
        </Text>
      </View>
      <Label text="NETWORK FEE" variant="light" />
      <View style={styles.row}>
        <Text style={[styles.font, styles.amount]}>{`${networkFee} ${
          chains[cryptoassets[asset.code].chain].fees.unit
        }`}</Text>
        <Text style={[styles.font, styles.amount]}>{`$${formatFiat(
          cryptoToFiat(networkFee.toNumber(), fiatRates[asset.code]),
        )}`}</Text>
      </View>
      <Label text="AMOUNT + FEES" variant="light" />
      <View style={styles.row}>
        <Text style={[styles.font, styles.amountStrong]}>{`${amount.plus(
          unitToCurrency(cryptoassets[asset.code], networkFee.toNumber()),
        )} ${asset.code}`}</Text>
        <Text style={[styles.font, styles.amountStrong]}>{`$${formatFiat(
          cryptoToFiat(
            amount
              .plus(
                unitToCurrency(cryptoassets[asset.code], networkFee.toNumber()),
              )
              .toNumber(),
            fiatRates[asset.code],
          ),
        )}`}</Text>
      </View>
      <Label
        text={type === 'SEND' ? 'SEND FROM' : 'RECEIVED AT'}
        variant="light"
      />
      <View style={styles.box}>
        <Text style={[styles.font, styles.address]}>
          External Wallet -{' '}
          {`${asset.address?.substring(0, 4)}...${asset.address?.substring(
            asset.address?.length - 4,
          )}`}
        </Text>
        <Pressable onPress={handleCopyPress}>
          <FontAwesomeIcon
            icon={isCopied ? faCheck : faClone}
            size={10}
            color={'#9D4DFA'}
            style={styles.icon}
          />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('screen').width,
    backgroundColor: '#FFF',
  },
  scrollView: {
    padding: 20,
  },
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
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icon: {
    marginVertical: 5,
    marginHorizontal: 5,
  },
})

export default SwapReviewAssetSummary

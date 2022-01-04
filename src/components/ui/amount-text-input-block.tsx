import React, {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useAppSelector, useInputState } from '../../hooks'
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native'
import LiqualityButton from './button'
import AssetIcon from '../asset-icon'
import { ChainId } from '@liquality/cryptoassets/src/types'
import Label from './label'
import { chainDefaultColors } from '../../core/config'
import { BigNumber } from '@liquality/types'
import {
  cryptoToFiat,
  fiatToCrypto,
  formatFiat,
} from '../../core/utils/coin-formatter'

type AmountTextInputBlockProps = {
  label: string
  chain: ChainId
  assetSymbol: string
  amountRef: MutableRefObject<BigNumber>
  maximumValue?: BigNumber
  minimumValue?: BigNumber
}

const AmountTextInputBlock: FC<AmountTextInputBlockProps> = (props) => {
  const { label, assetSymbol, chain, maximumValue, minimumValue, amountRef } =
    props
  const { fiatRates } = useAppSelector((state) => ({
    fiatRates: state.fiatRates,
  }))
  const input = useInputState('0')
  const color = chainDefaultColors[chain]
  const [isAmountNative, setIsAmountNative] = useState<boolean>(true)

  const handleToggleAmount = () => {
    if (isAmountNative) {
      handleTextChange(
        cryptoToFiat(
          new BigNumber(input.value).toNumber(),
          fiatRates?.[assetSymbol] || 0,
        ).toString(),
      )
    } else {
      handleTextChange(
        fiatToCrypto(
          new BigNumber(input.value),
          fiatRates?.[assetSymbol] || 0,
        ).toString(),
      )
    }
    setIsAmountNative(!isAmountNative)
  }

  const handleTextChange = useCallback(
    (text: string) => {
      if (isAmountNative) {
        amountRef.current = new BigNumber(text)
      } else {
        amountRef.current = fiatToCrypto(
          new BigNumber(text),
          fiatRates?.[assetSymbol] || 0,
        )
      }

      input.onChangeText(text)
    },
    [amountRef, assetSymbol, fiatRates, input, isAmountNative],
  )

  useEffect(() => {
    if (maximumValue && maximumValue.gt(0)) {
      handleTextChange(maximumValue.toString())
    } else if (minimumValue && minimumValue.gt(0)) {
      handleTextChange(minimumValue.toString())
    }
  }, [handleTextChange, maximumValue, minimumValue])

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.md3]}>
        <Label text={label} variant="strong" />
        <LiqualityButton
          text={
            isAmountNative
              ? `$${formatFiat(
                  cryptoToFiat(
                    new BigNumber(input.value).toNumber(),
                    fiatRates?.[assetSymbol] || 0,
                  ),
                )}`
              : `${fiatToCrypto(
                  new BigNumber(input.value),
                  fiatRates?.[assetSymbol] || 0,
                )} ${assetSymbol}`
          }
          action={handleToggleAmount}
          variant="small"
          type="plain"
          contentType="numeric"
        />
      </View>
      <View style={styles.row}>
        <View style={[styles.inputWrapper, styles.md3]}>
          <TextInput
            style={[styles.font, styles.input, { color }]}
            keyboardType={'numeric'}
            onChangeText={handleTextChange}
            value={input.value}
            placeholder={'0'}
            autoCorrect={false}
            returnKeyType="done"
          />
        </View>
        <AssetIcon asset={assetSymbol} chain={chain} />
        <Text style={[styles.font, styles.description]}>{assetSymbol}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width - 40 - 25,
    marginVertical: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  md3: {
    width: '75%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
    marginRight: 5,
  },
  font: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
  },
  input: {
    fontSize: 25,
    textAlign: 'right',
    lineHeight: 30,
    height: 35,
    width: '100%',
    color: '#EAB300',
  },
  description: {
    fontSize: 25,
    color: '#1D1E21',
    lineHeight: 25,
    height: 24,
    textAlign: 'left',
  },
  amount: {
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 18,
  },
})

export default AmountTextInputBlock

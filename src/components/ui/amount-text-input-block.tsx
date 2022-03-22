import React, { FC, useCallback, useEffect, useState } from 'react'
import { useAppSelector, useInputState } from '../../hooks'
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native'
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
import { SwapEventType } from '../../screens/wallet-features/swap/swap-screen'
import Button from '../../theme/button'

type AmountTextInputBlockProps = {
  type: 'FROM' | 'TO'
  label: string
  chain: ChainId
  assetSymbol: string
  maximumValue?: BigNumber
  minimumValue?: BigNumber
  defaultAmount?: BigNumber
  dispatch?: React.Dispatch<{
    payload: SwapEventType
    type: string
  }>
}

const AmountTextInputBlock: FC<AmountTextInputBlockProps> = (props) => {
  const {
    label,
    assetSymbol,
    chain,
    maximumValue,
    minimumValue,
    dispatch,
    type,
  } = props
  const { fiatRates } = useAppSelector((state) => ({
    fiatRates: state.fiatRates,
  }))
  const { value, onChangeText } = useInputState('0')
  const color = chainDefaultColors[chain]
  const [isAmountNative, setIsAmountNative] = useState<boolean>(true)

  const handleToggleAmount = () => {
    if (isAmountNative) {
      handleTextChange(
        cryptoToFiat(
          new BigNumber(value).toNumber(),
          fiatRates?.[assetSymbol] || 0,
        ).toString(),
      )
    } else {
      handleTextChange(
        fiatToCrypto(
          new BigNumber(value),
          fiatRates?.[assetSymbol] || 0,
        ).toString(),
      )
    }
    setIsAmountNative(!isAmountNative)
  }

  const updateAmount = useCallback(
    (text: string): BigNumber => {
      let newAmount = new BigNumber(text)
      if (!isAmountNative) {
        newAmount = fiatToCrypto(
          new BigNumber(text),
          fiatRates?.[assetSymbol] || 0,
        )
      }

      if (dispatch) {
        dispatch({
          type: type === 'TO' ? 'TO_AMOUNT_UPDATED' : 'FROM_AMOUNT_UPDATED',
          payload: {
            [type === 'TO' ? 'toAmount' : 'fromAmount']: newAmount,
          },
        })
      }
      return newAmount
    },
    [assetSymbol, fiatRates, isAmountNative, dispatch, type],
  )

  const handleTextChange = useCallback(
    (text: string) => {
      onChangeText(text)
      updateAmount(text)
    },
    [onChangeText, updateAmount],
  )

  useEffect(() => {
    if (maximumValue && maximumValue.gt(0)) {
      updateAmount(maximumValue.toString())
      onChangeText(maximumValue.toString())
    } else if (minimumValue && minimumValue.gt(0)) {
      updateAmount(minimumValue.toString())
      onChangeText(minimumValue.toString())
    }
  }, [onChangeText, maximumValue, minimumValue, updateAmount])

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.md3]}>
        <Label text={label} variant="strong" />
        <Button
          type="tertiary"
          variant="s"
          label={
            isAmountNative
              ? `$${formatFiat(
                  cryptoToFiat(
                    new BigNumber(value).toNumber(),
                    fiatRates?.[assetSymbol] || 0,
                  ),
                )}`
              : `${fiatToCrypto(
                  new BigNumber(value),
                  fiatRates?.[assetSymbol] || 0,
                )} ${assetSymbol}`
          }
          onPress={handleToggleAmount}
          isBorderless={false}
          isActive={true}
        />
      </View>
      <View style={styles.row}>
        <View style={[styles.inputWrapper, styles.md3]}>
          <TextInput
            style={[styles.font, styles.input, { color }]}
            keyboardType={'numeric'}
            onChangeText={handleTextChange}
            value={value}
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
})

export default AmountTextInputBlock

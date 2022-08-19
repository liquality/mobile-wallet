import React, {
  ForwardRefRenderFunction,
  useCallback,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { useInputState } from '../../hooks'
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native'
import AssetIcon from '../asset-icon'
import { ChainId } from '@liquality/cryptoassets/dist/src/types'
import Label from './label'
import { chainDefaultColors } from '../../core/config'
import { BigNumber } from '@liquality/types'
import {
  cryptoToFiat,
  fiatToCrypto,
  formatFiat,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import {
  SwapEventActionKind,
  SwapEventAction,
} from '../../screens/wallet-features/swap/swap-screen'
import Button from '../../theme/button'
import { useRecoilValue } from 'recoil'
import { fiatRatesState } from '../../atoms'

type AmountTextInputBlockProps = {
  type: 'FROM' | 'TO'
  label: string
  chain: ChainId
  assetSymbol: string
  maximumValue?: BigNumber
  minimumValue?: BigNumber
  defaultAmount?: BigNumber
  dispatch?: React.Dispatch<SwapEventAction>
}

type AmountTextInputHandle = {
  setAfterDispatch: (text: string) => void
}

const AmountTextInputBlock: ForwardRefRenderFunction<
  AmountTextInputHandle,
  AmountTextInputBlockProps
> = (props, forwardedRef) => {
  const { label, assetSymbol, chain, defaultAmount, dispatch, type } = props
  const fiatRates = useRecoilValue(fiatRatesState)
  const { value, onChangeText } = useInputState(
    defaultAmount?.toString() || '0',
  )
  const color = chainDefaultColors[chain]
  const [isAmountNative, setIsAmountNative] = useState<boolean>(true)
  const textInputRef = useRef<TextInput>(null)

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
    (text: string, skipDispatch: boolean): BigNumber => {
      let newAmount = new BigNumber(text)
      if (!isAmountNative) {
        newAmount = fiatToCrypto(
          new BigNumber(text),
          fiatRates?.[assetSymbol] || 0,
        ) as BigNumber
      }

      if (dispatch && !skipDispatch) {
        if (type === 'TO') {
          dispatch({
            type: SwapEventActionKind.ToAmountUpdated,
            payload: { toAmount: newAmount },
          })
        } else {
          dispatch({
            type: SwapEventActionKind.FromAmountUpdated,
            payload: { fromAmount: newAmount },
          })
        }
      }
      return newAmount
    },
    [assetSymbol, fiatRates, isAmountNative, dispatch, type],
  )

  useImperativeHandle(forwardedRef, () => ({
    setAfterDispatch: (text) => {
      onChangeText(text)
    },
  }))

  const handleTextChange = useCallback(
    (text: string) => {
      // avoid more than one decimal points and only number are allowed
      const validated = text.match(/^(\d*\.{0,1}\d{0,20}$)/)
      if (validated) {
        onChangeText(text)
        updateAmount(text, false)
      }
    },
    [onChangeText, updateAmount],
  )

  // Avoid NaN if user enters only decimal points
  let formattedValue = value
  if (value.length === 1 && value === '.') {
    formattedValue = '0'
  }

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
                    new BigNumber(formattedValue || 0),
                    fiatRates?.[assetSymbol] || 0,
                  ) as BigNumber,
                )}`
              : `${fiatToCrypto(
                  new BigNumber(formattedValue || 0),
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
            value={formattedValue}
            placeholder={'0'}
            autoCorrect={false}
            returnKeyType="done"
            ref={textInputRef}
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
    paddingBottom: 0,
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

export default forwardRef(AmountTextInputBlock)

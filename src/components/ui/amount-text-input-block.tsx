import React, { FC } from 'react'
import { useInputState } from '../../hooks'
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native'
import LiqualityButton from './button'
import AssetIcon from '../asset-icon'
import { ChainId } from '@liquality/cryptoassets/src/types'
import Label from './label'
import { chainDefaultColors } from '../../core/config'
import { BigNumber } from '@liquality/types'

type AmountTextInputBlockProps = {
  label: string
  chain: ChainId
  assetSymbol: string
  setAmountInFiat: React.Dispatch<React.SetStateAction<BigNumber>>
  setAmountInNative: React.Dispatch<React.SetStateAction<BigNumber>>
}

const AmountTextInputBlock: FC<AmountTextInputBlockProps> = (props) => {
  const { label, assetSymbol, chain, setAmountInNative, setAmountInFiat } =
    props
  const input = useInputState('')
  const color = chainDefaultColors[chain]

  const handleEndEditing = () => {
    setAmountInFiat(new BigNumber(input.value))
    setAmountInNative(new BigNumber(input.value))
  }

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.md3]}>
        <Label text={label} variant="strong" />
        <LiqualityButton
          text={'0.00'}
          action={() => ({})}
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
            onChangeText={input.onChangeText}
            onEndEditing={handleEndEditing}
            value={input.value}
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

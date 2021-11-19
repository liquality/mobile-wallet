import React, { FC } from 'react'
import { useInputState } from '../../hooks'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import LiqualityButton from '../button'
import AssetIcon from '../asset-icon'
import { ChainId } from '@liquality/cryptoassets/src/types'

type AmountTextInputBlockProps = {
  label: string
  chain: ChainId
  assetSymbol: string
  setAmountInFiat: (...args: unknown[]) => void
  setAmountInNative: (...args: unknown[]) => void
}

const AmountTextInputBlock: FC<AmountTextInputBlockProps> = (props) => {
  const { label, assetSymbol, chain, setAmountInNative, setAmountInFiat } =
    props
  const input = useInputState('')

  const handleEndEditing = () => {
    setAmountInFiat(input.value)
    setAmountInNative(input.value)
  }

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.md3]}>
        <Text style={[styles.font, styles.label]}>{label}</Text>
        <LiqualityButton
          text={'0.00'}
          action={() => ({})}
          variant="small"
          type="plain"
        />
      </View>
      <View style={styles.row}>
        <View style={[styles.inputWrapper, styles.md3]}>
          <TextInput
            style={[styles.font, styles.input]}
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
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
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
    fontWeight: '300',
  },
  input: {
    fontSize: 28,
    textAlign: 'right',
    lineHeight: 40,
    height: 40,
    width: '100%',
    color: '#EAB300',
  },
  description: {
    fontSize: 24,
    color: '#1D1E21',
    lineHeight: 24,
    height: 24,
    textAlign: 'left',
  },
  label: {
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
    color: '#1D1E21',
  },
  amount: {
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 18,
  },
})

export default AmountTextInputBlock

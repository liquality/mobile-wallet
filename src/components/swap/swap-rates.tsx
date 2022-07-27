import React, { FC, useEffect, useState } from 'react'
import {
  Modal,
  StyleSheet,
  View,
  FlatList,
  Pressable,
  Alert,
  StyleProp,
  ViewStyle,
} from 'react-native'
import Logo from '../../assets/icons/infinity.svg'
import LiqualityBoost from '../../assets/icons/swap-providers/liqualityboost.svg'
import Sovryn from '../../assets/icons/swap-providers/sovryn.svg'
import Thorchain from '../../assets/icons/swap-providers/thorchain.svg'
import SwapTypesInfo from './swap-types-info'
import Button from '../../theme/button'
import { dpUI } from '@liquality/wallet-core/dist/utils/coinFormatter'
import Box from '../../theme/box'
import Text from '../../theme/text'
import ListHeader from './list-header'
import { SwapQuote } from '@liquality/wallet-core/dist/swaps/types'
import { capitalizeFirstLetter, labelTranslateFn } from '../../utils'
import { calculateQuoteRate } from '@liquality/wallet-core/dist/utils/quotes'
import TimesIcon from '../../assets/icons/times.svg'
import CheckIcon from '../../assets/icons/swap-check.svg'

type SwapRatesProps = {
  fromAsset: string
  toAsset: string
  quotes: any[]
  selectedQuote: any
  selectQuote: (quote: any) => void
  clickable: boolean
  style?: StyleProp<ViewStyle>
}

const SwapRates: FC<SwapRatesProps> = (props) => {
  const {
    selectQuote,
    style,
    quotes,
    selectedQuote,
    fromAsset,
    toAsset,
    clickable,
  } = props
  const [selectedItem, setSelectedItem] = useState<SwapQuote>(selectedQuote)
  const [isRatesModalVisible, setIsRatesModalVisible] = useState(false)
  const [isSwapTypesModalVisible, setIsSwapTypesModalVisible] = useState(false)

  const getSwapProviderIcon = (marketQuotes: SwapQuote): React.ReactElement => {
    switch (marketQuotes.provider) {
      case 'liquality':
        return <Logo width={15} height={15} style={styles.icon} />
      case 'liqualityboost':
        return <LiqualityBoost width={15} height={15} style={styles.icon} />
      case 'sovryn':
        return <Sovryn width={15} height={15} style={styles.icon} />
      case 'thorchain':
        return <Thorchain width={15} height={15} style={styles.icon} />
      default:
        return <Logo width={15} height={15} style={styles.icon} />
    }
  }

  const handleSelectQuote = () => {
    if (selectedItem) {
      selectQuote(selectedItem)
      setIsRatesModalVisible(false)
    } else {
      Alert.alert(labelTranslateFn('swapRatesComp.selectQuoteFirst')!)
    }
  }

  useEffect(() => {
    setSelectedItem(selectedQuote)
  }, [selectedQuote])

  const renderItem = ({ item }: { item: any }) => {
    return (
      <Pressable
        style={[
          styles.listRow,
          selectedItem?.provider === item.provider && styles.selected,
        ]}
        key={item.provider}
        onPress={() => setSelectedItem(item)}>
        <Text style={[styles.text, styles.half]}>
          {dpUI(calculateQuoteRate(item)).toString()}
        </Text>
        <View style={styles.providerCell}>
          {getSwapProviderIcon(item)}
          <Text style={styles.text}>{item.provider}</Text>
          {selectedItem?.provider === item.provider && (
            <CheckIcon stroke={'#2CD2CF'} />
          )}
        </View>
      </Pressable>
    )
  }

  return (
    <Box
      alignItems="center"
      marginVertical="m"
      flexDirection="row"
      justifyContent="space-between"
      style={style}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <Box>
          <Text variant="secondaryInputLabel" tx="swapRatesComp.rate" />
          <Button
            type="tertiary"
            variant="s"
            label={
              selectedItem
                ? capitalizeFirstLetter(selectedItem.provider)
                : 'Liquality'
            }
            onPress={() => {
              if (clickable) setIsRatesModalVisible(true)
            }}
            isBorderless={false}
            isActive={true}>
            {selectedItem ? (
              getSwapProviderIcon(selectedItem)
            ) : (
              <Logo width={20} style={styles.icon} />
            )}
          </Button>
          {selectedQuote && (
            <Box flexDirection="row" marginTop="s">
              <Text variant="amountLabel">{`${fromAsset} = `}</Text>
              <Text variant="amount">
                {dpUI(calculateQuoteRate(selectedQuote)).toString()}
              </Text>
              <Text variant="amountLabel">{` ${toAsset}`}</Text>
            </Box>
          )}
        </Box>
      </Box>
      <Pressable onPress={() => setIsSwapTypesModalVisible(true)}>
        <Text variant="link" tx="swapRatesComp.swapTypes" />
      </Pressable>
      {isRatesModalVisible && (
        <Box
          flex={1}
          justifyContent="center"
          alignItems="center"
          backgroundColor="mainBackground"
          opacity={0.3}>
          <Modal transparent={true} animationType={'slide'}>
            <Box
              flex={1}
              justifyContent="center"
              alignItems="center"
              backgroundColor="transparentBlack">
              <Box
                backgroundColor="mainBackground"
                width="90%"
                height="70%"
                borderColor="mainBorderColor"
                borderWidth={1}
                paddingVertical="m">
                <View style={styles.header}>
                  <Text variant="header">{`${quotes?.length} ${labelTranslateFn(
                    'swapRatesComp.availQuotes',
                  )}`}</Text>
                  <Pressable onPress={() => setIsRatesModalVisible(false)}>
                    <TimesIcon fill={'#000'} />
                  </Pressable>
                </View>
                <Text
                  style={[styles.text, styles.padded]}
                  tx="swapRatesComp.theseAreDiffQuotesProv"
                />
                <FlatList
                  contentContainerStyle={styles.flatList}
                  data={quotes}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.provider}
                  ListHeaderComponent={ListHeader}
                />
                <View style={styles.footer}>
                  <Button
                    type="primary"
                    variant="l"
                    label={{ tx: 'swapRatesComp.selectQuote' }}
                    onPress={handleSelectQuote}
                    isBorderless={false}
                    isActive={true}
                  />
                  <Text
                    style={styles.text}
                    tx="swapRatesComp.learnMoreAboutSwap"
                  />
                </View>
              </Box>
            </Box>
          </Modal>
        </Box>
      )}
      {isSwapTypesModalVisible && (
        <SwapTypesInfo
          swapProviders={quotes || []}
          getIcon={getSwapProviderIcon}
          toggleModal={() => setIsSwapTypesModalVisible(false)}
        />
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    textTransform: 'capitalize',
    color: '#000D35',
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 20,
    marginVertical: 5,
    marginRight: 5,
  },
  flatList: {
    width: '100%',
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#D9DFE5',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  selected: {
    backgroundColor: '#F0F7F9',
  },
  providerCell: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  padded: {
    paddingHorizontal: 20,
  },
  half: {
    flex: 0.5,
  },
})

export default SwapRates

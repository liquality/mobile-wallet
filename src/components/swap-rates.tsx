import React, { FC, useEffect, useState } from 'react'
import {
  Modal,
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
} from 'react-native'
import { MarketDataType, SwapProvidersEnum } from '@liquality/core/dist/types'
import Label from './ui/label'
import LiqualityButton from './ui/button'
import Logo from '../assets/icons/infinity.svg'
import LiqualityBoost from '../assets/icons/swap-providers/liqualityboost.svg'
import Sovryn from '../assets/icons/swap-providers/sovryn.svg'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTimes, faCheck } from '@fortawesome/pro-light-svg-icons'
import SwapTypesInfo from './swap-types-info'
import { useAppSelector } from '../hooks'

const ListHeader: FC = () => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: '#D9DFE5',
      paddingHorizontal: 20,
    },
  })
  return (
    <View style={styles.container}>
      <Label text="RATE" variant="strong" />
      <Label text="PROVIDER" variant="strong" />
    </View>
  )
}

type SwapRatesProps = {
  fromAsset: string
  toAsset: string
  selectQuote: (quote: MarketDataType) => void
}

const SwapRates: FC<SwapRatesProps> = (props) => {
  const { fromAsset, toAsset, selectQuote } = props
  const { marketData } = useAppSelector((state) => ({
    marketData: state.marketData,
  }))
  const [selectedItem, setSelectedItem] = useState<MarketDataType>()
  const [isRatesModalVisible, setIsRatesModalVisible] = useState(false)
  const [isSwapTypesModalVisible, setIsSwapTypesModalVisible] = useState(false)
  const [quotes, setQuotes] = useState<MarketDataType[]>([])

  const getSwapProviderIcon = (
    marketQuotes: MarketDataType,
  ): React.ReactElement => {
    switch (marketQuotes.provider) {
      case SwapProvidersEnum.LIQUALITY.toLowerCase():
        return <Logo width={15} height={15} style={styles.icon} />
      case SwapProvidersEnum.LIQUALITYBOOST.toLowerCase():
        return <LiqualityBoost width={15} height={15} style={styles.icon} />
      case SwapProvidersEnum.SOVRYN.toLowerCase():
        return <Sovryn width={15} height={15} style={styles.icon} />
      default:
        return <Logo width={15} height={15} style={styles.icon} />
    }
  }

  const handleSelectQuote = () => {
    if (selectedItem) {
      selectQuote(selectedItem)
      setIsRatesModalVisible(false)
    } else {
      Alert.alert('Select a quote first')
    }
  }

  const renderItem = ({ item }: { item: MarketDataType }) => {
    return (
      <Pressable
        style={[
          styles.listRow,
          selectedItem?.provider === item.provider && styles.selected,
        ]}
        key={item.provider}
        onPress={() => setSelectedItem(item)}>
        <Text style={[styles.text, styles.half]}>{item.rate}</Text>
        <View style={styles.providerCell}>
          {getSwapProviderIcon(item)}
          <Text style={[styles.text]}>{item.provider}</Text>
          {selectedItem?.provider === item.provider && (
            <FontAwesomeIcon icon={faCheck} color={'#2CD2CF'} />
          )}
        </View>
      </Pressable>
    )
  }

  useEffect(() => {
    setQuotes(
      marketData?.filter(
        (item) => item.from === fromAsset && item.to === toAsset,
      ) || [],
    )
  }, [fromAsset, marketData, toAsset])

  return (
    <View style={[styles.box, styles.row]}>
      <View style={styles.row}>
        <Label text="RATE" variant="strong" />
        <LiqualityButton
          text="Liquality"
          variant="small"
          type="plain"
          action={() => setIsRatesModalVisible(true)}>
          <Logo width={20} style={styles.icon} />
        </LiqualityButton>
      </View>
      <Pressable onPress={() => setIsSwapTypesModalVisible(true)}>
        <Text style={[styles.text, styles.link]}>Swap Types</Text>
      </Pressable>
      {isRatesModalVisible && (
        <View style={styles.centeredView}>
          <Modal transparent={true} animationType={'slide'}>
            <View style={styles.container}>
              <View style={styles.content}>
                <View style={styles.header}>
                  <Label
                    text={`${quotes?.length} AVAILABLE QUOTES`}
                    variant="strong"
                  />
                  <Pressable onPress={() => setIsRatesModalVisible(false)}>
                    <FontAwesomeIcon icon={faTimes} color={'#000'} />
                  </Pressable>
                </View>
                <Text style={[styles.text, styles.padded]}>
                  These quotes are from different swap providers.
                </Text>
                <FlatList
                  contentContainerStyle={styles.flatList}
                  data={quotes}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.provider}
                  ListHeaderComponent={ListHeader}
                />
                <View style={styles.footer}>
                  <LiqualityButton
                    text="Select Quote"
                    variant="large"
                    type="positive"
                    action={handleSelectQuote}
                  />
                  <Text style={styles.text}>Learn about swap types</Text>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
      {isSwapTypesModalVisible && (
        <SwapTypesInfo
          swapProviders={quotes || []}
          getIcon={getSwapProviderIcon}
          toggleModal={() => setIsSwapTypesModalVisible(false)}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    opacity: 0.3,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    backgroundColor: '#FFF',
    width: '90%',
    height: '70%',
    borderColor: '#D9DFE5',
    borderWidth: 1,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  box: {
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
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
  },
  padded: {
    paddingHorizontal: 20,
  },
  link: {
    color: '#9D4DFA',
  },
  half: {
    flex: 0.5,
  },
})

export default SwapRates

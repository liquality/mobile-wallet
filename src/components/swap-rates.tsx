import React, { FC, useState } from 'react'
import {
  Modal,
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
} from 'react-native'
import Label from './ui/label'
import LiqualityButton from './ui/button'
import Logo from '../assets/icons/infinity.svg'
import LiqualityBoost from '../assets/icons/swap-providers/liqualityboost.svg'
import OneInch from '../assets/icons/swap-providers/oneinch.svg'
import Sovryn from '../assets/icons/swap-providers/sovryn.svg'
import Thorchain from '../assets/icons/swap-providers/thorchain.svg'
import Uniswap from '../assets/icons/swap-providers/uniswap.svg'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTimes, faCheck } from '@fortawesome/pro-light-svg-icons'
import SwapTypesInfo from './swap-types-info'
import { ProviderType } from '../types'

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

const swapProviders: ProviderType[] = [
  {
    name: 'Liquality',
    rate: 0.023847,
    icon: () => <Logo width={15} height={15} style={styles.icon} />,
  },
  {
    name: 'LiqualityBoost',
    rate: 0.023847,
    icon: () => <LiqualityBoost width={15} height={15} style={styles.icon} />,
  },
  {
    name: 'Thorchain',
    rate: 0.099847,
    icon: () => <Thorchain width={15} height={15} style={styles.icon} />,
  },
  {
    name: 'OneInch',
    rate: 0.022247,
    icon: () => <OneInch width={15} height={15} style={styles.icon} />,
  },
  {
    name: 'Uniswap',
    rate: 0.022247,
    icon: () => <Uniswap width={15} height={15} style={styles.icon} />,
  },
  {
    name: 'Sovryn',
    rate: 0.022247,
    icon: () => <Sovryn width={15} height={15} style={styles.icon} />,
  },
]

const SwapRates: FC = () => {
  const [selectedItem, setSelectedItem] = useState<ProviderType>(
    swapProviders[0],
  )
  const [isRatesModalVisible, setIsRatesModalVisible] = useState(false)
  const [isSwapTypesModalVisible, setIsSwapTypesModalVisible] = useState(false)

  const renderItem = ({ item }: { item: ProviderType }) => {
    return (
      <Pressable
        style={[
          styles.listRow,
          selectedItem.name === item.name && styles.selected,
        ]}
        key={item.name}
        onPress={() => setSelectedItem(item)}>
        <Text style={[styles.text, { flex: 0.5 }]}>{item.name}</Text>
        <View style={styles.providerCell}>
          {item.icon()}
          <Text style={[styles.text]}>{item.rate}</Text>
          {selectedItem.name === item.name && (
            <FontAwesomeIcon icon={faCheck} color={'#2CD2CF'} />
          )}
        </View>
      </Pressable>
    )
  }

  return (
    <View style={[styles.box, styles.row]}>
      <View style={{ flexDirection: 'row' }}>
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
                    text={`${swapProviders.length} AVAILABLE QUOTES`}
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
                  data={swapProviders}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.name}
                  ListHeaderComponent={ListHeader}
                />
                <View style={styles.footer}>
                  <LiqualityButton
                    text="Select Quote"
                    variant="large"
                    type="positive"
                    action={() => ({})}
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
          swapProviders={swapProviders}
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
})

export default SwapRates

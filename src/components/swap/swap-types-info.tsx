import React, { FC } from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Label from '../ui/label'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTimes } from '@fortawesome/pro-light-svg-icons'
import Uniswap from '../../assets/icons/swap-providers/uniswap.svg'
import LiqualityBoost from '../../assets/icons/swap-providers/liqualityboost.svg'
import Liquality from '../../assets/icons/swap-providers/liquality.svg'

type SwapTypesInfoProps = {
  swapProviders: any[]
  getIcon: (marketData: any) => React.ReactElement
  toggleModal: () => void
}

// TODO add the rest of the swap providers
const providersInfo = [
  {
    name: 'Liquality',
    icon: () => <Liquality width={15} height={15} style={styles.icon} />,
    description:
      'Atomic Swap Swap native assets across blockchains without counterparty risks.',
    pros: ['Cross-chain', 'Secure', 'Native assets'],
    cons: ['Low-quality', 'Few pairs'],
    tip: 'Fee structure: 1%, 0 slippage, $100 minimum trade size',
  },
  {
    name: 'LiqualityBoost',
    icon: () => <LiqualityBoost width={15} height={15} style={styles.icon} />,
    description:
      'Atomic Swap Swap native assets across blockchains without counterparty risks.',
    pros: ['Cross-chain', 'Secure', 'Native assets'],
    cons: ['Low-quality', 'Few pairs'],
    tip: 'Fee structure: 1%, 0 slippage, $100 minimum trade size',
  },
  {
    name: 'Uniswap',
    icon: () => <Uniswap width={15} height={15} style={styles.icon} />,
    description: 'AMM Swap  Swap Ethereum tokens through liquidity pools.',
    pros: ['High Liquidity', 'Many pairs', 'Fast'],
    cons: ['Slippage', 'Ethereum tokens only'],
    tip: 'Fee structure: 1%, 0 slippage, $100 minimum trade size',
  },
]

const SwapTypesInfo: FC<SwapTypesInfoProps> = (props) => {
  const { swapProviders, toggleModal, getIcon } = props
  return (
    <View style={styles.centeredView}>
      <Modal transparent={true} visible={true} animationType={'slide'}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Label text="Learn about swap types" variant="strong" />
              <Pressable onPress={toggleModal}>
                <FontAwesomeIcon icon={faTimes} color={'#000'} />
              </Pressable>
            </View>
            <ScrollView>
              <Text style={[styles.text, styles.padded]}>
                When trading assets provider vary regards the way its done:
                assets, chain, fees, slippage etc. At a glance:
              </Text>
              <View style={styles.providersLogos}>
                {swapProviders.map((item) => {
                  return (
                    <View
                      key={item.provider}
                      style={[styles.miniLabel, styles.borderless]}>
                      {getIcon(item)}
                      <Text style={styles.text}>{item.provider}</Text>
                    </View>
                  )
                })}
              </View>
              {providersInfo.map((provider) => (
                <View style={styles.block} key={provider.name}>
                  <View style={styles.miniLabel}>
                    {provider.icon()}
                    <Label text={provider.name} variant="light" />
                  </View>
                  <Text style={styles.description}>{provider.description}</Text>
                  <View style={styles.prosCons}>
                    <View>
                      <Label text="Pro" variant="strong" />
                      {provider.pros.map((pro) => (
                        <Text key={pro} style={styles.prosConsItem}>
                          {pro}
                        </Text>
                      ))}
                    </View>
                    <View>
                      <Label text="Con" variant="strong" />
                      {provider.cons.map((con) => (
                        <Text key={con} style={styles.prosConsItem}>
                          {con}
                        </Text>
                      ))}
                    </View>
                  </View>
                  <Text style={styles.description}>{provider.tip}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  block: {
    padding: 20,
  },
  providersLogos: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#A8AEB7',
    marginHorizontal: 20,
    paddingBottom: 10,
    flexWrap: 'wrap',
  },
  miniLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#A8AEB7',
    borderRadius: 50,
  },
  borderless: {
    borderWidth: 0,
    // flexDirection: 'row',
    // marginHorizontal: 5,
    // alignItems: 'center',
  },
  description: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 10,
  },
  prosCons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 10,
  },
  prosConsItem: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
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
  padded: {
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 5,
  },
})

export default SwapTypesInfo

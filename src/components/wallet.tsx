import * as React from 'react'
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

interface AssetType {
  id: string
  name: string
  address: string
  balance: string
  balanceInUSD: string
}

const DATA: Array<AssetType> = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'Ethereum',
    address: 'b01992929293839393',
    balance: '0.12345',
    balanceInUSD: '$12.22',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    name: 'DAI',
    address: 'b01992929293839393',
    balance: '0.12345',
    balanceInUSD: '$12.22',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    name: 'Bitcoin',
    address: 'b01992929293839393',
    balance: '0.12345',
    balanceInUSD: '$12.22',
  },
]

const renderAsset = ({ item }: { item: AssetType }) => {
  const { name, address, balance, balanceInUSD } = item
  return (
    <View style={[styles.row]}>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.address}>{address}</Text>
      </View>
      <View>
        <Text style={styles.balance}>{balance}</Text>
        <Text style={styles.balanceInUSD}>{balanceInUSD}</Text>
      </View>
    </View>
  )
}

const Wallet = () => {
  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <Image source={require('../assets/icons/separator.png')} />
        <ImageBackground
          style={styles.actionBlockBg}
          source={require('../assets/bg/action-block-bg.png')}>
          <View style={styles.totalValueSection}>
            <Text>
              <Text style={styles.totalValue}>9,345.19</Text>
              <Text style={styles.currency}>USD</Text>
            </Text>
          </View>
          <View style={styles.btnContainer}>
            <Pressable style={styles.btn}>
              <Image source={require('../assets/icons/send.png')} />
              <Text style={styles.btnText}>Send</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.swapBtn]}>
              <Image source={require('../assets/icons/swap.png')} />
              <Text style={[styles.btnText, styles.swapBtnText]}>Swap</Text>
            </Pressable>
            <Pressable style={styles.btn}>
              <Image source={require('../assets/icons/receive.png')} />
              <Text style={styles.btnText}>Receive</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.block}>
        <FlatList
          data={DATA}
          renderItem={renderAsset}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <View style={[styles.row, styles.header]}>
              <View>
                <Text style={[styles.name, styles.headerText]}>ASSET</Text>
              </View>
              <View>
                <Text style={[styles.balance, styles.headerText]}>
                  ACTIVITY
                </Text>
              </View>
            </View>
          )}
        />
      </View>
      <View style={styles.navBlock}>
        <Pressable style={styles.navBtn}>
          <Image source={require('../assets/icons/logo-small.png')} />
        </Pressable>
        <Pressable style={styles.navBtn}>
          <Image
            style={styles.navSelected}
            source={require('../assets/icons/ellipse.png')}
          />
          <Text style={styles.navBtnTextSelected}>Wallet</Text>
        </Pressable>
        <Pressable style={styles.navBtn}>
          <Text style={styles.navBtnText}>Collectibles</Text>
        </Pressable>
        <Pressable style={styles.navBtn}>
          <Text style={styles.navBtnText}>Dapps</Text>
        </Pressable>
        <Pressable style={styles.navBtn}>
          <Image source={require('../assets/icons/account-settings.png')} />
        </Pressable>
      </View>
      <View style={styles.block}>
        <Text>History Block</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 1,
  },
  block: {
    marginVertical: 15,
  },
  actionBlockBg: {
    width: '100%',
    height: 219,
  },
  totalValueSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 15,
  },
  totalValue: {
    borderWidth: 1,
    color: 'white',
    fontWeight: '500',
    fontSize: 50,
    marginTop: 15,
  },
  currency: {
    borderWidth: 1,
    color: 'white',
    fontWeight: '500',
    fontSize: 20,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    alignItems: 'center',
    marginHorizontal: 7,
    marginTop: 17,
  },
  swapBtn: {
    marginTop: 12,
  },
  btnText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 17,
    marginTop: 11,
  },
  swapBtnText: {
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#D9DFE5',
    padding: 15,
  },
  name: {
    color: 'black',
    fontSize: 15,
  },
  address: {
    color: '#646F85',
    fontSize: 15,
  },
  balance: {
    color: 'black',
    fontSize: 15,
  },
  balanceInUSD: {
    color: '#646F85',
    fontSize: 15,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  headerText: {
    fontSize: 19,
    fontWeight: '700',
  },

  navBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  navBtn: {
    alignItems: 'center',
  },
  navBtnText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#646F85',
  },
  navBtnTextSelected: {
    fontSize: 16,
    fontWeight: '500',
    color: '#646F85',
    marginTop: 7,
  },
  navSelected: {
    marginTop: -15,
  },
})

export default Wallet

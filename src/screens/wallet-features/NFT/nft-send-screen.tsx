import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../../atoms'
import Box from '../../../theme/box'
import { RootTabParamList, UseInputStateReturnType } from '../../../types'

const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}
type ShowAllNftsScreenProps = BottomTabScreenProps<
  RootTabParamList,
  'NftDetailScreen'
>

const wallet = setupWallet({
  ...defaultOptions,
})
const NftSendScreen = ({ navigation, route }: ShowAllNftsScreenProps) => {
  const { nftItem } = route.params
  const activeNetwork = useRecoilValue(networkState)
  const { activeWalletId } = wallet.state

  const addressInput = useInputState(
    'tb1qv87lrj2lprekaylh0drj3cyyvluapa7e2rjc9r',
  )

  console.log(nftItem, 'NFT TEM IN SEEND SCREEN')
  useEffect(() => {
    async function fetchData() {}
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetwork, activeWalletId])

  const sendNft = () => {}

  return (
    <View style={[styles.container, styles.fragmentContainer]}>
      <Text>NFT SEND SCREEEN</Text>
      <Pressable onPress={() => sendNft()}>
        <Text>SEND NFT</Text>
      </Pressable>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-end"
        marginBottom="m">
        <TextInput
          style={styles.sendToInput}
          onChangeText={addressInput.onChangeText}
          value={addressInput.value}
          autoCorrect={false}
          returnKeyType="done"
        />
        {/*  <Pressable onPress={handleQRCodeBtnPress}>
          <QRCode />
        </Pressable> */}
      </Box>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
  },
  fragmentContainer: {
    paddingHorizontal: 20,
  },
  sendToInput: {
    marginTop: 5,
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
    width: '90%',
  },
})

export default NftSendScreen

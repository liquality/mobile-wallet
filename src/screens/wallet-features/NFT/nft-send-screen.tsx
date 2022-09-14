import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../../atoms'
import { sendNFTTransaction, updateNFTs } from '../../../store/store'
import Box from '../../../theme/box'
import Button from '../../../theme/button'
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
  const { nftItem, accountIdsToSendIn } = route.params
  const activeNetwork = useRecoilValue(networkState)
  const { activeWalletId } = wallet.state
  const [sendSuccess, setSendSuccess] = useState('')

  //Hardcoded my own metamask mumbai testnet for testing purposes
  const addressInput = useInputState(
    '0xb81B9B88e764cb6b4E02c5D0F6D6D9051A61E020',
  )

  useEffect(() => {
    async function fetchData() {}
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetwork, activeWalletId])

  const sendNft = async () => {
    console.log('IN SEND NF T')
    try {
      /* 
      TODO add NFT fees, currently the fees sent in in extension 
      has wrong calculation (diff fees for NFTs and tokens and 
      a problem with NFT providers not giving fee estimations)
       const fee = this.feesAvailable
        ? this.assetFees[this.selectedFee].fee
        : undefined */
      const data = {
        network: activeNetwork,
        accountId: nftItem.accountId,
        walletId: activeWalletId,
        receiver: addressInput.value,
        contract: nftItem.asset_contract.address,
        tokenIDs: [nftItem.token_id],
        values: [1],
        fee: undefined,
        feeLabel: 'average',
        nft: nftItem,
      }
      console.log('DO I GET HER EIN TRY')
      await sendNFTTransaction(data)
      await updateNFTs({
        walletId: activeWalletId,
        network: activeNetwork,
        accountIds: accountIdsToSendIn,
      })
      setSendSuccess('Success! You sent the NFT')
    } catch (error) {
      console.log(error, 'could not send NFTs')
    }
  }

  return (
    <View style={[styles.container, styles.fragmentContainer]}>
      <Text>NFT SEND SCREEEN</Text>

      <Button
        type="primary"
        variant="l"
        label={'Send NFT'}
        isBorderless={false}
        isActive={true}
        onPress={() => sendNft()}
      />
      {sendSuccess ? <Text>{sendSuccess}</Text> : null}

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

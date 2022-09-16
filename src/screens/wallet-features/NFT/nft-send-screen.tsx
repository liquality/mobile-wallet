import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { StyleSheet, TextInput } from 'react-native'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../../atoms'
import { sendNFTTransaction, updateNFTs } from '../../../store/store'
import { Text, Button, Box } from '../../../theme'
import { RootStackParamList, UseInputStateReturnType } from '../../../types'

const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

type NftSendScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NftSendScreen'
>

const wallet = setupWallet({
  ...defaultOptions,
})

const NftSendScreen = ({ route }: NftSendScreenProps) => {
  const { nftItem, accountIdsToSendIn } = route.params
  const activeNetwork = useRecoilValue(networkState)
  const { activeWalletId } = wallet.state
  const [statusMsg, setStatusMsg] = useState('')

  //Hardcoded my own metamask mumbai testnet for testing purposes
  const addressInput = useInputState(
    '0xb81B9B88e764cb6b4E02c5D0F6D6D9051A61E020',
  )

  const sendNft = async () => {
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
        accountId: nftItem?.accountId,
        walletId: activeWalletId,
        receiver: addressInput.value,
        contract: nftItem?.asset_contract.address,
        tokenIDs: [nftItem?.token_id],
        values: [1],
        fee: undefined,
        feeLabel: 'average',
        nft: nftItem,
      }
      await sendNFTTransaction(data)
      await updateNFTs({
        walletId: activeWalletId,
        network: activeNetwork,
        accountIds: accountIdsToSendIn,
      })
      setStatusMsg('Success! You sent the NFT')
    } catch (error) {
      setStatusMsg('Failed to send the NFT')
    }
  }

  return (
    <Box style={[styles.container, styles.fragmentContainer]}>
      <Text>NFT SEND SCREEEN</Text>

      <Button
        type="primary"
        variant="l"
        label={'Send NFT'}
        isBorderless={false}
        isActive={true}
        onPress={() => sendNft()}
      />
      {statusMsg ? <Text>{statusMsg}</Text> : null}

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
        {/*  Todo: implement send NFT with QR code (waiting for design)
        <Pressable onPress={handleQRCodeBtnPress}>
          <QRCode />
        </Pressable> */}
      </Box>
    </Box>
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

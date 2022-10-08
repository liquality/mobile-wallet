import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { Image, StyleSheet, TextInput } from 'react-native'
import { useRecoilValue } from 'recoil'
import { AppIcons, Fonts } from '../../../assets'
import { networkState } from '../../../atoms'
import AssetIcon from '../../../components/asset-icon'
import { sendNFTTransaction, updateNFTs } from '../../../store/store'
import {
  Text,
  Button,
  Box,
  palette,
  Card,
  faceliftPalette,
} from '../../../theme'
import { RootStackParamList, UseInputStateReturnType } from '../../../types'
import { GRADIENT_BACKGROUND_HEIGHT } from '../../../utils'

const { CopyIcon, PurpleCopy, QRCode } = AppIcons
const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

type NftOverviewScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NftOverviewScreen'
>

const wallet = setupWallet({
  ...defaultOptions,
})

const NftOverviewScreen = ({ route }: NftOverviewScreenProps) => {
  const { nftItem, accountIdsToSendIn } = route.params
  const activeNetwork = useRecoilValue(networkState)
  const { activeWalletId } = wallet.state
  const [statusMsg, setStatusMsg] = useState('')

  //Hardcoded my own metamask mumbai testnet for testing purposes
  const addressInput = useInputState('')

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
    <Box backgroundColor={'white'}>
      <Card
        variant={'headerCard'}
        height={GRADIENT_BACKGROUND_HEIGHT}
        paddingHorizontal="xl">
        <Box flex={0.4} justifyContent="center"></Box>
        <Box flex={1}>
          <Box alignItems="center" justifyContent="center">
            <Image
              style={styles.image}
              source={{
                uri: nftItem.image_original_url,
              }}
            />
            <Text variant={'sendNftCollectionNameHeader'}>
              {nftItem.collection.name}
            </Text>

            <Text variant={'sendNftNameHeader'}>
              {nftItem.name} #{nftItem.token_id}
            </Text>
          </Box>
        </Box>
      </Card>
      <Box padding={'xl'}>
        <Text variant={'miniNftHeader'}>REVIEWWW SCREEN is here</Text>
        <Box paddingTop={'m'} flexDirection={'row'}>
          <AssetIcon chain={'ethereum'} />
          <Text variant={'miniNftHeader'}>ETH</Text>
        </Box>
      </Box>
      <Box flexDirection={'row'} paddingVertical="l">
        <Text variant={'miniNftHeader'}>Transfer Within Accounts | </Text>
        <Text variant={'miniNftHeader'}>Network Speed</Text>
      </Box>
      <Box style={styles.btnBox}>
        <Button
          type="primary"
          variant="l"
          label={'Review'}
          isBorderless={false}
          isActive={true}
          onPress={() => sendNft()}
        />
        <Button
          type="secondary"
          variant="l"
          /*           label={{ tx: 'receiveScreen.buyCrypto' }}*/
          label="Cancel"
          onPress={() => sendNft()}
          isBorderless={false}
          isActive={true}
        />
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: palette.white,
    paddingVertical: 15,
  },
  image: {
    width: 95,
    height: 95,
    marginBottom: 20,
  },
  btnBox: { alignItems: 'center' },
  sendToInput: {
    marginTop: 5,
    fontSize: 19,

    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 30,
    letterSpacing: 0.5,
    color: faceliftPalette.greyMeta,
    width: '90%',
    marginRight: 10,
  },
  copyIcon: { color: 'purple' },
})

export default NftOverviewScreen

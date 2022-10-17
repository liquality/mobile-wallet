import React from 'react'
import { useRecoilValue } from 'recoil'
import { networkState, addressStateFamily, walletState } from '../../../atoms'
import { Box, Text } from '../../../theme'
import { scale } from 'react-native-size-matters'
import { getAsset } from '@liquality/cryptoassets'
import AssetIcon from '../../../components/asset-icon'
import { AppIcons } from '../../../assets'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useNavigation, NavigationProp } from '@react-navigation/core'
import { MainStackParamList } from '../../../types'

const { ChevronRightIcon } = AppIcons

const ChainRow = ({ item }: { item: { id: string; name: string } }) => {
  const network = useRecoilValue(networkState)
  const wallet = useRecoilValue(walletState)
  const navigation = useNavigation<NavigationProp<MainStackParamList>>()

  const data = getAsset(network, item.name)
  const address = useRecoilValue(addressStateFamily(item.id))
  const shortAdd = shortenAddress(address)

  const onChainPress = () => {
    navigation.navigate('BackupWarningScreen', {
      isPrivateKey: true,
      walletId: wallet.activeWalletId,
      accountId: item.id,
      network,
      chain: data.chain,
      shortenAddress: shortAdd,
      accountName: data.name,
    })
  }

  return (
    <TouchableWithoutFeedback onPress={onChainPress}>
      <Box
        flexDirection={'row'}
        justifyContent="space-around"
        paddingVertical={'m'}
        height={70}>
        <Box
          height={scale(50)}
          width={scale(3)}
          style={{ backgroundColor: data.color }}
        />
        <Box>
          <Box width={10} height={10} />
        </Box>
        <Box flex={0.1} paddingLeft={'s'}>
          <AssetIcon chain={data.chain} />
        </Box>
        <Box flex={0.9} paddingLeft={'m'}>
          <Text variant={'listText'} color="darkGrey">
            {data.name}
          </Text>
          <Text variant={'subListText'} color="greyMeta">
            {shortAdd}
          </Text>
        </Box>
        <Box alignSelf={'center'}>
          <ChevronRightIcon width={scale(15)} height={scale(15)} />
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default ChainRow

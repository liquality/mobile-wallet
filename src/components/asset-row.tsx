import React, { useEffect, useState } from 'react'
import { getAsset, unitToCurrency } from '@liquality/cryptoassets'
import Switch from './ui/switch'
import { useRecoilValue } from 'recoil'
import {
  accountInfoStateFamily,
  balanceStateFamily,
  fiatRatesState,
  networkState,
} from '../atoms'
import { Box, Text } from '../theme'
import { Asset, BigNumber } from '@chainify/types'
import {
  cryptoToFiat,
  formatFiat,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { getNativeAsset } from '@liquality/wallet-core/dist/src/utils/asset'
import CombinedChainAssetIcons from './ui/CombinedChainAssetIcons'

interface CustomAsset extends Asset {
  id: string
  showGasLink: boolean
}

const AssetRow = ({
  assetItems,
  showModal,
}: {
  assetItems: CustomAsset
  showModal: () => void
}) => {
  const { code, chain, id } = assetItems
  const accountInfo = useRecoilValue(accountInfoStateFamily(id))
  const { name } = accountInfo
  const [prettyFiatBalance, setPrettyFiatBalance] = useState('0')
  const activeNetwork = useRecoilValue(networkState)
  const fiatRates = useRecoilValue(fiatRatesState)
  const balance = useRecoilValue(
    balanceStateFamily({
      asset: code,
      assetId: id,
    }),
  )

  useEffect(() => {
    const fiatBalance = fiatRates[code]
      ? cryptoToFiat(
          unitToCurrency(
            getAsset(activeNetwork, getNativeAsset(code)),
            balance,
          ).toNumber(),
          fiatRates[code],
        )
      : 0
    setPrettyFiatBalance(`$${formatFiat(new BigNumber(fiatBalance))}`)
  }, [activeNetwork, balance, code, fiatRates])

  return (
    <Box flexDirection={'row'} alignItems="center" marginTop={'xl'}>
      <CombinedChainAssetIcons chain={chain} code={code} />
      <Box flex={1} marginLeft="m">
        <Text variant={'listText'} color="darkGrey">
          {name} ({code})
        </Text>
        <Text variant={'subListText'} color="greyMeta">
          {prettyFiatBalance}
        </Text>
      </Box>
      {assetItems.showGasLink ? (
        <Box
          width={30}
          alignSelf="flex-start"
          marginTop={'s'}
          paddingRight={'s'}
          justifyContent="flex-end">
          <Text
            onPress={showModal}
            variant={'subListText'}
            color="link"
            tx="gas"
          />
        </Box>
      ) : (
        <Box paddingRight={'s'}>
          <Switch asset={code} />
        </Box>
      )}
    </Box>
  )
}

export default AssetRow

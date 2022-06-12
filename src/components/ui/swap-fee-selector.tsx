import { SwapQuote } from '@liquality/wallet-core/dist/swaps/types'
import React, { FC, useEffect, useState } from 'react'
import Text from '../../theme/text'
import { GasFees } from '../../types'
import FeeSelector from './fee-selector'
import { fetchFeesForAsset } from '../../store/store'
import { Alert } from 'react-native'
import { FeeLabel } from '@liquality/wallet-core/dist/store/types'
import ErrorFallback from '../error-fallback'
import ErrorBoundary from 'react-native-error-boundary'
import Box from '../../theme/box'

type SwapFeeSelectorProps = {
  asset: string
  networkFee: any
  selectedQuote: SwapQuote
  type: 'from' | 'to'
  handleCustomPress: (...args: unknown[]) => void
  changeNetworkSpeed: (speed: FeeLabel) => void
}

const SwapFeeSelector: FC<SwapFeeSelectorProps> = (props) => {
  const {
    asset,
    networkFee,
    selectedQuote,
    type,
    handleCustomPress,
    changeNetworkSpeed,
  } = props
  const [gasFees, setGasFees] = useState<GasFees>()

  useEffect(() => {
    fetchFeesForAsset(asset)
      .then(setGasFees)
      .catch(() => Alert.alert('Failed to fetch gas fees'))
  }, [asset, networkFee, selectedQuote, type])

  //TODO add an ErrorBoundary component
  if (!gasFees)
    return (
      <Box>
        <Text>Loading...</Text>
      </Box>
    )

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <FeeSelector
        assetSymbol={asset}
        handleCustomPress={handleCustomPress}
        networkFee={networkFee}
        gasFees={gasFees}
        changeNetworkSpeed={changeNetworkSpeed}
      />
    </ErrorBoundary>
  )
}

export default SwapFeeSelector

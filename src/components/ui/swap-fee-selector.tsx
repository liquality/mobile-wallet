import { SwapQuote } from '@liquality/wallet-core/dist/swaps/types'
import React, { FC, useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks'
import Text from '../../theme/text'
import { GasFees } from '../../types'
import { calculateFees } from '../../utils'
import FeeSelector from './fee-selector'

type SwapFeeSelectorProps = {
  asset: string
  networkFee: any
  selectedQuote: SwapQuote
  type: 'from' | 'to'
  handleCustomPress: (...args: unknown[]) => void
}

const SwapFeeSelector: FC<SwapFeeSelectorProps> = (props) => {
  const { asset, networkFee, selectedQuote, type, handleCustomPress } = props
  const [gasFees, setGasFees] = useState<GasFees>()
  const { activeNetwork, activeWalletId } = useAppSelector((state) => ({
    activeNetwork: state.activeNetwork,
    activeWalletId: state.activeWalletId,
  }))

  useEffect(() => {
    calculateFees(
      activeNetwork,
      activeWalletId,
      selectedQuote,
      asset,
      true,
      type,
    ).then(setGasFees)
  }, [activeNetwork, activeWalletId, asset, networkFee, selectedQuote, type])

  //TODO add an ErrorBoundary component
  if (!gasFees) return <Text>{`Failed to calculate fees for ${asset}`}</Text>

  return (
    <FeeSelector
      assetSymbol={asset}
      handleCustomPress={handleCustomPress}
      networkFee={networkFee}
      gasFees={gasFees}
    />
  )
}

export default SwapFeeSelector
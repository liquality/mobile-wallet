import React, { FC, useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks'
import { GasFees } from '../../types'
import { calculateFees } from '../../utils'
import FeeSelector from './fee-selector'

type SwapFeeSelectorProps = {
  asset: string
  networkFee: any
  selectedQuote: any
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
    ).then((fees) => {
      setGasFees(fees)
    })
  }, [activeNetwork, activeWalletId, asset, networkFee, selectedQuote, type])

  if (!gasFees) return null

  return (
    <FeeSelector
      assetSymbol={asset || type === 'from' ? 'BTC' : 'ETH'}
      handleCustomPress={handleCustomPress}
      networkFee={networkFee}
      gasFees={gasFees}
    />
  )
}

export default SwapFeeSelector

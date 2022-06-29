import React, { FC, MutableRefObject, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import ErrorBoundary from 'react-native-error-boundary'
import { fetchFeesForAsset } from '../../store/store'
import { GasFees, NetworkFeeType } from '../../types'
import FeeSelector from './fee-selector'
import { FeeLabel } from '@liquality/wallet-core/dist/store/types'
import ErrorFallback from '../error-fallback'

type SendFeeSelectorProps = {
  asset: string
  handleCustomPress: (...args: unknown[]) => void
  networkFee: MutableRefObject<NetworkFeeType | undefined>
  changeNetworkSpeed: (speed: FeeLabel) => void
}

const SendFeeSelector: FC<SendFeeSelectorProps> = (props) => {
  const { asset, handleCustomPress, networkFee, changeNetworkSpeed } = props
  const [gasFees, setGasFees] = useState<GasFees>()

  useEffect(() => {
    fetchFeesForAsset(asset)
      .then(setGasFees)
      .catch(() => Alert.alert('Failed to fetch gas fees'))
  }, [asset])

  if (!gasFees) return null

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

export default SendFeeSelector

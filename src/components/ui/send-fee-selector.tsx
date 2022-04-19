import React, { FC, MutableRefObject, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useAppSelector } from '../../hooks'
import { fetchFeesForAsset } from '../../store/store'
import { GasFees, NetworkFeeType } from '../../types'
import FeeSelector from './fee-selector'

type SendFeeSelectorProps = {
  asset: string
  handleCustomPress: (...args: unknown[]) => void
  networkFee: MutableRefObject<NetworkFeeType>
}

const SendFeeSelector: FC<SendFeeSelectorProps> = (props) => {
  const { asset, handleCustomPress, networkFee } = props
  const { activeNetwork, activeWalletId } = useAppSelector((state) => ({
    activeNetwork: state.activeNetwork,
    activeWalletId: state.activeWalletId,
  }))
  const [gasFees, setGasFees] = useState<GasFees>()

  useEffect(() => {
    fetchFeesForAsset(asset)
      .then((fees) => {
        setGasFees(fees)
      })
      .catch(() => Alert.alert('Failed to fetch gas fees'))
  }, [activeNetwork, activeWalletId, asset, networkFee])

  if (!gasFees) return null

  return (
    <FeeSelector
      assetSymbol={asset}
      handleCustomPress={handleCustomPress}
      networkFee={networkFee}
      gasFees={gasFees}
    />
  )
}

export default SendFeeSelector

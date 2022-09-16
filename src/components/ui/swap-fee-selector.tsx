import { SwapQuote } from '@liquality/wallet-core/dist/src/swaps/types'
import React, { FC, useEffect, useState } from 'react'
import Text from '../../theme/text'
import { GasFees } from '../../types'
import FeeSelector, { LikelyWaitProps } from './fee-selector'
import { fetchFeesForAsset } from '../../store/store'
import { Alert } from 'react-native'
import { FeeLabel } from '@liquality/wallet-core/dist/src/store/types'
import ErrorFallback from '../error-fallback'
import ErrorBoundary from 'react-native-error-boundary'
import Box from '../../theme/box'
import { labelTranslateFn } from '../../utils'
import { SwapScreenPopUpTypes } from '../../atoms'

type SwapFeeSelectorProps = {
  asset: string
  networkFee: any
  selectedQuote: SwapQuote
  type: 'from' | 'to'
  handleCustomPress: (...args: unknown[]) => void
  changeNetworkSpeed: (speed: FeeLabel) => void
  gasFees: GasFees
  setGasFees: (gasFee: GasFees) => void
  customFee: number | undefined
  customFeeAsset: string
  toAsset?: string // to render double tap or long press popup accordingly
  fromAsset?: string // to render double tap or long press popup accordingly
  doubleLongTapFeelabel?: SwapScreenPopUpTypes
  likelyWait?: LikelyWaitProps
}

const SwapFeeSelector: FC<SwapFeeSelectorProps> = (props) => {
  const {
    asset,
    networkFee,
    selectedQuote,
    type,
    handleCustomPress,
    changeNetworkSpeed,
    gasFees,
    setGasFees,
    customFee,
    customFeeAsset,
    toAsset,
    fromAsset,
    doubleLongTapFeelabel,
    likelyWait,
  } = props
  const [alertStatus, setAlertStatus] = useState(false)
  useEffect(() => {
    fetchFeesForAsset(asset)
      .then((result) => setGasFees(result))
      .catch(() => {
        // to avoid multiple alert rendering
        if (!alertStatus) {
          Alert.alert(labelTranslateFn('failedToFetchGasFee')!)
          setAlertStatus(true)
        }
      })
  }, [asset, networkFee, selectedQuote, type, alertStatus, setGasFees])

  //TODO add an ErrorBoundary component
  if (!gasFees)
    return (
      <Box>
        <Text tx="common.load" />
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
        customFeeProps={customFee}
        customFeeAsset={customFeeAsset}
        toAsset={toAsset}
        fromAsset={fromAsset}
        doubleLongTapFeelabel={doubleLongTapFeelabel}
        likelyWait={likelyWait}
      />
    </ErrorBoundary>
  )
}

export default SwapFeeSelector

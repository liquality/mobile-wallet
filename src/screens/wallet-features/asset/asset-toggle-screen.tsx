import React, { useCallback, useEffect, useState } from 'react'
import AssetManagement from '../../../components/asset-management'
import { RootStackParamList } from '../../../types'
import { StackScreenProps } from '@react-navigation/stack'

type AssetToggleScreenProps = StackScreenProps<
  RootStackParamList,
  'AssetToggleScreen'
>

const AssetToggleScreen = ({ route }: AssetToggleScreenProps) => {
  const [selectedAssetCodes, setSelectedAssetCodes] = useState<string[]>([])

  const handleEnableFeature = useCallback(
    (assetCode: string) => {
      const { onSelectAssetCodes } = route.params
      if (!onSelectAssetCodes) {
        return
      }

      const isSelected = selectedAssetCodes.includes(assetCode)
      const newAssetCodes = isSelected
        ? selectedAssetCodes.filter((type) => type !== assetCode)
        : [...new Set([...selectedAssetCodes, assetCode])]
      setSelectedAssetCodes(newAssetCodes)
      onSelectAssetCodes(newAssetCodes)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [route.params?.onSelectAssetCodes, selectedAssetCodes],
  )

  useEffect(() => {
    setSelectedAssetCodes(route.params.selectedAssetCodes || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AssetManagement
      enabledAssetCodes={selectedAssetCodes}
      onEnableFeature={handleEnableFeature}
    />
  )
}

export default AssetToggleScreen

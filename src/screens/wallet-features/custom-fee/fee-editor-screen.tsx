import React, { useEffect, useState } from 'react'

import {
  NavigationState,
  Route,
  SceneMap,
  SceneRendererProps,
  TabView,
} from 'react-native-tab-view'
import {
  Modal,
  Pressable,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native'
import {
  Box,
  Button,
  OVERVIEW_TAB_BAR_STYLE,
  OVERVIEW_TAB_STYLE,
  TabBar,
  Text,
} from '../../../theme'
import SlowIcon from '../../../assets/icons/slow.svg'
import AverageIcon from '../../../assets/icons/average.svg'
import FastIcon from '../../../assets/icons/fast.svg'
import CloseIcon from '../../../assets/icons/close.svg'
import { scale } from 'react-native-size-matters'
import ButtonFooter from '../../../components/button-footer'
import AssetIcon from '../../../components/asset-icon'
import { ChainId, getAsset } from '@liquality/cryptoassets'
import { useRecoilValue } from 'recoil'
import {
  fiatRatesState,
  networkState,
  selectedAssetState,
  walletState,
} from '../../../atoms'
import {
  getSendFee,
  isEIP1559Fees,
  maxFeePerUnitEIP1559,
} from '@liquality/wallet-core/dist/src/utils/fees'
import { FeeDetails as FDs } from '@chainify/types/dist/lib/Fees'
import { v4 as uuidv4 } from 'uuid'
import { fetchFeeDetailsForAsset } from '../../../store/store'
import { prettyFiatBalance } from '@liquality/wallet-core/dist/src/utils/coinFormatter'

type SpeedType = 'slow' | 'average' | 'fast'
const SLOW = 'slow'
const AVERAGE = 'average'
const FAST = 'fast'

const StandardRoute = () => {
  const activeNetwork = useRecoilValue(networkState)
  const fiatRates = useRecoilValue(fiatRatesState)
  const selectedAsset = useRecoilValue(selectedAssetState)
  const { activeWalletId, fees } = useRecoilValue(walletState)
  const [speed, setSpeed] = useState<SpeedType | undefined>()
  const [, setError] = useState('')
  const [gasFees, setGasFees] = useState<FDs>()

  const handleApplyPress = () => {}

  useEffect(() => {
    fetchFeeDetailsForAsset(selectedAsset).then(setGasFees)
  }, [setError, fees, activeWalletId, activeNetwork, gasFees, selectedAsset])

  return (
    <Box flex={1}>
      <Box
        flex={1}
        flexDirection="row"
        justifyContent="space-between"
        marginTop="xl">
        {Array.of<SpeedType>(SLOW, AVERAGE, FAST).map((speedType) => (
          <Pressable
            key={uuidv4()}
            onPress={() => {
              setSpeed(speedType)
            }}>
            <Box
              backgroundColor={
                speed === speedType
                  ? 'selectedBackgroundColor'
                  : 'blockBackgroundColor'
              }
              padding="l"
              width={scale(108)}
              height={scale(274)}
              borderRadius={3}>
              {speedType === SLOW ? (
                <SlowIcon />
              ) : speedType === AVERAGE ? (
                <AverageIcon />
              ) : (
                <FastIcon />
              )}
              <Text
                variant="gasIndicatorLabel"
                color="slowColor"
                marginTop="xl">
                {speedType.toUpperCase()}
              </Text>
              <Text variant="normalText" color="slowColor">
                {gasFees?.[speedType]?.wait
                  ? `~${gasFees[speedType].wait / 1000}s`
                  : ''}
              </Text>
              <Text
                variant="normalText"
                color="textColor"
                lineBreakMode={'middle'}
                numberOfLines={2}
                marginTop="l">
                ~{`${selectedAsset} ${gasFees?.[speedType]?.fee.toString()}`}
              </Text>
              <Text variant="normalText" color="textColor">
                {gasFees?.[speedType]?.fee &&
                  `$${prettyFiatBalance(
                    getSendFee(selectedAsset, gasFees[speedType].fee),
                    fiatRates[selectedAsset],
                  )}`}
              </Text>
              <Text variant="normalText" color="greyMeta" marginTop="l">
                max
              </Text>
              <Text variant="normalText" color="greyMeta">
                {gasFees?.[speedType].fee &&
                  `$${prettyFiatBalance(
                    getSendFee(
                      selectedAsset,
                      isEIP1559Fees(
                        getAsset(activeNetwork, selectedAsset).chain,
                      )
                        ? maxFeePerUnitEIP1559(gasFees[speedType].fee)
                        : gasFees?.[speedType].fee,
                    ),
                    fiatRates[selectedAsset],
                  )}`}
              </Text>
            </Box>
          </Pressable>
        ))}
      </Box>
      {speed}
      <ButtonFooter>
        <Button
          type="primary"
          variant="l"
          label={'APPLY'}
          onPress={handleApplyPress}
          isBorderless={true}
          isActive={!!speed}
        />
      </ButtonFooter>
    </Box>
  )
}

const CustomizeRoute = () => {
  return (
    <Box>
      <Text>Customize</Text>
    </Box>
  )
}

const renderScene = SceneMap({
  standard: StandardRoute,
  customize: CustomizeRoute,
})

type RenderTabBar = SceneRendererProps & {
  navigationState: NavigationState<Route>
}

type FeeEditorScreenType = {
  onClose: () => void
}

const FeeEditorScreen = ({ onClose }: FeeEditorScreenType) => {
  const layout = useWindowDimensions()
  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'standard', title: 'Standard' },
    { key: 'customize', title: 'Customize' },
  ])

  const renderTabBar = (props: RenderTabBar) => {
    return (
      <TabBar
        {...props}
        renderLabel={({ route, focused }) => (
          <Text
            variant={'tabLabel'}
            color={focused ? 'tablabelActiveColor' : 'tablabelInactiveColor'}>
            {route.title}
          </Text>
        )}
        tabStyle={OVERVIEW_TAB_BAR_STYLE}
        variant="light"
        style={OVERVIEW_TAB_STYLE}
      />
    )
  }

  return (
    <Modal visible>
      <SafeAreaView style={{ flex: 1 }}>
        <Box
          flex={1}
          paddingHorizontal="m"
          paddingTop="xl"
          backgroundColor="mainBackground">
          <Box
            flexDirection="row"
            alignItems={'center'}
            justifyContent={'space-between'}
            marginBottom={'xl'}>
            <Pressable onPress={onClose}>
              <CloseIcon width={15} height={15} />
            </Pressable>
            <Box flex={0.5} flexDirection="row" alignItems={'center'}>
              <AssetIcon size={20} chain={ChainId.Ethereum} />
              <Text>Network Speed/Fee</Text>
            </Box>
          </Box>
          <TabView
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            initialLayout={{ width: layout.width }}
          />
        </Box>
      </SafeAreaView>
    </Modal>
  )
}

export default FeeEditorScreen

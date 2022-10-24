import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabView,
} from 'react-native-tab-view'
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from 'react-native'
import {
  Box,
  Button,
  faceliftPalette,
  OVERVIEW_TAB_BAR_STYLE,
  OVERVIEW_TAB_STYLE,
  TabBar,
  Text,
} from '../../../theme'
import SlowIcon from '../../../assets/icons/slow.svg'
import AverageIcon from '../../../assets/icons/average.svg'
import FastIcon from '../../../assets/icons/fast.svg'
import CloseIcon from '../../../assets/icons/close.svg'
import SwapIcon from '../../../assets/icons/swap.svg'
import SwapProviderInfoIcon from '../../../assets/icons/swapProviderInfo.svg'
import { scale } from 'react-native-size-matters'
import ButtonFooter from '../../../components/button-footer'
import AssetIcon from '../../../components/asset-icon'
import { getAsset, getChain } from '@liquality/cryptoassets'
import { useRecoilValue } from 'recoil'
import {
  accountForAssetState,
  fiatRatesState,
  networkState,
} from '../../../atoms'
import {
  getSendFee,
  getSendTxFees,
  isEIP1559Fees,
  maxFeePerUnitEIP1559,
} from '@liquality/wallet-core/dist/src/utils/fees'
import { FeeDetails as FDs } from '@chainify/types/dist/lib/Fees'
import { v4 as uuidv4 } from 'uuid'
import {
  fetchFeeDetailsForAsset,
  fetchFeesForAsset,
} from '../../../store/store'
import {
  dpUI,
  prettyFiatBalance,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { BigNumber } from '@liquality/types'
import { labelTranslateFn } from '../../../utils'
import { useInputState } from '../../../hooks'
import { Fonts } from '../../../assets'
import { getNativeAsset } from '@liquality/wallet-core/dist/src/utils/asset'
import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { GasFees, TotalFees } from '../../../types'

type LikelyWaitObjType = {
  slow: number | undefined
  average: number | undefined
  fast: number | undefined
}

type PresetType = {
  amount: string
  fiat: string
  max: string
}
type SpeedType = 'slow' | 'average' | 'fast'
const SLOW = 'slow'
const AVERAGE = 'average'
const FAST = 'fast'

const StandardRoute = ({
  selectedAsset,
  amount,
  applyFee,
}: {
  selectedAsset: string
  amount: BigNumber
  applyFee: (fee: BigNumber) => void
}) => {
  const activeNetwork = useRecoilValue(networkState)
  const fiatRates = useRecoilValue(fiatRatesState)
  const [speed, setSpeed] = useState<SpeedType | undefined>()
  const [, setError] = useState('')
  const [gasFees, setGasFees] = useState<FDs>()
  const [totalFees, setTotalFees] = useState<TotalFees | undefined>()
  const nativeAssetCode = getNativeAsset(selectedAsset)
  const accountForAsset = useRecoilValue(accountForAssetState(nativeAssetCode))
  const [fee, setFee] = useState<GasFees | null>(null)
  const wallet = setupWallet({
    ...defaultOptions,
  })
  const { activeWalletId, fees } = wallet.state
  const [presets, setPresets] = useState<{
    speed: SpeedType
    preset: PresetType
  }>({})

  const handleApplyPress = () => {
    applyFee(new BigNumber(computePreset(speed)?.amount))
  }

  const computePreset = useCallback(
    (speedValue: SpeedType) => {
      if (!fee) return
      let preset = gasFees?.[speedValue] || null
      let totalFeesSpeed = totalFees?.[speedValue] || null
      let feeInSatOrGwei = fee?.[speedValue] || fee

      if (
        preset &&
        totalFeesSpeed &&
        isEIP1559Fees(getAsset(activeNetwork, selectedAsset).chain)
      ) {
        const gasFeeForSpeed = preset.fee
        const maxSendFee = getSendFee(
          selectedAsset,
          maxFeePerUnitEIP1559(gasFeeForSpeed),
        )

        let amountInNative = dpUI(
          getSendFee(selectedAsset, feeInSatOrGwei.toNumber()),
          6,
        ).toString()
        let fiat = prettyFiatBalance(totalFeesSpeed, fiatRates[selectedAsset])
        return {
          amount: amountInNative,
          fiat: fiat.toString(),
          max: prettyFiatBalance(
            maxSendFee,
            fiatRates[selectedAsset],
          ).toString(),
        }
      } else {
        let amountInNative = dpUI(
          getSendFee(selectedAsset, feeInSatOrGwei.toNumber()),
          9,
        ).toString()

        return {
          amount: amountInNative,
          fiat: prettyFiatBalance(
            Number(amountInNative),
            fiatRates[selectedAsset],
          ).toString(),
          max: labelTranslateFn('customFeeScreen.maxHere'),
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fee, gasFees],
  )

  useEffect(() => {
    async function fetchData() {
      const amtInpBg = new BigNumber(amount || 0)
      const totalFeesData = await getSendTxFees(
        accountForAsset?.id!,
        nativeAssetCode,
        amtInpBg,
      )
      setTotalFees(totalFeesData)
    }
    fetchData()
    const presetObject = {
      [SLOW]: computePreset(SLOW),
      [AVERAGE]: computePreset(AVERAGE),
      [FAST]: computePreset(FAST),
    }
    setPresets(presetObject)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computePreset])

  useEffect(() => {
    fetchFeesForAsset(selectedAsset).then(setFee)
    fetchFeeDetailsForAsset(selectedAsset).then(setGasFees)
  }, [setError, fees, activeWalletId, activeNetwork, selectedAsset])

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
                  ? `~ ${gasFees[speedType].wait / 1000}s`
                  : ''}
              </Text>
              {gasFees?.[speedType]?.fee && (
                <Text
                  variant="normalText"
                  color="textColor"
                  lineBreakMode={'middle'}
                  numberOfLines={2}
                  marginTop="l">
                  ~ {`${selectedAsset} ${presets[speedType]?.amount}`}
                </Text>
              )}

              <Text variant="normalText" color="textColor">
                {`$${presets[speedType]?.fiat}`}
              </Text>
              {isEIP1559Fees(getAsset(activeNetwork, selectedAsset).chain) &&
                gasFees?.[speedType].fee && (
                  <Fragment>
                    <Text variant="normalText" color="greyMeta" marginTop="l">
                      {labelTranslateFn('customFeeScreen.max')}
                    </Text>
                    <Text variant="normalText" color="greyMeta">
                      {`$${presets[speedType]?.max}`}
                    </Text>
                  </Fragment>
                )}
            </Box>
          </Pressable>
        ))}
      </Box>
      <ButtonFooter>
        <Button
          type="primary"
          variant="l"
          label={{ tx: 'common.apply' }}
          onPress={handleApplyPress}
          isBorderless={true}
          isActive={!!speed}>
          <Box marginLeft="s">
            <SwapIcon width={scale(20)} height={scale(15)} />
          </Box>
        </Button>
      </ButtonFooter>
    </Box>
  )
}

const CustomizeRoute = ({
  selectedAsset,
  amount,
  applyFee,
}: {
  selectedAsset: string
  amount: BigNumber
  applyFee: (fee: BigNumber) => void
}) => {
  const activeNetwork = useRecoilValue(networkState)
  const fiatRates = useRecoilValue(fiatRatesState)
  const [unit, setUnit] = useState<string | undefined>()
  const [speed, setSpeed] = useState<SpeedType>(SLOW)
  const [, setError] = useState('')
  const [currentBaseFee, setCurrentBaseFee] = useState()
  const [gasFees, setGasFees] = useState<FDs>()
  const nativeAssetCode = getNativeAsset(selectedAsset)
  const accountForAsset = useRecoilValue(accountForAssetState(nativeAssetCode))
  const [totalFees, setTotalFees] = useState<TotalFees>()
  const wallet = setupWallet({
    ...defaultOptions,
  })
  const { activeWalletId, fees } = wallet.state
  const [likelyWaitObj, setLikelyWaitObj] = useState<LikelyWaitObjType>()
  const minerTipInput = useInputState('0')
  const maxFeeInput = useInputState('0')

  const handleApplyPress = () => {
    applyFee(
      new BigNumber(minerTipInput.value).plus(new BigNumber(maxFeeInput.value)),
    )
  }

  const handleMinerTip = useCallback(
    (text: string) => {
      minerTipInput.onChangeText(text)
    },
    [minerTipInput],
  )

  const handleMaxFee = useCallback(
    (text: string) => {
      maxFeeInput.onChangeText(text)
    },
    [maxFeeInput],
  )

  const getSummaryMaximum = () => {
    if (totalFees && gasFees?.[speed]?.fee) {
      const maximumFee = maxFeePerUnitEIP1559({
        maxFeePerGas: Number(maxFeeInput.value),
        maxPriorityFeePerGas: Number(minerTipInput.value),
        suggestedBaseFeePerGas: Number(
          gasFees[speed].fee.suggestedBaseFeePerGas,
        ),
      })

      const totalMaxFee = getSendFee(nativeAssetCode, Number(maximumFee)).plus(
        totalFees.fast,
      )
      return {
        amount: new BigNumber(totalMaxFee).dp(6),
        fiat: prettyFiatBalance(totalFees.fast, fiatRates[nativeAssetCode]),
      }
    }
  }

  const getMinerTipFiat = () => {
    const fiat = prettyFiatBalance(
      getSendFee(nativeAssetCode, Number(minerTipInput.value) || 0),
      fiatRates[nativeAssetCode],
    )
    return isNaN(Number(fiat)) ? 0 : fiat
  }

  const getMaxFiat = () => {
    const fiat = prettyFiatBalance(
      getSendFee(nativeAssetCode, Number(maxFeeInput.value)),
      fiatRates[nativeAssetCode],
    )
    return isNaN(Number(fiat)) ? 0 : fiat
  }

  useEffect(() => {
    fetchFeeDetailsForAsset(selectedAsset).then(setGasFees)
  }, [setError, fees, activeWalletId, activeNetwork, selectedAsset])

  useEffect(() => {
    async function fetchData() {
      const amtInpBg = amount || new BigNumber(0)
      const totalFeesData = await getSendTxFees(
        accountForAsset?.id!,
        nativeAssetCode,
        amtInpBg,
      )
      setTotalFees(totalFeesData)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const feesForThisAsset =
      fees[activeNetwork]?.[activeWalletId]?.[selectedAsset]
    setLikelyWaitObj({
      slow: feesForThisAsset?.slow.wait,
      average: feesForThisAsset?.average.wait,
      fast: feesForThisAsset?.fast.wait,
    })
  }, [activeNetwork, activeWalletId, fees, selectedAsset, speed])

  useEffect(() => {
    setUnit(
      getChain(activeNetwork, getAsset(activeNetwork, selectedAsset).chain).fees
        .unit,
    )
    const feeDetails =
      fees?.[activeNetwork]?.[activeWalletId]?.[getNativeAsset(selectedAsset)]
    if (!feeDetails) {
      setError(labelTranslateFn('customFeeScreen.gasFeeMissing')!)
      return
    }

    if (typeof feeDetails[speed].fee !== 'number') {
      handleMinerTip(feeDetails[speed].fee.maxPriorityFeePerGas.toString())
      handleMaxFee(feeDetails[speed].fee.maxFeePerGas.toString())
      setCurrentBaseFee(feeDetails[speed].fee.suggestedBaseFeePerGas.toString())
    } else {
      handleMinerTip(feeDetails[speed].fee.toString())
      handleMaxFee(feeDetails[speed].fee.toString())
    }
  }, [
    activeNetwork,
    activeWalletId,
    fees,
    gasFees,
    handleMaxFee,
    handleMinerTip,
    selectedAsset,
    speed,
  ])

  return (
    <Box flex={1}>
      <Box flex={1} marginTop="m">
        <Text variant="normalText" color="greyMeta" marginTop="l">
          {labelTranslateFn('customFeeScreen.perGas')}
        </Text>
        <Box flexDirection="row" marginVertical={'m'}>
          <Text variant="normalText" marginRight={'m'}>
            {labelTranslateFn('customFeeScreen.currentBaseFee')}
          </Text>
          <Text variant="normalText" marginRight={'m'}>
            {'|'}
          </Text>
          <Text variant="normalText">{`${unit?.toUpperCase()} ${currentBaseFee}`}</Text>
        </Box>
        <Box marginTop="s" backgroundColor="blockBackgroundColor" padding="l">
          <Box flexDirection="row">
            <Text variant="normalText" marginRight={'m'}>
              {unit?.toUpperCase()}
            </Text>
            <Text variant="normalText" marginRight={'m'} color="greyMeta">
              {'|'}
            </Text>
            <Text variant="normalText" marginRight={'m'}>
              {labelTranslateFn('customFeeScreen.minerTip')}
            </Text>
            <Text variant="normalText" color="greyMeta">
              {labelTranslateFn('customFeeScreen.toSpeedUp')}
            </Text>
          </Box>
          <TextInput
            keyboardType={'numeric'}
            onChangeText={handleMinerTip}
            value={minerTipInput.value}
            autoCorrect={false}
            autoCapitalize={'none'}
            returnKeyType="done"
            style={styles.amountLarge}
          />
          <Box flexDirection="row" marginTop="s" alignItems={'flex-end'}>
            <Text
              variant="normalText"
              marginRight={'m'}
              style={styles.transparentBottomBorder}>
              {`$${getMinerTipFiat()}`}
            </Text>
            <Text
              variant="normalText"
              marginRight={'m'}
              color="greyMeta"
              style={styles.transparentBottomBorder}>
              {'|'}
            </Text>
            {Array.of<SpeedType>(SLOW, AVERAGE, FAST).map((speedValue) => (
              <Box marginRight="m" key={uuidv4()}>
                <Pressable
                  style={
                    speedValue === speed
                      ? styles.activeBottomBorder
                      : styles.transparentBottomBorder
                  }
                  onPress={() => setSpeed(speedValue)}>
                  <Text
                    variant={speedValue === speed ? 'activeLink' : 'normalText'}
                    marginRight="s">
                    {speedValue.toUpperCase()}
                  </Text>
                </Pressable>
              </Box>
            ))}
          </Box>
          <Box
            borderColor="secondaryButtonBorderColor"
            borderWidth={1}
            marginVertical="xl"
            borderRadius={3}
          />
          <Box flexDirection="row">
            <Text variant="normalText" marginRight={'m'}>
              {unit?.toLocaleUpperCase()}
            </Text>
            <Text color={'greyMeta'} variant="normalText" marginRight={'m'}>
              {'|'}
            </Text>
            <Text variant="normalText" marginRight={'m'}>
              {`${labelTranslateFn('customFeeScreen.maxFee')}`}
            </Text>
            <Text color={'greyMeta'} variant="normalText" marginRight={'m'}>
              {`${labelTranslateFn('customFeeScreen.perGas')}`}
            </Text>
          </Box>
          <TextInput
            keyboardType={'numeric'}
            onChangeText={handleMaxFee}
            value={maxFeeInput.value}
            autoCorrect={false}
            autoCapitalize={'none'}
            returnKeyType="done"
            style={styles.amountLarge}
          />
          <Text variant="normalText" color="greyMeta">
            {`$${getMaxFiat()}`}
          </Text>
        </Box>

        <Box flexDirection="row" marginVertical="xl">
          {speed === SLOW ? (
            <SlowIcon width={scale(20)} height={scale(20)} />
          ) : speed === AVERAGE ? (
            <AverageIcon width={scale(20)} height={scale(20)} />
          ) : (
            <FastIcon width={scale(20)} height={scale(20)} />
          )}
          <Box marginLeft={'m'}>
            <Box flexDirection="row">
              <Text variant="normalText">{`${labelTranslateFn(
                'customFeeScreen.custom',
              )}`}</Text>
              {likelyWaitObj?.[speed] && (
                <Text variant="normalText" marginLeft={'m'}>
                  {`${likelyWaitObj?.[speed]} sec`}
                </Text>
              )}
            </Box>
            <Text variant="normalText" color="greyMeta">
              {`~ ${getSummaryMaximum()?.amount} ${nativeAssetCode}`}
            </Text>
            <Text variant="normalText" color="greyMeta">
              {`~ $${getSummaryMaximum()?.fiat}`}
            </Text>
            <Text variant="normalText" color="greyMeta">
              {gasFees?.[speed].fee &&
                `${labelTranslateFn(
                  'customFeeScreen.max',
                )} $${prettyFiatBalance(
                  getSendFee(
                    selectedAsset,
                    maxFeePerUnitEIP1559(gasFees[speed].fee),
                  ),
                  fiatRates[selectedAsset],
                )}`}
            </Text>
          </Box>
        </Box>
      </Box>
      <ButtonFooter>
        <Button
          type="primary"
          variant="l"
          label={{ tx: 'common.apply' }}
          onPress={handleApplyPress}
          isBorderless={true}
          isActive>
          <Box marginLeft="s">
            <SwapIcon width={scale(20)} height={scale(15)} />
          </Box>
        </Button>
      </ButtonFooter>
    </Box>
  )
}

type RenderTabBar = SceneRendererProps & {
  navigationState: NavigationState<Route>
}

type FeeEditorScreenType = {
  onClose: Dispatch<SetStateAction<boolean>>
  amount: BigNumber
  selectedAsset: string
  applyFee: (fee: BigNumber) => void
}

const FeeEditorScreen = ({
  onClose,
  selectedAsset,
  amount,
  applyFee,
}: FeeEditorScreenType) => {
  const layout = useWindowDimensions()
  const [index, setIndex] = useState(0)
  const activeNetwork = useRecoilValue(networkState)
  const initialRoutes = [{ key: 'standard', title: 'Standard' }]
  if (isEIP1559Fees(getAsset(activeNetwork, selectedAsset).chain)) {
    initialRoutes.push({ key: 'customize', title: 'Customize' })
  }
  const [routes] = useState(initialRoutes)

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'standard':
        return (
          <StandardRoute
            selectedAsset={selectedAsset}
            amount={amount}
            applyFee={applyFee}
          />
        )
      case 'customize':
        return (
          <CustomizeRoute
            selectedAsset={selectedAsset}
            amount={amount}
            applyFee={applyFee}
          />
        )
    }
  }

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
            <Pressable onPress={() => onClose(false)}>
              <CloseIcon width={15} height={15} />
            </Pressable>
            <Box flex={0.5} flexDirection="row" alignItems={'center'}>
              <AssetIcon size={20} asset={selectedAsset} />
              <Text>{labelTranslateFn('common.networkSpeed')}</Text>
            </Box>
            <Pressable onPress={() => onClose(false)}>
              <SwapProviderInfoIcon width={24} height={20} />
            </Pressable>
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

const styles = StyleSheet.create({
  activeBottomBorder: {
    borderBottomColor: faceliftPalette.active,
    borderBottomWidth: 2,
  },
  transparentBottomBorder: {
    borderBottomColor: faceliftPalette.transparent,
    borderBottomWidth: 2,
  },
  amountLarge: {
    fontFamily: Fonts.Regular,
    fontWeight: '300',
    fontSize: 28,
  },
})

export default FeeEditorScreen

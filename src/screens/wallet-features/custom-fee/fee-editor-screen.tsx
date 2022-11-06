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
import SwapProviderInfoIcon from '../../../assets/icons/swapProviderInfo.svg'
import { scale } from 'react-native-size-matters'
import ButtonFooter from '../../../components/button-footer'
import AssetIcon from '../../../components/asset-icon'
import { getAsset, getChain, unitToCurrency } from '@liquality/cryptoassets'
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
import { fetchFeeDetailsForAsset } from '../../../store/store'
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
import {
  ActionEnum,
  CustomFeeLabel,
  ExtendedFeeLabel,
  TotalFees,
} from '../../../types'
import { FeeLabel } from '@liquality/wallet-core/dist/src/store/types'

type LikelyWaitObjType = {
  slow: number | undefined
  average: number | undefined
  fast: number | undefined
}

type PresetType = {
  amount: string
  fiat: string
  max: string | null
}
type PresetObjectType = {
  [K in FeeLabel]?: PresetType
}

const StandardRoute = ({
  selectedAsset,
  amount,
  applyFee,
  applyNetworkSpeed,
  networkSpeed,
}: {
  selectedAsset: string
  amount: BigNumber
  applyFee: (fee: BigNumber, speed: FeeLabel) => void
  applyNetworkSpeed?: (speedType: ExtendedFeeLabel) => void
  networkSpeed?: ExtendedFeeLabel
}) => {
  const activeNetwork = useRecoilValue(networkState)
  const fiatRates = useRecoilValue(fiatRatesState)
  const [speed, setSpeed] = useState<ExtendedFeeLabel | null>(
    networkSpeed || null,
  )
  const [gasFees, setGasFees] = useState<FDs>()
  const [totalFees, setTotalFees] = useState<TotalFees | undefined>()
  const nativeAssetCode = getNativeAsset(selectedAsset)
  const accountForAsset = useRecoilValue(accountForAssetState(nativeAssetCode))
  const [presets, setPresets] = useState<PresetObjectType>({})

  const handleApplyPress = () => {
    if (!speed || !totalFees || !gasFees) return
    const computed = computePreset(speed, totalFees, gasFees)?.amount
    if (computed) applyFee(new BigNumber(computed), speed)
    if (applyNetworkSpeed) {
      applyNetworkSpeed(speed as ExtendedFeeLabel)
    }
  }

  const computePreset = useCallback(
    (speedValue: FeeLabel, tf: TotalFees): PresetType | undefined => {
      if (!gasFees) return undefined
      let totalFeesSpeed = tf?.[speedValue] || null
      let feeInSatOrGwei = gasFees?.[speedValue].fee

      if (
        feeInSatOrGwei &&
        totalFeesSpeed &&
        isEIP1559Fees(getAsset(activeNetwork, selectedAsset).chain)
      ) {
        //TODO How to calculate maxSendFee
        const maxSendFee = maxFeePerUnitEIP1559(feeInSatOrGwei)
        let amountInNative = dpUI(feeInSatOrGwei, 6).toString()
        let fiat = prettyFiatBalance(feeInSatOrGwei, fiatRates[selectedAsset])

        return {
          amount: amountInNative,
          fiat: fiat.toString(),
          max: prettyFiatBalance(
            maxSendFee,
            fiatRates[selectedAsset],
          ).toString(),
        }
      } else {
        let amountInNative = dpUI(feeInSatOrGwei, 9).toString()

        return {
          amount: amountInNative,
          fiat: prettyFiatBalance(
            unitToCurrency(
              getAsset(activeNetwork, selectedAsset),
              Number(amountInNative),
            ),
            fiatRates[selectedAsset],
          ).toString(),
          max: labelTranslateFn('customFeeScreen.maxHere'),
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gasFees],
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
      const presetObject: PresetObjectType = {
        [FeeLabel.Slow]: computePreset(FeeLabel.Slow, totalFeesData, gasFees),
        [FeeLabel.Average]: computePreset(
          FeeLabel.Average,
          totalFeesData,
          gasFees,
        ),
        [FeeLabel.Fast]: computePreset(FeeLabel.Fast, totalFeesData, gasFees),
      }
      setPresets(presetObject)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computePreset])

  useEffect(() => {
    fetchFeeDetailsForAsset(selectedAsset).then(setGasFees)
  }, [activeNetwork, selectedAsset])

  return (
    <Box flex={1}>
      <Box
        flex={1}
        flexDirection="row"
        justifyContent="space-between"
        marginTop="xl">
        {Array.of<FeeLabel>(FeeLabel.Slow, FeeLabel.Average, FeeLabel.Fast).map(
          (feeLabel) => (
            <Pressable
              key={uuidv4()}
              onPress={() => {
                setSpeed(feeLabel)
              }}>
              <Box
                backgroundColor={
                  speed === feeLabel
                    ? 'selectedBackgroundColor'
                    : 'blockBackgroundColor'
                }
                padding="l"
                width={scale(108)}
                height={scale(274)}
                borderRadius={3}>
                {feeLabel === FeeLabel.Slow ? (
                  <SlowIcon />
                ) : feeLabel === FeeLabel.Average ? (
                  <AverageIcon />
                ) : (
                  <FastIcon />
                )}
                <Text
                  variant="gasIndicatorLabel"
                  color="slowColor"
                  marginTop="xl">
                  {feeLabel.toUpperCase()}
                </Text>
                <Text variant="normalText" color="slowColor">
                  {gasFees?.[feeLabel]?.wait
                    ? `~ ${gasFees[feeLabel].wait / 1000}s`
                    : ''}
                </Text>
                {gasFees?.[feeLabel]?.fee && (
                  <Text
                    variant="normalText"
                    color="textColor"
                    lineBreakMode={'middle'}
                    numberOfLines={2}
                    marginTop="l">
                    ~ {`${selectedAsset} ${presets[feeLabel]?.amount}`}
                  </Text>
                )}

                <Text variant="normalText" color="textColor">
                  {`$${presets[feeLabel]?.fiat}`}
                </Text>
                {isEIP1559Fees(getAsset(activeNetwork, selectedAsset).chain) &&
                  gasFees?.[feeLabel].fee && (
                    <Fragment>
                      <Text variant="normalText" color="greyMeta" marginTop="l">
                        {labelTranslateFn('customFeeScreen.max')}
                      </Text>
                      <Text variant="normalText" color="greyMeta">
                        {`$${presets[feeLabel]?.max}`}
                      </Text>
                    </Fragment>
                  )}
              </Box>
            </Pressable>
          ),
        )}
      </Box>
      <ButtonFooter>
        <Button
          type="primary"
          variant="l"
          label={{ tx: 'common.apply' }}
          onPress={handleApplyPress}
          isBorderless={true}
          isActive={!!speed}
        />
      </ButtonFooter>
    </Box>
  )
}

const CustomizeRoute = ({
  selectedAsset,
  amount,
  applyFee,
  applyNetworkSpeed,
  networkSpeed,
}: {
  selectedAsset: string
  amount: BigNumber
  applyFee: (fee: BigNumber, speed: FeeLabel) => void
  applyNetworkSpeed?: (speedType: ExtendedFeeLabel) => void
  networkSpeed?: ExtendedFeeLabel
}) => {
  const activeNetwork = useRecoilValue(networkState)
  const fiatRates = useRecoilValue(fiatRatesState)
  const [unit, setUnit] = useState<string | undefined>()
  const [speed, setSpeed] = useState<ExtendedFeeLabel>(
    networkSpeed || FeeLabel.Slow,
  )
  const [, setError] = useState('')
  const [currentBaseFee, setCurrentBaseFee] = useState()
  const [gasFees, setGasFees] = useState<FDs>()
  const nativeAssetCode = getNativeAsset(selectedAsset)
  const accountForAsset = useRecoilValue(accountForAssetState(nativeAssetCode))
  const [totalFees, setTotalFees] = useState<TotalFees>()
  const wallet = setupWallet({
    ...defaultOptions,
  })
  const { activeWalletId } = wallet.state
  const [likelyWaitObj, setLikelyWaitObj] = useState<LikelyWaitObjType>()
  const minerTipInput = useInputState('0')
  const maxFeeInput = useInputState('0')

  const handleApplyPress = () => {
    applyFee(
      new BigNumber(minerTipInput.value).plus(new BigNumber(maxFeeInput.value)),
      speed,
    )
    if (applyNetworkSpeed && speed) {
      applyNetworkSpeed(CustomFeeLabel.Custom)
    }
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
    fetchFeeDetailsForAsset(selectedAsset).then((gf) => {
      setLikelyWaitObj({
        slow: gf?.slow.wait,
        average: gf?.average.wait,
        fast: gf?.fast.wait,
      })
      setGasFees(gf)
    })
  }, [setError, activeWalletId, activeNetwork, selectedAsset])

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
    setUnit(
      getChain(activeNetwork, getAsset(activeNetwork, selectedAsset).chain).fees
        .unit,
    )
    if (!gasFees) {
      setError(labelTranslateFn('customFeeScreen.gasFeeMissing')!)
      return
    }

    if (typeof gasFees[speed].fee !== 'number') {
      handleMinerTip(gasFees[speed].fee.maxPriorityFeePerGas.toString())
      handleMaxFee(gasFees[speed].fee.maxFeePerGas.toString())
      setCurrentBaseFee(gasFees[speed].fee.suggestedBaseFeePerGas.toString())
    } else {
      handleMinerTip(gasFees[speed].fee.toString())
      handleMaxFee(gasFees[speed].fee.toString())
    }
  }, [
    activeNetwork,
    activeWalletId,
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
            {Array.of<FeeLabel>(
              FeeLabel.Slow,
              FeeLabel.Average,
              FeeLabel.Fast,
            ).map((speedValue) => (
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
          {speed === FeeLabel.Slow ? (
            <SlowIcon width={scale(20)} height={scale(20)} />
          ) : speed === FeeLabel.Average ? (
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
          isActive
        />
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
  applyFee: (fee: BigNumber, speed: FeeLabel) => void
  networkSpeed?: ExtendedFeeLabel
  applyNetworkSpeed?: (speedType: ExtendedFeeLabel) => void
  transactionType: ActionEnum
}

const FeeEditorScreen = ({
  onClose,
  selectedAsset,
  amount,
  applyFee,
  networkSpeed,
  applyNetworkSpeed,
  transactionType,
}: FeeEditorScreenType) => {
  const layout = useWindowDimensions()
  const activeNetwork = useRecoilValue(networkState)
  const initialRoutes = [{ key: 'standard', title: 'Standard' }]
  let currentIndex = 0
  if (!isEIP1559Fees(getAsset(activeNetwork, selectedAsset).chain)) {
    initialRoutes.push({ key: 'customize', title: 'Customize' })
    if (networkSpeed === CustomFeeLabel.Custom) {
      currentIndex = 1
    }
  }
  const [index, setIndex] = useState(currentIndex)
  const [routes] = useState(initialRoutes)

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'standard':
        return (
          <StandardRoute
            selectedAsset={selectedAsset}
            amount={amount}
            applyFee={applyFee}
            networkSpeed={networkSpeed}
            applyNetworkSpeed={applyNetworkSpeed}
          />
        )
      case 'customize':
        return (
          <CustomizeRoute
            selectedAsset={selectedAsset}
            amount={amount}
            applyFee={applyFee}
            networkSpeed={networkSpeed}
            applyNetworkSpeed={applyNetworkSpeed}
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
          paddingHorizontal="xl"
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
            {transactionType === ActionEnum.SWAP ? (
              <Pressable onPress={() => onClose(false)}>
                <SwapProviderInfoIcon width={24} height={20} />
              </Pressable>
            ) : (
              <Box width={24} />
            )}
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

import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from 'react'

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
import { scale } from 'react-native-size-matters'
import ButtonFooter from '../../../components/button-footer'
import AssetIcon from '../../../components/asset-icon'
import { ChainId, getAsset, getChain } from '@liquality/cryptoassets'
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
import { BigNumber } from '@liquality/types'
import { labelTranslateFn } from '../../../utils'
import { useInputState } from '../../../hooks'
import { Fonts } from '../../../assets'

type SpeedType = 'slow' | 'average' | 'fast'
const SLOW = 'slow'
const AVERAGE = 'average'
const FAST = 'fast'

type MinerTipType = 'low' | 'medium' | 'high'
const LOW = 'low'
const MEDIUM = 'medium'
const HIGH = 'high'

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
                  ? `~${gasFees[speedType].wait / 1000}s`
                  : ''}
              </Text>
              {gasFees?.[speedType]?.fee && (
                <Text
                  variant="normalText"
                  color="textColor"
                  lineBreakMode={'middle'}
                  numberOfLines={2}
                  marginTop="l">
                  ~{`${selectedAsset} ${gasFees?.[speedType]?.fee.toString()}`}
                </Text>
              )}

              <Text variant="normalText" color="textColor">
                {gasFees?.[speedType]?.fee &&
                  `$${prettyFiatBalance(
                    getSendFee(selectedAsset, gasFees[speedType].fee),
                    fiatRates[selectedAsset],
                  )}`}
              </Text>
              {isEIP1559Fees(getAsset(activeNetwork, selectedAsset).chain) && (
                <Fragment>
                  <Text variant="normalText" color="greyMeta" marginTop="l">
                    max
                  </Text>
                  <Text variant="normalText" color="greyMeta">
                    {gasFees?.[speedType].fee &&
                      `$${prettyFiatBalance(
                        getSendFee(
                          selectedAsset,
                          maxFeePerUnitEIP1559(gasFees[speedType].fee),
                        ),
                        fiatRates[selectedAsset],
                      )}`}
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
  const activeNetwork = useRecoilValue(networkState)
  const fiatRates = useRecoilValue(fiatRatesState)
  const selectedAsset = useRecoilValue(selectedAssetState)
  const [minerTipLevel, setMinerTipLevel] = useState<MinerTipType>(LOW)
  const [unit, setUnit] = useState<string | undefined>()

  const handleApplyPress = () => {}

  const minerTipInput = useInputState('0')
  const maxFeeInput = useInputState('0')

  const handleMinerTip = (text: string) => {
    minerTipInput.onChangeText(text)
  }

  const handleMaxFee = (text: string) => {
    maxFeeInput.onChangeText(text)
  }

  useEffect(() => {
    setUnit(
      getChain(activeNetwork, getAsset(activeNetwork, selectedAsset).chain).fees
        .unit,
    )
  }, [activeNetwork, selectedAsset])

  return (
    <Box flex={1}>
      <Box flex={1} marginTop="m">
        <Text variant="normalText" color="greyMeta" marginTop="l">
          {`${labelTranslateFn('customFeeScreen.perGas')}`}
        </Text>
        <Box flexDirection="row" marginVertical={'m'}>
          <Text variant="normalText" marginRight={'m'}>
            {`${labelTranslateFn('customFeeScreen.currentBaseFee')}`}
          </Text>
          <Text variant="normalText" marginRight={'m'}>
            {'|'}
          </Text>
          <Text variant="normalText">{`${unit?.toUpperCase()} 151`}</Text>
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
              {`${labelTranslateFn('customFeeScreen.minerTip')}`}
            </Text>
            <Text variant="normalText" color="greyMeta">
              TO SPEED UP
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
              {`$${prettyFiatBalance(
                getSendFee(selectedAsset, Number(minerTipInput.value)),
                fiatRates[selectedAsset],
              )}`}
            </Text>
            <Text
              variant="normalText"
              marginRight={'m'}
              color="greyMeta"
              style={styles.transparentBottomBorder}>
              {'|'}
            </Text>
            {Array.of<MinerTipType>(LOW, MEDIUM, HIGH).map((minerTipValue) => (
              <Box marginRight="m">
                <Pressable
                  key={uuidv4()}
                  style={
                    minerTipValue === minerTipLevel
                      ? styles.activeBottomBorder
                      : styles.transparentBottomBorder
                  }
                  onPress={() => setMinerTipLevel(minerTipValue)}>
                  <Text
                    variant={
                      minerTipValue === minerTipLevel
                        ? 'activeLink'
                        : 'normalText'
                    }
                    marginRight="s">
                    {minerTipValue.toUpperCase()}
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
              {`${labelTranslateFn('customFeeScreen.toSpeedUp')}`}
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
            {`$${prettyFiatBalance(
              getSendFee(selectedAsset, Number(maxFeeInput.value)),
              fiatRates[selectedAsset],
            )}`}
          </Text>
        </Box>

        <Box flexDirection="row" marginVertical="xl">
          <SlowIcon width={scale(20)} height={scale(20)} />
          <Box marginLeft={'m'} marginTop="s">
            <Box flexDirection="row">
              <Text variant="normalText">{`${labelTranslateFn(
                'customFeeScreen.custom',
              )}`}</Text>
              <Text variant="normalText" marginLeft={'m'}>
                {'< 15 sec'}
              </Text>
            </Box>
            <Text variant="normalText" color="greyMeta">
              {`~0.20390 ${unit}`}
            </Text>
            <Text variant="normalText" color="greyMeta">
              {'~$123.34'}
            </Text>
            <Text variant="normalText" color="greyMeta">
              {`${labelTranslateFn('customFeeScreen.max')} $123`}
            </Text>
          </Box>
        </Box>
      </Box>
      <ButtonFooter>
        <Button
          type="primary"
          variant="l"
          label={'APPLY'}
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
}

const FeeEditorScreen = ({ onClose }: FeeEditorScreenType) => {
  const layout = useWindowDimensions()
  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'standard', title: 'Standard' },
    { key: 'customize', title: 'Customize' },
  ])

  const renderScene = SceneMap({
    standard: StandardRoute,
    customize: CustomizeRoute,
  })

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

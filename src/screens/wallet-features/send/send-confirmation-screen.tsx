import React from 'react'
import { StyleSheet, ScrollView, View, Dimensions } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { unitToCurrency, getChain, getAsset } from '@liquality/cryptoassets'
import { SendHistoryItem } from '@liquality/wallet-core/dist/src/store/types'
import { MainStackParamList } from '../../../types'
import SendTransactionDetails from '../../../components/send/send-transaction-details'
import ProgressCircle from '../../../components/animations/progress-circle'
import { Box, faceliftPalette, palette, Text, theme } from '../../../theme'
import { formatDate } from '../../../utils'
import { useRecoilValue } from 'recoil'
import {
  fiatRatesState,
  historyStateFamily,
  networkState,
} from '../../../atoms'
import { AppIcons, Fonts } from '../../../assets'
import { prettyFiatBalance } from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { Path, Svg } from 'react-native-svg'
import AssetIcon from '../../../components/asset-icon'
import { scale } from 'react-native-size-matters'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'

const { CompletedIcon: SuccessIcon } = AppIcons

type SendConfirmationScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'SendConfirmationScreen'
>

const ConfirmationComponent: React.FC<SendConfirmationScreenProps> = React.memo(
  (props) => {
    const { route } = props
    const transaction = route.params.sendTransactionConfirmation!
    const historyItem = useRecoilValue(
      historyStateFamily(transaction.id),
    ) as SendHistoryItem
    const activeNetwork = useRecoilValue(networkState)
    const fiatRates = useRecoilValue(fiatRatesState)

    const amountInNative = () => {
      return unitToCurrency(
        getAsset(activeNetwork, historyItem.from),
        historyItem.tx.value,
      ).toNumber()
    }
    const amountInFiatNow = () => {
      return prettyFiatBalance(amountInNative(), fiatRates[historyItem.from])
    }

    const amountInFiatThen = () => {
      return prettyFiatBalance(amountInNative(), historyItem.fiatRate)
    }

    const gasPricePerUnit = (): string => {
      if (!historyItem.tx?.feePrice) return 'N/A'
      return `${Math.floor(
        historyItem.tx.feePrice /
          getChain(
            activeNetwork,
            getAsset(activeNetwork, historyItem.from).chain,
          ).gasLimit.send.native,
      )}`
    }

    const getBackgroundBox = (height: number) => {
      const width = Dimensions.get('screen').width - theme.spacing.xl
      const flatRadius = 30
      return (
        <Box
          alignItems="center"
          justifyContent="center"
          shadowColor={'darkGrey'}
          shadowOffset={{ width: 4, height: 6 }}
          shadowOpacity={1}
          shadowRadius={2}
          elevation={2}
          style={StyleSheet.absoluteFillObject}>
          <Svg
            width={`${width}`}
            height={`${height}`}
            viewBox={`0 0 ${width} ${height}`}
            fill="none">
            <Path
              d={`M0 0 H ${
                width - flatRadius
              } L ${width} ${flatRadius} V ${height} H ${0} V ${0} Z`}
              fill={faceliftPalette.white}
              strokeWidth={3}
              stroke={faceliftPalette.darkGrey}
              strokeLinejoin={'bevel'}
              strokeLinecap={'round'}
            />
          </Svg>
        </Box>
      )
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Box
          paddingVertical="xl"
          paddingHorizontal="xxl"
          flexDirection={'row'}
          alignItems={'center'}>
          {getBackgroundBox(scale(135))}
          <Box flexDirection={'row'} alignItems={'flex-end'}>
            <AssetIcon
              size={scale(60)}
              chain={getAsset(activeNetwork, historyItem.from).chain}
            />
            <AssetIcon
              size={scale(30)}
              styles={{ left: -10 }}
              asset={historyItem.from}
            />
          </Box>

          <Box marginLeft={'mxxl'}>
            <Text
              fontFamily={Fonts.JetBrainsMono}
              fontSize={scale(17)}
              fontWeight={'400'}
              color={'darkGrey'}
              marginBottom={'m'}>
              {historyItem.from}
            </Text>
            <Text variant={'amountMedium'} color={'darkGrey'}>
              {historyItem.fee}
            </Text>
            <Text variant={'amountMedium'} color={'activeLink'}>
              {shortenAddress(historyItem.toAddress)}
            </Text>
          </Box>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          paddingHorizontal="xl"
          marginTop={'lxxl'}
          marginBottom="xl">
          <Box>
            <Text
              variant="amountLabel"
              tx="sendConfirmationScreeen.status"
              textTransform={'capitalize'}
            />
            <Text variant="normalText">
              {historyItem.status === 'SUCCESS'
                ? `Completed | ${
                    getChain(
                      activeNetwork,
                      getAsset(activeNetwork, historyItem.from).chain,
                    ).safeConfirmations
                  } confirmations`
                : `Pending | ${
                    getChain(
                      activeNetwork,
                      getAsset(activeNetwork, historyItem.from).chain,
                    ).safeConfirmations - (historyItem.tx.confirmations || 0)
                  } confirmations`}
            </Text>
          </Box>
          {historyItem.status === 'SUCCESS' ? (
            <SuccessIcon />
          ) : (
            <ProgressCircle
              radius={17}
              current={historyItem.tx.confirmations || 0}
              total={
                getChain(
                  activeNetwork,
                  getAsset(activeNetwork, historyItem.from).chain,
                ).safeConfirmations
              }
            />
          )}
        </Box>
        <Box
          justifyContent="space-between"
          paddingHorizontal="xl"
          marginBottom="xl">
          <Text
            variant="amountLabel"
            tx="sendConfirmationScreeen.initiated"
            textTransform={'capitalize'}
          />
          <Text variant="normalText">{formatDate(historyItem.startTime)}</Text>
        </Box>
        {!historyItem.endTime && (
          <Box
            justifyContent="space-between"
            paddingHorizontal="xl"
            marginBottom="xl">
            <Text
              variant="amountLabel"
              tx="sendConfirmationScreeen.completed"
              textTransform={'capitalize'}
            />
            <Text variant="normalText">{formatDate(historyItem.endTime)}</Text>
          </Box>
        )}
        <Box
          justifyContent="space-between"
          paddingHorizontal="xl"
          marginBottom="xl">
          <Text
            variant="amountLabel"
            tx="sendConfirmationScreeen.sent"
            textTransform={'capitalize'}
          />
          <Box flexDirection={'row'} alignItems={'center'}>
            <Text variant="normalText">
              {`${amountInNative()} ${historyItem.from}`}
            </Text>
            <Text variant={'bar'} marginHorizontal={'m'}>
              |
            </Text>
            <Text variant="normalText">{`$${amountInFiatNow()} today, $${amountInFiatThen()} then`}</Text>
          </Box>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          paddingHorizontal="xl">
          <Box>
            <Text
              variant="amountLabel"
              tx="sendConfirmationScreeen.networkSpeed"
              textTransform={'capitalize'}
            />
            <Box flexDirection={'row'} alignItems={'center'}>
              <Text variant="normalText">
                {`${historyItem.from} Fee: ${gasPricePerUnit()}x ${
                  getChain(
                    activeNetwork,
                    getAsset(activeNetwork, historyItem.from).chain,
                  ).fees.unit
                }/Unit`}
              </Text>
              <Text variant={'bar'} marginHorizontal={'m'}>
                |
              </Text>
              <Text variant="normalText">
                {`${historyItem.fee} ${getChain(
                  activeNetwork,
                  getAsset(activeNetwork, historyItem.from).chain,
                ).fees.unit.toUpperCase()}`}
              </Text>
            </Box>
          </Box>
        </Box>
        <Box paddingHorizontal={'xl'}>
          {historyItem && <SendTransactionDetails historyItem={historyItem} />}
        </Box>
      </ScrollView>
    )
  },
)

const SendConfirmationScreen: React.FC<SendConfirmationScreenProps> = ({
  route,
  navigation,
}) => {
  return (
    <React.Suspense
      fallback={
        <View>
          <Text tx="sendConfirmationScreeen.load" />
        </View>
      }>
      <ConfirmationComponent navigation={navigation} route={route} />
    </React.Suspense>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.white,
    paddingVertical: 15,
  },
})

export default SendConfirmationScreen

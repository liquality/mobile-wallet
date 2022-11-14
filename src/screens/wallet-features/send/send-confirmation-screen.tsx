import React from 'react'
import { StyleSheet, ScrollView, View, Dimensions, Linking } from 'react-native'
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
import { scale } from 'react-native-size-matters'
import { getTransactionExplorerLink } from '@liquality/wallet-core/dist/src/utils/asset'
import CombinedChainAssetIcons from '../../../components/ui/CombinedChainAssetIcons'

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

    const shortenHash = (hash: string) => {
      return `${hash.slice(0, 6)}...${hash.slice(hash.length - 4)}`
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

    const handleTansactionHashPress = () => {
      Linking.openURL(
        getTransactionExplorerLink(
          historyItem.tx.hash,
          historyItem.from,
          historyItem.network,
        ),
      )
    }

    const getBackgroundBox = (height: number) => {
      const width = Dimensions.get('screen').width - theme.spacing.xl
      const flatRadius = 30
      const SHADOW_WIDTH = 6

      return (
        <Box
          alignItems="center"
          justifyContent="center"
          style={StyleSheet.absoluteFillObject}>
          <Svg
            width={`${width}`}
            height={`${height}`}
            viewBox={`0 0 ${width} ${height}`}
            fill="none">
            <Path
              d={`
              M10 40 
              H ${width - 5}
              Q ${width},40 ${width},49 
              V ${height - 9} 
              Q ${width},${height} ${width - 9},${height} 
              H ${19} 
              Q ${10}, ${height} 
                ${10}, ${height - 9}
              V ${70} 
              Z`}
              fill={faceliftPalette.darkGrey}
              strokeWidth={4}
              stroke={faceliftPalette.darkGrey}
              strokeLinejoin={'round'}
              strokeLinecap={'round'}
            />
            <Path
              d={`
                  M10 0 
                  H ${width - flatRadius} 
                  L ${width - SHADOW_WIDTH} ${flatRadius} 
                  V ${height - SHADOW_WIDTH - 9}
                  Q ${width - SHADOW_WIDTH}, ${height - SHADOW_WIDTH} 
                    ${width - SHADOW_WIDTH - 9}, ${height - SHADOW_WIDTH} 
                  H ${9} 
                  Q ${0}, ${height - SHADOW_WIDTH} 
                    ${0}, ${height - SHADOW_WIDTH - 9}
                  V ${9} 
                  Q ${0}, ${0} 
                    ${9}, ${0}
                  Z
                  `}
              fill={faceliftPalette.white}
              strokeWidth={3}
              stroke={faceliftPalette.darkGrey}
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
            <CombinedChainAssetIcons
              chain={getAsset(activeNetwork, historyItem.from).chain}
              code={historyItem.from}
              scaleMultiplier={2}
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
            <Text
              variant={'amountMedium'}
              color={'activeLink'}
              onPress={handleTansactionHashPress}>
              {shortenHash(historyItem.tx.hash)}
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

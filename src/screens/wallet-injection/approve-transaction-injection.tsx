import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet } from 'react-native'
import { useRecoilValue } from 'recoil'

import { emitterController } from '../../controllers/emitterController'
import { INJECTION_REQUESTS } from '../../controllers/constants'
import { Box, Button, faceliftPalette, Text } from '../../theme'
import { RootStackParamList } from '../../types'
import { accountForAssetState, fiatRatesState, networkState } from '../../atoms'
import { Fonts } from '../../assets'
import { sendTransaction } from '../../store/store'
import { getNativeAssetCode, IChain } from '@liquality/cryptoassets'
import { BigNumber } from '@liquality/types'
import { FeeLabel } from '@liquality/wallet-core/dist/src/store/types'
import { scale } from 'react-native-size-matters'
import ReviewDrawer from '../../components/review-drawer'
import { getChainNameByChainIdNumber } from '../../utils/others'
import { prettyFiatBalance } from '@liquality/wallet-core/dist/src/utils/coinFormatter'

const { OFF_SEND_TRANSACTION } = INJECTION_REQUESTS

type ApproveTransactionInjectionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ApproveTransactionInjectionScreen'
>

const ApproveTransactionInjectionScreen = ({
  navigation,
  route,
}: ApproveTransactionInjectionScreenProps) => {
  const activeNetwork = useRecoilValue(networkState)
  const { chainId, walletConnectData } = route.params
  const [showReviewDrawer, setShowReviewDrawer] = useState(false)
  const [connectedChain, setConnectedChain] = useState<[string, IChain]>()
  const accountForConnectedChain = useRecoilValue(
    accountForAssetState(
      !connectedChain
        ? 'ETH'
        : getNativeAssetCode(activeNetwork, connectedChain[0]),
    ),
  )
  const fiatRates = useRecoilValue(fiatRatesState)

  useEffect(() => {
    async function fetchData() {
      if (chainId) {
        let chainConnected = await getChainNameByChainIdNumber(chainId)
        setConnectedChain(chainConnected)
      }
    }
    fetchData()
  }, [activeNetwork, chainId])

  const send = async () => {
    let asset = getNativeAssetCode(activeNetwork, connectedChain[0])

    try {
      const hash = await sendTransaction({
        asset,
        activeNetwork,
        to: walletConnectData.to,
        value: walletConnectData.value
          ? new BigNumber(parseInt(walletConnectData.value, 10))
          : new BigNumber(0),
        fee: walletConnectData.gas,
        feeLabel: FeeLabel.Average,
        memo: walletConnectData.data,
      })

      emitterController.emit(OFF_SEND_TRANSACTION, hash)
      navigation.navigate('OverviewScreen')
    } catch (_error) {
      Alert.alert('Transaction failed', _error)
    }
  }

  const reject = () => {
    navigation.navigate('OverviewScreen')
  }

  const renderBalancesAndAmounts = () => {
    if (connectedChain) {
      return {
        totalNativeBalance:
          accountForConnectedChain?.assets[
            getNativeAssetCode(activeNetwork, connectedChain[0])
          ].balance,
        valueInNative: new BigNumber(parseInt(walletConnectData.value, 10)),
        valueAmountInDollars: prettyFiatBalance(
          new BigNumber(parseInt(walletConnectData.value, 10)),
          fiatRates.MATIC,
        ).toString(),
      }
    }
  }

  return (
    <Box flex={1} backgroundColor={'white'} paddingHorizontal={'screenPadding'}>
      {/* TODO: Style the review drawer according to figma designs */}
      {showReviewDrawer ? (
        <ReviewDrawer
          destinationAddress={''}
          handlePressSend={send}
          title={'Review Transaction'}
          accountId={''}
          setShowDrawer={setShowReviewDrawer}
        />
      ) : null}
      <Box>
        <Text style={styles.headerText}>Transaction Request</Text>
      </Box>
      <Text style={styles.permissionText}>
        [dApp] is asking to spend your money. [transaction type]
      </Text>
      {connectedChain ? (
        <Box flexDirection={'row'}>
          <Text style={(styles.text, styles.subheadingInfo)}>
            <Text fontWeight={'700'}>
              SEND {getNativeAssetCode(activeNetwork, connectedChain[0])}
            </Text>{' '}
            {renderBalancesAndAmounts()?.totalNativeBalance} Balance
          </Text>
        </Box>
      ) : null}

      <Text style={(styles.text, styles.balanceText)}>0.000 | $0</Text>
      <Text style={styles.purpleLink} tx={'common.networkSpeed'} />
      <Box height={scale(170)} />

      <Box width={'100%'}>
        <Button
          type="primary"
          variant="l"
          label={'Approve'}
          onPress={send}
          isBorderless={true}
          appendChildren={false}
        />
        <Button
          type="secondary"
          variant="l"
          label={'Deny'}
          onPress={reject}
          isBorderless={true}
          isActive={true}
        />
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.5,
    fontSize: 42,

    marginTop: 30,
    color: faceliftPalette.darkGrey,
  },
  permissionText: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.5,
    fontSize: 17,

    color: faceliftPalette.black,
  },

  text: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  balanceText: {
    fontSize: 25,
    marginTop: scale(10),
    color: faceliftPalette.darkGrey,
    fontWeight: '300',
  },

  subheadingInfo: {
    color: faceliftPalette.greyBlack,
    fontSize: 15,
    marginTop: scale(5),
  },

  purpleLink: {
    fontSize: 18,
    marginTop: scale(10),
    color: faceliftPalette.switchActiveColor,
    fontWeight: '400',
  },
})

export default ApproveTransactionInjectionScreen

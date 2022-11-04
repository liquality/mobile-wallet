import { Box, Button, faceliftPalette, Text } from '../../../theme'
import { Modal, Pressable } from 'react-native'
import { labelTranslateFn } from '../../../utils'
import { scale } from 'react-native-size-matters'
import React, { useEffect, useState } from 'react'
import { BigNumber } from '@liquality/types'
import { prettyFiatBalance } from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { getSendFee } from '@liquality/wallet-core/dist/src/utils/fees'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
import i18n from 'i18n-js'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import {
  fiatRatesState,
  historyIdsState,
  historyStateFamily,
  networkState,
} from '../../../atoms'
import {
  FeeLabel,
  HistoryItem,
} from '@liquality/wallet-core/dist/src/store/types'
import { sendTransaction } from '../../../store/store'
import { currencyToUnit, getAsset } from '@liquality/cryptoassets'
import { NavigationProp, useNavigation } from '@react-navigation/core'
import { AccountType, MainStackParamList } from '../../../types'
import CloseIcon from '../../../assets/icons/close.svg'

type SendReviewDrawerScreenProps = {
  amount: number
  gasFee: number
  speedLabel: FeeLabel
  destinationAddress: string
  asset: string
  memo?: string
  assetData: AccountType
  onClose: () => void
}
const SendReviewScreen = (props: SendReviewDrawerScreenProps) => {
  const {
    asset,
    destinationAddress,
    gasFee,
    amount,
    speedLabel,
    assetData,
    onClose,
  } = props
  const [rate, setRate] = useState<number>(0)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fiatRates = useRecoilValue(fiatRatesState)
  const activeNetwork = useRecoilValue(networkState)
  const ids = useRecoilValue(historyIdsState)
  const addTransaction = useRecoilCallback(
    ({ set }) =>
      (transactionId: string, historyItem: HistoryItem) => {
        set(historyIdsState, [...ids, transactionId])
        set(historyStateFamily(transactionId), historyItem)
      },
  )
  const navigation = useNavigation<NavigationProp<MainStackParamList>>()

  const handleSendPress = async () => {
    setIsLoading(true)
    if (!asset || !destinationAddress || !amount || !gasFee || !activeNetwork) {
      setError(labelTranslateFn('sendReviewScreen.inputDataInvalid')!)
      return
    }

    try {
      const transaction = await sendTransaction({
        asset,
        activeNetwork,
        to: destinationAddress,
        value: new BigNumber(
          currencyToUnit(getAsset(activeNetwork, asset), amount).toNumber(),
        ),
        fee: gasFee,
        feeLabel: speedLabel,
        memo: '',
      })

      delete transaction.tx._raw

      addTransaction(transaction.id, transaction)

      onClose()
      navigation.navigate('SendConfirmationScreen', {
        screenTitle: i18n.t('sendReviewScreen.sendTransDetails'),
        sendTransactionConfirmation: transaction,
        assetData,
        fee: gasFee,
      })
    } catch (_error) {
      setIsLoading(false)
      setError(labelTranslateFn('sendReviewScreen.failedTrans')! + _error)
    }
  }

  useEffect(() => {
    if (!fiatRates || !asset || !fiatRates[asset]) {
      setError(labelTranslateFn('sendReviewScreen.rateNotAvail')!)
    } else {
      setRate(fiatRates[asset])
    }
  }, [fiatRates, asset])

  return (
    <Modal transparent={true} animationType={'slide'}>
      <Box
        flex={1}
        justifyContent="flex-end"
        alignItems="stretch"
        backgroundColor="transparentBlack">
        <Box
          justifyContent={'flex-end'}
          alignItems={'flex-end'}
          marginBottom={'l'}
          marginRight={'xl'}>
          <Pressable onPress={onClose}>
            <CloseIcon
              width={scale(15)}
              height={scale(15)}
              stroke={faceliftPalette.white}
            />
          </Pressable>
        </Box>

        <Box
          flex={0.6}
          backgroundColor="mainBackground"
          paddingHorizontal={'xl'}>
          <Text
            fontSize={scale(30)}
            fontWeight="500"
            textAlign={'center'}
            marginVertical={'xl'}>{`Review Send ${asset}`}</Text>
          <Box>
            <Text variant="secondaryInputLabel" tx="sendReviewScreen.send" />
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="m">
              <Text variant="normalText">
                {amount &&
                  `${new BigNumber(amount).dp(
                    6,
                  )} ${asset} | $${prettyFiatBalance(amount, rate)}`}
              </Text>
            </Box>
          </Box>

          <Box marginTop="m">
            <Text
              variant="amountLabel"
              tx="sendReviewScreen.netFee"
              textTransform={'capitalize'}
            />
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="m">
              <Text variant="normalText">
                {asset &&
                  gasFee &&
                  `${gasFee} ${asset} | $${prettyFiatBalance(
                    getSendFee(asset, gasFee).toNumber(),
                    rate,
                  )}`}
              </Text>
            </Box>
          </Box>
          <Box marginTop="m">
            <Text
              variant="amountLabel"
              tx="sendReviewScreen.amtFee"
              textTransform={'capitalize'}
            />
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="m">
              <Text variant="normalText">
                {amount &&
                  gasFee &&
                  asset &&
                  `${new BigNumber(amount)
                    .plus(gasFee)
                    .dp(9)} ${asset} | $${prettyFiatBalance(
                    new BigNumber(amount).plus(gasFee).toNumber(),
                    rate,
                  )}`}
              </Text>
            </Box>
          </Box>

          <Box marginTop="m">
            <Text
              variant="amountLabel"
              tx="sendReviewScreen.sendTo"
              textTransform={'capitalize'}
            />
            <Text variant="normalText">
              {destinationAddress && shortenAddress(destinationAddress)}
            </Text>
          </Box>

          {!!error && <Text variant="error">{error}</Text>}

          <Button
            type="primary"
            variant="l"
            label={i18n.t('sendReviewScreen.sendAsset', { asset })}
            onPress={handleSendPress}
            isLoading={isLoading}
            isBorderless={false}
            isActive={true}
          />
        </Box>
      </Box>
    </Modal>
  )
}

export default SendReviewScreen

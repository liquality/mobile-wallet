import React, { Fragment } from 'react'
import { scale } from 'react-native-size-matters'
import Toast, { ToastConfig } from 'react-native-toast-message'
import { AppIcons } from '../assets'
import { Box, faceliftPalette, Text } from '.'
import { labelTranslateFn } from '../utils'
import i18n from 'i18n-js'
import { ErrorBtn } from '../components/ui/err-msg-banner'
import { ErrorMessages, SendToastProps } from '../types'
import DangerIcon from '../assets/icons/danger.svg'
import CloseIcon from '../assets/icons/close.svg'
import { Pressable } from 'react-native'

const { CopySuccessTick } = AppIcons
export const toastConfig: ToastConfig = {
  copyToast: ({ text1 }) => (
    <Box
      height={scale(54)}
      width={'90%'}
      borderRadius={scale(10)}
      justifyContent="center"
      padding={'xl'}
      backgroundColor={'sectionTitleColor'}>
      <Box flexDirection={'row'} height={scale(54)} alignItems="center">
        <CopySuccessTick />
        <Text color="white" variant="normalText">
          {text1}
        </Text>
      </Box>
    </Box>
  ),
  sendToast: ({ props }: { props: SendToastProps }) => {
    const { msg, type } = props.errorMessage
    const code = props.code
    if (!msg) {
      return null
    }

    const getMessage = () => {
      switch (type) {
        case ErrorMessages.NotEnoughToken:
          return (
            <Fragment>
              <Text color="white" variant="normalText">{`${i18n.t(
                'sendScreen.notEnoughTkn',
                {
                  token: code,
                },
              )}`}</Text>
              <ErrorBtn
                label={`${i18n.t('sendScreen.getTkn', {
                  token: code,
                })}`}
                onPress={props.onGetPress}
              />
            </Fragment>
          )
        case ErrorMessages.NotEnoughTokenSelectMax:
          return (
            <Fragment>
              <Text
                color="white"
                variant="normalText"
                padding={'vs'}>{`${i18n.t('sendScreen.notEnoughTkn', {
                token: code,
              })}`}</Text>
              <ErrorBtn
                label={`${i18n.t('sendScreen.getTkn', {
                  token: code,
                })}`}
                onPress={props.onGetPress}
              />
              <Text
                color="white"
                variant="normalText"
                padding={'vs'}
                tx={'sendScreen.orSelect'}
              />
              <ErrorBtn
                label={`${labelTranslateFn('sendScreen.max')}`}
                onPress={props.onMaxPress}
              />
            </Fragment>
          )
        case ErrorMessages.NotEnoughCoverFees:
          return (
            <Fragment>
              <Text
                color="white"
                variant="normalText"
                padding={'vs'}>{`${i18n.t('sendScreen.notEnoughTknForFees', {
                token: code,
              })}`}</Text>
              <ErrorBtn
                label={`${i18n.t('sendScreen.getTkn', {
                  token: code,
                })}`}
                onPress={props.onGetPress}
              />
              <Text
                color="white"
                variant="normalText"
                padding={'vs'}
                tx={'sendScreen.orSelect'}
              />
              <ErrorBtn
                label={`${labelTranslateFn('sendScreen.max')}`}
                onPress={props.onMaxPress}
              />
            </Fragment>
          )
        case ErrorMessages.NotEnoughGas:
          return (
            <Fragment>
              <Text color="white" variant="normalText" padding={'vs'}>
                {`${i18n.t('sendScreen.notEnoughGas', {
                  n: props.amount,
                  token: code,
                })}`}
              </Text>
              <ErrorBtn
                label={`${i18n.t('sendScreen.getTkn', {
                  token: code,
                })}`}
                onPress={props.onGetPress}
              />
            </Fragment>
          )
        case ErrorMessages.AdjustSending:
          return (
            <Fragment>
              <Text
                color="white"
                variant="normalText"
                padding={'vs'}
                tx="sendScreen.adjustSending"
              />
              <ErrorBtn
                label={`${i18n.t('sendScreen.getTkn', {
                  token: code,
                })}`}
                onPress={props.onGetPress}
              />
              <Text
                color="white"
                variant="normalText"
                padding={'vs'}
                tx={'sendScreen.and'}
              />
              <ErrorBtn
                label={`${i18n.t('sendScreen.getTkn', {
                  token: code,
                })}`}
                onPress={props.onGetPress}
              />
            </Fragment>
          )
        default:
          return (
            <Fragment>
              <Text color="white" variant="normalText">
                {msg}
              </Text>
            </Fragment>
          )
      }
    }

    const handleToastHide = () => {
      Toast.hide()
    }

    return (
      <Box
        width={'90%'}
        borderRadius={scale(10)}
        justifyContent="space-between"
        padding={'l'}
        backgroundColor={'sectionTitleColor'}>
        <Box flexDirection={'row'} justifyContent={'flex-end'}>
          <Pressable onPress={handleToastHide}>
            <CloseIcon stroke={faceliftPalette.white} />
          </Pressable>
        </Box>
        <Box flexDirection={'row'} alignItems={'flex-start'} marginTop={'m'}>
          <DangerIcon />
          <Box
            flexDirection={'row'}
            flexWrap={'wrap'}
            alignItems={'center'}
            marginLeft={'m'}>
            {getMessage()}
          </Box>
        </Box>
      </Box>
    )
  },
}

type ToastType = 'copyToast' | 'sendToast'

export const showCopyToast = (toastType: ToastType, toastMsg: string) => {
  Toast.show({
    type: toastType,
    text1: toastMsg,
  })
}

export const showSendToast = (toastType: ToastType, props: SendToastProps) => {
  Toast.show({
    type: toastType,
    props,
  })
}

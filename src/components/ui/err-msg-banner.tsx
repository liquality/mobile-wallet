import React, { FC } from 'react'
import { Dimensions } from 'react-native'
import { Button, Box } from '../../theme'

const width = Dimensions.get('screen').width

type ErrorBtnProps = {
  label: string
  onPress: () => void
}

export const ErrorBtn: FC<ErrorBtnProps> = (props) => {
  const { label, onPress } = props
  return (
    <Button
      type="tertiary"
      variant="s"
      label={label}
      onPress={onPress}
      isBorderless={false}
      isActive={true}
    />
  )
}

type SendMessageBannerProps = {
  children: React.ReactNode
}

const ErrMsgBanner: FC<SendMessageBannerProps> = (props) => {
  const { children } = props

  return (
    <Box padding={'l'} backgroundColor="errorMsgBarColor" width={width}>
      <Box flexDirection={'row'} flexWrap="wrap" alignItems={'center'}>
        {children}
      </Box>
    </Box>
  )
}

export default ErrMsgBanner

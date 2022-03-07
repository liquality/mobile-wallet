import React, { FC } from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { createText } from '@shopify/restyle'
import { Theme } from '../../theme'

type LiqualityButtonProps = {
  text: string
  variant: 'small' | 'medium' | 'large'
  type: 'plain' | 'positive' | 'negative'
  contentType?: 'numeric' | 'alphanumeric'
  action: (...args: unknown[]) => void
  style?: StyleProp<ViewStyle>
  isLoading?: boolean
  children?: React.ReactElement
}

//TODO this is deprecated
const LiqualityButton: FC<LiqualityButtonProps> = (props) => {
  const {
    text,
    variant = 'medium',
    type = 'positive',
    action,
    style,
    isLoading,
    children,
  } = props
  const Text = createText<Theme>()

  return (
    <Pressable
      style={[styles.actionBtn, styles[variant], styles[type], style]}
      onPress={action}>
      {!isLoading && !!children && children}
      {isLoading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text variant="mainButtonLabel">{text}</Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  actionBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderColor: '#9D4DFA',
    borderWidth: 1,
    paddingHorizontal: 5,
    marginVertical: 5,
  },
  small: {},
  medium: {
    width: 152,
    height: 36,
  },
  large: {
    width: '80%',
    height: 36,
  },
  plain: {
    color: '#1D1E21',
    borderColor: '#D9DFE5',
    fontWeight: '600',
  },
  positive: {
    color: '#FFFFFF',
    backgroundColor: '#9D4DFA',
  },
  negative: {
    color: '#9D4DFA',
    backgroundColor: '#F8FAFF',
  },
})

export default LiqualityButton

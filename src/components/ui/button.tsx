import React, { FC, useContext } from 'react'
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native'
import { ThemeContext } from '../../theme'

type LiqualityButtonProps = {
  text: string
  variant: 'small' | 'medium' | 'large'
  type: 'plain' | 'positive' | 'negative'
  contentType?: 'numeric' | 'alphanumeric'
  action: (...args: unknown[]) => void
  style?: StyleProp<ViewStyle>
  children?: React.ReactElement
}

const LiqualityButton: FC<LiqualityButtonProps> = (props) => {
  const {
    text,
    variant = 'medium',
    type = 'positive',
    contentType = 'alphanumeric',
    action,
    style,
    children,
  } = props
  const theme = useContext(ThemeContext)

  return (
    <Pressable
      style={[styles.actionBtn, styles[variant], styles[type], style]}
      onPress={action}>
      {children && children}
      <Text
        style={[
          styles[type],
          contentType === 'alphanumeric'
            ? theme.buttonText
            : theme.buttonTextAmount,
        ]}>
        {text}
      </Text>
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

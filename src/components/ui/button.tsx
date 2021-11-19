import React, { FC, useContext } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { ThemeContext } from '../../theme'

type LiqualityButtonProps = {
  text: string
  variant: 'small' | 'medium' | 'large'
  type: 'plain' | 'positive' | 'negative'
  children?: React.ReactElement
  action: (...args: unknown[]) => void
}

const LiqualityButton: FC<LiqualityButtonProps> = (props) => {
  const {
    text,
    variant = 'medium',
    type = 'positive',
    action,
    children,
  } = props
  const theme = useContext(ThemeContext)

  return (
    <Pressable
      style={[styles.actionBtn, styles[variant], styles[type]]}
      onPress={action}>
      {children && children}
      <Text style={[styles[type], theme.buttonText]}>{text}</Text>
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
    width: '100%',
    height: 36,
  },
  plain: {
    color: '#1D1E21',
    borderColor: '#D9DFE5',
  },
  positive: {
    color: '#FFFFFF',
    backgroundColor: '#9D4DFA',
  },
  negative: {
    color: '#9D4DFA',
    backgroundColor: '#F8FAFF',
  },
  plainText: {
    color: '#1D1E21',
  },
  positiveText: {
    color: '#FFFFFF',
  },
  negativeText: {
    color: '#9D4DFA',
  },
})

export default LiqualityButton

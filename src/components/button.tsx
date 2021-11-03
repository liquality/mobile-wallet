import React, { useContext } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { ThemeContext } from '../theme'

const LiqualityButton = ({
  text,
  textColor = '#9D4DFA',
  backgroundColor = '#F8FAFF',
  width,
  action,
  children,
}: {
  text: string
  textColor: string
  backgroundColor: string
  width: number
  action: () => void
  children?: React.ReactElement
}) => {
  const theme = useContext(ThemeContext)

  return (
    <Pressable
      style={[styles.actionBtn, { width, backgroundColor }]}
      onPress={action}>
      {children && children}
      <Text style={[{ color: textColor }, theme.buttonText]}>{text}</Text>
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
    width: 152,
    height: 36,
  },
})

export default LiqualityButton

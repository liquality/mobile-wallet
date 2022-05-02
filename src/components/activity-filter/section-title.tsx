import React, { FC } from 'react'
import { StyleSheet, Text } from 'react-native'

const SectionTitle: FC<{ title: string }> = ({ title }) => (
  <Text style={styles.title}>{title}</Text>
)

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
    color: '#3D4767',
  },
})

export default SectionTitle

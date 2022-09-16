import React, { FC } from 'react'
import { StyleSheet, Text } from 'react-native'
import { TxKeyPath, translate } from '../../i18n'
import i18n from 'i18n-js'
import { langSelected as LS } from '../../../src/atoms'
import { useRecoilValue } from 'recoil'
import { Fonts } from '../../assets'
import { palette } from '../../theme'
interface SectionTitleProps {
  title: string
  tx?: TxKeyPath
  txOptions?: i18n.TranslateOptions
}

const SectionTitle: FC<SectionTitleProps> = (props: SectionTitleProps) => {
  const { tx, txOptions, title } = props
  const langSelected = useRecoilValue(LS)
  i18n.locale = langSelected
  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || title
  return <Text style={styles.title}>{content}</Text>
}

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.Regular,
    fontWeight: '700',
    fontSize: 12,
    color: palette.sectionTitleColor,
  },
})

export default SectionTitle

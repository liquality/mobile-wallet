import { Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Fonts } from '../../assets'
import { Box, faceliftPalette, palette, Text } from '../../theme'

type NftTabBarProps = {
  leftTabText: string
  rightTabText: string
  setShowLeftTab: (show: boolean) => void
  showLeftTab: boolean
}

const NftTabBar: React.FC<NftTabBarProps> = (props) => {
  const { leftTabText, rightTabText, setShowLeftTab, showLeftTab } = props

  const renderTabBar = () => {
    return (
      <Box flexDirection="row" paddingVertical={'m'}>
        <Box marginRight={'l'}>
          <Pressable
            style={[styles.tabText, showLeftTab && styles.tabBarFocused]}
            onPress={() => setShowLeftTab(!showLeftTab)}>
            <Text
              style={[styles.tabText, showLeftTab && styles.headerTextFocused]}
              tx={leftTabText}
            />
          </Pressable>
        </Box>
        <Pressable
          style={[styles.tabText, !showLeftTab && styles.tabBarFocused]}
          onPress={() => setShowLeftTab(!showLeftTab)}>
          <Text style={styles.tabText} tx={rightTabText} />
        </Pressable>
      </Box>
    )
  }

  return renderTabBar()
}

const styles = StyleSheet.create({
  tabText: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 17,
    lineHeight: 28,
    letterSpacing: 0.75,
    textTransform: 'capitalize',
    color: faceliftPalette.darkGrey,
  },

  tabBarFocused: {
    borderBottomStyle: 'inset',
    borderBottomWidth: 2,
    lineHeight: '1em',
    color: palette.purplePrimary,
    borderBottomColor: palette.purplePrimary,
  },

  headerTextFocused: {
    color: palette.black2,
  },
})

export default NftTabBar

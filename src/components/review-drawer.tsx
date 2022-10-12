import React, { useState } from 'react'
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import { Box, faceliftPalette, Text } from '../theme'
import { AppIcons, Fonts } from '../assets'
import { scale } from 'react-native-size-matters'
import BottomDrawer from 'react-native-bottom-drawer-view'

const { GreenCheckMark } = AppIcons
const ReviewDrawer = ({
  setShowPopup,
}: {
  showPopup: boolean
  setShowPopup: (show: boolean) => void
}) => {
  const [showExpanded, setShowExpanded] = useState<boolean>(false)
  const [showOverview, setShowOverview] = useState<boolean>(true)

  return (
    <Box flex={1} style={styles.overviewBlock}>
      <Box style={styles.headerContainer}></Box>
      <BottomDrawer
        containerHeight={671}
        downDisplay={580}
        offset={150}
        startUp={false}
        roundedEdges={false}
        backgroundColor={'rgba(255, 255, 255, 0.77)'}
        onExpanded={() => setShowExpanded(true)}
        onCollapsed={() => setShowExpanded(false)}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity>
            <Box style={styles.drawerContainer}>
              <Text style={[styles.descriptionTitle, styles.flex]}>Halloo</Text>
              {/*  <Box marginVertical={'s'} flexDirection={'row'}>
                <Text style={[styles.descriptionTitle, styles.flex]}>
                  {!showExpanded ? renderDrawerCollapsed() : null}
                </Text>
              
              </Box> */}
              {/*   {showExpanded ? (
                <DetailsDrawerExpanded
                  nftItem={nftItem}
                  showOverview={showOverview}
                  setShowOverview={setShowOverview}
                />
              ) : null} */}
            </Box>
          </TouchableOpacity>
        </ScrollView>
      </BottomDrawer>
    </Box>
  )
}

const styles = StyleSheet.create({
  drawerContainer: { paddingHorizontal: 35, paddingVertical: 20 },

  overviewBlock: {
    justifyContent: 'center',
    width: '100%',
    height: 225,
    backgroundColor: faceliftPalette.white,
    zIndex: 100,
  },

  shortLine: { padding: 3 },
  headerContainer: {
    marginBottom: 20,
  },

  image: {
    width: Dimensions.get('screen').width,
    resizeMode: 'contain',
    aspectRatio: 1,
  },

  drawerClosedText: {
    fontFamily: 'Anek Kannada',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,

    letterSpacing: 0.5,

    color: '#000000',
  },

  descriptionTitle: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 21,
    letterSpacing: 0.5,
    color: faceliftPalette.darkGrey,
    marginTop: 0,
  },

  flex: { flex: 1 },
})

export default ReviewDrawer

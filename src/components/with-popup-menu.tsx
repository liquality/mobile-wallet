import React from 'react'
import { ImageBackground, TouchableWithoutFeedback } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { CommonActions } from '@react-navigation/native'
import { MainStackParamList } from '../types'
import { Box, Text } from '../theme'
import { AppIcons, Images } from '../assets'
import { useHeaderHeight } from '@react-navigation/elements'
import { scale, ScaledSheet } from 'react-native-size-matters'

const { LockIcon, ManageAssetsDarkIcon, SettingsActive } = AppIcons

type Props = NativeStackScreenProps<
  MainStackParamList,
  'AssetManagementScreen' | 'LoginScreen' | 'WithPopupMenu'
>
const WithPopupMenu = (props: Props) => {
  const { navigation } = props

  const headerHeight = useHeaderHeight()

  const handleLockPress = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      }),
    )
  }

  const handleManageAssetsBtnPress = () => {
    navigation.goBack()
    navigation.navigate('AssetManagementScreen', {
      screenTitle: 'Manage Assets',
      includeBackBtn: true,
    })
  }

  return (
    <Box
      flex={1}
      backgroundColor={'popMenuColor'}
      paddingHorizontal={'xl'}
      style={{ paddingTop: headerHeight / 2 }}>
      <TouchableWithoutFeedback onPress={navigation.goBack}>
        <Box flex={1} alignItems={'flex-end'}>
          <Box height={scale(200)} width={scale(230)}>
            <ImageBackground
              style={styles.lowerBgImg}
              resizeMode="contain"
              source={Images.popUpDark}>
              <ImageBackground
                style={styles.upperBgImg}
                resizeMode="contain"
                source={Images.popUpWhite}>
                <Box
                  flex={1}
                  justifyContent="center"
                  padding={'onboardingPadding'}>
                  <TouchableWithoutFeedback
                    onPress={handleManageAssetsBtnPress}>
                    <Box flexDirection={'row'}>
                      <ManageAssetsDarkIcon
                        height={scale(20)}
                        width={scale(20)}
                      />
                      <Text
                        variant={'radioText'}
                        paddingLeft={'l'}
                        color="textColor"
                        tx="manageAssets"
                      />
                    </Box>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={navigation.goBack}>
                    <Box flexDirection={'row'} marginTop="l">
                      <SettingsActive height={scale(20)} width={scale(20)} />
                      <Text
                        variant={'radioText'}
                        paddingLeft={'l'}
                        color="activeButton"
                        tx="manageAccs"
                      />
                    </Box>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={handleLockPress}>
                    <Box flexDirection={'row'} marginTop="l">
                      <LockIcon height={scale(20)} width={scale(20)} />
                      <Text
                        variant={'radioText'}
                        paddingLeft={'l'}
                        color="textColor"
                        tx="lock"
                      />
                    </Box>
                  </TouchableWithoutFeedback>
                </Box>
              </ImageBackground>
            </ImageBackground>
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </Box>
  )
}

const styles = ScaledSheet.create({
  lowerBgImg: {
    height: '100%',
  },
  upperBgImg: {
    height: '100%',
    width: '100%',
    marginTop: scale(-5),
    marginLeft: scale(-5),
  },
  icon: {
    marginRight: '10@s',
  },
})

export default WithPopupMenu

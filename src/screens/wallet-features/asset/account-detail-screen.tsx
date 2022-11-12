import React, { FC } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import {
  Box,
  faceliftPalette,
  Text,
  ThemeType,
  TouchableOpacity,
} from '../../../theme'
import { scale } from 'react-native-size-matters'
import { StyleSheet } from 'react-native'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
import { AppIcons } from '../../../assets'
import { useTheme } from '@shopify/restyle'

const { CopyIcon, ShareIcon, GasIcon } = AppIcons

type ScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'AccountDetailScreen'
>

const AccountDetailScreen: FC<ScreenProps> = ({ route }) => {
  const { assetData } = route.params
  const theme = useTheme<ThemeType>()

  const onCopyPress = () => {}
  const onSharePress = () => {}

  return (
    <Box
      flex={1}
      paddingHorizontal="screenPadding"
      backgroundColor={'mainBackground'}>
      <Box
        height={scale(120)}
        marginTop={'xl'}
        justifyContent="flex-end"
        backgroundColor="greyBackground">
        <Box height={scale(90)}>
          <Box flexDirection={'row'}>
            <Box width={scale(4)} borderRadius={scale(5)} />
            <Text
              paddingHorizontal="xl"
              variant={'transLink'}
              tx="account"
              fontWeight={'400'}
              color={'black2'}
            />
          </Box>
          <Box flexDirection={'row'} height={scale(35)} marginTop="m">
            <Box
              width={scale(4)}
              borderRadius={scale(5)}
              height={scale(30)}
              style={{ backgroundColor: assetData?.color }}
              alignItems={'center'}
            />
            <Text
              paddingHorizontal="xl"
              variant={'warnText'}
              lineHeight={scale(35)}>
              {assetData?.name}
            </Text>
          </Box>
        </Box>
        <Box position={'absolute'} top={0} right={0} zIndex={0}>
          <Box justifyContent="center" alignItems={'flex-end'} zIndex={100}>
            <Box style={styles.topRightHalfCutArrow} />
          </Box>
        </Box>
      </Box>
      {assetData && assetData.address && (
        <Box
          flexDirection={'row'}
          marginTop="l"
          justifyContent={'space-between'}>
          <Box flexDirection={'row'}>
            <Text variant={'addressLabel'} color="darkGrey">
              {shortenAddress(assetData?.address)}
            </Text>
            <Box
              alignSelf={'flex-start'}
              width={1}
              marginLeft="m"
              height={scale(15)}
              backgroundColor="inactiveText"
            />
            <TouchableOpacity
              style={{ marginHorizontal: theme.spacing.l }}
              onPress={onCopyPress}>
              <CopyIcon
                width={scale(15)}
                height={scale(15)}
                onPress={() => {}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onSharePress}>
              <ShareIcon />
            </TouchableOpacity>
          </Box>
          <Box flexDirection={'row'} alignItems="center">
            <GasIcon width={scale(20)} height={scale(20)} />
            <Text marginLeft={'s'} variant={'addressLabel'} tx="gas" />
          </Box>
        </Box>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  topRightHalfCutArrow: {
    borderTopWidth: scale(40),
    borderTopColor: faceliftPalette.white,
    borderRightWidth: 0,
    borderBottomWidth: scale(40),
    borderBottomColor: faceliftPalette.greyBackground,
    borderLeftWidth: scale(40),
    borderLeftColor: faceliftPalette.greyBackground,
  },
})

export default AccountDetailScreen

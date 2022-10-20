import React, { FC } from 'react'
import { TouchableOpacity } from 'react-native'
import { Box, Text } from '../../../theme'
import { scale } from 'react-native-size-matters'

interface SettingListComponentProps {
  mainLabel: string
  sublabel: string
  icon?: React.ReactElement
  onPress?: () => void
  reactElementPlusOnPress?: React.ReactElement
}

const SettingListComponent: FC<SettingListComponentProps> = (props) => {
  const {
    mainLabel,
    sublabel,
    icon: Icon,
    reactElementPlusOnPress: ReactElementPlusOnPress,
    onPress,
  } = props
  return (
    <Box
      flexDirection={'row'}
      justifyContent="space-between"
      alignItems={'center'}
      marginTop={'l'}
      height={scale(50)}>
      <Box width={'70%'}>
        <Text variant={'listText'} color="greyMeta">
          {mainLabel}
        </Text>
        <Text variant={'subListText'} color="greyBlack">
          {sublabel}
        </Text>
      </Box>
      {ReactElementPlusOnPress || (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
          {Icon}
        </TouchableOpacity>
      )}
    </Box>
  )
}

export default SettingListComponent

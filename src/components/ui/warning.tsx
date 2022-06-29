import React, { FC } from 'react'
import Box from '../../theme/box'
import Text from '../../theme/text'

type WarningProps = {
  text1: string
  text2: string
  children: React.ReactElement
}

const Warning: FC<WarningProps> = (props) => {
  const { text1, text2, children } = props

  return (
    <Box
      flexDirection="row"
      justifyContent="center"
      alignItems="flex-end"
      marginVertical="m"
      paddingHorizontal="xl">
      {children}
      <Text variant="warningBold">
        {text1} <Text variant="warningLight">{text2}</Text>
      </Text>
    </Box>
  )
}

export default Warning

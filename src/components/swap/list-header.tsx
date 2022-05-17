import React, { FC } from 'react'
import Box from '../../theme/box'
import Text from '../../theme/text'

const ListHeader: FC = () => {
  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      borderBottomWidth={1}
      borderBottomColor="mainBorderColor"
      paddingHorizontal="xl">
      <Text variant="header">RATE</Text>
      <Text variant="header">PROVIDER</Text>
    </Box>
  )
}

export default ListHeader

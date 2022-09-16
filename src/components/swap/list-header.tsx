import React, { FC } from 'react'
import { Text, Box } from '../../theme'

const ListHeader: FC = () => {
  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      borderBottomWidth={1}
      borderBottomColor="mainBorderColor"
      paddingHorizontal="xl">
      <Text variant="header" tx="listHeaderComp.rate" />
      <Text variant="header" tx="listHeaderComp.provider" />
    </Box>
  )
}

export default ListHeader

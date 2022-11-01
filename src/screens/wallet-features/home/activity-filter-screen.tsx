import * as React from 'react'
import { Box, Card, Text } from '../../../theme'
import { LARGE_TITLE_HEADER_HEIGHT } from '../../../utils'

const ActivityFilterScreen = () => {
  return (
    <Box flex={1} backgroundColor={'mainBackground'}>
      <Card
        variant={'headerCard'}
        height={LARGE_TITLE_HEADER_HEIGHT}
        paddingHorizontal="xl">
        <Box flex={1} justifyContent="flex-end">
          <Text>All chains</Text>
        </Box>
      </Card>
    </Box>
  )
}

export default ActivityFilterScreen

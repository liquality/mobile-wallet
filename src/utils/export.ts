import { HistoryItem } from '@liquality/wallet-core/dist/store/types'
import { getCSVContent } from '@liquality/wallet-core/dist/utils/export'
import RNFS from 'react-native-fs'
import Share from 'react-native-share'

import { CSV_HEADERS } from './csv-header'

export const downloadAssetAcitivity = async (history: HistoryItem[]) => {
  const content = getCSVContent(history, CSV_HEADERS)
  if (!content) {
    return
  }

  const targetPath = `${RNFS.DocumentDirectoryPath}/activity.csv`

  const targetExists = await RNFS.exists(targetPath)
  if (targetExists) {
    await RNFS.unlink(targetPath)
  }

  await RNFS.writeFile(targetPath, content, 'utf8')
  const shareOptions = {
    title: 'Liquality Asset Activity',
    message:
      'Here is the asset activity csv exported from Liquality mobile app!',
    url: `file://${targetPath}`,
    subject: 'Liquality Asset Activity',
  }
  Share.open(shareOptions)
}

export const downloadWalletLogs = async (logs: any) => {
  if (!logs) {
    return
  }

  const targetPath = `${RNFS.DocumentDirectoryPath}/Liquality Wallet Logs.json`

  const targetExists = await RNFS.exists(targetPath)
  if (targetExists) {
    await RNFS.unlink(targetPath)
  }

  await RNFS.writeFile(targetPath, JSON.stringify(logs, null, 2), 'utf8')
  const shareOptions = {
    title: 'Liquality Wallet Logs',
    message: 'Here is the wallet logs exported from Liquality mobile app!',
    url: `file://${targetPath}`,
    subject: 'Liquality Wallet Logs',
  }
  Share.open(shareOptions)
}

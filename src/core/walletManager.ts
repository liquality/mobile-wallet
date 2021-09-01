import { chains, assets } from '@liquality/cryptoassets'
import { v4 as uuidv4 } from 'uuid'
import EncryptionManager from './encryptionManager'
import config, {
  accountColors,
  chainDefaultColors,
  NetworkEnum,
} from './config'
import {
  AccountType,
  AccountWrapperType,
  NetworkWrapperType,
  WalletType,
} from './types'

// SETUP_WALLET (state, { key }) {
//   state.key = key
//   state.keyUpdatedAt = Date.now()
//   state.setupAt = Date.now()
// },

// ACCEPT_TNC (state) {
//   state.termsAcceptedAt = Date.now()
// },

class WalletManager {
  wallets: Array<WalletType>
  password: string
  cryptoassets: any
  chains: any

  constructor(wallet: WalletType, password: string) {
    this.wallets = [wallet]
    this.password = password
    this.cryptoassets = assets
    this.chains = chains
  }

  /**
   * Creates a wallet along with an account
   */
  public async createWallet() {
    const encryptionManager = new EncryptionManager(this.password)
    const account: AccountWrapperType = {}
    const id = uuidv4()
    const at = Date.now()
    const { networks, defaultAssets } = config
    const { encrypted: encryptedWallets, keySalt } =
      await encryptionManager.encrypt(JSON.stringify(this.wallets))

    networks.forEach((network: NetworkEnum) => {
      const assetKeys = defaultAssets[network]
      config.chains.forEach(async (chainId) => {
        const assetList = assetKeys.filter((asset) => {
          return this.cryptoassets[asset]?.chain === chainId
        })

        const chain = this.chains[chainId]
        account[id] = {
          [network]: {
            id: uuidv4(),
            name: `${chain.name} 1`,
            chain: chainId,
            type: 'default',
            index: 0,
            addresses: [],
            assets: assetList,
            balances: {},
            color: this.getNextAccountColor(chainId, 0),
            createdAt: at,
            updatedAt: at,
          } as AccountType,
        } as NetworkWrapperType
      })
    })

    return {
      activeWalletId: id,
      encryptedWallets,
      keySalt,
      wallets: this.wallets,
      account,
    }
  }

  /**
   * Stores the encrypted wallets locally
   */
  public async backupWallet() {
    // const encryptionManager = new EncryptionManager(this.password)
    // const { encrypted, keySalt } = await encryptionManager.encrypt(
    //   JSON.stringify(this.wallets),
    // )
    // store
  }

  private getNextAccountColor(chain: string, index: number) {
    const defaultColor = chainDefaultColors[chain]
    const defaultIndex = accountColors.findIndex((c) => c === defaultColor)
    if (defaultIndex === -1) {
      return defaultColor
    }
    const finalIndex = index + defaultIndex
    if (finalIndex >= accountColors.length) {
      return accountColors[defaultIndex]
    }
    return accountColors[finalIndex]
  }
}

export default WalletManager

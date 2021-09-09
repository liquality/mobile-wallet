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
  StorageManagerI,
  WalletType,
} from './types'
import { generateMnemonic } from 'bip39'

class WalletManager {
  storageKey: string
  wallets: Array<WalletType>
  password: string
  cryptoassets: any
  chains: any
  storageManager: StorageManagerI

  constructor(
    wallet: WalletType,
    password: string,
    storageManager: StorageManagerI,
  ) {
    this.wallets = [
      {
        id: uuidv4(),
        at: Date.now(),
        name: 'Account-1',
        ...wallet,
      },
    ]
    this.password = password
    this.cryptoassets = assets
    this.chains = chains
    this.storageManager = storageManager
    this.storageKey = '@liqualityStore'
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

    const state = {
      activeWalletId: id,
      encryptedWallets,
      keySalt,
      wallets: this.wallets,
      account,
    }
    //persist to local storage
    await this.persistToLocalStorage(state)

    return state
  }

  public static generateSeedWords() {
    return generateMnemonic().split(' ')
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

  public async retrieveWallet(): Promise<any | Error> {
    const wallet = await this.storageManager.read(this.storageKey)
    if (wallet instanceof Error) {
      return 'Unable to retrieve wallet from local storage'
    }
    return JSON.parse(wallet)
  }

  private async persistToLocalStorage(state: any) {
    await this.storageManager.persist(this.storageKey, JSON.stringify(state))
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

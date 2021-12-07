import { v4 as uuidv4 } from 'uuid'
import config, { ChainNetworks } from './config'
import {
  AccountType,
  ArrayElement,
  EncryptionManagerI,
  NetworkEnum,
  StateType,
  StorageManagerI,
  WalletManagerI,
} from './types'
import { generateMnemonic, validateMnemonic } from 'bip39'
import {
  assets,
  ChainId,
  chains,
  isEthereumChain,
} from '@liquality/cryptoassets'
import { EthereumNetwork } from '@liquality/ethereum-networks'
import { EthereumGasNowFeeProvider } from '@liquality/ethereum-gas-now-fee-provider'
import { EthereumRpcFeeProvider } from '@liquality/ethereum-rpc-fee-provider'
import axios from 'axios'
import { Asset } from '@liquality/cryptoassets/dist/src/types'
import AbstractWalletManager from './abstract-wallet-manager'
import { SendOptions, Transaction } from '@liquality/types'

const ETHEREUM_TESTNET_URL = `https://ropsten.infura.io/v3/${config.infuraApiKey}`
const ETHEREUM_MAINNET_URL = `https://mainnet.infura.io/v3/${config.infuraApiKey}`

//TODO move urls to a config file
class WalletManager extends AbstractWalletManager implements WalletManagerI {
  wallets: StateType['wallets'] = []
  password: string = ''
  cryptoassets: any = assets
  chains: any = chains
  storageManager: StorageManagerI<StateType>
  encryptionManager: EncryptionManagerI

  constructor(
    storageManager: StorageManagerI<StateType>,
    encryptionManager: EncryptionManagerI,
  ) {
    super()
    this.storageManager = storageManager
    this.encryptionManager = encryptionManager
  }

  /**
   * Creates a wallet along with an account
   */
  public async createWallet(
    wallet: Omit<ArrayElement<StateType['wallets']>, 'id' | 'at' | 'name'>,
    password: string,
  ): Promise<StateType> {
    const walletId = uuidv4()
    this.wallets = [
      {
        id: walletId,
        at: Date.now(),
        name: 'Account-1',
        ...wallet,
      },
    ]
    this.password = password

    const accounts: StateType['accounts'] = { [walletId]: {} }
    const at = Date.now()
    const { networks, defaultAssets } = config
    const { encrypted: encryptedWallets, keySalt } =
      await this.encryptionManager.encrypt(
        JSON.stringify(this.wallets),
        password,
      )

    networks.forEach((network: NetworkEnum) => {
      const assetKeys = defaultAssets[network]
      accounts[walletId][network] = []
      config.chains.forEach(async (chainId) => {
        const assetList = assetKeys.filter((asset) => {
          return this.cryptoassets[asset]?.chain === chainId
        })

        const chain = this.chains[chainId]
        accounts[walletId][network]?.push({
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
        })
      })
    })

    const state = {
      activeWalletId: walletId,
      encryptedWallets,
      keySalt,
      accounts,
    }
    //write to local storage
    await this.persistToLocalStorage(state)

    return {
      ...state,
      wallets: this.wallets,
      key: this.password,
      fees: {
        [NetworkEnum.Mainnet]: {
          [walletId]: {},
        },
        [NetworkEnum.Testnet]: {
          [walletId]: {},
        },
      },
    }
  }

  public async retrieveWallet(): Promise<StateType> {
    return this.storageManager.read()
  }

  /**
   * Decrypts the encrypted wallet
   */
  public async restoreWallet(
    password: string,
    state: StateType,
  ): Promise<StateType> {
    const { encryptedWallets, keySalt } = state

    if (!encryptedWallets || !keySalt) {
      throw new Error('Please import/create your wallet')
    }

    const decryptedWallets = await this.encryptionManager.decrypt(
      encryptedWallets!,
      keySalt!,
      password,
    )
    if (!decryptedWallets) {
      throw new Error('Password Invalid')
    }

    const wallets = JSON.parse(decryptedWallets)

    if (!wallets || wallets.length === 0) {
      throw new Error('Password Invalid')
    }
    const activeWalletId = wallets[0].id
    //TODO update the enabledAsset dynamically
    return {
      ...state,
      key: password,
      unlockedAt: Date.now(),
      wallets,
      fees: {
        [NetworkEnum.Mainnet]: {
          [activeWalletId!]: {},
        },
        [NetworkEnum.Testnet]: {
          [activeWalletId!]: {},
        },
      },
      activeNetwork: NetworkEnum.Testnet,
    }
  }

  public async sendTransaction(
    options: SendOptions,
  ): Promise<Transaction | Error> {
    if (!this.client) {
      return new Error('client is not instantiated')
    }
    return await this.client.chain.sendTransaction(options)
  }

  //TODO refactor
  public async updateAddressesAndBalances(
    state: StateType,
  ): Promise<StateType> {
    const stateClone = { ...state }

    for (const walletId in stateClone.accounts) {
      const network = stateClone.accounts[walletId]
      for (const networkId in network) {
        if (stateClone.activeNetwork !== networkId) {
          continue
        }
        const accounts = network[networkId as NetworkEnum] as Array<AccountType>
        for (const account of accounts) {
          for (const asset of account.assets) {
            if (
              !stateClone.enabledAssets ||
              !stateClone.enabledAssets[networkId][walletId].includes(asset)
            ) {
              continue
            }

            const derivationPath = this.calculateDerivationPaths(account.chain)(
              networkId,
              account.index,
            )

            if (!derivationPath) {
              throw new Error(
                'Unable to generate address. Derivation path missing',
              )
            }

            const isTestnet = networkId === NetworkEnum.Testnet
            const ethereumNetwork = ChainNetworks[ChainId.Ethereum]![networkId]
            const infuraApi = isTestnet
              ? ETHEREUM_TESTNET_URL
              : ETHEREUM_MAINNET_URL
            const feeProvider = isTestnet
              ? new EthereumRpcFeeProvider()
              : new EthereumGasNowFeeProvider()
            const mnemonic = stateClone.wallets?.find(
              (w) => w.id === walletId,
            )?.mnemomnic

            if (!mnemonic) {
              throw new Error('Unable to generate address. Mnemonic missing')
            }

            const client = this.createEthereumClient(
              ethereumNetwork as EthereumNetwork,
              infuraApi,
              feeProvider,
              mnemonic,
              derivationPath,
            )

            const result = await client.wallet.getUnusedAddress()
            const balance = (await client.chain.getBalance([result])).toNumber()
            const feeDetails = await client.chain.getFees()
            stateClone.fees![networkId]![walletId]![
              this.cryptoassets[asset].chain
            ] = feeDetails
            const address = isEthereumChain(this.cryptoassets[asset].chain)
              ? result.address.replace('0x', '')
              : result.address // TODO: Should not require removing 0x
            account.addresses.push(address)
            account.balances![asset] = balance
          }
        }
      }
    }

    return stateClone
  }

  public async getPricesForAssets(
    baseCurrencies: Array<string>,
    toCurrency: string,
  ): Promise<StateType['fiatRates']> {
    const COIN_GECKO_API = 'https://api.coingecko.com/api/v3'
    const coindIds = baseCurrencies
      .filter((currency) => this.cryptoassets[currency]?.coinGeckoId)
      .map((currency) => this.cryptoassets[currency].coinGeckoId)
    const { data } = await axios.get(
      `${COIN_GECKO_API}/simple/price?ids=${coindIds.join(
        ',',
      )}&vs_currencies=${toCurrency}`,
    )

    let prices = Object.keys(data).reduce((acc: any, coinGeckoId) => {
      const asset = Object.entries<Asset>(this.cryptoassets).find((entry) => {
        return entry[1].coinGeckoId === coinGeckoId
      })
      if (asset) {
        acc[asset[0]] = {
          [toCurrency.toUpperCase()]:
            data[coinGeckoId][toCurrency.toLowerCase()],
        }
      }

      return acc
    }, {})

    for (const baseCurrency of baseCurrencies) {
      if (
        !prices[baseCurrency] &&
        this.cryptoassets[baseCurrency].matchingAsset
      ) {
        prices[baseCurrency] =
          prices[this.cryptoassets[baseCurrency].matchingAsset]
      }
    }

    return Object.keys(prices).reduce((acc: any, assetName) => {
      acc[assetName] = prices[assetName][toCurrency.toUpperCase()]
      return acc
    }, {})
  }

  public static generateSeedWords() {
    return generateMnemonic().split(' ')
  }

  public static validateSeedPhrase(seedPhrase: string) {
    return validateMnemonic(seedPhrase)
  }
}

export default WalletManager

import {
  assets,
  ChainId,
  chains,
  isEthereumChain,
} from '@liquality/cryptoassets'
import { bitcoin } from '@liquality/types'
import { v4 as uuidv4 } from 'uuid'
import EncryptionManager from './encryptionManager'
import config, {
  accountColors,
  chainDefaultColors,
  ChainNetworks,
  NetworkEnum,
} from './config'
import {
  AccountType,
  AccountWrapperType,
  StateType,
  StorageManagerI,
  WalletType,
} from './types'
import { generateMnemonic, validateMnemonic } from 'bip39'
import { EthereumNetwork } from '@liquality/ethereum-networks'
import { Client } from '@liquality/client'
import { BitcoinJsWalletProvider } from '@liquality/bitcoin-js-wallet-provider'
import { BitcoinEsploraBatchApiProvider } from '@liquality/bitcoin-esplora-batch-api-provider'
import { BitcoinFeeApiProvider } from '@liquality/bitcoin-fee-api-provider'
import { BitcoinRpcFeeProvider } from '@liquality/bitcoin-rpc-fee-provider'
import { EthereumRpcProvider } from '@liquality/ethereum-rpc-provider'
import { EthereumJsWalletProvider } from '@liquality/ethereum-js-wallet-provider'
import { EthereumGasNowFeeProvider } from '@liquality/ethereum-gas-now-fee-provider'
import { EthereumRpcFeeProvider } from '@liquality/ethereum-rpc-fee-provider'
import { BitcoinNetwork } from '@liquality/bitcoin-networks'

class WalletManager {
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
  }

  /**
   * Creates a wallet along with an account
   */
  public async createWallet() {
    const encryptionManager = new EncryptionManager(this.password)
    const id = this.wallets[0].id
    const accounts: AccountWrapperType = { [`${id}`]: {} }
    const at = Date.now()
    const { networks, defaultAssets } = config
    const { encrypted: encryptedWallets, keySalt } =
      await encryptionManager.encrypt(JSON.stringify(this.wallets))

    networks.forEach((network: NetworkEnum) => {
      const assetKeys = defaultAssets[network]
      accounts[`${id}`][network] = []
      config.chains.forEach(async (chainId) => {
        const assetList = assetKeys.filter((asset) => {
          return this.cryptoassets[asset]?.chain === chainId
        })

        const chain = this.chains[chainId]
        accounts[`${id}`][network]?.push({
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
      activeWalletId: id,
      encryptedWallets,
      keySalt,
      accounts,
    }
    //persist to local storage
    await this.persistToLocalStorage(state)

    return {
      ...state,
      wallets: this.wallets,
      key: this.password,
    }
  }

  public static generateSeedWords() {
    return generateMnemonic().split(' ')
  }

  public static validateSeedPhrase(seedPhrase: string) {
    return validateMnemonic(seedPhrase)
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

  private createBtcClient(
    network: NetworkEnum,
    mnemonic: string,
    accountType: string,
    derivationPath: string,
  ) {
    const isTestnet = network === NetworkEnum.Testnet
    const bitcoinNetwork = ChainNetworks[ChainId.Bitcoin]![network]
    const esploraApi = config.exploraApis[network]
    const batchEsploraApi = config.batchEsploraApis[network]

    const btcClient = new Client()
    btcClient.addProvider(
      new BitcoinEsploraBatchApiProvider({
        batchUrl: batchEsploraApi,
        url: esploraApi,
        network: bitcoinNetwork as BitcoinNetwork,
        numberOfBlockConfirmation: 2,
      }),
    )

    btcClient.addProvider(
      new BitcoinJsWalletProvider({
        network: bitcoinNetwork as BitcoinNetwork,
        mnemonic,
        baseDerivationPath: derivationPath,
      }),
    )

    if (isTestnet) {
      btcClient.addProvider(new BitcoinRpcFeeProvider())
    } else {
      btcClient.addProvider(
        new BitcoinFeeApiProvider(
          'https://liquality.io/swap/mempool/v1/fees/recommended',
        ),
      )
    }

    return btcClient
  }

  private createEthereumClient(
    ethereumNetwork: EthereumNetwork,
    rpcApi: string,
    feeProvider: EthereumRpcFeeProvider | EthereumGasNowFeeProvider,
    mnemonic: string,
    derivationPath: string,
  ) {
    const ethClient = new Client()
    ethClient.addProvider(new EthereumRpcProvider({ uri: rpcApi }))

    ethClient.addProvider(
      new EthereumJsWalletProvider({
        network: ethereumNetwork,
        mnemonic,
        derivationPath,
      }),
    )

    ethClient.addProvider(feeProvider)

    return ethClient
  }

  public async updateAddresses(state: StateType): Promise<Array<string>> {
    let updatedAddresses: Array<string> = []
    for (const walletId in state.accounts) {
      const network = state.accounts[walletId]
      for (const networkId in network) {
        if (state.activeNetwork !== networkId) {
          continue
        }
        const accounts = network[networkId as NetworkEnum] as Array<AccountType>
        for (const account of accounts) {
          for (const asset of account.assets) {
            if (
              !state.enabledAssets ||
              !state.enabledAssets[networkId][walletId].includes(asset)
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

            const isTestnet = networkId === 'testnet'
            const ethereumNetwork = ChainNetworks[ChainId.Ethereum]![networkId]
            const infuraApi = isTestnet
              ? `https://ropsten.infura.io/v3/${config.infuraApiKey}`
              : `https://mainnet.infura.io/v3/${config.infuraApiKey}`
            const feeProvider = isTestnet
              ? new EthereumRpcFeeProvider()
              : new EthereumGasNowFeeProvider()
            const mnemonic = state.wallets?.find(
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

            const address = isEthereumChain(this.cryptoassets[asset].chain)
              ? result.address.replace('0x', '')
              : result.address // TODO: Should not require removing 0x
            // let updatedAddresses = []
            if (account.chain === ChainId.Bitcoin) {
              if (!account.addresses.includes(address)) {
                updatedAddresses.push(...account.addresses, address)
              } else {
                updatedAddresses.push(...account.addresses)
              }
            } else {
              updatedAddresses.push(address)
            }
          }
        }
      }
    }

    return updatedAddresses
  }

  public async retrieveWallet(): Promise<StateType | Error> {
    return await this.storageManager.read()
  }

  private async persistToLocalStorage(state: StateType) {
    await this.storageManager.persist(state)
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

  // Derivation paths calculation
  private getBitcoinDerivationPath(coinType: string, index: number) {
    const BTC_ADDRESS_TYPE_TO_PREFIX = {
      legacy: 44,
      'p2sh-segwit': 49,
      bech32: 84,
    }
    return `${
      BTC_ADDRESS_TYPE_TO_PREFIX[bitcoin.AddressType.BECH32]
    }'/${coinType}'/${index}'`
  }

  private getEthereumBasedDerivationPath = (coinType: string, index: number) =>
    `m/44'/${coinType}'/${index}'/0/0`

  private calculateDerivationPaths(
    chainId: ChainId,
  ): (network: NetworkEnum, index: number) => string | undefined {
    if (chainId === ChainId.Bitcoin) {
      return (network: NetworkEnum, index: number) => {
        const bitcoinNetwork = ChainNetworks[ChainId.Bitcoin]![network]
        return this.getBitcoinDerivationPath(bitcoinNetwork.coinType, index)
      }
    }
    return (network: NetworkEnum, index: number) => {
      const ethNetwork = ChainNetworks[ChainId.Ethereum]![network]
      return this.getEthereumBasedDerivationPath(ethNetwork.coinType, index)
    }
  }
}

export default WalletManager

import WalletManager from '../src/core/wallet-manager'
import StorageManager from '../src/core/storage-manager'
import { NetworkEnum } from '../src/core/types'
import { ArrayElement, StateType } from '../src/core/types'
import EncryptionManager from '../src/core/encryption-manager'

describe('WalletManagerTest', () => {
  const PASSWORD = '123123123'
  const wallet: Omit<
    ArrayElement<StateType['wallets']>,
    'id' | 'at' | 'name'
  > = {
    mnemomnic:
      'legend else tooth car romance thought rather share lunar reopen attend refuse',
    assets: ['ETH'],
    activeNetwork: NetworkEnum.Testnet,
    imported: false,
  }
  const walletManager = new WalletManager(
    new StorageManager('@liqualityStore', []),
    new EncryptionManager(),
  )

  beforeAll(() => {
    global.crypto = {}
    global.crypto.getRandomValues = () => new Uint8Array(1)
  })

  it('should create a wallet', async () => {
    const newWallet = await walletManager.createWallet(wallet, PASSWORD)
    expect(newWallet.keySalt).toBeTruthy()
    expect(newWallet.wallets).toBeTruthy()
    expect(newWallet.encryptedWallets).toBeTruthy()
    expect(newWallet.accounts).toBeTruthy()
  })

  it('should be able to restore a wallet', async () => {
    const newWallet = await walletManager.createWallet(wallet, PASSWORD)
    delete newWallet.wallets
    const retoredWallet = await walletManager.restoreWallet(PASSWORD, newWallet)

    expect(retoredWallet.keySalt).toBeTruthy()
    expect(retoredWallet.wallets).toBeTruthy()
    expect(retoredWallet.encryptedWallets).toBeTruthy()
    expect(retoredWallet.accounts).toBeTruthy()
  })

  it('should generate 12 seed words', () => {
    const seedWords = WalletManager.generateSeedWords()
    expect(seedWords.length).toEqual(12)
  })

  it('should generate different random seed words', () => {
    const seedWords1 = WalletManager.generateSeedWords()
    const seedWords2 = WalletManager.generateSeedWords()
    expect(
      seedWords1.sort().join(' ') !== seedWords2.sort().join(' '),
    ).toBeTruthy()
  })

  it('should find a seed phrase NOT valid', () => {
    expect(!WalletManager.validateSeedPhrase('blabl')).toBeTruthy()
  })

  it('should find a seed phrase valid', () => {
    expect(
      WalletManager.validateSeedPhrase(
        'seed sock milk update focus rotate barely fade car face mechanic mercy',
      ),
    ).toBeTruthy()
  })

  //TODO run this against Truffle
  it('should find unused addresses', async () => {
    const {
      keySalt,
      encryptedWallets,
      activeWalletId = '',
      accounts,
      wallets,
    } = await walletManager.createWallet(wallet, PASSWORD)
    const state: StateType = {
      key: PASSWORD,
      wallets,
      unlockedAt: Date.now(),
      keySalt,
      encryptedWallets,
      accounts,
      fees: {
        [NetworkEnum.Testnet]: {
          [activeWalletId]: {
            ETH: {
              average: { fee: 3.7500000135 },
              fast: { fee: 5.000000018 },
              slow: { fee: 2.500000009 },
            },
          },
        },
      },
      enabledAssets: {
        [NetworkEnum.Mainnet]: {
          [activeWalletId]: ['ETH'],
        },
        [NetworkEnum.Testnet]: {
          [activeWalletId]: ['ETH'],
        },
      },
      activeNetwork: NetworkEnum.Testnet,
      activeWalletId,
    }
    const { accounts: updatedAccount } =
      await walletManager.updateAddressesAndBalances(state)
    const { addresses, balances = {} } =
      updatedAccount![activeWalletId!][NetworkEnum.Testnet]![1]
    expect(
      addresses.length > 0 && addresses.length === Object.keys(balances).length,
    ).toBeTruthy()
  })

  it('should get prices for assets', async () => {
    const prices = await walletManager.getPricesForAssets(['ETH', 'BTC'], 'USD')
    expect(prices && prices.ETH > 0 && prices.BTC > 0).toBeTruthy()
  })
})

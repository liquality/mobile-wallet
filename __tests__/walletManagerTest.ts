import WalletManager from '../src/core/walletManager'
import StorageManager from '../src/core/storageManager'
import { NetworkEnum } from '../src/core/config'
import { StateType, WalletType } from '../src/core/types'

describe('WalletManagerTest', () => {
  const PASSWORD = 'this is my cool password'
  const wallet: WalletType = {
    at: Date.now(),
    name: 'Account-1',
    mnemomnic: 'anjsnc8383jndndj',
    assets: ['ETH'],
    activeNetwork: NetworkEnum.Testnet,
    imported: false,
  }
  const walletManager = new WalletManager(
    wallet,
    PASSWORD,
    new StorageManager('@liqualityStore', []),
  )

  beforeAll(() => {
    global.crypto = {}
    global.crypto.getRandomValues = () => new Uint8Array(1)
  })

  it('should create a wallet', async () => {
    const newWallet = await walletManager.createWallet()
    expect(newWallet.keySalt).toBeTruthy()
    expect(newWallet.wallets).toBeTruthy()
    expect(newWallet.encryptedWallets).toBeTruthy()
    expect(newWallet.accounts).toBeTruthy()
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

  it('should find unused addresses', async () => {
    const { keySalt, encryptedWallets, activeWalletId, accounts, wallets } =
      await walletManager.createWallet()
    const state: StateType = {
      key: PASSWORD,
      wallets,
      unlockedAt: Date.now(),
      keySalt,
      encryptedWallets,
      accounts,
      enabledAssets: {
        mainnet: {
          [activeWalletId]: ['ETH'],
        },
        testnet: {
          [activeWalletId]: ['ETH'],
        },
      },
      activeNetwork: NetworkEnum.Testnet,
      activeWalletId,
    }
    const addresses = await walletManager.updateAddresses(state)
    expect(addresses.length > 0).toBeTruthy()
  })
})

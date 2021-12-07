import StorageManager from '../src/core/storage-manager'
import EncryptionManager from '../src/core/encryption-manager'
import Wallet from '@liquality/core/dist/wallet'
import { Config } from '@liquality/core/dist/config'
import { NetworkEnum } from '@liquality/core/dist/types'
import { config } from 'dotenv'
import { AccountType } from '../src/core/types'

describe('WalletManagerTest', () => {
  config()
  const PASSWORD = process.env.PASSWORD!
  const MNEMONIC = process.env.MNEMONIC!
  let wallet = new Wallet(
    new StorageManager('@liqualityStore', []),
    new EncryptionManager(),
    new Config(process.env.INFURA_API_KEY),
  )

  beforeAll(() => {
    global.crypto = {}
    global.crypto.getRandomValues = () => new Uint8Array(1)
  })

  beforeEach(() => {
    wallet = new Wallet(
      new StorageManager('@liqualityStore', []),
      new EncryptionManager(),
      new Config(process.env.INFURA_API_KEY),
    )
  })

  it('should create a wallet', async () => {
    const initialState = await wallet.init(PASSWORD, MNEMONIC)
    expect(initialState.keySalt).toBeTruthy()
  })

  it('should create an account', async () => {
    let account
    await wallet.init(PASSWORD, MNEMONIC)
    wallet.subscribe((acct: AccountType) => {
      account = acct
    })
    await wallet.addAccounts(NetworkEnum.Testnet)
    expect(account).toBeTruthy()
  })

  it('should have a positive balance', async () => {
    await wallet.init(PASSWORD, MNEMONIC)
    let balances: Record<string, number> = {}
    wallet.subscribe((account: AccountType) => {
      balances = account.balances
    })
    await wallet.addAccounts(NetworkEnum.Testnet)

    expect(balances.ETH > 0).toBeTruthy()
  })

  it('should call callback upon adding an account', async () => {
    await wallet.init(PASSWORD, MNEMONIC)
    const fnc = jest.fn()
    wallet.subscribe(fnc)
    await wallet.addAccounts(NetworkEnum.Testnet)
    expect(fnc).toHaveBeenCalled()
  })

  it('should be able to restore a wallet', async () => {
    const newWallet = await wallet.build(PASSWORD, MNEMONIC, false)
    await wallet.store(newWallet)
    delete newWallet.wallets
    const retoredWallet = await wallet.restore(PASSWORD)

    expect(retoredWallet.keySalt).toBeTruthy()
    expect(retoredWallet.wallets).toBeTruthy()
    expect(retoredWallet.encryptedWallets).toBeTruthy()
    expect(retoredWallet.accounts).toBeTruthy()
  })

  it('should generate 12 seed words', () => {
    const seedWords = Wallet.generateSeedWords()
    expect(seedWords.length).toEqual(12)
  })

  it('should generate different random seed words', () => {
    const seedWords1 = Wallet.generateSeedWords()
    const seedWords2 = Wallet.generateSeedWords()
    expect(
      seedWords1.sort().join(' ') !== seedWords2.sort().join(' '),
    ).toBeTruthy()
  })

  it('should find a seed phrase NOT valid', () => {
    expect(!Wallet.validateSeedPhrase('blabl')).toBeTruthy()
  })

  it('should find a seed phrase valid', () => {
    expect(
      Wallet.validateSeedPhrase(
        'seed sock milk update focus rotate barely fade car face mechanic mercy',
      ),
    ).toBeTruthy()
  })

  // //TODO run this against Truffle
  it('should find unused addresses', async () => {
    const {
      activeWalletId = '',
      activeNetwork,
      accounts,
    } = await wallet.build(PASSWORD, MNEMONIC, false)

    const { addresses, balances = {} } =
      accounts[activeWalletId][activeNetwork][0]
    expect(
      addresses.length > 0 && addresses.length === Object.keys(balances).length,
    ).toBeTruthy()
  })

  it('should get prices for assets', async () => {
    const { fiatRates } = await wallet.build(PASSWORD, MNEMONIC, false)
    expect(fiatRates && fiatRates.ETH > 0).toBeTruthy()
  })
})

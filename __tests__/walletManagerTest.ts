import WalletManager from '../src/core/walletManager'
import StorageManager from '../src/core/storageManager'

describe('WalletManagerTest', () => {
  const PASSWORD = 'this is my cool password'
  const wallet = {
    id: '1234',
    at: Date.now(),
    name: 'Account-1',
    mnemomnic: 'anjsnc8383jndndj',
    imported: false,
  }
  const walletManager = new WalletManager(
    wallet,
    PASSWORD,
    new StorageManager(),
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
    expect(newWallet.account).toBeTruthy()
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
})

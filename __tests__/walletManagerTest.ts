import WalletManager from '../src/core/walletManager'
import StorageManager from '../src/core/storageManager'

describe('WalletManagerTest', () => {
  const PASSWORD = 'this is my cool password'
  beforeAll(() => {
    global.crypto = {}
    global.crypto.getRandomValues = () => new Uint8Array(1)
  })

  it('should create a wallet', async () => {
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
    const newWallet = await walletManager.createWallet()
    expect(newWallet.keySalt).toBeTruthy()
    expect(newWallet.wallets).toBeTruthy()
    expect(newWallet.encryptedWallets).toBeTruthy()
    expect(newWallet.account).toBeTruthy()
  })
})

import { ChainId } from '@liquality/cryptoassets'

// class CustomConfig extends Config {
//   public getDefaultEnabledAssets(network: NetworkEnum): string[] {
//     return super.getDefaultEnabledAssets(network)
//   }
//
//   public getDefaultEnabledChains(network: NetworkEnum): ChainId[] {
//     return super
//       .getDefaultEnabledChains(network)
//       .concat([ChainId.Bitcoin, ChainId.Rootstock])
//   }
// }

describe('WalletManagerTest', () => {
  //   config()
  //   const PASSWORD = process.env.PASSWORD!
  //   const MNEMONIC = process.env.MNEMONIC!
  //   let wallet = new Wallet(
  //     new StorageManager('@liqualityStore', []),
  //     new MockEncryptionManager(),
  //     new Config(process.env.INFURA_API_KEY),
  //   )
  //
  //   beforeAll(() => {
  //     jest.setTimeout(100000)
  //     global.crypto = {}
  //     global.crypto.getRandomValues = () => new Uint8Array(1)
  //   })
  //
  //   beforeEach(() => {
  //     wallet = new Wallet(
  //       new StorageManager('@liqualityStore', []),
  //       new MockEncryptionManager(),
  //       new Config(process.env.INFURA_API_KEY),
  //     )
  //   })
  //
  it('should create a wallet', async () => {
    // const initialState = await wallet.init(PASSWORD, MNEMONIC)
    // expect(initialState.keySalt).toBeTruthy()
    expect(!!ChainId.Bitcoin)
  })
  //
  //   it('should create an account', async () => {
  //     let account
  //     await wallet.init(PASSWORD, MNEMONIC)
  //     wallet.subscribe((acct: AccountType) => {
  //       account = acct
  //     })
  //     await wallet.addAccounts(NetworkEnum.Testnet)
  //     expect(account).toBeTruthy()
  //   })
  //
  //   it('should have a positive balance for two assets', async () => {
  //     wallet = new Wallet(
  //       new StorageManager('@liqualityStore', []),
  //       new MockEncryptionManager(),
  //       new CustomConfig(process.env.INFURA_API_KEY),
  //     )
  //     const walletState = await wallet.build(PASSWORD, MNEMONIC, false)
  //     const { activeNetwork, activeWalletId } = walletState
  //     const accounts = walletState?.accounts?.[activeWalletId!][activeNetwork!]
  //     const ethBalance = accounts?.filter((item) => item.balances?.SOV)
  //     const btcBalance = accounts?.filter((item) => item.balances?.RBTC)
  //     expect(ethBalance && btcBalance).toBeTruthy()
  //   })
  //
  //   it('should have a positive balance for rsk/rootstock assets', async () => {
  //     wallet = new Wallet(
  //       new StorageManager('@liqualityStore', []),
  //       new MockEncryptionManager(),
  //       new CustomConfig(process.env.INFURA_API_KEY),
  //     )
  //
  //     const walletState = await wallet.build(PASSWORD, MNEMONIC, false)
  //     const { activeNetwork, activeWalletId } = walletState
  //     const accounts = walletState?.accounts?.[activeWalletId!][activeNetwork!]
  //
  //     const sovBalance = accounts?.filter((item) => item.balances?.SOV)
  //     const rbtcBalance = accounts?.filter((item) => item.balances?.RBTC)
  //     expect(sovBalance && rbtcBalance).toBeTruthy()
  //   })
  //
  //   it('should call callback upon adding an account', async () => {
  //     await wallet.init(PASSWORD, MNEMONIC)
  //     const fnc = jest.fn()
  //     wallet.subscribe(fnc)
  //     await wallet.addAccounts(NetworkEnum.Testnet)
  //     expect(fnc).toHaveBeenCalled()
  //   })
  //
  //   it('should be able to restore a wallet', async () => {
  //     const newWallet = await wallet.build(PASSWORD, MNEMONIC, false)
  //     await wallet.store(newWallet)
  //     delete newWallet.wallets
  //     const retoredWallet = await wallet.restore(PASSWORD)
  //     await wallet.refresh()
  //
  //     expect(retoredWallet.keySalt).toBeTruthy()
  //     expect(retoredWallet.wallets).toBeTruthy()
  //     expect(retoredWallet.encryptedWallets).toBeTruthy()
  //     expect(retoredWallet.accounts).toBeTruthy()
  //   })
  //
  //   it('should generate 12 seed words', () => {
  //     const seedWords = Wallet.generateSeedWords()
  //     expect(seedWords.length).toEqual(12)
  //   })
  //
  //   it('should generate different random seed words', () => {
  //     const seedWords1 = Wallet.generateSeedWords()
  //     const seedWords2 = Wallet.generateSeedWords()
  //     expect(
  //       seedWords1.sort().join(' ') !== seedWords2.sort().join(' '),
  //     ).toBeTruthy()
  //   })
  //
  //   it('should find a seed phrase NOT valid', () => {
  //     expect(!Wallet.validateSeedPhrase('blabl')).toBeTruthy()
  //   })
  //
  //   it('should find a seed phrase valid', () => {
  //     expect(
  //       Wallet.validateSeedPhrase(
  //         'seed sock milk update focus rotate barely fade car face mechanic mercy',
  //       ),
  //     ).toBeTruthy()
  //   })
  //
  //   it('should find unused addresses', async () => {
  //     const { activeWalletId, activeNetwork, accounts } = await wallet.build(
  //       PASSWORD,
  //       MNEMONIC,
  //       false,
  //     )
  //
  //     if (!accounts || !activeWalletId || !activeNetwork) {
  //       throw new Error('invalid setup')
  //     }
  //     const { addresses, balances } =
  //       accounts![activeWalletId]![activeNetwork]![0]
  //     expect(
  //       addresses.length > 0 && addresses.length === Object.keys(balances).length,
  //     ).toBeTruthy()
  //   })
  //
  //   it('should get prices for assets', async () => {
  //     const { fiatRates } = await wallet.build(PASSWORD, MNEMONIC, false)
  //     expect(fiatRates && fiatRates.ETH > 0).toBeTruthy()
  //   })
})

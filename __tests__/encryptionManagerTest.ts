import EncryptionManager from '../src/core/encryptionManager'

describe('EncryptionManagerTest', () => {
  const PASSWORD = 'this is my password'

  beforeAll(() => {
    global.crypto = {}
    global.crypto.getRandomValues = () => new Uint8Array(1)
  })

  it('should generate a base64 encoded salt', () => {
    const encryptionManager = new EncryptionManager(PASSWORD)
    expect(encryptionManager.generateSalt(16)).toBeTruthy()
  })

  it('should encrypt a string', async () => {
    const encryptionManager = new EncryptionManager(PASSWORD)
    const encryptedValue = await encryptionManager.encrypt(
      'This is a cool wallet',
    )
    expect(encryptedValue).toBeTruthy()
  })

  it('should decrypt a string', async () => {
    const DATA = 'This is a cool wallet'
    const encryptionManager = new EncryptionManager(PASSWORD)
    const { encrypted, keySalt } = await encryptionManager.encrypt(DATA)
    const decryptedValue = await encryptionManager.decrypt(encrypted, keySalt)
    expect(decryptedValue).toEqual(DATA)
  })
})

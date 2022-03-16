import MockEncryptionManager from '../__mocks__/mock-encryption-manager'

describe('EncryptionManagerTest', () => {
  const PASSWORD = 'this is my password'
  const DATA = 'This is a cool wallet'

  beforeAll(() => {
    global.crypto = {}
    global.crypto.getRandomValues = () => new Uint8Array(1)
  })

  fit('should generate a base64 encoded salt', () => {
    const encryptionManager = new MockEncryptionManager()
    expect(encryptionManager.generateSalt(16)).toBeTruthy()
  })

  it('should encrypt a string', async () => {
    const encryptionManager = new MockEncryptionManager()
    const keySalt = encryptionManager.generateSalt(16)
    const encryptedValue = await encryptionManager.encrypt(
      DATA,
      keySalt,
      PASSWORD,
    )
    expect(encryptedValue).toBeTruthy()
  })

  it('should decrypt a string', async () => {
    const encryptionManager = new MockEncryptionManager()
    const keySalt = encryptionManager.generateSalt(16)
    const encrypted = await encryptionManager.encrypt(DATA, keySalt, PASSWORD)
    const decryptedValue = await encryptionManager.decrypt(
      encrypted,
      keySalt,
      PASSWORD,
    )
    expect(decryptedValue).toEqual(DATA)
  })

  it('should fail decryption when decyrpting using a different password', async () => {
    const encryptionManager = new MockEncryptionManager()
    const keySalt = encryptionManager.generateSalt(16)
    const encrypted = await encryptionManager.encrypt(DATA, keySalt, PASSWORD)
    const encryptionManager2 = new MockEncryptionManager()
    const decryptedValue = await encryptionManager2.decrypt(
      encrypted,
      keySalt,
      'BLA',
    )
    expect(!decryptedValue).toBeTruthy()
  })
})

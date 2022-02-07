import EncryptionManager from '../src/core/encryption-manager'
import _pbkdf2 from 'pbkdf2'

const PBKDF2_ITERATIONS = 100000
const PBKDF2_LENGTH = 32

export default class MockEncryptionManager extends EncryptionManager {
  public async pbkdf2(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      _pbkdf2.pbkdf2(
        password,
        salt,
        PBKDF2_ITERATIONS,
        PBKDF2_LENGTH,
        'sha256',
        (err, derivedKey) => {
          if (err) {
            reject(err)
          } else {
            resolve(global.Buffer.from(derivedKey).toString('hex'))
          }
        },
      )
    })
  }
}

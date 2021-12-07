import _pbkdf2 from 'pbkdf2'
import { enc as Enc, AES, lib as Lib } from 'crypto-js'
import { IEncryption } from '@liquality/core/dist/types'

const PBKDF2_ITERATIONS = 100000
const PBKDF2_LENGTH = 32
const PBKDF2_DIGEST = 'sha256'

interface CipherJsonType {
  ct: string
  iv?: string
  s?: string
}

export default class EncryptionManager implements IEncryption {
  public generateSalt(byteCount = 32): string {
    const view = new Uint8Array(byteCount)
    // @ts-ignore
    global.crypto.getRandomValues(view)
    return global.Buffer.from(
      String.fromCharCode.apply(null, Array.from(view)),
    ).toString('base64')
  }

  public async encrypt(
    value: string,
    keySalt: string,
    password: string,
  ): Promise<string> {
    const derivedKey = await this.pbkdf2(password, keySalt)
    const rawEncryptedValue = AES.encrypt(value, derivedKey)
    return this.JsonFormatter.stringify(rawEncryptedValue)
  }

  public async decrypt(
    encrypted: string,
    keySalt: string,
    password: string,
  ): Promise<string> {
    if (!keySalt) {
      return ''
    }

    const encryptedValue = this.JsonFormatter.parse(encrypted)
    try {
      const derivedKey = await this.pbkdf2(password, keySalt)
      const decryptedValue = AES.decrypt(encryptedValue, derivedKey)
      return decryptedValue.toString(Enc.Utf8)
    } catch (e) {
      return ''
    }
  }

  private JsonFormatter = {
    stringify(cipherParams: Lib.CipherParams) {
      const jsonObj: CipherJsonType = {
        ct: cipherParams.ciphertext.toString(Enc.Base64),
      }

      if (cipherParams.iv) {
        jsonObj.iv = cipherParams.iv.toString()
      }

      if (cipherParams.salt) {
        jsonObj.s = cipherParams.salt.toString()
      }

      return JSON.stringify(jsonObj)
    },

    parse(jsonStr: string) {
      const jsonObj = JSON.parse(jsonStr)

      const cipherParams = Lib.CipherParams.create({
        ciphertext: Enc.Base64.parse(jsonObj.ct),
      })

      if (jsonObj.iv) {
        cipherParams.iv = Enc.Hex.parse(jsonObj.iv)
      }

      if (jsonObj.s) {
        cipherParams.salt = Enc.Hex.parse(jsonObj.s)
      }

      return cipherParams
    },
  }

  private async pbkdf2(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      _pbkdf2.pbkdf2(
        password,
        salt,
        PBKDF2_ITERATIONS,
        PBKDF2_LENGTH,
        PBKDF2_DIGEST,
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

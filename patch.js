const fs = require('fs/promises')

async function fixBrowserCheck(path) {
  const vueRuntimeDom = await fs.readFile(path, { encoding: 'utf8' })
  const fixedVueRuntimeDom = vueRuntimeDom
    .replaceAll(
      "typeof window !== 'undefined'",
      "typeof window !== 'undefined' && typeof document !== 'undefined'",
    )
    .replaceAll(
      '"undefined"!=typeof window',
      '"undefined"!=typeof window && "undefined"!==typeof document',
    )
  await fs.writeFile(path, fixedVueRuntimeDom)
}

;(async () => {
  //Fix solana
  const solanaWeb3Package = await fs.readFile(
    'node_modules/@solana/web3.js/package.json',
    { encoding: 'utf8' },
  )
  const fixedSolanaWeb3Package = solanaWeb3Package.replaceAll(
    './lib/index.browser.cjs.js',
    './lib/index.cjs.js',
  )
  await fs.writeFile(
    'node_modules/@solana/web3.js/package.json',
    fixedSolanaWeb3Package,
  )

  //Fix ethers pbkdf2
  const ethersPbkdf2Web3Package = await fs.readFile(
    'node_modules/@ethersproject/pbkdf2/package.json',
    { encoding: 'utf8' },
  )
  const fixedEthersPbkdf2Package = ethersPbkdf2Web3Package.replaceAll(
    'browser-pbkdf2.js',
    'pbkdf2.js',
  )
  await fs.writeFile(
    'node_modules/@ethersproject/pbkdf2/package.json',
    fixedEthersPbkdf2Package,
  )

  //Fix xmlhttprequest file
  const xmlHttpRequestFile = await fs.readFile(
    'node_modules/xmlhttprequest/lib/XMLHttpRequest.js',
    { encoding: 'utf8' },
  )
  const fixedXmlHttpRequestFile = xmlHttpRequestFile.replaceAll(
    'var spawn = require("child_process").spawn;',
    'var spawn = () => {}',
  )
  await fs.writeFile(
    'node_modules/xmlhttprequest/lib/XMLHttpRequest.js',
    fixedXmlHttpRequestFile,
  )

  //Fix Vue JSX conflict with react-native jsx
  const vueJsxTypeDef = await fs.readFile('node_modules/vue/types/jsx.d.ts', {
    encoding: 'utf8',
  })
  const fixVueJsxTypeDef = vueJsxTypeDef.replaceAll('JSX', 'JSX_NOT_REQUIRED')
  await fs.writeFile('node_modules/vue/types/jsx.d.ts', fixVueJsxTypeDef)

  //Fix Asyncstorage warning
  const asyncDownIssueFile1 = await fs.readFile(
    'node_modules/asyncstorage-down/default-opts.js',
    {
      encoding: 'utf8',
    },
  )
  const fixAsyncDownIssueFile1 = asyncDownIssueFile1.replaceAll(
    "return require('react-native').AsyncStorage",
    "return require('@react-native-async-storage/async-storage').default",
  )
  await fs.writeFile(
    'node_modules/asyncstorage-down/default-opts.js',
    fixAsyncDownIssueFile1,
  )

  const asyncDownIssueFile2 = await fs.readFile(
    'node_modules/asyncstorage-down/package.json',
    {
      encoding: 'utf8',
    },
  )
  const fixAsyncDownIssueFile2 = asyncDownIssueFile2.replaceAll(
    '"react-native": "file:./mock-react-native"',
    '"@react-native-async-storage/async-storage": "file:./mock-react-native"',
  )
  await fs.writeFile(
    'node_modules/asyncstorage-down/package.json',
    fixAsyncDownIssueFile2,
  )

  try {
    await fs.rename(
      'node_modules/superstruct/lib/index.cjs',
      'node_modules/superstruct/lib/index.cjs.js',
    )
  } catch (e) {
    //Ignore error
    //console.log('node_modules/superstruct/lib/index.cjs', 'already renamed?')
  }

  await fixBrowserCheck('node_modules/vue/dist/vue.runtime.common.dev.js')
  await fixBrowserCheck('node_modules/vue/dist/vue.runtime.common.prod.js')

  //Fix for bitcoin send issue with BufferN for file p2pkh
  const readBufferN_p2pkh = await fs.readFile(
    'node_modules/bitcoinjs-lib/src/payments/p2pkh.js',
    {
      encoding: 'utf8',
    },
  )
  const writeBufferN_To_Buffer_p2pkh = readBufferN_p2pkh.replaceAll(
    'output: typef.maybe(typef.BufferN(25))',
    'output: typef.maybe(typef.Buffer)',
  )
  await fs.writeFile(
    'node_modules/bitcoinjs-lib/src/payments/p2pkh.js',
    writeBufferN_To_Buffer_p2pkh,
  )

  //Fix for bitcoin send issue with BufferN for file p2sh
  const readBufferN_p2sh = await fs.readFile(
    'node_modules/bitcoinjs-lib/src/payments/p2sh.js',
    {
      encoding: 'utf8',
    },
  )
  const writeBufferN_To_Buffer_p2sh = readBufferN_p2sh.replaceAll(
    'output: typef.maybe(typef.BufferN(23))',
    'output: typef.maybe(typef.Buffer)',
  )
  await fs.writeFile(
    'node_modules/bitcoinjs-lib/src/payments/p2sh.js',
    writeBufferN_To_Buffer_p2sh,
  )

  //Fix for bitcoin send issue with BufferN for file p2wpkh
  const readBufferN_p2wpkh = await fs.readFile(
    'node_modules/bitcoinjs-lib/src/payments/p2wpkh.js',
    {
      encoding: 'utf8',
    },
  )
  const writeBufferN_To_Buffer_p2wpkh = readBufferN_p2wpkh.replaceAll(
    'output: typef.maybe(typef.BufferN(22))',
    'output: typef.maybe(typef.Buffer)',
  )
  await fs.writeFile(
    'node_modules/bitcoinjs-lib/src/payments/p2wpkh.js',
    writeBufferN_To_Buffer_p2wpkh,
  )

  //Fix for bitcoin send issue with BufferN for file p2wsh
  const readBufferN_p2wsh = await fs.readFile(
    'node_modules/bitcoinjs-lib/src/payments/p2wsh.js',
    {
      encoding: 'utf8',
    },
  )
  const writeBufferN_To_Buffer_p2wsh = readBufferN_p2wsh.replaceAll(
    'output: typef.maybe(typef.BufferN(34))',
    'output: typef.maybe(typef.Buffer)',
  )
  await fs.writeFile(
    'node_modules/bitcoinjs-lib/src/payments/p2wsh.js',
    writeBufferN_To_Buffer_p2wsh,
  )

  //Fix ZLIB FILE
  const zLibFile = await fs.readFile(
    'node_modules/@eth-optimism/core-utils/dist/optimism/batch-encoding.js',
    { encoding: 'utf8' },
  )
  const fixedZLibFile = zLibFile.replaceAll(
    'const zlib_1 = __importDefault(require("zlib"));',
    'const zlib_1 = () => {}',
  )
  await fs.writeFile(
    'node_modules/@eth-optimism/core-utils/dist/optimism/batch-encoding.js',
    fixedZLibFile,
  )
})()

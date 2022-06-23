const fs = require('fs/promises')

async function fixBrowserCheck(path) {
  const vueRuntimeDom = await fs.readFile(path, { encoding: 'utf8' })
  const fixedVueRuntimeDom = vueRuntimeDom.replaceAll(
    "typeof window !== 'undefined'",
    "typeof window !== 'undefined' && typeof document !== 'undefined'",
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
})()

const fs = require('fs/promises')

;(async () => {
  const solanaWeb3Package = await fs.readFile(
    'node_modules/@solana/web3.js/package.json',
    { encoding: 'utf8' },
  )
  const fixedSolanaWeb3Package = solanaWeb3Package.replace(
    /\.\/lib\/index\.browser\.cjs\.js/g,
    './lib/index.cjs.js',
  )
  await fs.writeFile(
    'node_modules/@solana/web3.js/package.json',
    fixedSolanaWeb3Package,
  )

  const vueRuntimeDom = await fs.readFile(
    'node_modules/@vue/runtime-dom/dist/runtime-dom.cjs.js',
    { encoding: 'utf8' },
  )
  const fixedVueRuntimeDom = vueRuntimeDom.replace(
    /if \(typeof window !== 'undefined'\)/g,
    "if (typeof window !== 'undefined' && typeof document !== 'undefined')",
  )
  await fs.writeFile(
    'node_modules/@vue/runtime-dom/dist/runtime-dom.cjs.js',
    fixedVueRuntimeDom,
  )

  try {
    await fs.rename(
      'node_modules/superstruct/lib/index.cjs',
      'node_modules/superstruct/lib/index.cjs.js',
    )
  } catch (e) {
    //ignore
  }
})()

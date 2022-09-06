import { calculateAvailableAmnt } from '../src/core/utils/fee-calculator'

describe('fee-calculator', () => {
  it('calculateAvailableAmnt: should calculate available amount', () => {
    expect(
      calculateAvailableAmnt('mainnet', 'ETH', 2.34, 14979979875164946000),
    ).toEqual('14.979979')
  })

  it('calculateAvailableAmnt: should calculate available amount for ERC20', () => {
    expect(
      calculateAvailableAmnt('testnet', 'DAI', 2.34, 14979979875164946000),
    ).toEqual('14.979979')
  })

  it('calculateAvailableAmnt: should throw error for negative fees', () => {
    expect(() => calculateAvailableAmnt('testnet', 'ETH', -123, 1123)).toThrow(
      'Invalid arguments',
    )
  })

  it('calculateAvailableAmnt: should throw error for invalid asset', () => {
    expect(() => calculateAvailableAmnt('testnet', 'BLA', 123, 1123)).toThrow(
      'Invalid asset name',
    )
  })
})

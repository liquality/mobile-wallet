import {
  calculateAvailableAmnt,
  calculateGasFee,
} from '../src/core/utils/fee-calculator'

describe('fee-calculator', () => {
  it('calculateGasFee: should calculate gas fee', () => {
    expect(calculateGasFee('ETH', 123) > 0).toBeTruthy()
  })

  it('calculateGasFee: should throw an error for invalid asset', () => {
    expect(() => calculateGasFee('BLA', 123) > 0).toThrow('Invalid asset name')
  })

  it('calculateGasFee: should throw error for negative fees', () => {
    expect(() => calculateGasFee('ETH', -123) > 0).toThrow('Invalid arguments')
  })

  it('calculateAvailableAmnt: should calculate available amount', () => {
    expect(calculateAvailableAmnt('ETH', 2.34, 14979979875164946000)).toEqual(
      '12.639979',
    )
  })

  it('calculateAvailableAmnt: should calculate available amount for ERC20', () => {
    expect(calculateAvailableAmnt('ZAP', 2.34, 14979979875164946000)).toEqual(
      '14.979979',
    )
  })

  it('calculateAvailableAmnt: should throw error for negative fees', () => {
    expect(() => calculateAvailableAmnt('ETH', -123, 1123)).toThrow(
      'Invalid arguments',
    )
  })

  it('calculateAvailableAmnt: should throw error for invalid asset', () => {
    expect(() => calculateAvailableAmnt('BLA', 123, 1123)).toThrow(
      'Invalid asset name',
    )
  })
})

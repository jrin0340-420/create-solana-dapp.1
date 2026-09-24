import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getVersion } from '../src/utils/get-version'
import { runEnvironmentDoctor } from '../src/utils/run-environment-doctor'

vi.mock('../src/utils/get-version', () => ({
  getVersion: vi.fn(),
}))

describe('runEnvironmentDoctor', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns no notes when no versions are required', async () => {
    await expect(runEnvironmentDoctor()).resolves.toEqual([])
  })

  it('returns targeted notes for missing or outdated tools', async () => {
    vi.mocked(getVersion).mockImplementation((command) => {
      if (command === 'anchor') {
        return '0.30.0'
      }
      if (command === 'solana') {
        return undefined
      }
      return undefined
    })

    const result = await runEnvironmentDoctor({ anchor: '0.31.1', solana: '2.1.0' })

    expect(result[0]).toBe('Environment doctor:')
    expect(result[1]).toContain('Anchor 0.30.0 found; 0.31.1 or newer is recommended.')
    expect(result[2]).toContain('Solana is not installed; 2.1.0 or newer is recommended.')
  })
})

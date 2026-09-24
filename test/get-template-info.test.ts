import { describe, expect, it } from 'vitest'
import { formatTemplateInfo } from '../src/utils/get-template-info'

describe('formatTemplateInfo', () => {
  it('formats the major template metadata sections', () => {
    const result = formatTemplateInfo({
      initInstructions: ['Run {pm} install'],
      keywords: ['nextjs', 'anchor'],
      options: {
        ollama: {
          default: true,
          description: 'Configure the template for Ollama',
          group: 'engine',
        },
      },
      packageManager: 'bun',
      template: {
        description: 'Basic template',
        id: 'gh:solana-foundation/templates/basic',
        keywords: ['nextjs', 'anchor'],
        name: 'basic',
        path: 'kit/basic',
        usecase: 'Starter app',
      },
      versions: {
        anchor: '0.31.1',
        solana: '2.1.0',
      },
    })

    expect(result).toContain('Template: basic')
    expect(result).toContain('Package manager: bun')
    expect(result).toContain('Keywords: nextjs, anchor')
    expect(result).toContain('- anchor >= 0.31.1')
    expect(result).toContain('- --ollama (default, group: engine): Configure the template for Ollama')
    expect(result).toContain('- Run {pm} install')
  })

  it('renders empty sections when the template has no optional metadata', () => {
    const result = formatTemplateInfo({
      template: {
        description: 'Basic template',
        id: 'gh:solana-foundation/templates/basic',
        keywords: [],
        name: 'basic',
        path: 'kit/basic',
      },
    })

    expect(result).toContain('Keywords: None')
    expect(result).toContain('Required tools:\n- None')
    expect(result).toContain('Option flags:\n- None')
    expect(result).toContain('Post-create instructions:\n- None')
  })
})

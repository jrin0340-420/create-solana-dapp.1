import { describe, expect, it } from 'vitest'
import { buildTemplateOptionsData, formatTemplateOptions } from '../src/utils/list-template-options'

describe('formatTemplateOptions', () => {
  it('formats template options with defaults and groups', () => {
    const result = formatTemplateOptions(
      buildTemplateOptionsData({
        options: {
          llamacpp: {
            description: 'Configure the template for llama.cpp',
            group: 'engine',
          },
          ollama: {
            default: true,
            description: 'Configure the template for Ollama',
            group: 'engine',
          },
        },
        template: { name: 'basic' },
      }),
    )

    expect(result).toContain('Template options for basic:')
    expect(result).toContain('- --ollama (default, group: engine): Configure the template for Ollama')
    expect(result).toContain('- --llamacpp (group: engine): Configure the template for llama.cpp')
  })

  it('renders no options when none are declared', () => {
    const result = formatTemplateOptions(buildTemplateOptionsData({ template: { name: 'basic' } }))

    expect(result).toBe('Template options for basic:\n- None')
  })

  it('builds machine-readable template option data', () => {
    const result = buildTemplateOptionsData({
      options: {
        ollama: {
          default: true,
          description: 'Configure the template for Ollama',
          group: 'engine',
        },
      },
      template: { name: 'basic' },
    })

    expect(result).toEqual({
      options: [
        {
          default: true,
          description: 'Configure the template for Ollama',
          group: 'engine',
          name: 'ollama',
          optionFlag: '--ollama',
        },
      ],
      template: 'basic',
    })
  })
})

import { describe, expect, it } from 'vitest'
import { filterTemplates } from '../src/utils/list-templates'
import type { TemplateJsonTemplate } from '../src/utils/template-schema'

const templates: TemplateJsonTemplate[] = [
  {
    description: 'AI starter kit',
    id: 'gh:org/ai-kit',
    keywords: ['ai', 'react'],
    name: 'ai-kit',
    path: 'community/ai-kit',
    usecase: 'Inference',
  },
  {
    description: 'Minimal mobile template',
    id: 'gh:org/mobile-minimal',
    keywords: ['mobile', 'minimal'],
    name: 'mobile-minimal',
    path: 'mobile/minimal',
    usecase: 'Starter app',
  },
]

describe('filterTemplates', () => {
  it('returns all templates when no filters are provided', () => {
    expect(filterTemplates({ templates })).toEqual(templates)
  })

  it('matches filters against keywords and other text fields', () => {
    expect(filterTemplates({ filters: ['ai'], templates })).toEqual([templates[0]])
    expect(filterTemplates({ filters: ['mobile', 'minimal'], templates })).toEqual([templates[1]])
  })
})

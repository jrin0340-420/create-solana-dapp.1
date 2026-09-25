import { log } from '@clack/prompts'
import { TemplateJsonTemplate } from './template-schema'

export function listTemplates({ filters = [], templates }: { filters?: string[]; templates: TemplateJsonTemplate[] }) {
  const filteredTemplates = filterTemplates({ filters, templates })

  if (filteredTemplates.length === 0) {
    log.warn(`No templates matched${filters.length > 0 ? `: ${filters.join(', ')}` : '.'}`)
    return
  }

  for (const template of filteredTemplates) {
    log.info(`${template.name}: \n\n\t${template.description}\n\t${template.id}`)
  }
}

export function filterTemplates({
  filters = [],
  templates,
}: {
  filters?: string[]
  templates: TemplateJsonTemplate[]
}): TemplateJsonTemplate[] {
  if (filters.length === 0) {
    return templates
  }

  return templates.filter((template) => {
    const haystack = [
      template.description,
      template.id,
      ...template.keywords,
      template.name,
      template.path,
      template.usecase,
    ]
      .filter(Boolean)
      .join('\n')
      .toLowerCase()

    return filters.every((filter) => haystack.includes(filter.toLowerCase()))
  })
}

export function listTemplatesJson({
  filters = [],
  templates,
}: {
  filters?: string[]
  templates: TemplateJsonTemplate[]
}): TemplateJsonTemplate[] {
  return filterTemplates({ filters, templates })
}

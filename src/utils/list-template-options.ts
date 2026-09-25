import { getTemplateMetadata } from './get-template-metadata'
import { InitScriptOptions } from './init-script-schema'
import { Template } from './template'

export async function listTemplateOptions({ template }: { template: Template }): Promise<string> {
  const metadata = await getTemplateMetadata(template)
  return formatTemplateOptions(buildTemplateOptionsData({ options: metadata.init?.options, template }))
}

export function buildTemplateOptionsData({
  options,
  template,
}: {
  options?: InitScriptOptions
  template: Pick<Template, 'name'>
}) {
  const entries = Object.entries(options ?? {})

  if (entries.length === 0) {
    return {
      options: [],
      template: template.name,
    }
  }

  return {
    options: entries.map(([name, option]) => ({
      default: option.default ?? false,
      description: option.description,
      group: option.group,
      name,
      optionFlag: `--${name}`,
    })),
    template: template.name,
  }
}

export function formatTemplateOptions(data: ReturnType<typeof buildTemplateOptionsData>): string {
  if (data.options.length === 0) {
    return `Template options for ${data.template}:\n- None`
  }

  return [
    `Template options for ${data.template}:`,
    ...data.options.map((option) => {
      const meta = [option.default ? 'default' : undefined, option.group ? `group: ${option.group}` : undefined]
        .filter(Boolean)
        .join(', ')

      return `- ${option.optionFlag}${meta ? ` (${meta})` : ''}: ${option.description ?? 'No description provided.'}`
    }),
  ].join('\n')
}

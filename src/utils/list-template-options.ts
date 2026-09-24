import { getTemplateMetadata } from './get-template-metadata'
import { InitScriptOptions } from './init-script-schema'
import { Template } from './template'

export async function listTemplateOptions({ template }: { template: Template }): Promise<string> {
  const metadata = await getTemplateMetadata(template)
  return formatTemplateOptions({ options: metadata.init?.options, template })
}

export function formatTemplateOptions({
  options,
  template,
}: {
  options?: InitScriptOptions
  template: Pick<Template, 'name'>
}): string {
  const entries = Object.entries(options ?? {})

  if (entries.length === 0) {
    return `Template options for ${template.name}:\n- None`
  }

  return [
    `Template options for ${template.name}:`,
    ...entries.map(([name, option]) => {
      const meta = [option.default ? 'default' : undefined, option.group ? `group: ${option.group}` : undefined]
        .filter(Boolean)
        .join(', ')

      return `- --${name}${meta ? ` (${meta})` : ''}: ${option.description ?? 'No description provided.'}`
    }),
  ].join('\n')
}

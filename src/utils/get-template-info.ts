import { InitScriptOptions } from './init-script-schema'
import { getTemplateMetadata } from './get-template-metadata'
import { Template } from './template'

export async function getTemplateInfo({ template }: { template: Template }): Promise<string> {
  const metadata = await getTemplateMetadata(template)
  return formatTemplateInfo({ options: metadata.init?.options, template, ...metadata })
}

export function formatTemplateInfo({
  initInstructions,
  keywords,
  options,
  packageManager,
  template,
  versions,
}: {
  initInstructions?: string[]
  keywords?: string[]
  options?: InitScriptOptions
  packageManager?: string
  template: Template
  versions?: Record<string, string | undefined>
}): string {
  const lines = [
    `Template: ${template.name}`,
    `Description: ${template.description}`,
    `Id: ${template.id}`,
    ...(template.path ? [`Path: ${template.path}`] : []),
    ...(template.usecase ? [`Use case: ${template.usecase}`] : []),
    `Keywords: ${keywords?.length ? keywords.join(', ') : 'None'}`,
    `Package manager: ${packageManager ?? 'Any supported package manager'}`,
    '',
    'Required tools:',
    ...formatRequiredTools(versions),
    '',
    'Option flags:',
    ...formatOptionSummary(options),
    '',
    'Post-create instructions:',
    ...formatInstructions(initInstructions),
  ]

  return lines.join('\n')
}

function formatInstructions(instructions?: string[]) {
  return instructions?.length ? instructions.map((instruction) => `- ${instruction}`) : ['- None']
}

function formatOptionSummary(options?: InitScriptOptions) {
  const entries = Object.entries(options ?? {})

  if (entries.length === 0) {
    return ['- None']
  }

  return entries.map(([name, option]) => {
    const meta = [option.default ? 'default' : undefined, option.group ? `group: ${option.group}` : undefined]
      .filter(Boolean)
      .join(', ')

    return `- --${name}${meta ? ` (${meta})` : ''}: ${option.description ?? 'No description provided.'}`
  })
}

function formatRequiredTools(versions?: Record<string, string | undefined>) {
  const entries = Object.entries(versions ?? {}).filter(([, version]) => version)

  if (entries.length === 0) {
    return ['- None']
  }

  return entries.map(([command, version]) => `- ${command} >= ${version}`)
}

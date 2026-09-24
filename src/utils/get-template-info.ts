import { getTemplateMetadata } from './get-template-metadata'
import { InitScriptOptions } from './init-script-schema'
import { Template } from './template'

export async function getTemplateInfo({ template }: { template: Template }): Promise<string> {
  const metadata = await getTemplateMetadata(template)
  return formatTemplateInfo(
    buildTemplateInfoData({
      initInstructions: metadata.init?.instructions,
      keywords: template.keywords,
      options: metadata.init?.options,
      packageManager: metadata.packageManager,
      template,
      versions: metadata.init?.versions,
    }),
  )
}

export function buildTemplateInfoData({
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
}) {
  const requiredTools = Object.fromEntries(
    Object.entries(versions ?? {}).filter((entry): entry is [string, string] => Boolean(entry[1])),
  )

  return {
    description: template.description,
    id: template.id,
    instructions: initInstructions ?? [],
    keywords: keywords ?? [],
    name: template.name,
    optionFlags: formatOptionSummary(options),
    packageManager,
    path: template.path,
    requiredTools,
    usecase: template.usecase,
  }
}

export function formatTemplateInfo(data: ReturnType<typeof buildTemplateInfoData>): string {
  const lines = [
    `Template: ${data.name}`,
    `Description: ${data.description}`,
    `Id: ${data.id}`,
    ...(data.path ? [`Path: ${data.path}`] : []),
    ...(data.usecase ? [`Use case: ${data.usecase}`] : []),
    `Keywords: ${data.keywords.length > 0 ? data.keywords.join(', ') : 'None'}`,
    `Package manager: ${data.packageManager ?? 'Any supported package manager'}`,
    '',
    'Required tools:',
    ...formatRequiredTools(data.requiredTools),
    '',
    'Option flags:',
    ...formatOptionLines(data.optionFlags),
    '',
    'Post-create instructions:',
    ...formatInstructions(data.instructions),
  ]

  return lines.join('\n')
}

function formatInstructions(instructions?: string[]) {
  return instructions?.length ? instructions.map((instruction) => `- ${instruction}`) : ['- None']
}

function formatOptionSummary(options?: InitScriptOptions) {
  const entries = Object.entries(options ?? {})

  if (entries.length === 0) {
    return []
  }

  return entries.map(([name, option]) => {
    const optionFlag = `--${name}`
    return {
      default: option.default ?? false,
      description: option.description,
      group: option.group,
      name,
      optionFlag,
    }
  })
}

function formatOptionLines(
  options: Array<{ default: boolean; description?: string; group?: string; optionFlag: string }>,
) {
  if (options.length === 0) {
    return ['- None']
  }

  return options.map((option) => {
    const meta = [option.default ? 'default' : undefined, option.group ? `group: ${option.group}` : undefined]
      .filter(Boolean)
      .join(', ')

    return `- ${option.optionFlag}${meta ? ` (${meta})` : ''}: ${option.description ?? 'No description provided.'}`
  })
}

function formatRequiredTools(versions?: Record<string, string>) {
  const entries = Object.entries(versions ?? {}).filter(([, version]) => version)

  if (entries.length === 0) {
    return ['- None']
  }

  return entries.map(([command, version]) => `- ${command} >= ${version}`)
}

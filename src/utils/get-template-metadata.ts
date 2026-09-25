import { downloadTemplate } from 'giget'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { getPackageJson, PackageJson } from './get-package-json'
import { InitScript, initScriptKey } from './init-script-schema'
import { Template } from './template'

export interface TemplateMetadata {
  init?: InitScript
  packageJson?: PackageJson
  packageManager?: string
}

export async function getTemplateMetadata(template: Template): Promise<TemplateMetadata> {
  const packageJson = await loadTemplatePackageJson(template)

  return {
    init: packageJson?.[initScriptKey],
    packageJson,
    packageManager: packageJson?.[initScriptKey]?.packageManager ?? packageJson?.packageManager,
  }
}

async function loadTemplatePackageJson(template: Template): Promise<PackageJson | undefined> {
  if (template.id.startsWith('local:')) {
    return safeReadPackageJson(template.id.replace('local:', ''))
  }

  const directory = mkdtempSync(join(tmpdir(), 'create-solana-dapp-'))

  try {
    await downloadTemplate(template.id, { dir: directory, forceClean: true })
    return safeReadPackageJson(directory)
  } finally {
    rmSync(directory, { force: true, recursive: true })
  }
}

function safeReadPackageJson(directory: string): PackageJson | undefined {
  try {
    return getPackageJson(directory).contents
  } catch (error) {
    if (`${error}`.includes('No package.json found')) {
      return undefined
    }
    throw error
  }
}

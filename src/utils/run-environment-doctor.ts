import { log } from '@clack/prompts'
import { getVersion } from './get-version'
import { getVersionUrls } from './get-version-urls'
import { InitScriptVersions } from './init-script-schema'
import { validateVersion } from './validate-version'

export async function runEnvironmentDoctor(versions?: InitScriptVersions, verbose = false): Promise<string[]> {
  if (!versions) {
    return []
  }

  const issues = Object.entries(versions)
    .filter((entry): entry is [keyof InitScriptVersions, string] => Boolean(entry[1]))
    .flatMap(([command, required]) => {
      const version = getVersion(command)
      const { valid } = validateVersion({ required, version })

      if (valid) {
        return []
      }

      const urls = getVersionUrls(command, required)
      return [
        version
          ? `${capitalize(command)} ${version} found; ${required} or newer is recommended.${urls.update ? ` ${urls.update}` : ''}`
          : `${capitalize(command)} is not installed; ${required} or newer is recommended.${urls.install ? ` ${urls.install}` : ''}`,
      ]
    })

  if (verbose && issues.length > 0) {
    log.warn(`Environment doctor found ${issues.length} issue${issues.length === 1 ? '' : 's'}`)
  }

  return issues.length > 0 ? ['Environment doctor:', ...issues] : []
}

function capitalize(value: string) {
  return `${value[0].toUpperCase()}${value.slice(1)}`
}

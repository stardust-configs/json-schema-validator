#!/usr/bin/env node

import { cac } from 'cac'

import { version } from './version'
import jsv from './index'

const cli = cac()

cli
  .command('[...src]', 'Validate files')
  .option('-s, --schema [url]', 'Remote JSON Schema URL')
  .option('--strict', 'Enable strict mode')
  .example((name) => {
    return `${name} "package.json" -s "https://json.schemastore.org/package"`
  })
  .example((name) => {
    return `${name} "tsconfig.json" "node12.json" "node14.json" -s "https://json.schemastore.org/tsconfig"`
  })
  .example((name) => {
    return `${name} "**/*.json" -s "https://json.schemastore.org/package"`
  })
  .action(async (src: string[], options) => {
    try {
      if (src.length === 0) throw new Error('src is required')
      if (options.s == undefined || options.schema == undefined) throw new Error('schema option is required')

      if (typeof options.s !== 'string' || typeof options.schema !== 'string') {
        throw new Error('schema option is string only')
      }

      const isValid = await jsv({
        srcFilePath: src,
        schemaFileURL: options.schema,
        strict: options.strict,
      })

      if (!isValid) return process.exit(1)

      return process.exit(0)
    } catch (error) {
      return process.exit(1)
    }
  })

cli.version(version)
cli.help()

cli.parse()

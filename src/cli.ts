import { cac } from 'cac'
import { validate } from './validate'
import consola from 'consola'

const cli = cac()

cli
  .command('[...src]', 'Validate files')
  .option('-s, --schema [url]', 'Remote JSON Schema URL')
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

      await validate({
        src: src,
        schema: options.schema,
      })
    } catch (error) {
      consola.error(error)
    }
  })

cli.version('0.1.0')
cli.help()

cli.parse()

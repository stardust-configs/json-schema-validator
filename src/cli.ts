import { cac } from 'cac'
import { validate } from './validate'

const cli = cac()

cli
  .command('[...src]', 'Validate files')
  .option('-s [url], --schema [url]', 'Remote JSON Schema URL')
  .example((name) => {
    return `${name} "package.json" -s "https://json.schemastore.org/package"`
  })
  .example((name) => {
    return `${name} "tsconfig.json" "node12.json" "node14.json" -s "https://json.schemastore.org/tsconfig"`
  })
  .example((name) => {
    return `${name} "**/*.json" -s "https://json.schemastore.org/package"`
  })
  .action(async (src, options) => {
    await validate({
      src: src,
      schema: options.schema,
    })
  })

cli.version('0.1.0')
cli.help()

cli.parse()

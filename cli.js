const { version } = require('./package')
const cli = require('cac')()
const validate = require('./validate')

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

cli.version(version)
cli.help()

cli.parse()

const Ajv = require('ajv').default
const consola = require('consola')
const fetch = require('node-fetch')
const fs = require('fs')
const globby = require('globby')
const migrate = require('json-schema-migrate')
const path = require('path')

module.exports = async (args) => {
  try {
    const currentWorkDirectory = process.cwd()

    const srcFileNames = await globby(args.src, {
      gitignore: true,
    })

    const schema = await fetch(args.schema).then((data) => {
      consola.success('Download schema file')

      return data.json()
    })

    migrate.draft7(schema)

    const ajv = new Ajv({
      strict: args.strict,
    })
    const validate = ajv.compile(schema)

    await Promise.all(
      srcFileNames.map(async (srcFileName) => {
        const srcFilePath = path.resolve(currentWorkDirectory, srcFileName)

        const src = await fs.promises.readFile(srcFilePath).then((data) => {
          return JSON.parse(data)
        })

        const valid = validate(src)

        if (valid) {
          consola.success(`${srcFileName} is valid`)
        } else {
          throw new Error(`${srcFileName} is invalid`)
        }
      })
    )
  } catch (error) {
    consola.error(error)

    return process.exit(1)
  }
}

import { draft7 } from 'json-schema-migrate'
import Ajv from 'ajv'
import consola from 'consola'
import fetch from 'node-fetch'
import fs from 'fs'
import globby from 'globby'
import path from 'path'

export type ValidateArgument = {
  // Strict mode
  strict?: boolean
  // Validate JSON path
  src: string | string[]
  // Remove JSON Schema URL
  schema: string
}

export const validate = async ({ strict = true, src, schema }: ValidateArgument) => {
  try {
    const currentWorkDirectory = process.cwd()

    const srcFileNames = await globby(src, {
      gitignore: true,
    })

    const schemaData = await fetch(schema).then((data) => {
      consola.success('Download schema file')

      return data.json()
    })

    draft7(schemaData)

    const ajv = new Ajv({ strict })
    const validate = ajv.compile(schemaData)

    await Promise.all(
      srcFileNames.map(async (srcFileName) => {
        const srcFilePath = path.resolve(currentWorkDirectory, srcFileName)

        const src = await fs.promises.readFile(srcFilePath, 'utf-8').then((data) => {
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

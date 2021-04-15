import { draft7 } from 'json-schema-migrate'
import Ajv from 'ajv'
import consola from 'consola'
import fs from 'fs'
import globby from 'globby'
import path from 'path'

import { getSchemaFromURL } from './utilities'

export default async ({
  srcFilePath,
  schemaFileURL,
  strict = false,
}: {
  srcFilePath: string | string[]
  schemaFileURL: string
  strict?: boolean
}) => {
  try {
    const cwd = process.cwd()

    const srcFilePaths = await globby(srcFilePath, {
      gitignore: true,
    })

    const schema = await getSchemaFromURL(schemaFileURL)

    draft7(schema)

    const validator = new Ajv({ strict, logger: false }).compile(schema)

    const results = await Promise.all(
      srcFilePaths.map(async (srcFilePath) => {
        const srcFileFullPath = path.resolve(cwd, srcFilePath)

        const src = await fs.promises.readFile(srcFileFullPath, 'utf-8').then((data) => {
          return JSON.parse(data) as JSONObject
        })

        return validator(src)
      })
    )

    return results.every((result) => {
      return result == true
    })
  } catch (error) {
    consola.error(error)

    throw new Error(error)
  }
}

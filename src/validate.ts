import consola from 'consola'
import fs from 'fs'
import globby from 'globby'
import path from 'path'

import { createValidator, ValidatorArgument } from './validator'

export type ValidateArgument = {
  // Validate JSON path
  src: string | string[]
} & ValidatorArgument

export const validate = async ({ strict = false, src, schema }: ValidateArgument) => {
  const cwd = process.cwd()

  try {
    const srcPaths = await globby(src, {
      gitignore: true,
    })

    const validator = await createValidator({ strict, schema })

    await Promise.all(
      srcPaths.map(async (srcPath) => {
        const srcFullPath = path.resolve(cwd, srcPath)

        const srcData = await fs.promises.readFile(srcFullPath, 'utf-8').then((data) => {
          return JSON.parse(data) as JSONObject
        })

        const isValid = validator(srcData)

        if (isValid) {
          consola.success(`${srcPath} is valid`)
        } else {
          throw new Error(`${srcPath} is invalid`)
        }
      })
    )
  } catch (error) {
    throw new Error(error)
  }
}

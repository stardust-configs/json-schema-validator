import { draft7 } from 'json-schema-migrate'
import { URL } from 'url'
import Ajv from 'ajv'
import consola from 'consola'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

export type ValidatorArgument = {
  // Strict mode
  strict?: boolean
  // Remove JSON Schema URL
  schema: string
}

const isURL = (url: string) => {
  try {
    const protocol = new URL(url).protocol

    if (protocol === 'http:' || protocol === 'https:') return true

    return false
  } catch {
    return false
  }
}

const readLocalSchema = async (schemaPath: string) => {
  const cwd = process.cwd()

  const schemaFullPath = path.resolve(cwd, schemaPath)

  return await fs.promises
    .readFile(schemaFullPath, {
      encoding: 'utf-8',
    })
    .then((data) => {
      consola.success('Success read schema file')

      return JSON.parse(data) as JSONObject
    })
    .catch(() => {
      throw new Error('Faild read schema file')
    })
}

const fetchRemoteSchema = async (schemaURL: string) => {
  return await fetch(schemaURL)
    .then(async (data) => {
      consola.success('Success download schema file')

      return (await data.json()) as JSONObject
    })
    .catch(() => {
      throw new Error('Faild download schema file')
    })
}

export const createValidator = async ({ strict, schema }: ValidatorArgument) => {
  const schemaData = isURL(schema) ? await fetchRemoteSchema(schema) : await readLocalSchema(schema)

  draft7(schemaData)

  const ajv = new Ajv({ strict, logger: false })

  return ajv.compile(schemaData)
}

import { URL } from 'url'
import consola from 'consola'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

const isRemote = (url: string) => {
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

export const getSchemaFromURL = async (schemaURL: string) => {
  return isRemote(schemaURL) ? await fetchRemoteSchema(schemaURL) : await readLocalSchema(schemaURL)
}

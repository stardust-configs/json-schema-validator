import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'

import jsv from '../src'

const exampleSchemaFileFullPath = path.resolve(process.cwd(), './examples/tsconfig.schema.json')

beforeAll(async () => {
  const schema = await fetch('https://json.schemastore.org/tsconfig').then(async (data) => {
    return await data.json()
  })

  await fs.promises.writeFile(exampleSchemaFileFullPath, JSON.stringify(schema), { encoding: 'utf-8' })

  return
})

afterAll(async () => {
  rimraf(exampleSchemaFileFullPath, () => {})

  return
})

test('valid', async () => {
  const result = await jsv({
    srcFilePath: './examples/.prettierrc.valid.json',
    schemaFileURL: 'https://json.schemastore.org/prettierrc',
  })

  expect(result).toBeTruthy()
})

test('invalid', async () => {
  const result = await jsv({
    srcFilePath: './examples/.prettierrc.invalid.json',
    schemaFileURL: 'https://json.schemastore.org/prettierrc',
  })

  expect(result).toBeFalsy()
})

test('glob', async () => {
  const result = await jsv({
    srcFilePath: './examples/tsconfig.es*.json',
    schemaFileURL: 'https://json.schemastore.org/tsconfig',
  })

  expect(result).toBeTruthy()
})

test('glob multiple src (contain invalid)', async () => {
  const result = await jsv({
    srcFilePath: ['./examples/tsconfig.es*.json', './examples/tsconfig.invalid.json'],
    schemaFileURL: 'https://json.schemastore.org/tsconfig',
  })

  expect(result).toBeFalsy()
})

test('schema does not exist', async () => {
  await expect(
    jsv({
      srcFilePath: ['./examples/tsconfig.es2020.json'],
      schemaFileURL: 'https://json.schemastore.org/typoscriptconfig',
    })
  ).rejects.toThrow()
})

test('local schema file', async () => {
  const result = await jsv({
    srcFilePath: './examples/tsconfig.es2020.json',
    schemaFileURL: './examples/tsconfig.schema.json',
  })

  expect(result).toBeTruthy()
})

test('local schema file does no exist', async () => {
  await expect(
    jsv({
      srcFilePath: './examples/tsconfig.es2020.json',
      schemaFileURL: './examples/typoconfig.schema.json',
    })
  ).rejects.toThrow()
})

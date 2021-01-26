import { validate } from '../src/validate'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

beforeAll(async () => {
  const cwd = process.cwd()

  const schema = await fetch('https://json.schemastore.org/tsconfig').then(async (data) => {
    return await data.json()
  })

  const schemaFullPath = path.resolve(cwd, './examples/tsconfig.schema.json')

  await fs.promises.writeFile(schemaFullPath, JSON.stringify(schema), { encoding: 'utf-8' })

  return
})

test('valid', async () => {
  const result = await validate({
    src: './examples/.prettierrc.valid.json',
    schema: 'https://json.schemastore.org/prettierrc',
  })

  expect(result).toBe(undefined)
})

test('invalid', async () => {
  await expect(
    validate({
      src: './examples/.prettierrc.invalid.json',
      schema: 'https://json.schemastore.org/prettierrc',
    })
  ).rejects.toThrow()
})

test('glob', async () => {
  const result = await validate({
    src: './examples/tsconfig.es*.json',
    schema: 'https://json.schemastore.org/tsconfig',
  })

  await expect(result).toBe(undefined)
})

test('glob multiple src (contain invalid)', async () => {
  await expect(
    validate({
      src: ['./examples/tsconfig.es*.json', './examples/tsconfig.invalid.json'],
      schema: 'https://json.schemastore.org/tsconfig',
    })
  ).rejects.toThrow()
})

test('schema does not exist', async () => {
  await expect(
    validate({
      src: ['./examples/tsconfig.es2020.json'],
      schema: 'https://json.schemastore.org/typoscriptconfig',
    })
  ).rejects.toThrow()
})

test('local schema file', async () => {
  const result = await validate({
    src: './examples/tsconfig.es2020.json',
    schema: './examples/tsconfig.schema.json',
  })

  expect(result).toBe(undefined)
})

test('local schema file does no exist', async () => {
  await expect(
    validate({
      src: './examples/tsconfig.es2020.json',
      schema: './examples/typoconfig.schema.json',
    })
  ).rejects.toThrow()
})

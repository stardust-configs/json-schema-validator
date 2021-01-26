const { validate } = require('../dist/validate')

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

test('src is no exist', async () => {
  await expect(
    validate({
      src: ['./examples/tsconfig.es2077.json'],
      schema: 'https://json.schemastore.org/tsconfig',
    })
  ).rejects.toThrow()
})

test('schema is no exist', async () => {
  await expect(
    validate({
      src: ['./examples/tsconfig.es2020.json'],
      schema: 'https://json.schemastore.org/typoscriptconfig',
    })
  ).rejects.toThrow()
})

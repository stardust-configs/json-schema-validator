# @stardust-configs/json-schema-validator

> JSON Schema validator

## Install

```bash
$ npm install @stardust-configs/json-schema-validator --save-dev
```

## Usage

```ts
import jsonSchemaValidator from '@stardust-configs/json-schema-validator'

jsonSchemaValidator({
  src: 'tsconfig.json',
  schema: 'https://json.schemastore.org/tsconfig',
}).catch((error) => {
  console.error(error)
})
```

In CLI.

```bash
# basic
$ jsv "tsconfig.json" --schema "https://json.schemastore.org/tsconfig"

# glob
$ jsv "tsconfig.*.json" --schema "https://json.schemastore.org/tsconfig"

# multiple
$ jsv "tsconfig.node.json" "tsconfig.jest.json" --schema "https://json.schemastore.org/tsconfig"

# no strict
$ jsv "tsconfig.json" --schema "https://json.schemastore.org/tsconfig" --no-strict
```

## Author

[@p-chan](https://github.com/p-chan)

## License

MIT

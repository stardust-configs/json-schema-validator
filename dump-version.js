const { version } = require('./package')
const fs = require('fs')

fs.writeFileSync('./src/version.ts', `export const version = '${version}'\n`, {
  encoding: 'utf-8',
})

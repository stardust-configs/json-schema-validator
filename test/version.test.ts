const packageJson = require('../package')
import { version } from '../src/version'

test('version', () => {
  expect(version).toEqual(packageJson.version)
})

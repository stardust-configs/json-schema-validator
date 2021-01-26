const packageJson = require('../package')
import { version } from '../dist/version'

test('version', () => {
  expect(version).toEqual(packageJson.version)
})

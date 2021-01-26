const packageJson = require('../package')
const { version } = require('../dist/version')

test('version', () => {
  expect(version).toEqual(packageJson.version)
})

var babel = require('babel-core')
var fs = require('fs')
var path = require('path')
var fixturesDir = path.join(__dirname, 'fixtures')

// var inputFilename = path.join(fixturesDir, "input.js")
// var expected = readFile(path.join(fixturesDir, "expected.js"))

var pluginPath = path.join(__dirname, '../../babel-plugin-add-react-displayname')
var assert = require('assert')
describe('add-react-displayname transform', function () {
  fs.readdirSync(fixturesDir).forEach(function (fixture) {
    var actual = transformFile(path.join(fixturesDir, fixture, 'input.js'))
    var expected = readFile((path.join(fixturesDir, fixture, 'expected.js')))

    it('transforms ' + path.basename(fixture), function () {
      assert.equal(actual, expected)
    })
  })

  it('should work with other plugins', function () {
    var actual = transformFile(path.join(fixturesDir, 'arrowFun', 'input.js'),
      ['transform-react-inline-elements',
        'transform-react-constant-elements',
        'transform-inline-environment-variables'])
    var expected = readFile((path.join(fixturesDir, 'arrowFun', 'expected-inline.js')))

    assert.equal(actual, expected)
  })
})

function readFile (filename) {
  var file = fs.readFileSync(filename, 'utf8').trim()
  file = file.replace(/\r\n/g, '\n')
  return file
}

function transformFile (filename, testPlugins) {
  var plugins = [
    [pluginPath, {'knownComponents': ['Component5a', 'Component5b', 'Component5c']}],
    'transform-decorators-legacy'
  ]
  if (testPlugins) {
    plugins = plugins.concat(testPlugins)
  }
  return babel.transformFileSync(filename, {
    presets: ['react', 'stage-1'],
    plugins: plugins
  }).code
}

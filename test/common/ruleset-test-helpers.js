const assert = require('assert')

const SEVERITY = {
  off: -1,
  error: 0,
  warn: 1,
  info: 2,
  hint: 3
}

function checkError (error, code, path, severity) {
  assert.strictEqual(error.code, code, 'invalid error code')
  assert.deepStrictEqual(error.path, path, 'invalid path')
  assert.strictEqual(error.severity, severity, 'invalid severity')
}

function checkExpectedError (errors, code, path, severity) {
  assert.notDeepStrictEqual(errors, [], 'no error returned')
  assert.strictEqual(errors.length, 1, 'more errors than expected')
  for (let i = 0; i < errors.length; i++) {
    checkError(errors[i], code, path, severity)
  }
}

function checkNoError (errors) {
  assert.deepStrictEqual(errors, [], 'unexpected error')
}

function checkAllRulesHaveBeenTest (spectralTestWrapper) {
  assert.deepStrictEqual(spectralTestWrapper.listUntestedRules(), [], 'untested rules')
}

module.exports.SEVERITY = SEVERITY
module.exports.checkError = checkError
module.exports.checkExpectedError = checkExpectedError
module.exports.checkNoError = checkNoError
module.exports.checkAllRulesHaveBeenTest = checkAllRulesHaveBeenTest

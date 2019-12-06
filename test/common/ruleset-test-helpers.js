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

function checkSameTypeErrors (errors, code, paths, severity) {
  assert.notDeepStrictEqual(errors, [], 'no error returned')
  assert.strictEqual(errors.length, paths.length, 'more errors than expected')
  for (let i = 0; i < paths.length; i++) {
    checkError(errors[i], code, paths[i], severity)
  }
}

function checkNoErrors (errors) {
  assert.deepStrictEqual(errors, [], 'unexpected error')
}

module.exports.SEVERITY = SEVERITY
module.exports.checkSameTypeErrors = checkSameTypeErrors
module.exports.checkNoErrors = checkNoErrors

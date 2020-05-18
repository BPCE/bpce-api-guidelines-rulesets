const assert = require('assert')
const { JSONPath } = require('jsonpath-plus')
const { Spectral, isOpenApiv2, isOpenApiv3 } = require('@stoplight/spectral')

const SEVERITY = {
  off: -1,
  error: 0,
  warn: 1,
  info: 2,
  hint: 3
}

const FORMATS = {
  oas2: 'oas2',
  oas3: 'oas3'
}

function jsonPointerToArray (pointer) {
  const split = pointer.split('/')
  const result = []
  for (const i in split) {
    if (split[i].length > 0) {
      result.push(split[i].replace(/~1/g, '/'))
    }
  }
  return result
}

// oasFormat: null, auto, forceOas2, forceOas3
function SpectralTestWrapper (oasFormat) {
  this.spectral = new Spectral()
  // TODO Check when testing main if this is style necessary
  switch (oasFormat) {
    case 'auto':
      this.spectral.registerFormat('oas2', isOpenApiv2)
      this.spectral.registerFormat('oas3', isOpenApiv3)
      break
    case 'forceOas2':
      this.spectral.registerFormat('oas2', function (document) { return true })
      this.spectral.registerFormat('oas3', function (document) { return false })
      break
    case 'forceOas3':
      this.spectral.registerFormat('oas2', function (document) { return false })
      this.spectral.registerFormat('oas3', function (document) { return true })
      break
    default:
      // no format registered
  }

  this.originalRuleset = this.spectral.rules
  this.testedRules = []
  this.currentRuleName = undefined
}

SpectralTestWrapper.prototype.loadRuleset = async function (path) {
  await this.spectral.loadRuleset(path)
}

SpectralTestWrapper.prototype.run = function (document) {
  return this.spectral.run(document)
}

// For isolation testing. The rule is added to the tested rules
SpectralTestWrapper.prototype.disableAllRulesExcept = function (name) {
  if (this.testedRules.indexOf(name) === -1) {
    this.testedRules.push(name)
  }
  const subRuleset = {}
  if (this.originalRuleset[name] === undefined) {
    throw new Error('Unknown rule ' + name)
  }

  subRuleset[name] = this.originalRuleset[name]
  this.spectral.rules = subRuleset
  this.currentRuleName = name

  // TODO fix that to check rule actual format instead of name
  // Reseting registered formats and registering oas2 or oas3 format if rule name ends by it
  this.spectral.formats = {}
  if (/oas2$/.test(name)) {
    this.spectral.registerFormat('oas2', function (document) { return true })
    this.spectral.registerFormat('oas3', function (document) { return false })
  } else if (/oas3$/.test(name)) {
    this.spectral.registerFormat('oas2', function (document) { return false })
    this.spectral.registerFormat('oas3', function (document) { return true })
  }
}

SpectralTestWrapper.prototype.resetToOriginalRuleSet = function () {
  this.spectral.rules = this.originalRuleset
  this.currentRuleName = undefined
}

SpectralTestWrapper.prototype.getCurrentRule = function () {
  return this.spectral.rules[this.currentRuleName]
}

// Rules are added to tested rule when using disableAllRulesExcept
SpectralTestWrapper.prototype.listUntestedRules = function () {
  const untestedRules = []
  for (const ruleName in this.originalRuleset) {
    // disabled rules have -1 severity
    if (this.originalRuleset[ruleName].severity >= 0 && !this.testedRules.includes(ruleName)) {
      untestedRules.push(ruleName)
    }
  }
  return untestedRules
}

SpectralTestWrapper.prototype.listRuleNames = function () {
  const names = []
  for (const ruleName in this.originalRuleset) {
    // disabled rules have -1 severity
    if (this.originalRuleset[ruleName].severity >= 0) {
      names.push(ruleName)
    }
  }
  return names
}

SpectralTestWrapper.prototype.checkSeverity = function (actual, expected) {
  // Spectral returns numerical severity while text is used in ruleset file
  // not easy to read when there's an error, so transforming back to text
  let actualText
  let expectedText
  for (const key in SEVERITY) {
    if (SEVERITY[key] === actual) {
      actualText = key
    }
    if (SEVERITY[key] === expected) {
      expectedText = key
    }
  }
  assert.strictEqual(actualText, expectedText, 'invalid severity')
}

SpectralTestWrapper.prototype.checkError = function (actual, expected) {
  assert.strictEqual(actual.code, expected.code, 'invalid error code')
  assert.deepStrictEqual(actual.path, expected.path, 'invalid path')
  this.checkSeverity(actual.severity, expected.severity)
  // Not checking Spectral message or other value
}

SpectralTestWrapper.prototype.checkRunOnlyOn = function (expectedFormat) {
  const rule = this.getCurrentRule()
  assert.deepStrictEqual(rule.formats, [expectedFormat], 'Unexpected rule formats, it should be [' + expectedFormat + ']')
  assert.strictEqual(this.currentRuleName.endsWith(expectedFormat), true, 'Rule name must end with -' + expectedFormat)
}

SpectralTestWrapper.prototype.checkAlwaysRun = function () {
  const rule = this.getCurrentRule()
  assert.deepStrictEqual(rule.formats, undefined, 'Rule formats must be empty if rule runs on all formats')
  assert.strictEqual(this.currentRuleName.endsWith(FORMATS.oas2), false, 'Rule name must not end with -' + FORMATS.oas2)
  assert.strictEqual(this.currentRuleName.endsWith(FORMATS.oas3), false, 'Rule name must not end with -' + FORMATS.oas3)
}

SpectralTestWrapper.prototype.checkAllRulesHaveBeenTest = function () {
  assert.deepStrictEqual(this.listUntestedRules(), [], 'untested rules')
}

SpectralTestWrapper.prototype.checkExpectedError = function (errors, codeOrCodes, pathOrPaths, severityOrSeverities) {
  assert.notDeepStrictEqual(errors, [], 'no error returned')
  if (errors.length > 0) {
    // Building array of expected errors {code, path, severity}
    let expectedErrorCount
    if (Array.isArray(codeOrCodes[0])) {
      expectedErrorCount = codeOrCodes.length
    } else if (Array.isArray(pathOrPaths[0])) {
      expectedErrorCount = pathOrPaths.length
    } else {
      expectedErrorCount = 1
    }

    const expectedErrors = []
    for (let i = 0; i < expectedErrorCount; i++) {
      let code, path, severity

      if (Array.isArray(codeOrCodes[0])) {
        code = codeOrCodes[i]
      } else {
        code = codeOrCodes
      }

      if (Array.isArray(pathOrPaths[0])) {
        path = pathOrPaths[i]
      } else {
        path = pathOrPaths
      }

      if (Array.isArray(severityOrSeverities[0])) {
        severity = severityOrSeverities[i]
      } else {
        severity = severityOrSeverities
      }

      expectedErrors.push({ code: code, path: path, severity: severity })
    }

    // Building actual errors list (Spectral errors limited to code, path and severity) to have correct output when more or less errors
    const actualErrors = []
    for (let i = 0; i < errors.length; i++) {
      actualErrors.push({ code: errors[i].code, path: errors[i].path, severity: errors[i].severity })
    }

    if (errors.length > expectedErrors.length) {
      assert.fail(actualErrors, expectedErrors, 'more errors than expected')
    } else if (errors.length < expectedErrors.length) {
      assert.fail(actualErrors, expectedErrors, 'less errors than expected')
    } else {
      for (let i = 0; i < expectedErrors.length; i++) {
        this.checkError(errors[i], expectedErrors[i])
      }
    }
  }
}

SpectralTestWrapper.prototype.checkNoError = function (errors) {
  assert.deepStrictEqual(errors, [], 'unexpected error')
}

// To use in test suites

SpectralTestWrapper.prototype.checkGivenFound = function (document, pathOrPaths, givenIndex) {
  const rule = this.getCurrentRule()
  let jsonPath
  if (Array.isArray(rule.given)) {
    jsonPath = rule.given[givenIndex]
  } else {
    jsonPath = rule.given
  }

  let expectedPaths
  if (Array.isArray(pathOrPaths[0])) {
    expectedPaths = pathOrPaths
  } else {
    expectedPaths = [pathOrPaths]
  }

  const foundPointers = JSONPath({ resultType: 'pointer', path: jsonPath, json: document })
  const foundPaths = []
  for (const i in foundPointers) {
    foundPaths.push(jsonPointerToArray(foundPointers[i]))
  }

  assert.deepStrictEqual(foundPaths, expectedPaths, 'Found paths for given ' + jsonPath + ' differ from expected')
}

// Checks that no path matching rule given[givenIndex] or all given if givenIndex is not provided is found is document
SpectralTestWrapper.prototype.checkGivenNotFound = function (document, givenIndex) {
  const rule = this.getCurrentRule()
  let jsonPath
  if (Array.isArray(rule.given)) {
    if (givenIndex !== undefined) {
      jsonPath = rule.given[givenIndex]
    } else {
      throw new Error('Rule has multiple given, a givenIndex must be provided')
    }
  } else {
    jsonPath = rule.given
  }

  const expectedPaths = []
  const foundPaths = []

  const foundPointers = JSONPath({ resultType: 'pointer', path: jsonPath, json: document })
  for (const i in foundPointers) {
    foundPaths.push(jsonPointerToArray(foundPointers[i]))
  }

  assert.deepStrictEqual(foundPaths, expectedPaths, 'Rule\'s given json path ' + jsonPath + ' returned unexpected paths')
}

SpectralTestWrapper.prototype.runAndCheckNoError = async function (document) {
  const results = await this.run(document)
  this.checkNoError(results)
}

SpectralTestWrapper.prototype.runAndCheckExpectedError = async function (document, pathOrPaths, severityOrSeverities, codeOrCodes) {
  const results = await this.run(document)
  let localCodeOrCodes
  if (codeOrCodes === undefined) {
    localCodeOrCodes = this.currentRuleName
  } else {
    localCodeOrCodes = codeOrCodes
  }
  this.checkExpectedError(results, localCodeOrCodes, pathOrPaths, severityOrSeverities)
}

module.exports.SEVERITY = SEVERITY
module.exports.FORMATS = FORMATS
module.exports.SpectralTestWrapper = SpectralTestWrapper

/*
 * Copyright 2019-2022 Groupe BPCE
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

const assert = require('assert')
const { JSONPath } = require('jsonpath-plus')
const { Spectral } = require('@stoplight/spectral-core')

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

  // Reseting registered formats and registering oas2 or oas3 format
  // Allows to use not valid and incomplete documents
  this.spectral.formats = {}
  if (this.originalRuleset[name].formats !== undefined) {
    if (this.originalRuleset[name].formats.includes('oas2')) {
      this.spectral.registerFormat('oas2', function (document) { return true })
      this.spectral.registerFormat('oas3', function (document) { return false })
    } else if (this.originalRuleset[name].formats.includes('oas3')) {
      this.spectral.registerFormat('oas2', function (document) { return false })
      this.spectral.registerFormat('oas3', function (document) { return true })
    }
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
    // avoid list run disabled
    if (!this.originalRuleset[ruleName].enabled) { continue }
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
    // avoid list run disabled
    if (!this.originalRuleset[ruleName].enabled) { continue }
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

SpectralTestWrapper.prototype.checkRunOnlyOn = function (expectedFormat, disableNameCheck) {
  const rule = this.getCurrentRule()
  assert.deepStrictEqual(rule.formats, [expectedFormat], 'Unexpected rule formats, it should be [' + expectedFormat + ']')
  // For Spectral standard rules which not use same naming patterns
  if (!disableNameCheck) {
    assert.strictEqual(this.currentRuleName.endsWith(expectedFormat), true, 'Rule name must end with -' + expectedFormat)
  }
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

SpectralTestWrapper.prototype.runAndCheckExpectedError = async function (document, pathOrPaths, severityOrSeverities, codeOrCodes, debugResults) {
  const results = await this.run(document)
  let localCodeOrCodes
  if (codeOrCodes === undefined) {
    localCodeOrCodes = this.currentRuleName
  } else {
    localCodeOrCodes = codeOrCodes
  }
  if (debugResults) {
    console.log(results)
  }
  this.checkExpectedError(results, localCodeOrCodes, pathOrPaths, severityOrSeverities)
}

module.exports.SEVERITY = SEVERITY
module.exports.FORMATS = FORMATS
module.exports.SpectralTestWrapper = SpectralTestWrapper

const assert = require('assert')
const path = require('@stoplight/path')
const { Spectral, isOpenApiv2, isOpenApiv3 } = require('@stoplight/spectral')

const SEVERITY = {
  off: -1,
  error: 0,
  warn: 1,
  info: 2,
  hint: 3
}

// Rulesets file paths are expected to be GIT_REPO/rulesets/{name}-ruleset.yaml
async function loadRuleset (name, oasFormat) {
  const spectral = new SpectralTestWrapper(oasFormat)
  await spectral.loadRuleset(path.join(__dirname, '../../rulesets/' + name + '-ruleset.yaml'))
  return spectral
}

function ruleset (test, level) {
  let rulesetName
  if (test.tests !== undefined) {
    // inner describe level
    rulesetName = test.title
  } else {
    if (test.currentTest === undefined) {
      if (test.test.parent.suites.length > 0) {
        // before level
        rulesetName = test.test.parent.title
      } else {
        // it level
        rulesetName = test.test.parent.parent.title
      }
    } else {
      // inner describe or beforeEach
      rulesetName = test.currentTest.parent.parent.title
    }
  }
  return rulesetName
}

function rule (test) {
  let rule
  if (test.currentTest === undefined) {
    rule = test.test.parent.title
  } else {
    rule = test.currentTest.parent.title
  }
  return rule
}

function isNotRulesetFullyTestedTestSuite (test) {
  return rule(test).localeCompare(rulesetFullyTestedSuiteName(test))
}

function rulesetFullyTestedSuiteName (test) {
  return ruleset(test, 'rulesetFullyTestedSuiteName') + ' ruleset fully tested'
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

  // Reseting registered formats and registering oas2 or oas3 format if rule name ends by it
  this.spectral.formats = {}
  if (/oas(2|3)$/.test(name)) {
    this.spectral.registerFormat('oas2', isOpenApiv2)
    this.spectral.registerFormat('oas3', isOpenApiv3)
  }

  subRuleset[name] = this.originalRuleset[name]
  this.spectral.rules = subRuleset
}

SpectralTestWrapper.prototype.resetToOriginalRuleSet = function () {
  this.spectral.rules = this.originalRuleset
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

SpectralTestWrapper.prototype.runAndCheckNoError = async function (document) {
  const results = await this.run(document)
  this.checkNoError(results)
}

SpectralTestWrapper.prototype.runAndCheckExpectedError = async function (document, codeOrCodes, pathOrPaths, severityOrSeverities) {
  const results = await this.run(document)
  this.checkExpectedError(results, codeOrCodes, pathOrPaths, severityOrSeverities)
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

SpectralTestWrapper.prototype.checkAllRulesHaveBeenTest = function () {
  assert.deepStrictEqual(this.listUntestedRules(), [], 'untested rules')
}

module.exports.loadRuleset = loadRuleset
module.exports.ruleset = ruleset
module.exports.rule = rule
module.exports.isNotRulesetFullyTestedTestSuite = isNotRulesetFullyTestedTestSuite
module.exports.rulesetFullyTestedSuiteName = rulesetFullyTestedSuiteName
module.exports.SEVERITY = SEVERITY

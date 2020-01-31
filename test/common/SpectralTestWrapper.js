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
async function loadRuleset (name) {
  const spectral = new SpectralTestWrapper()
  await spectral.loadRuleset(path.join(__dirname, '../../rulesets/' + name + '-ruleset.yaml'))
  return spectral
}

function currentRule (currentTest) {
  return currentTest.test.parent.title
}

function SpectralTestWrapper (path) {
  this.path = path
  this.spectral = new Spectral()
  // this.spectral.registerFormat('oas2', isOpenApiv2)
  // this.spectral.registerFormat('oas3', isOpenApiv3)
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

SpectralTestWrapper.prototype.checkError = function (error, code, path, severity) {
  assert.strictEqual(error.code, code, 'invalid error code')
  assert.deepStrictEqual(error.path, path, 'invalid path')
  assert.strictEqual(error.severity, severity, 'invalid severity')
}

SpectralTestWrapper.prototype.checkExpectedError = function (errors, codeOrCodes, pathOrPaths, severityOrSeverities) {
  assert.notDeepStrictEqual(errors, [], 'no error returned')
  assert.strictEqual(errors.length, 1, 'more errors than expected')
  for (let i = 0; i < errors.length; i++) {
    let code, path, severity

    if (codeOrCodes[0] === 'array') {
      code = codeOrCodes[i]
    } else {
      code = codeOrCodes
    }

    if (pathOrPaths[0] === 'array') {
      path = pathOrPaths[i]
    } else {
      path = pathOrPaths
    }

    if (severityOrSeverities[0] === 'array') {
      severity = severityOrSeverities[i]
    } else {
      severity = severityOrSeverities
    }

    this.checkError(errors[i], code, path, severity)
  }
}

SpectralTestWrapper.prototype.checkNoError = function (errors) {
  assert.deepStrictEqual(errors, [], 'unexpected error')
}

SpectralTestWrapper.prototype.checkAllRulesHaveBeenTest = function (spectralTestWrapper) {
  assert.deepStrictEqual(spectralTestWrapper.listUntestedRules(), [], 'untested rules')
}

module.exports.loadRuleset = loadRuleset
module.exports.SEVERITY = SEVERITY
module.exports.currentRule = currentRule

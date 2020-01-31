const path = require('@stoplight/path')
const { Spectral, isOpenApiv2, isOpenApiv3 } = require('@stoplight/spectral')

async function loadRuleset (name) {
  const spectral = new SpectralTestWrapper()
  await spectral.loadRuleset(path.join(__dirname, '../../rulesets/' + name + '-ruleset.yaml'))
  return spectral
}

function SpectralTestWrapper (path) {
  this.path = path
  this.spectral = new Spectral()
  this.spectral.registerFormat('oas2', isOpenApiv2)
  this.spectral.registerFormat('oas3', isOpenApiv3)
  this.originalRuleset = this.spectral.rules
  this.testedRuleset = []
}

SpectralTestWrapper.prototype.loadRuleset = async function (path) {
  await this.spectral.loadRuleset(path)
}

SpectralTestWrapper.prototype.run = function (document) {
  return this.spectral.run(document)
}

// Isolation testing, the rule is added to the tested rules
SpectralTestWrapper.prototype.initRuleTest = function (name) {
  this.reset()
  this.testedRuleset.push(name)
  const subRuleset = {}
  if (this.originalRuleset[name] === undefined) {
    throw new Error('Unknow rule ' + name)
  }
  subRuleset[name] = this.originalRuleset[name]
  this.spectral.rules = subRuleset
}

SpectralTestWrapper.prototype.reset = function () {
  this.spectral.rules = this.originalRuleset
}

SpectralTestWrapper.prototype.listUntestedRules = function () {
  const untestedRules = []
  for (const ruleName in this.originalRuleset) {
    // disabled rules have -1 severity
    if (this.originalRuleset[ruleName].severity >= 0 && !this.testedRuleset.includes(ruleName)) {
      untestedRules.push(ruleName)
    }
  }
  return untestedRules
}

module.exports.SpectralTestWrapper = SpectralTestWrapper
module.exports.loadRuleset = loadRuleset

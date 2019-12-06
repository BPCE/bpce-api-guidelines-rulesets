const { Spectral, isOpenApiv2, isOpenApiv3 } = require('@stoplight/spectral')

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

SpectralTestWrapper.prototype.initRuleTest = function (name) {
  this.testedRuleset.push(name)
  const subRuleset = {}
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

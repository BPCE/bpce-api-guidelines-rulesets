const { loadRuleset } = require('./common/SpectralTestWrapper.js')
const testHelpers = require('./common/ruleset-test-helpers')

describe('basepath', function () {
  let spectral

  before(async function () {
    spectral = await loadRuleset(this.test.parent.title)
  })

  beforeEach(function () {
    spectral.initRuleTest(this.currentTest.parent.title)
  })

  after(function () {
    describe('all ' + this.test.parent.title + ' rules tested', function () {
      it('all rules should have been tested', function () {
        testHelpers.checkAllRulesHaveBeenTest(spectral)
      })
    })
  })

  describe('basepath-defined', function () {
    it('should not return an error if basepath is defined', async function () {
      const document = {
        basePath: '/someBasePath'
      }
      const results = await spectral.run(document)
      testHelpers.checkNoError(results)
    })

    it('should return an error if basepath is not defined', async function () {
      const document = {}
      const results = await spectral.run(document)
      testHelpers.checkExpectedError(results, 'basepath-defined', [], testHelpers.SEVERITY.error)
    })
  })

  describe('basepath-valid-structure', function () {
    it('should not return an error if basepath has a valid structure', async function () {
      const document = {
        basePath: '/someName/v2'
      }
      const results = await spectral.run(document)
      testHelpers.checkNoError(results)
    })

    it('should return an error if basepath nas not a valid structure', async function () {
      const document = {
        basePath: '/someBasePath'
      }
      const results = await spectral.run(document)
      testHelpers.checkExpectedError(results, 'basepath-valid-structure', ['basePath'], testHelpers.SEVERITY.error)
    })
  })
})

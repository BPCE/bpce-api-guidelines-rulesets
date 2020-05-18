// TODO check that each include actually exists
// TODO check that all files in rulesets are included
// TODO check that at least one rule of each rule set works or only oas check?

const assert = require('assert')
const path = require('@stoplight/path')
const { Spectral, isOpenApiv2, isOpenApiv3 } = require('@stoplight/spectral')

const ruleset = 'main'
let spectral

async function checkInclude (spectral, ruleCode, document) {
  const results = await spectral.run(document)
  assert.notDeepStrictEqual(results, [], 'no error returned')
  assert.strictEqual(results.length, 1, 'more than one error returned')
  assert.strictEqual(
    results[0].code,
    ruleCode,
    'unexpected error code'
  )
}

before(async function () {
  spectral = new Spectral()
  spectral.registerFormat('oas2', isOpenApiv2)
  spectral.registerFormat('oas3', isOpenApiv3)
  await spectral.loadRuleset(
    path.join(__dirname, '../rulesets/' + ruleset + '-ruleset.yaml')
  )
})

describe(ruleset, function () {
  describe('includes', function () {
    it('should include oas ruleset', async function () {
      // missing path
      const document = {
        swagger: '2.0',
        info: {
          title: 'name',
          description: 'what the API does',
          version: '1.0'
        }
      }
      await checkInclude(spectral, 'oas2-schema', document)
    })

    it('should include info ruleset', async function () {
      // invalid API name
      const document = {
        swagger: '2.0',
        info: {
          title: 'API name',
          description: 'what the API does',
          version: '1.0'
        },
        paths: {}
      }
      await checkInclude(spectral, 'api-name-does-not-contain-api', document)
    })
  })
})

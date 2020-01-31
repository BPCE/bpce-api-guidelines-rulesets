const assert = require('assert')
const path = require('@stoplight/path')
const { Spectral } = require('@stoplight/spectral')

const ruleset = 'info'
let spectral

before(async function () {
  spectral = new Spectral()
  await spectral.loadRuleset(
    path.join(__dirname, '../rulesets/' + ruleset + '-ruleset.yaml')
  )
})

describe(ruleset, function () {
  describe('api-name-provided', function () {
    it('should return an error if info.title is not provided', async function () {
      const document = {
        info: {
          description: 'what the API does',
          version: '1.0'
        }
      }
      const results = await spectral.run(document)
      assert.notDeepStrictEqual(results, [], 'no error returned')
      assert.strictEqual(results.length, 1, 'more than one error returned')
      assert.strictEqual(
        results[0].code,
        'api-name-provided',
        'unexpected error code'
      )
      assert.deepStrictEqual(results[0].path, ['info'], 'unexpected path')
    })

    it('should not return an error if info.title is provided', async function () {
      const document = {
        info: {
          title: 'name',
          description: 'what the API does',
          version: '1.0'
        }
      }
      const results = await spectral.run(document)
      assert.deepStrictEqual(results, [], 'unexpected error(s) returned')
    })
  })

  describe('api-name-does-not-contain-api', function () {
    it('should return an error if info.title contains the word api', async function () {
      const apiNames = [
        'apiName',
        'Some API name',
        'AnotherApiName',
        'Yet another api name'
      ]

      for (const i in apiNames) {
        const document = {
          info: {
            title: apiNames[i],
            description: 'what the API does',
            version: '1.0'
          }
        }
        const results = await spectral.run(document)
        assert.notDeepStrictEqual(results, [], 'result is empty for ' + apiNames[i])
        assert.strictEqual(results.length, 1, 'more than one error for' + apiNames[i])
        assert.strictEqual(
          results[0].code,
          'api-name-does-not-contain-api',
          'unexpected error code for ' + apiNames[i]
        )
        assert.deepStrictEqual(results[0].path, ['info', 'title'], 'unexpected path')
      }
    })
  })

  describe('api-description-provided', function () {
    it('should return an error if info.description is no provided', async function () {
      const document = {
        info: {
          title: 'name',
          version: '1.0'
        }
      }
      const results = await spectral.run(document)
      assert.notDeepStrictEqual(results, [], 'result is empty')
      assert.strictEqual(results.length, 1, 'more than one error')
      assert.strictEqual(
        results[0].code,
        'api-description-provided',
        'unexpected error code'
      )
      assert.deepStrictEqual(results[0].path, ['info'], 'unexpected path')
    })

    it('should not return an error if info.description is provided', async function () {
      const document = {
        info: {
          title: 'name',
          description: 'what the API does',
          version: '1.0'
        }
      }
      const results = await spectral.run(document)
      assert.deepStrictEqual(results, [], 'unexpected error(s) returned')
    })
  })
})

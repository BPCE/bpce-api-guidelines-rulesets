const assert = require('assert')
const path = require('@stoplight/path')
const { Spectral, isOpenApiv2, isOpenApiv3 } = require('@stoplight/spectral')

let spectral

before(async function () {
  spectral = new Spectral()
  spectral.registerFormat('oas2', isOpenApiv2)
  spectral.registerFormat('oas3', isOpenApiv3)
  await spectral.loadRuleset(
    path.join(__dirname, '../rulesets/oas-ruleset.yaml')
  )
})

describe('oas', function () {
  describe('oas2-schema', function () {
    it('should return an error if Swagger 2.0 file is invalid', async function () {
      // missing path
      const document = {
        swagger: '2.0',
        info: {
          title: 'apiName',
          description: 'what the API does',
          version: '1.0'
        }
      }
      const results = await spectral.run(document)
      assert.notDeepStrictEqual(results, [], 'no error returned')
      assert.strictEqual(results.length, 1, 'more than one error returned')
      assert.strictEqual(
        results[0].code,
        'oas2-schema',
        'unexpected error code'
      )
    })

    it('should not return an error if Swagger 2.0 file is valid', async function () {
      const document = {
        swagger: '2.0',
        info: {
          title: 'apiName',
          description: 'what the API does',
          version: '1.0'
        },
        paths: {}
      }
      const results = await spectral.run(document)
      assert.deepStrictEqual(results, [], 'unexpected error(s) returned')
    })
  })

  describe('oas3-schema', function () {
    it('should return an error if OpenAPI 3 file is invalid', async function () {
      // missing path
      const document = {
        openapi: '3.0.1',
        info: {
          title: 'apiName',
          description: 'what the API does',
          version: '1.0'
        }
      }
      const results = await spectral.run(document)
      assert.notDeepStrictEqual(results, [], 'no error returned')
      assert.strictEqual(results.length, 1, 'more than one error returned')
      assert.strictEqual(
        results[0].code,
        'oas3-schema',
        'unexpected error code'
      )
    })

    it('should not return an error if OpenAPI 3 file is valid', async function () {
      const document = {
        openapi: '3.0.1',
        info: {
          title: 'apiName',
          description: 'what the API does',
          version: '1.0'
        },
        paths: {}
      }
      const results = await spectral.run(document)
      assert.deepStrictEqual(results, [], 'unexpected error(s) returned')
    })
  })
})

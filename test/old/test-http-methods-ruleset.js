const assert = require('assert')
const path = require('@stoplight/path')
const { Spectral } = require('@stoplight/spectral')

let spectral

before(async function () {
  spectral = new Spectral()
  await spectral.loadRuleset(path.join(__dirname, '../rulesets/http-methods-ruleset.yaml'))
})

describe('http-methods', function () {
  describe('allowed-http-method', function () {
    it('should not return an error if http method is allowed', async function () {
      const document = {
        paths: {
          '/resources': {
            get: {},
            post: {},
            put: {},
            patch: {},
            delete: {}
          }
        }
      }
      const results = await spectral.run(document)
      assert.deepStrictEqual(results, [], 'unexpected error(s) returned')
    })

    it('should not return an error if parameters property is present in path', async function () {
      const document = {
        paths: {
          '/resources': {
            get: {},
            post: {},
            put: {},
            patch: {},
            delete: {},
            parameters: []
          }
        }
      }
      const results = await spectral.run(document)
      assert.deepStrictEqual(results, [], 'unexpected error(s) returned')
    })

    it('should not return an error if x- property is present in path', async function () {
      const document = {
        paths: {
          '/resources': {
            get: {},
            post: {},
            put: {},
            patch: {},
            delete: {},
            'x-something': {}
          }
        }
      }
      const results = await spectral.run(document)
      assert.deepStrictEqual(results, [], 'unexpected error(s) returned')
    })

    it('should return an error if http method is not allowed', async function () {
      const document = {
        paths: {
          '/resources': {
            get: {},
            post: {},
            put: {},
            patch: {},
            delete: {},
            options: {},
            head: {}
          },
          '/other-resources': {
            pst: {}
          }
        }
      }
      const results = await spectral.run(document)
      assert.notDeepStrictEqual(results, [], 'no error returned')
      assert.strictEqual(results.length, 3, 'more than 3 errors returned')
      assert.strictEqual(results[0].code, 'allowed-http-method', 'unexpected error code')
      assert.deepStrictEqual(results[0].path, ['paths', '/resources', 'options'], 'unexpected path')
      assert.strictEqual(results[1].code, 'allowed-http-method', 'unexpected error code')
      assert.deepStrictEqual(results[1].path, ['paths', '/resources', 'head'], 'unexpected path')
      assert.strictEqual(results[2].code, 'allowed-http-method', 'unexpected error code')
      assert.deepStrictEqual(results[2].path, ['paths', '/other-resources', 'pst'], 'unexpected path')
    })
  })
})

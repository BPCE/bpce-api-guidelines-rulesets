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

const linterTestSuite = require('./common/linter-test-suite.js')

describe('http-method', function () {
  linterTestSuite.initialize()

  describe('http-method-allowed', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if get, post, patch, put or delete is used', async function () {
      const document = {
        paths: {
          '/some/path': {
            get: {},
            post: {}
          },
          '/another/path': {
            patch: {},
            put: {},
            delete: {}
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if there are path level parameters', async function () {
      const document = {
        paths: {
          '/some/path': {
            parameters: [],
            get: {},
            post: {}
          },
          '/another/path': {
            patch: {},
            put: {},
            delete: {}
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if there is an x-tension', async function () {
      const document = {
        paths: {
          '/some/path': {
            'x-tension': 'dummy value',
            get: {},
            post: {}
          },
          '/another/path': {
            patch: {},
            put: {},
            delete: {}
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if unauthorized HTTP method is used', async function () {
      const document = {
        paths: {
          '/some/path': {
            get: {},
            post: {},
            unauthorized: {}
          },
          '/another/path': {
            patch: {},
            put: {},
            delete: {},
            options: {}
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'unauthorized'],
        ['paths', '/another/path', 'options']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('http-method-post-only-on-search', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if path does not end with /search and does not use post', async function () {
      const document = {
        paths: {
          '/some/path': {
            get: {}
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if path ends with /search and uses only post', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {}
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if path ends with /search, uses only post and has path level paramaters', async function () {
      const document = {
        paths: {
          '/some/path': {
            paramaters: [],
            post: {}
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if path ends with /search, uses only post and has path x-tension', async function () {
      const document = {
        paths: {
          '/some/path': {
            'x-tension': {},
            post: {}
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if path ends with /search and uses post and other http method', async function () {
      const document = {
        paths: {
          '/some/path/search': {
            get: {},
            post: {},
            patch: {}
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path/search', 'get'],
        ['paths', '/some/path/search', 'patch']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if path ends with /search and uses http method other than post', async function () {
      const document = {
        paths: {
          '/some/path/search': {
            get: {},
            patch: {}
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path/search', 'get'],
        ['paths', '/some/path/search', 'patch']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('http-method-no-post-on-unit-resource', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should ignore collections', async function () {
      const document = {
        paths: {
          '/resources': {
            post: {}
          },
          '/resources/{id}/resources': {
            post: {}
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should ignore post /search', async function () {
      const document = {
        paths: {
          '/resources/search': {
            post: {}
          },
          '/resources/{id}/resources/search': {
            post: {}
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if post is not used on unitary resource', async function () {
      const pathObject = {
        parameters: [],
        'x-tension': 'dummy value',
        get: {},
        put: {},
        patch: {},
        delete: {}
      }
      const document = {
        paths: {
          '/name/v1/resources/{id}': pathObject,
          '/v1/resources/{id}': pathObject,
          '/resources/{id}': pathObject,
          '/resources/{id}/resources/me': pathObject
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if post is used on unitary resource', async function () {
      const pathObject = {
        parameters: [],
        'x-tension': 'dummy value',
        post: {},
        get: {},
        put: {},
        patch: {},
        delete: {}
      }
      const document = {
        paths: {
          '/name/v1/resources/{id}': pathObject,
          '/v1/resources/{id}': pathObject,
          '/resources/{id}': pathObject,
          '/resources/{id}/resources/me': pathObject
        }
      }
      const errorPaths = [
        ['paths', '/name/v1/resources/{id}', 'post'],
        ['paths', '/v1/resources/{id}', 'post'],
        ['paths', '/resources/{id}', 'post'],
        ['paths', '/resources/{id}/resources/me', 'post']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  linterTestSuite.finalize()
})

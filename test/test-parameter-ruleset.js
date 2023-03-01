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

describe('parameter', function () {
  linterTestSuite.initialize()

  describe('parameter-query-forbidden-on-post-put-patch-delete', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should ignore path level parameters, x-tensions and get parameters', function () {
      const operation = {
        parameters: [
          { }
        ]
      }
      const document = {
        paths: {
          somepath: {
            parameters: operation,
            get: operation,
            'x-tension': operation
          }
        }
      }
      const givenIndex = 0
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should check post, put, patch and delete parameters', function () {
      const operation = {
        parameters: [
          { }
        ]
      }
      const document = {
        paths: {
          somepath: {
            post: operation,
            put: operation,
            patch: operation,
            delete: operation
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'post', 'parameters', '0'],
        ['paths', 'somepath', 'put', 'parameters', '0'],
        ['paths', 'somepath', 'patch', 'parameters', '0'],
        ['paths', 'somepath', 'delete', 'parameters', '0']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if no query parameter is found', async function () {
      const operation = {
        parameters: [
          { in: 'somewhere' }
        ]
      }
      const document = {
        paths: {
          somepath: {
            post: operation,
            put: operation,
            patch: operation,
            delete: operation
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if query parameter is found', async function () {
      const operation = {
        parameters: [
          { in: 'query' }
        ]
      }
      const document = {
        paths: {
          somepath: {
            post: operation,
            put: operation,
            patch: operation,
            delete: operation
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'post', 'parameters', '0', 'in'],
        ['paths', 'somepath', 'put', 'parameters', '0', 'in'],
        ['paths', 'somepath', 'patch', 'parameters', '0', 'in'],
        ['paths', 'somepath', 'delete', 'parameters', '0', 'in']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('parameter-body-forbidden-on-get-delete-oas2', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas2)

    it('should ignore path level parameters, x-tensions and post, put, patch parameters', function () {
      const operation = {
        parameters: [
          { in: 'somewhere' }
        ]
      }
      const document = {
        paths: {
          somepath: {
            parameters: [],
            post: operation,
            put: operation,
            patch: operation,
            'x-tension': 'dummy value'
          }
        }
      }
      const givenIndex = 0
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should check get and delete parameters', function () {
      const operation = {
        parameters: [
          { }
        ]
      }
      const document = {
        paths: {
          somepath: {
            get: operation,
            delete: operation
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'get', 'parameters', '0'],
        ['paths', 'somepath', 'delete', 'parameters', '0']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if no body parameter is found', async function () {
      const operation = {
        parameters: [
          { in: 'somewhere' }
        ]
      }
      const document = {
        paths: {
          somepath: {
            get: operation,
            delete: operation
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if body parameter is found', async function () {
      const operation = {
        parameters: [
          { in: 'body' }
        ]
      }
      const document = {
        paths: {
          somepath: {
            get: operation,
            delete: operation
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'get', 'parameters', '0', 'in'],
        ['paths', 'somepath', 'delete', 'parameters', '0', 'in']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('parameter-body-forbidden-on-get-delete-oas3', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3)

    it('should ignore path level parameters, x-tensions, post, put, patch operations', function () {
      const operation = {}
      const document = {
        paths: {
          somepath: {
            parameters: [],
            post: operation,
            put: operation,
            patch: operation,
            'x-tension': 'dummy value'
          }
        }
      }
      const givenIndex = 0
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should check get and delete operations', function () {
      const operation = {}
      const document = {
        paths: {
          somepath: {
            get: operation,
            delete: operation
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'get'],
        ['paths', 'somepath', 'delete']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if no request body is found on get or delete', async function () {
      const operation = {}
      const document = {
        paths: {
          somepath: {
            get: operation,
            delete: operation
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if a request body is found on get or delete', async function () {
      const operation = {
        requestBody: {}
      }
      const document = {
        paths: {
          somepath: {
            get: operation,
            delete: operation
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'get', 'requestBody'],
        ['paths', 'somepath', 'delete', 'requestBody']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('parameter-body-is-an-object', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should ignore oas2 operation level non body parameters', function () {
      const operation = {
        parameters: [
          { in: 'not body' }
        ]
      }
      const document = {
        paths: {
          somepath: {
            somemethod: operation
          }
        }
      }
      const givenIndex = 0
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should ignore oas3 application/json request bodies', function () {
      const operation = {
        requestBody: {
          content: {
            'not application/json': {}
          }
        }
      }
      const document = {
        paths: {
          somepath: {
            somemethod: operation
          }
        }
      }
      const givenIndex = 1
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should check oas2 operation level body parameters', function () {
      const operation = {
        parameters: [
          {
            in: 'body'
          }
        ]
      }
      const document = {
        paths: {
          somepath: {
            somemethod: operation
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'somemethod', 'parameters', '0']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should check oas3 request bodies', function () {
      const operation = {
        requestBody: {
          content: {
            'application/json': {}
          }
        }
      }
      const document = {
        paths: {
          somepath: {
            somemethod: operation
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'somemethod', 'requestBody', 'content', 'application/json']
      ]
      const givenIndex = 1
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if oas2 body parameter is explicitely an object', async function () {
      const operation = {
        parameters: [
          {
            in: 'body',
            schema: {
              type: 'object'
            }
          }
        ]
      }
      const document = {
        paths: {
          somepath: {
            post: operation
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if oas2 body parameter is implicitely an object', async function () {
      const operation = {
        parameters: [
          {
            in: 'body',
            schema: {
              properties: {
                aProperty: {}
              }
            }
          }
        ]
      }
      const document = {
        paths: {
          somepath: {
            post: operation
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if oas3 request body is explicitely an object', async function () {
      const operation = {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object'
              }
            }
          }
        }
      }
      const document = {
        paths: {
          somepath: {
            post: operation
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if oas3 request body is implicitely an object', async function () {
      const operation = {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                properties: {
                  aProperty: {}
                }
              }
            }
          }
        }
      }
      const document = {
        paths: {
          somepath: {
            post: operation
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if oas2 body parameter is not an object', async function () {
      const operation = {
        parameters: [
          {
            in: 'body',
            type: 'string'
          }
        ]
      }
      const document = {
        paths: {
          somepath: {
            post: operation
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'post', 'parameters', '0']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if oas3 request body is not an object', async function () {
      const operation = {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'string'
              }
            }
          }
        }
      }
      const document = {
        paths: {
          somepath: {
            post: operation
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'post', 'requestBody', 'content', 'application/json', 'schema', 'type']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('parameter-body-required-properties-on-post-put', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should ignore oas2 get, delete and patch operations, path level parameters and x-tensions', function () {
      const operation = {
        parameters: [
          {
            in: 'body',
            schema: {}
          }
        ]
      }
      const document = {
        paths: {
          somepath: {
            parameters: operation,
            get: operation,
            delete: operation,
            patch: operation,
            'x-tension': operation
          }
        }
      }
      const givenIndex = 0
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should ignore oas2 post and put operations non body parameters', function () {
      const operation = {
        parameters: [
          {
            in: 'not body',
            schema: {}
          }
        ]
      }
      const document = {
        paths: {
          somepath: {
            post: operation,
            put: operation
          }
        }
      }
      const givenIndex = 0
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should ignore oas3 get, delete and patch operations, path level parameters and x-tensions', function () {
      const operation = {
        requestBody: {
          content: {
            'application/json': {
              schema: {}
            }
          }
        }
      }
      const document = {
        paths: {
          somepath: {
            parameters: operation,
            get: operation,
            delete: operation,
            patch: operation,
            'x-tension': operation
          }
        }
      }
      const givenIndex = 1
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should ignore oas3 post and put operations non application/json request bodies', function () {
      const operation = {
        requestBody: {
          content: {
            'not application/json': {
              schema: {}
            }
          }
        }
      }
      const document = {
        paths: {
          somepath: {
            post: operation,
            put: operation
          }
        }
      }
      const givenIndex = 1
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should check oas2 post and put operations body parameter schemas', function () {
      const operation = {
        parameters: [
          {
            in: 'body',
            schema: {}
          }
        ]
      }
      const document = {
        paths: {
          somepath: {
            post: operation,
            put: operation
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'post', 'parameters', '0', 'schema'],
        ['paths', 'somepath', 'put', 'parameters', '0', 'schema']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should check oas3 post and put operations request body schemas', function () {
      const operation = {
        requestBody: {
          content: {
            'application/json': {
              schema: {}
            }
          }
        }
      }
      const document = {
        paths: {
          somepath: {
            post: operation,
            put: operation
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'post', 'requestBody', 'content', 'application/json', 'schema'],
        ['paths', 'somepath', 'put', 'requestBody', 'content', 'application/json', 'schema']
      ]
      const givenIndex = 1
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if schema required list is not empty', async function () {
      const operation = {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['aProperty'],
                properties: {
                  aProperty: {}
                }
              }
            }
          }
        }
      }
      const document = {
        paths: {
          somepath: {
            post: operation
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return a warning if schema does not have required list', async function () {
      const operation = {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  aProperty: {}
                }
              }
            }
          }
        }
      }
      const document = {
        paths: {
          somepath: {
            post: operation
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'post', 'requestBody', 'content', 'application/json', 'schema']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.warn
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return a warning if schema required list is empty', async function () {
      const operation = {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [],
                properties: {
                  aProperty: {}
                }
              }
            }
          }
        }
      }
      const document = {
        paths: {
          somepath: {
            post: operation
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'post', 'requestBody', 'content', 'application/json', 'schema', 'required']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.warn
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  function ignoreAndCheckQueryPathBodyParameterNames () {
    it('should ignore non query/body/path operation level parameter names', function () {
      const parameters = [
        { in: 'header', name: 'name' }
      ]
      const document = {
        paths: {
          somepath: {
            somemethod: {
              parameters: parameters
            }
          }
        }
      }
      const givenIndex = 0
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should ignore non query/body/path path level parameter names', function () {
      const parameters = [
        { in: 'header', name: 'name' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const givenIndex = 1
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should check query/body/path operation level parameter names', function () {
      const parameters = [
        { in: 'query', name: 'name' },
        { in: 'body', name: 'name' },
        { in: 'path', name: 'name' }
      ]
      const document = {
        paths: {
          somepath: {
            somemethod: {
              parameters: parameters
            }
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'somemethod', 'parameters', '0', 'name'],
        ['paths', 'somepath', 'somemethod', 'parameters', '1', 'name'],
        ['paths', 'somepath', 'somemethod', 'parameters', '2', 'name']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should check query/body/path path level parameter names', function () {
      const parameters = [
        { in: 'query', name: 'name' },
        { in: 'body', name: 'name' },
        { in: 'path', name: 'name' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'parameters', '0', 'name'],
        ['paths', 'somepath', 'parameters', '1', 'name'],
        ['paths', 'somepath', 'parameters', '2', 'name']
      ]
      const givenIndex = 1
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })
  }

  describe('parameter-query-path-body-name-lowercamelcase', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    ignoreAndCheckQueryPathBodyParameterNames()

    it('should return no error if parameter name is lowerCamelCased', async function () {
      const parameters = [
        { in: 'query', name: 'name' },
        { in: 'query', name: 'aName' },
        { in: 'body', name: 'aLongerName' },
        { in: 'path', name: 'aLongerNameWithNumber9' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if parameter name is not lowerCamelCased', async function () {
      const parameters = [
        { in: 'query', name: 'Name' },
        { in: 'query', name: 'NAME' },
        { in: 'query', name: 'NAme' },
        { in: 'query', name: 'naME' },
        { in: 'body', name: 'some-name' },
        { in: 'path', name: 'another_name' },
        { in: 'path', name: 'yet another name' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'parameters', '0', 'name'],
        ['paths', 'somepath', 'parameters', '1', 'name'],
        ['paths', 'somepath', 'parameters', '2', 'name'],
        ['paths', 'somepath', 'parameters', '4', 'name'],
        ['paths', 'somepath', 'parameters', '5', 'name'],
        ['paths', 'somepath', 'parameters', '6', 'name']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('parameter-query-path-body-name-no-number', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    ignoreAndCheckQueryPathBodyParameterNames()

    it('should return no error if parameter name contains no number', async function () {
      const parameters = [
        { in: 'query', name: 'name' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return a warning if parameter name contains a number', async function () {
      const parameters = [
        { in: 'query', name: 'name9' },
        { in: 'query', name: 'name9Longer' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'parameters', '0', 'name'],
        ['paths', 'somepath', 'parameters', '1', 'name']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.warn
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('parameter-path-name-not-id', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should ignore non path operation level parameter names', function () {
      const parameters = [
        { in: 'header', name: 'name' },
        { in: 'query', name: 'name' },
        { in: 'body', name: 'name' }
      ]
      const document = {
        paths: {
          somepath: {
            somemethod: {
              parameters: parameters
            }
          }
        }
      }
      const givenIndex = 0
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should ignore non path path level parameter names', function () {
      const parameters = [
        { in: 'header', name: 'name' },
        { in: 'query', name: 'name' },
        { in: 'body', name: 'name' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const givenIndex = 1
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should check path operation level parameter names', function () {
      const parameters = [
        { in: 'path', name: 'name' }
      ]
      const document = {
        paths: {
          somepath: {
            somemethod: {
              parameters: parameters
            }
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'somemethod', 'parameters', '0', 'name']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should check path path level parameter names', function () {
      const parameters = [
        { in: 'path', name: 'name' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'parameters', '0', 'name']
      ]
      const givenIndex = 1
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if path parameter name is not id', async function () {
      const parameters = [
        { in: 'path', name: 'resourceId' },
        { in: 'path', name: 'code' },
        { in: 'path', name: 'somethingElse' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if parameter name is id', async function () {
      const parameters = [
        { in: 'path', name: 'id' },
        { in: 'path', name: 'Id' },
        { in: 'path', name: 'ID' },
        { in: 'path', name: 'iD' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'parameters', '0', 'name'],
        ['paths', 'somepath', 'parameters', '1', 'name'],
        ['paths', 'somepath', 'parameters', '2', 'name'],
        ['paths', 'somepath', 'parameters', '3', 'name']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.warn
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('parameter-query-not-required', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should ignore non query operation level parameter required flags', function () {
      const parameters = [
        { in: 'header', required: true },
        { in: 'path', required: true },
        { in: 'body', required: true }
      ]
      const document = {
        paths: {
          somepath: {
            somemethod: {
              parameters: parameters
            }
          }
        }
      }
      const givenIndex = 0
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should ignore non query path level parameter required flags', function () {
      const parameters = [
        { in: 'header', required: true },
        { in: 'path', required: true },
        { in: 'body', required: true }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const givenIndex = 1
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should check query operation level parameter required flags', function () {
      const parameters = [
        { in: 'query', name: 'parameterOne', required: true },
        { in: 'query', name: 'parameterTwo', required: true }
      ]
      const document = {
        paths: {
          somepath: {
            somemethod: {
              parameters: parameters
            }
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'somemethod', 'parameters', '0', 'required'],
        ['paths', 'somepath', 'somemethod', 'parameters', '1', 'required']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should check query path level parameter required flags', function () {
      const parameters = [
        { in: 'query', name: 'parameterOne', required: true },
        { in: 'query', name: 'parameterTwo', required: true }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'parameters', '0', 'required'],
        ['paths', 'somepath', 'parameters', '1', 'required']
      ]
      const givenIndex = 1
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if query parameter name is not required implicitely and explicitely', async function () {
      const parameters = [
        { in: 'query', name: 'parameterOne' },
        { in: 'query', name: 'parameterTwo', required: false }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return a warning if query parameter is required', async function () {
      const parameters = [
        { in: 'query', name: 'parameter', required: true }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'parameters', '0', 'required']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.warn
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('parameter-path-required', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should ignore non path operation level parameter', function () {
      const parameters = [
        { in: 'header' },
        { in: 'query' },
        { in: 'body' }
      ]
      const document = {
        paths: {
          somepath: {
            somemethod: {
              parameters: parameters
            }
          }
        }
      }
      const givenIndex = 0
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should ignore non path path level parameter', function () {
      const parameters = [
        { in: 'header' },
        { in: 'query' },
        { in: 'body' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const givenIndex = 1
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should check path operation level parameter', function () {
      const parameters = [
        { in: 'path', name: 'parameter' }
      ]
      const document = {
        paths: {
          somepath: {
            somemethod: {
              parameters: parameters
            }
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'somemethod', 'parameters', '0']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should check path path level parameter', function () {
      const parameters = [
        { in: 'path', name: 'parameter' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'parameters', '0']
      ]
      const givenIndex = 1
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if path parameter name is required', async function () {
      const parameters = [
        { in: 'path', name: 'parameter', required: true }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if path parameter is not required implicitely and explicitely', async function () {
      const parameters = [
        { in: 'path', name: 'parameterOne', required: false },
        { in: 'path', name: 'parameterTwo' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'parameters', '0', 'required'],
        ['paths', 'somepath', 'parameters', '1']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('parameter-header-check-with-reviewer', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should check operation level parameter', function () {
      const parameters = [
        { in: 'header' }
      ]
      const document = {
        paths: {
          somepath: {
            somemethod: {
              parameters: parameters
            }
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'somemethod', 'parameters', '0', 'in']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should check path level parameter', function () {
      const parameters = [
        { in: 'header' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'parameters', '0', 'in']
      ]
      const givenIndex = 1
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if there is no header parameter', async function () {
      const parameters = [
        { in: 'path' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return a hint if there is a header parameter', async function () {
      const parameters = [
        { in: 'header' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'parameters', '0', 'in']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.hint
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  function ignoreAndCheckHeaderParameterNames () {
    it('should ignore non header operation level parameter names', function () {
      const parameters = [
        { in: 'path', name: 'name' },
        { in: 'query', name: 'name' },
        { in: 'body', name: 'name' }
      ]
      const document = {
        paths: {
          somepath: {
            somemethod: {
              parameters: parameters
            }
          }
        }
      }
      const givenIndex = 0
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should ignore non header path level parameter names', function () {
      const parameters = [
        { in: 'path', name: 'name' },
        { in: 'query', name: 'name' },
        { in: 'body', name: 'name' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const givenIndex = 1
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should check header operation level parameter names', function () {
      const parameters = [
        { in: 'header', name: 'name' }
      ]
      const document = {
        paths: {
          somepath: {
            somemethod: {
              parameters: parameters
            }
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'somemethod', 'parameters', '0', 'name']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should check header path level parameter names', function () {
      const parameters = [
        { in: 'header', name: 'name' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const expectedPaths = [
        ['paths', 'somepath', 'parameters', '0', 'name']
      ]
      const givenIndex = 1
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })
  }

  describe('parameter-header-name-case', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    ignoreAndCheckHeaderParameterNames()

    it('should return no error if header name is Hyphened-Pascal-Case', async function () {
      const parameters = [
        { in: 'header', name: 'Name' },
        { in: 'header', name: 'Longer-Name' },
        { in: 'header', name: 'X-Name' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if header name is not Hyphened-Pascal-Case', async function () {
      const parameters = [
        { in: 'header', name: 'name' },
        { in: 'header', name: 'NAME' },
        { in: 'header', name: 'longerName' },
        { in: 'header', name: 'LongerName' },
        { in: 'header', name: 'Longer_Name' },
        { in: 'header', name: 'longer_name' },
        { in: 'header', name: 'LONGER_NAME' },
        { in: 'header', name: 'longer-name' },
        { in: 'header', name: 'LONGER-NAME' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'parameters', '0', 'name'],
        ['paths', 'somepath', 'parameters', '1', 'name'],
        ['paths', 'somepath', 'parameters', '2', 'name'],
        ['paths', 'somepath', 'parameters', '4', 'name'],
        ['paths', 'somepath', 'parameters', '5', 'name'],
        ['paths', 'somepath', 'parameters', '6', 'name'],
        ['paths', 'somepath', 'parameters', '7', 'name'],
        ['paths', 'somepath', 'parameters', '8', 'name']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('parameter-header-authorized-name', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    ignoreAndCheckHeaderParameterNames()

    it('should return no error if header name is authorized', async function () {
      const parameters = [
        { in: 'header', name: 'Accept' },
        { in: 'header', name: 'Accept-Language' },
        { in: 'header', name: 'Accept-Datetime' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if header name is not authorized', async function () {
      const parameters = [
        { in: 'header', name: 'Custom' },
        { in: 'header', name: 'Access-Control-Allow-Credentials' }
      ]
      const document = {
        paths: {
          somepath: {
            parameters: parameters
          }
        }
      }
      const errorPaths = [
        ['paths', 'somepath', 'parameters', '0', 'name'],
        ['paths', 'somepath', 'parameters', '1', 'name']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  linterTestSuite.finalize()
})

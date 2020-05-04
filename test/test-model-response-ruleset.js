const { loadRuleset, SEVERITY, FORMATS, ruleset, rule, isNotRulesetFullyTestedTestSuite, rulesetFullyTestedSuiteName } = require('./common/SpectralTestWrapper.js')

describe('model-response', function () {
  let spectralTestWrapper

  // Loads ruleset file based on the ruleset name set in the ruleset level test suite describe('{ruleset name}')
  before(async function () {
    spectralTestWrapper = await loadRuleset(ruleset(this))
  })

  // Disables all rules except the one indicated in rule level test suite describe('{rule name}'
  beforeEach(function () {
    if (isNotRulesetFullyTestedTestSuite(this)) {
      spectralTestWrapper.disableAllRulesExcept(rule(this))
    }
  })

  function checkAlwaysRun () {
    spectralTestWrapper.checkAlwaysRun()
  }

  function checkRunOnlyOnOas2 () {
    spectralTestWrapper.checkRunOnlyOn(FORMATS.oas2)
  }

  function checkRunOnlyOnOas3 () {
    spectralTestWrapper.checkRunOnlyOn(FORMATS.oas3)
  }

  function responseSchemaIsDefinedIgnore204And3xx () {
    const document = {
      paths: {
        '/some/path': {
          anymethod: {
            responses: {
              204: {},
              302: {}
            }
          }
        }
      }
    }
    spectralTestWrapper.checkNoFoundPath(document)
  }

  function responseSchemaIsDefinedCheck2xx4xx5xx () {
    const document = {
      paths: {
        '/some/path': {
          anymethod: {
            responses: {
              201: {},
              401: {},
              500: {}
            }
          }
        }
      }
    }
    const expectedPaths = [
      ['paths', '/some/path', 'anymethod', 'responses', '201'],
      ['paths', '/some/path', 'anymethod', 'responses', '401'],
      ['paths', '/some/path', 'anymethod', 'responses', '500']
    ]
    spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths)
  }

  describe('response-schema-is-defined-oas2', function () {
    it('should run only on oas2 document', checkRunOnlyOnOas2)

    it('should ignore 204 and 3xx responses', responseSchemaIsDefinedIgnore204And3xx)

    it('should check all 2xx (expect 204), 4xx and 5xx responses', responseSchemaIsDefinedCheck2xx4xx5xx)

    it('should return no error if schema is defined in 2xx, 4xx and 5xx oas2 response', async function () {
      const response = {
        description: 'some valid response',
        schema: {}
      }
      const document = {
        swagger: '2.0',
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                200: response,
                401: response,
                500: response
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if schema is undefined in 2xx, 4xx and 5xx oas2 response', async function () {
      const response = {
        description: 'some invalid response'
      }
      const document = {
        swagger: '2.0',
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                200: response,
                401: response,
                500: response
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'anymethod', 'responses', '200'],
        ['paths', '/some/path', 'anymethod', 'responses', '401'],
        ['paths', '/some/path', 'anymethod', 'responses', '500']
      ]
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('response-schema-is-defined-oas3', function () {
    it('should run only on oas3 document', checkRunOnlyOnOas3)

    it('should ignore 204 and 3xx responses', responseSchemaIsDefinedIgnore204And3xx)

    it('should check all 2xx (expect 204), 4xx and 5xx responses', responseSchemaIsDefinedCheck2xx4xx5xx)

    it('should return no error is schema is defined in 2xx, 4xx and 5xx oas3 response', async function () {
      const response = {
        description: 'some valid response',
        content: {
          'application/json': {
            schema: {}
          }
        }
      }
      const document = {
        openapi: '3.0',
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                200: response,
                401: response,
                500: response
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if schema is undefined in 2xx, 4xx and 5xx oas3 response', async function () {
      const document = {
        openapi: '3.0',
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                200: { description: 'some invalid response' },
                401: {
                  description: 'some invalid response',
                  content: {}
                },
                500: {
                  description: 'some invalid response',
                  content: {
                    'application/json': {}
                  }
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'anymethod', 'responses', '200'],
        ['paths', '/some/path', 'anymethod', 'responses', '401', 'content'],
        ['paths', '/some/path', 'anymethod', 'responses', '500', 'content', 'application/json']
      ]
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('response-schema-is-not-defined-for-204-or-3xx', function () {
    it('should run on all formats', checkAlwaysRun)

    it('should ignore 2xx other than 204, 4xx and 5xx response', function () {
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                200: {},
                201: {},
                202: {},
                400: {},
                401: {},
                403: {},
                404: {},
                500: {}
              }
            }
          }
        }
      }
      spectralTestWrapper.checkNoFoundPath(document, rule(this))
    })

    it('should check 204 and 3xx response', function () {
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                204: {},
                301: {},
                302: {}
              }
            }
          }
        }
      }
      const expectedPaths = [
        ['paths', '/some/path', 'anymethod', 'responses', '204'],
        ['paths', '/some/path', 'anymethod', 'responses', '301'],
        ['paths', '/some/path', 'anymethod', 'responses', '302']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths)
    })

    it('should return no error if 204 or 3xx response schema is not defined', async function () {
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                204: {},
                301: {},
                302: {},
                303: {}
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if schema is defined in 204 or 3xx oas2 response', async function () {
      const response = {
        schema: {}
      }
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                204: response,
                301: response,
                302: response,
                303: response
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'anymethod', 'responses', '204', 'schema'],
        ['paths', '/some/path', 'anymethod', 'responses', '301', 'schema'],
        ['paths', '/some/path', 'anymethod', 'responses', '302', 'schema'],
        ['paths', '/some/path', 'anymethod', 'responses', '303', 'schema']
      ]
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })

    it('should return an error if schema is defined in 204 or 3xx oas3 response', async function () {
      const response = {
        description: 'some invalid response',
        content: {}
      }
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                204: response,
                301: response,
                302: response,
                303: response
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'anymethod', 'responses', '204', 'content'],
        ['paths', '/some/path', 'anymethod', 'responses', '301', 'content'],
        ['paths', '/some/path', 'anymethod', 'responses', '302', 'content'],
        ['paths', '/some/path', 'anymethod', 'responses', '303', 'content']
      ]
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('response-schema-is-an-object', function () {
    it('should run on all formats', checkAlwaysRun)

    it('should ignore 204 and 3xx response oas2 schema', function () {
      const response = {
        schema: {}
      }
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                204: response,
                302: response
              }
            }
          }
        }
      }
      spectralTestWrapper.checkNoFoundPath(document, 0)
    })

    it('should check 2xx (expect 204), 4xx and 5xx response oas2 schema', function () {
      const response = {
        schema: {}
      }
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                200: response,
                401: response,
                500: response
              }
            }
          }
        }
      }
      const expectedPaths = [
        ['paths', '/some/path', 'anymethod', 'responses', '200', 'schema'],
        ['paths', '/some/path', 'anymethod', 'responses', '401', 'schema'],
        ['paths', '/some/path', 'anymethod', 'responses', '500', 'schema']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 0)
    })

    it('should ignore 204 and 3xx response application/json oas3 response', function () {
      const response = {
        content: {
          'application/json': {
            schema: {}
          }
        }
      }
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                204: response,
                301: response
              }
            }
          }
        }
      }
      spectralTestWrapper.checkNoFoundPath(document, 1)
    })

    it('should ignore 2xx (except 204), 4xx and 5xx non application/json oas3 response', function () {
      const response = {
        content: {
          'application/pdf': {
            schema: {}
          }
        }
      }
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                200: response,
                401: response,
                500: response
              }
            }
          }
        }
      }
      spectralTestWrapper.checkNoFoundPath(document, 0)
    })

    it('should check 2xx (except 204), 4xx and 5xx application/json oas3 response', function () {
      const response = {
        content: {
          'application/json': {
            schema: {}
          }
        }
      }
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                200: response,
                401: response,
                500: response
              }
            }
          }
        }
      }
      const expectedPaths = [
        ['paths', '/some/path', 'anymethod', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', '/some/path', 'anymethod', 'responses', '401', 'content', 'application/json', 'schema'],
        ['paths', '/some/path', 'anymethod', 'responses', '500', 'content', 'application/json', 'schema']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 1)
    })

    it('should return no error if 2xx, 4xx, 5xx oas2 response is an object', async function () {
      const responseExplicitObject = {
        schema: { type: 'object' }
      }
      const responseImplicitObject = {
        schema: {}
      }
      const document = {
        paths: {
          '/some/path': {
            get: {
              responses: {
                200: responseExplicitObject,
                201: responseExplicitObject,
                202: responseExplicitObject,
                400: responseExplicitObject,
                401: responseImplicitObject,
                403: responseImplicitObject,
                404: responseImplicitObject,
                500: responseImplicitObject
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if 2xx, 4xx, 5xx oas3 response is an object', async function () {
      const responseExplicitObject = {
        content: {
          'application/json': {
            schema: { type: 'object' }
          }
        }
      }
      const responseImplicitObject = {
        content: {
          'application/json': {
            schema: { type: 'object' }
          }
        }
      }
      const document = {
        paths: {
          '/some/path': {
            get: {
              responses: {
                200: responseExplicitObject,
                201: responseExplicitObject,
                202: responseExplicitObject,
                400: responseExplicitObject,
                401: responseImplicitObject,
                403: responseImplicitObject,
                404: responseImplicitObject,
                500: responseImplicitObject
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if 2xx, 4xx, 5xx oas2 response is not an object (array or string for example)', async function () {
      const responseArray = { schema: { type: 'array' } }
      const responseString = { schema: { type: 'string' } }
      const responseNumber = { schema: { type: 'number' } }
      const document = {
        paths: {
          '/some/path': {
            get: {
              responses: {
                200: responseArray,
                201: responseArray,
                202: responseArray,
                400: responseString,
                401: responseString,
                403: responseString,
                404: responseNumber,
                500: responseNumber
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'get', 'responses', '200', 'schema', 'type'],
        ['paths', '/some/path', 'get', 'responses', '201', 'schema', 'type'],
        ['paths', '/some/path', 'get', 'responses', '202', 'schema', 'type'],
        ['paths', '/some/path', 'get', 'responses', '400', 'schema', 'type'],
        ['paths', '/some/path', 'get', 'responses', '401', 'schema', 'type'],
        ['paths', '/some/path', 'get', 'responses', '403', 'schema', 'type'],
        ['paths', '/some/path', 'get', 'responses', '404', 'schema', 'type'],
        ['paths', '/some/path', 'get', 'responses', '500', 'schema', 'type']
      ]
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })

    it('should return an error if 2xx, 4xx, 5xx oas3 response is not an object (array or string for example)', async function () {
      const responseArray = {
        content: {
          'application/json': {
            schema: { type: 'array' }
          }
        }
      }
      const responseString = {
        content: {
          'application/json': {
            schema: { type: 'string' }
          }
        }
      }
      const responseNumber = {
        content: {
          'application/json': {
            schema: { type: 'number' }
          }
        }
      }
      const document = {
        paths: {
          '/some/path': {
            get: {
              responses: {
                200: responseArray,
                201: responseArray,
                202: responseArray,
                400: responseString,
                401: responseString,
                403: responseString,
                404: responseNumber,
                500: responseNumber
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'get', 'responses', '200', 'content', 'application/json', 'schema', 'type'],
        ['paths', '/some/path', 'get', 'responses', '201', 'content', 'application/json', 'schema', 'type'],
        ['paths', '/some/path', 'get', 'responses', '202', 'content', 'application/json', 'schema', 'type'],
        ['paths', '/some/path', 'get', 'responses', '400', 'content', 'application/json', 'schema', 'type'],
        ['paths', '/some/path', 'get', 'responses', '401', 'content', 'application/json', 'schema', 'type'],
        ['paths', '/some/path', 'get', 'responses', '403', 'content', 'application/json', 'schema', 'type'],
        ['paths', '/some/path', 'get', 'responses', '404', 'content', 'application/json', 'schema', 'type'],
        ['paths', '/some/path', 'get', 'responses', '500', 'content', 'application/json', 'schema', 'type']
      ]
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('response-error-schema-is-valid', function () {
    const errorSchema = {
      required: ['errors'],
      properties: {
        errors: {
          type: 'array',
          minItems: 1,
          items: {
            required: ['code', 'message'],
            properties: {
              code: {
                type: 'string',
                description: 'machine readable error code'
              },
              message: {
                type: 'string',
                description: 'human readable error description'
              },
              attribute: {
                type: 'string',
                description: 'name of the attribute or parameter source of the error'
              },
              path: {
                type: 'string',
                description: 'path of the body attribute source of the error'
              },
              additionalInformation: {
                type: 'object'
              }
            }
          }
        }
      }
    }

    it('should run on all formats', checkAlwaysRun)

    it('should ignore 2xx responses in oas2', function () {
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                200: { schema: 'example' }
              }
            }
          }
        }
      }
      spectralTestWrapper.checkNoFoundPath(document, 0)
    })

    it('should ignore 2xx responses in oas3', function () {
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: 'example'
                    }
                  }
                }
              }
            }
          }
        }
      }
      spectralTestWrapper.checkNoFoundPath(document, 1)
    })

    it('should check 4xx and 5xx response schema in oas2', function () {
      const response = { schema: {} }
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                400: response,
                500: response
              }
            }
          }
        }
      }
      const expectedPaths = [
        ['paths', '/some/path', 'anymethod', 'responses', '400', 'schema'],
        ['paths', '/some/path', 'anymethod', 'responses', '500', 'schema']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 0)
    })

    it('should check 4xx and 5xx response schema in oas3', function () {
      const response = {
        content: {
          'application/json': {
            schema: {}
          }
        }
      }
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                400: response,
                500: response
              }
            }
          }
        }
      }
      const expectedPaths = [
        ['paths', '/some/path', 'anymethod', 'responses', '400', 'content', 'application/json', 'schema'],
        ['paths', '/some/path', 'anymethod', 'responses', '500', 'content', 'application/json', 'schema']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 1)
    })

    it('should return no error if schema matches standard error one on all 4xx and 5xx responses', async function () {
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                400: { schema: errorSchema },
                401: { schema: errorSchema },
                403: { schema: errorSchema },
                404: { schema: errorSchema },
                500: { schema: errorSchema }
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if schema other than for responses 4xx and 5xx do not match error model', async function () {
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                200: { description: 'ok' }
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if schema does not match standard error one on a 4xx or 5xx response', async function () {
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                401: {
                  schema: {
                    properties: {
                      message: {
                        type: 'string',
                        description: 'the error message'
                      }
                    }
                  }
                },
                500: {
                  schema: {
                    type: 'string',
                    description: 'the error message'
                  }
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'anymethod', 'responses', '401', 'schema'],
        ['paths', '/some/path', 'anymethod', 'responses', '500', 'schema']
      ]
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('response-collection-schema-is-valid', function () {
    it('should run on all formats', checkAlwaysRun)

    it('should ignore get unitary resource 200 response in oas2', function () {
      const pathObject = {
        get: {
          responses: {
            200: {
              schema: {}
            }
          }
        }
      }

      const document = {
        paths: {
          '/name/v1/resources/{id}': pathObject,
          '/v1/resources/{id}': pathObject,
          '/resources/{id}': pathObject,
          '/resources/{id}-{composite}': pathObject,
          '/resources/magic': pathObject,
          '/resources/{id}/resources/{anotherId}': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}': pathObject,
          '/resources/{id}/resources/magic': pathObject
        }
      }
      spectralTestWrapper.checkNoFoundPath(document, 0) // get collection oas 2
    })

    it('should ignore get unitary resource 200 response in oas3', function () {
      const pathObject = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {}
                }
              }
            }
          }
        }
      }

      const document = {
        paths: {
          '/name/v1/resources/{id}': pathObject,
          '/v1/resources/{id}': pathObject,
          '/resources/{id}': pathObject,
          '/resources/{id}-{composite}': pathObject,
          '/resources/magic': pathObject,
          '/resources/{id}/resources/{anotherId}': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}': pathObject,
          '/resources/{id}/resources/magic': pathObject
        }
      }
      spectralTestWrapper.checkNoFoundPath(document, 1) // get collection
      spectralTestWrapper.checkNoFoundPath(document, 3) // post search
    })

    it('should ignore post non search resource 200 response in oas2', function () {
      const pathObject = {
        post: {
          responses: {
            200: {
              schema: {}
            }
          }
        }
      }

      const document = {
        paths: {
          '/name/v1/resources': pathObject,
          '/v1/resources': pathObject,
          '/resources': pathObject,
          '/resources/{id}/resources': pathObject,
          '/resources/magic/resources': pathObject,
          '/resources/{id}-{composite}/resources': pathObject,
          '/resources/{id}/resources/{id}/resources': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources': pathObject,
          '/resources/{id}/resources/magic/resources': pathObject
        }
      }
      spectralTestWrapper.checkNoFoundPath(document, 2)
    })

    it('should ignore post non search resource 200 response in oas3', function () {
      const pathObject = {
        post: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {}
                }
              }
            }
          }
        }
      }

      const document = {
        paths: {
          '/name/v1/resources': pathObject,
          '/v1/resources': pathObject,
          '/resources': pathObject,
          '/resources/{id}/resources': pathObject,
          '/resources/magic/resources': pathObject,
          '/resources/{id}-{composite}/resources': pathObject,
          '/resources/{id}/resources/{id}/resources': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources': pathObject,
          '/resources/{id}/resources/magic/resources': pathObject
        }
      }
      spectralTestWrapper.checkNoFoundPath(document, 3)
    })

    it('should ignore any put, patch, delete collection 200 response in oas2', async function () {
      const responsesObject = {
        responses: {
          200: {
            schema: {}
          }
        }
      }
      const pathObject = {
        put: responsesObject,
        patch: responsesObject,
        delete: responsesObject
      }

      const document = {
        paths: {
          '/name/v1/resources': pathObject,
          '/v1/resources': pathObject,
          '/resources': pathObject,
          '/resources/{id}/resources': pathObject,
          '/resources/{id}-{composite}/resources': pathObject,
          '/resources/magic/resources': pathObject,
          '/resources/{id}/resources/{anotherId}/resources': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources': pathObject,
          '/resources/{id}/resources/magic/resources': pathObject
        }
      }
      spectralTestWrapper.checkNoFoundPath(document, 0)
      spectralTestWrapper.checkNoFoundPath(document, 2)
    })

    it('should ignore any put, patch, delete collection 200 response in oas3', async function () {
      const responsesObject = {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {}
              }
            }
          }
        }
      }
      const pathObject = {
        put: responsesObject,
        patch: responsesObject,
        delete: responsesObject
      }

      const document = {
        paths: {
          '/name/v1/resources': pathObject,
          '/v1/resources': pathObject,
          '/resources': pathObject,
          '/resources/{id}/resources': pathObject,
          '/resources/{id}-{composite}/resources': pathObject,
          '/resources/magic/resources': pathObject,
          '/resources/{id}/resources/{anotherId}/resources': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources': pathObject,
          '/resources/{id}/resources/magic/resources': pathObject
        }
      }
      spectralTestWrapper.checkNoFoundPath(document, 1)
      spectralTestWrapper.checkNoFoundPath(document, 3)
    })

    it('should ignore get collection resource non 200 response in oas2', function () {
      const responseObject = {
        schema: {}
      }
      const pathObject = {
        get: {
          responses: {
            401: responseObject,
            404: responseObject,
            500: responseObject
          }
        }
      }

      const document = {
        paths: {
          '/name/v1/resources': pathObject,
          '/v1/resources': pathObject,
          '/resources': pathObject,
          '/resources/{id}/resources': pathObject,
          '/resources/magic/resources': pathObject,
          '/resources/{id}-{composite}/resources': pathObject,
          '/resources/{id}/resources/{id}/resources': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources': pathObject,
          '/resources/{id}/resources/magic/resources': pathObject
        }
      }
      spectralTestWrapper.checkNoFoundPath(document, 0)
    })

    it('should ignore get collection resource non 200 response in oas3', function () {
      const responseObject = {
        content: {
          'application/json': {
            schema: {}
          }
        }
      }
      const pathObject = {
        post: {
          responses: {
            401: responseObject,
            404: responseObject,
            500: responseObject
          }
        }
      }

      const document = {
        paths: {
          '/name/v1/resources': pathObject,
          '/v1/resources': pathObject,
          '/resources': pathObject,
          '/resources/{id}/resources': pathObject,
          '/resources/magic/resources': pathObject,
          '/resources/{id}-{composite}/resources': pathObject,
          '/resources/{id}/resources/{id}/resources': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources': pathObject,
          '/resources/{id}/resources/magic/resources': pathObject
        }
      }
      spectralTestWrapper.checkNoFoundPath(document, 1)
    })

    it('should ignore post search resource non 200 response in oas2', function () {
      const responseObject = {
        schema: {}
      }
      const pathObject = {
        post: {
          responses: {
            401: responseObject,
            404: responseObject,
            500: responseObject
          }
        }
      }

      const document = {
        paths: {
          '/name/v1/resources/search': pathObject,
          '/v1/resources/search': pathObject,
          '/resources/search': pathObject,
          '/resources/{id}/resources/search': pathObject,
          '/resources/magic/resources/search': pathObject,
          '/resources/{id}-{composite}/resources/search': pathObject,
          '/resources/{id}/resources/{id}/resources/search': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources/search': pathObject,
          '/resources/{id}/resources/magic/resources/search': pathObject
        }
      }
      spectralTestWrapper.checkNoFoundPath(document, 2)
    })

    it('should ignore post search resource non 200 response in oas3', function () {
      const responseObject = {
        content: {
          'application/json': {
            schema: {}
          }
        }
      }
      const pathObject = {
        post: {
          responses: {
            401: responseObject,
            404: responseObject,
            500: responseObject
          }
        }
      }

      const document = {
        paths: {
          '/name/v1/resources/search': pathObject,
          '/v1/resources/search': pathObject,
          '/resources/search': pathObject,
          '/resources/{id}/resources/search': pathObject,
          '/resources/magic/resources/search': pathObject,
          '/resources/{id}-{composite}/resources/search': pathObject,
          '/resources/{id}/resources/{id}/resources/search': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources/search': pathObject,
          '/resources/{id}/resources/magic/resources/search': pathObject
        }
      }
      spectralTestWrapper.checkNoFoundPath(document, 3)
    })

    it('should check get collection 200 response in oas2', function () {
      const pathObject = {
        get: {
          responses: {
            200: {
              schema: {}
            }
          }
        }
      }
      const document = {
        paths: {
          '/name/v1/resources': pathObject,
          '/v1/resources': pathObject,
          '/resources': pathObject,
          '/resources/{id}/resources': pathObject,
          '/resources/magic/resources': pathObject,
          '/resources/{id}-{composite}/resources': pathObject,
          '/resources/{id}/resources/{id}/resources': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources': pathObject,
          '/resources/{id}/resources/magic/resources': pathObject
        }
      }

      const expectedPaths = [
        ['paths', '/name/v1/resources', 'get', 'responses', '200', 'schema'],
        ['paths', '/v1/resources', 'get', 'responses', '200', 'schema'],
        ['paths', '/resources', 'get', 'responses', '200', 'schema'],
        ['paths', '/resources/{id}/resources', 'get', 'responses', '200', 'schema'],
        ['paths', '/resources/magic/resources', 'get', 'responses', '200', 'schema'],
        ['paths', '/resources/{id}-{composite}/resources', 'get', 'responses', '200', 'schema'],
        ['paths', '/resources/{id}/resources/{id}/resources', 'get', 'responses', '200', 'schema'],
        ['paths', '/resources/{id}/resources/{anotherId}-{composite}/resources', 'get', 'responses', '200', 'schema'],
        ['paths', '/resources/{id}/resources/magic/resources', 'get', 'responses', '200', 'schema']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 0)
    })

    it('should check get collection 200 response in oas3', function () {
      const pathObject = {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {}
                }
              }
            }
          }
        }
      }
      const document = {
        paths: {
          '/name/v1/resources': pathObject,
          '/v1/resources': pathObject,
          '/resources': pathObject,
          '/resources/{id}/resources': pathObject,
          '/resources/magic/resources': pathObject,
          '/resources/{id}-{composite}/resources': pathObject,
          '/resources/{id}/resources/{id}/resources': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources': pathObject,
          '/resources/{id}/resources/magic/resources': pathObject
        }
      }

      const expectedPaths = [
        ['paths', '/name/v1/resources', 'get', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', '/v1/resources', 'get', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', '/resources', 'get', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', '/resources/{id}/resources', 'get', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', '/resources/magic/resources', 'get', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', '/resources/{id}-{composite}/resources', 'get', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', '/resources/{id}/resources/{id}/resources', 'get', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', '/resources/{id}/resources/{anotherId}-{composite}/resources', 'get', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', '/resources/{id}/resources/magic/resources', 'get', 'responses', '200', 'content', 'application/json', 'schema']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 1)
    })

    it('should check post search 200 response in oas2', function () {
      const pathObject = {
        post: {
          responses: {
            200: {
              schema: {}
            }
          }
        }
      }
      const document = {
        paths: {
          '/name/v1/resources/search': pathObject,
          '/v1/resources/search': pathObject,
          '/resources/search': pathObject,
          '/resources/{id}/resources/search': pathObject,
          '/resources/magic/resources/search': pathObject,
          '/resources/{id}-{composite}/resources/search': pathObject,
          '/resources/{id}/resources/{id}/resources/search': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources/search': pathObject,
          '/resources/{id}/resources/magic/resources/search': pathObject
        }
      }

      const expectedPaths = [
        ['paths', '/name/v1/resources/search', 'post', 'responses', '200', 'schema'],
        ['paths', '/v1/resources/search', 'post', 'responses', '200', 'schema'],
        ['paths', '/resources/search', 'post', 'responses', '200', 'schema'],
        ['paths', '/resources/{id}/resources/search', 'post', 'responses', '200', 'schema'],
        ['paths', '/resources/magic/resources/search', 'post', 'responses', '200', 'schema'],
        ['paths', '/resources/{id}-{composite}/resources/search', 'post', 'responses', '200', 'schema'],
        ['paths', '/resources/{id}/resources/{id}/resources/search', 'post', 'responses', '200', 'schema'],
        ['paths', '/resources/{id}/resources/{anotherId}-{composite}/resources/search', 'post', 'responses', '200', 'schema'],
        ['paths', '/resources/{id}/resources/magic/resources/search', 'post', 'responses', '200', 'schema']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 2)
    })

    it('should check post search 200 response in oas3', function () {
      const pathObject = {
        post: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {}
                }
              }
            }
          }
        }
      }
      const document = {
        paths: {
          '/name/v1/resources/search': pathObject,
          '/v1/resources/search': pathObject,
          '/resources/search': pathObject,
          '/resources/{id}/resources/search': pathObject,
          '/resources/magic/resources/search': pathObject,
          '/resources/{id}-{composite}/resources/search': pathObject,
          '/resources/{id}/resources/{id}/resources/search': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources/search': pathObject,
          '/resources/{id}/resources/magic/resources/search': pathObject
        }
      }

      const expectedPaths = [
        ['paths', '/name/v1/resources/search', 'post', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', '/v1/resources/search', 'post', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', '/resources/search', 'post', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', '/resources/{id}/resources/search', 'post', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', '/resources/magic/resources/search', 'post', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', '/resources/{id}-{composite}/resources/search', 'post', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', '/resources/{id}/resources/{id}/resources/search', 'post', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', '/resources/{id}/resources/{anotherId}-{composite}/resources/search', 'post', 'responses', '200', 'content', 'application/json', 'schema'],
        ['paths', '/resources/{id}/resources/magic/resources/search', 'post', 'responses', '200', 'content', 'application/json', 'schema']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 3)
    })

    it('should return no error if response is an object containing an items list', async function () {
      const validSchemaItemsOnly = {
        required: ['items'],
        properties: {
          items: {
            type: 'array',
            items: {}
          }
        }
      }

      const document = {
        paths: {
          '/resources': {
            get: {
              responses: {
                200: {
                  schema: validSchemaItemsOnly
                }
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error response is an object with items optional additionalInformation or page', async function () {
      const validSchemaFull = {
        required: ['items'],
        properties: {
          items: {
            type: 'array',
            items: {},
            page: {},
            additionalInformation: {}
          }
        }
      }

      const document = {
        paths: {
          '/resources': {
            get: {
              responses: {
                200: {
                  schema: validSchemaFull
                }
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if a get collection 200 response is not an object containing an items list', async function () {
      const invalidSchemaNotObjectWithItems = {
        properties: {
          something: {
            type: 'string'
          }
        }
      }

      const document = {
        paths: {
          '/resources': {
            get: {
              responses: {
                200: {
                  schema: invalidSchemaNotObjectWithItems
                }
              }
            }
          }
        }
      }

      const errorPaths = [
        ['paths', '/resources', 'get', 'responses', '200', 'schema', 'properties']
      ]

      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })

    it('should return an error if response contains unexpected properties besides items, additionalInformation or page', async function () {
      const invalidSchemaUnexpectedProperties = {
        required: ['items'],
        properties: {
          items: {
            type: 'array',
            items: {}
          },
          pagination: {},
          someValue: {}
        }
      }

      const document = {
        paths: {
          '/resources': {
            get: {
              responses: {
                200: {
                  schema: invalidSchemaUnexpectedProperties
                }
              }
            }
          }
        }
      }

      const errorPaths = [
        ['paths', '/resources', 'get', 'responses', '200', 'schema', 'properties']
      ]

      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('response-collection-items-schema-is-valid', function () {
    // Note the root of regex have been tested in response-collection-schema-is-valid

    it('should check get collection items property schema in oas2', function () {
      const operationObject = {
        responses: {
          200: {
            schema: {
              properties: {
                items: {
                  items: {}
                }
              }
            }
          }
        }
      }

      const document = {
        paths: {
          '/resources': {
            get: operationObject
          }
        }
      }

      const expectedPaths = [
        ['paths', '/resources', 'get', 'responses', '200', 'schema', 'properties', 'items', 'items']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 0)
    })

    it('should check get collection items property schema in oas3', function () {
      const operationObject = {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  properties: {
                    items: {
                      items: {}
                    }
                  }
                }
              }
            }
          }
        }
      }

      const document = {
        paths: {
          '/resources': {
            get: operationObject
          }
        }
      }

      const expectedPaths = [
        ['paths', '/resources', 'get', 'responses', '200', 'content', 'application/json', 'schema', 'properties', 'items', 'items']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 1)
    })

    it('should check post search items property schema in oas2', function () {
      const operationObject = {
        responses: {
          200: {
            schema: {
              properties: {
                items: {
                  items: {}
                }
              }
            }
          }
        }
      }

      const document = {
        paths: {
          '/resources/search': {
            post: operationObject
          }
        }
      }

      const expectedPaths = [
        ['paths', '/resources/search', 'post', 'responses', '200', 'schema', 'properties', 'items', 'items']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 2)
    })

    it('should check get collection items property schema in oas3', function () {
      const operationObject = {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  properties: {
                    items: {
                      items: {}
                    }
                  }
                }
              }
            }
          }
        }
      }

      const document = {
        paths: {
          '/resources/search': {
            post: operationObject
          }
        }
      }

      const expectedPaths = [
        ['paths', '/resources/search', 'post', 'responses', '200', 'content', 'application/json', 'schema', 'properties', 'items', 'items']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 3)
    })

    it('should return no error if items is an implicit object list', async function () {
      const validSchemaItemsImplicitObject = {
        required: ['items'],
        properties: {
          items: {}
        }
      }

      const pathObject = {
        get: {
          responses: {
            200: {
              schema: validSchemaItemsImplicitObject
            }
          }
        }
      }

      const document = {
        paths: {
          '/resources': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if items is an explicit object list', async function () {
      const validSchemaItemsExplicitObject = {
        required: ['items'],
        properties: {
          items: {
            type: 'object'
          }
        }
      }

      const pathObject = {
        get: {
          responses: {
            200: {
              schema: validSchemaItemsExplicitObject
            }
          }
        }
      }

      const document = {
        paths: {
          '/resources': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if items is not an object list', async function () {
      const invalidSchemaItems = {
        required: ['items'],
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      }

      const pathObject = {
        get: {
          responses: {
            200: {
              schema: invalidSchemaItems
            }
          }
        }
      }

      const document = {
        paths: {
          '/resources': pathObject
        }
      }

      const errorPaths = [
        ['paths', '/resources', 'get', 'responses', '200', 'schema', 'properties', 'items', 'items', 'type']
      ]

      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('response-collection-additional-information-schema-is-valid', function () {
    it('should check get collection additionalInformation schema in oas2', function () {
      const operationObject = {
        responses: {
          200: {
            schema: {
              properties: {
                additionalInformation: {}
              }
            }
          }
        }
      }

      const document = {
        paths: {
          '/resources': {
            get: operationObject
          }
        }
      }

      const expectedPaths = [
        ['paths', '/resources', 'get', 'responses', '200', 'schema', 'properties', 'additionalInformation']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 0)
    })

    it('should check get collection additionalInformation schema in oas3', function () {
      const operationObject = {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  properties: {
                    additionalInformation: {}
                  }
                }
              }
            }
          }
        }
      }

      const document = {
        paths: {
          '/resources': {
            get: operationObject
          }
        }
      }

      const expectedPaths = [
        ['paths', '/resources', 'get', 'responses', '200', 'content', 'application/json', 'schema', 'properties', 'additionalInformation']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 1)
    })

    it('should check post search additionalInformation schema in oas2', function () {
      const operationObject = {
        responses: {
          200: {
            schema: {
              properties: {
                additionalInformation: {}
              }
            }
          }
        }
      }

      const document = {
        paths: {
          '/resources/search': {
            post: operationObject
          }
        }
      }

      const expectedPaths = [
        ['paths', '/resources/search', 'post', 'responses', '200', 'schema', 'properties', 'additionalInformation']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 2)
    })

    it('should check get collection additionalInformation schema in oas3', function () {
      const operationObject = {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  properties: {
                    additionalInformation: {
                      items: {}
                    }
                  }
                }
              }
            }
          }
        }
      }

      const document = {
        paths: {
          '/resources/search': {
            post: operationObject
          }
        }
      }

      const expectedPaths = [
        ['paths', '/resources/search', 'post', 'responses', '200', 'content', 'application/json', 'schema', 'properties', 'additionalInformation']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 3)
    })

    it('should return no error if additionalInformation is an implicit object', async function () {
      const validSchemaAdditionalImplicitObject = {
        properties: {
          additionalInformation: {}
        }
      }

      const pathObject = {
        get: {
          responses: {
            200: {
              schema: validSchemaAdditionalImplicitObject
            }
          }
        }
      }

      const document = {
        paths: {
          '/resources': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if additionalInformation is an explicit object', async function () {
      const validSchemaAdditionalExplicitObject = {
        properties: {
          additionalInformation: {
            type: 'object'
          }
        }
      }

      const pathObject = {
        get: {
          responses: {
            200: {
              schema: validSchemaAdditionalExplicitObject
            }
          }
        }
      }

      const document = {
        paths: {
          '/resources': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if additionalInformation is not an object', async function () {
      const invalidSchemaAdditional = {
        properties: {
          additionalInformation: {
            type: 'string'
          }
        }
      }

      const pathObject = {
        get: {
          responses: {
            200: {
              schema: invalidSchemaAdditional
            }
          }
        }
      }

      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources': pathObject
        }
      }

      const errorPaths = [
        ['paths', '/resources', 'get', 'responses', '200', 'schema', 'properties', 'additionalInformation', 'type']
      ]

      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('response-collection-page-schema-is-valid', function () {
    it('should check get collection page schema in oas2', function () {
      const operationObject = {
        responses: {
          200: {
            schema: {
              properties: {
                page: {}
              }
            }
          }
        }
      }

      const document = {
        paths: {
          '/resources': {
            get: operationObject
          }
        }
      }

      const expectedPaths = [
        ['paths', '/resources', 'get', 'responses', '200', 'schema', 'properties', 'page']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 0)
    })

    it('should check get collection page schema in oas3', function () {
      const operationObject = {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  properties: {
                    page: {}
                  }
                }
              }
            }
          }
        }
      }

      const document = {
        paths: {
          '/resources': {
            get: operationObject
          }
        }
      }

      const expectedPaths = [
        ['paths', '/resources', 'get', 'responses', '200', 'content', 'application/json', 'schema', 'properties', 'page']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 1)
    })

    it('should check post search page schema in oas2', function () {
      const operationObject = {
        responses: {
          200: {
            schema: {
              properties: {
                page: {}
              }
            }
          }
        }
      }

      const document = {
        paths: {
          '/resources/search': {
            post: operationObject
          }
        }
      }

      const expectedPaths = [
        ['paths', '/resources/search', 'post', 'responses', '200', 'schema', 'properties', 'page']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 2)
    })

    it('should check get collection page schema in oas3', function () {
      const operationObject = {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  properties: {
                    page: {
                      items: {}
                    }
                  }
                }
              }
            }
          }
        }
      }

      const document = {
        paths: {
          '/resources/search': {
            post: operationObject
          }
        }
      }

      const expectedPaths = [
        ['paths', '/resources/search', 'post', 'responses', '200', 'content', 'application/json', 'schema', 'properties', 'page']
      ]
      spectralTestWrapper.checkExpectedFoundPath(document, expectedPaths, 3)
    })

    it('should return no error if page is valid index pagination', async function () {
      const document = {
        paths: {
          '/resources': {
            get: {
              responses: {
                200: {
                  schema: {
                    properties: {
                      page: {
                        properties: {
                          pageNumber: { type: 'number' },
                          pageSize: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '/resources/{id}/resources': {
            get: {
              responses: {
                200: {
                  schema: {
                    properties: {
                      page: {
                        properties: {
                          pageNumber: { type: 'number' },
                          pageSize: { type: 'number' },
                          totalPages: { type: 'number' },
                          totalElements: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if page is valid cursor pagination', async function () {
      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources': {
            get: {
              responses: {
                200: {
                  schema: {
                    properties: {
                      page: {
                        properties: {
                          after: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '/resources/{id}/resources': {
            get: {
              responses: {
                200: {
                  schema: {
                    properties: {
                      page: {
                        properties: {
                          after: { type: 'string' },
                          before: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if page is invalid', async function () {
      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources': {
            get: {
              responses: {
                200: {
                  schema: {
                    properties: {
                      page: {
                        properties: {
                          current: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/resources', 'get', 'responses', '200', 'schema', 'properties', 'page'], // due to oneOf
        ['paths', '/resources', 'get', 'responses', '200', 'schema', 'properties', 'page', 'properties']
      ]

      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })

    it('should return an error if page mixes index and cursor pagination', async function () {
      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources': {
            get: {
              responses: {
                200: {
                  schema: {
                    properties: {
                      page: {
                        properties: {
                          pageNumber: { type: 'number' },
                          after: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/resources', 'get', 'responses', '200', 'schema', 'properties', 'page'],
        ['paths', '/resources', 'get', 'responses', '200', 'schema', 'properties', 'page', 'properties']
      ]

      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  // Checks that all rules have been tested
  describe(rulesetFullyTestedSuiteName(this), function () {
    it('should return no untested rule', function () {
      spectralTestWrapper.checkAllRulesHaveBeenTest()
    })
  })
})

const { loadRuleset, SEVERITY, ruleset, rule, isNotRulesetFullyTestedTestSuite, rulesetFullyTestedSuiteName } = require('./common/SpectralTestWrapper.js')

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

  describe('response-schema-is-an-object', function () {
    it('should ignore 204 and 3xx response schema', async function () {
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                204: { description: 'ok' },
                302: { description: 'go elsewhere' }
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if 2xx, 4xx, 5xx response schema is defined', async function () {
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                200: { schema: {} },
                201: { schema: {} },
                202: { schema: {} },
                400: { schema: {} },
                401: { schema: {} },
                403: { schema: {} },
                404: { schema: {} },
                500: { schema: {} }
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if 2xx, 4xx, 5xx response schema is not defined', async function () {
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
      const errorPaths = [
        ['paths', '/some/path', 'anymethod', 'responses', '200'],
        ['paths', '/some/path', 'anymethod', 'responses', '201'],
        ['paths', '/some/path', 'anymethod', 'responses', '202'],
        ['paths', '/some/path', 'anymethod', 'responses', '400'],
        ['paths', '/some/path', 'anymethod', 'responses', '401'],
        ['paths', '/some/path', 'anymethod', 'responses', '403'],
        ['paths', '/some/path', 'anymethod', 'responses', '404'],
        ['paths', '/some/path', 'anymethod', 'responses', '500']
      ]
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })

    it('should return no error if 2xx, 4xx, 5xx response is an object', async function () {
      const document = {
        paths: {
          '/some/path': {
            get: {
              responses: {
                200: { schema: { type: 'object' } },
                201: { schema: { type: 'object' } },
                202: { schema: { type: 'object' } },
                400: { schema: { type: 'object' } },
                401: { schema: { type: 'object' } },
                403: { schema: { type: 'object' } },
                404: { schema: { type: 'object' } },
                500: { schema: { type: 'object' } }
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if 2xx, 4xx, 5xx response is not an object (array or string for example)', async function () {
      const document = {
        paths: {
          '/some/path': {
            get: {
              responses: {
                200: { schema: { type: 'array' } },
                201: { schema: { type: 'array' } },
                202: { schema: { type: 'array' } },
                400: { schema: { type: 'string' } },
                401: { schema: { type: 'string' } },
                403: { schema: { type: 'string' } },
                404: { schema: { type: 'string' } },
                500: { schema: { type: 'number' } }
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
  })

  describe('response-schema-is-not-defined-for-204-or-3xx', function () {
    it('should ignore 2xx other than 204, 4xx and 5xx response schema', async function () {
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                200: { schema: {} },
                201: { schema: {} },
                202: { schema: {} },
                400: { schema: {} },
                401: { schema: {} },
                403: { schema: {} },
                404: { schema: {} },
                500: { schema: {} }
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
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

    it('should return an error if 204 or 3xx response schema is defined', async function () {
      const document = {
        paths: {
          '/some/path': {
            anymethod: {
              responses: {
                204: { schema: {} },
                301: { schema: {} },
                302: { schema: {} },
                303: { schema: {} }
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
                200: { description: "ok" }
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

    const validSchemaItemsOnly = {
      required: ['items'],
      properties: {
        items: {
          type: 'array',
          items: {}
        }
      }
    }

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

    const invalidSchema = {
      properties: {
        something: {
          type: 'string'
        }
      }
    }

    it('should ignore get unitary resource 200 response', async function () {
      const pathObject = {
        get: {
          responses: {
            200: { 
              schema: invalidSchema
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
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should ignore post collection 200 response', async function () {
      const pathObject = {
        post: {
          responses: {
            200: { 
              schema: invalidSchema
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
          '/resources/{id}-{composite}/resources': pathObject,
          '/resources/magic/resources': pathObject,
          '/resources/{id}/resources/{anotherId}/resources': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources': pathObject,
          '/resources/{id}/resources/magic/resources': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should ignore any put, patch, delete 200 response', async function () {
      const pathObject = {
        put: {
          responses: {
            200: { 
              schema: invalidSchema
            } 
          }
        },
        patch: {
          responses: {
            200: { 
              schema: invalidSchema
            } 
          }
        },
        delete: {
          responses: {
            200: { 
              schema: invalidSchema
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
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if a get collection 200 response is an object containing an items list', async function () {
      const pathObject = {
        get: {
          responses: {
            200: {
              schema: validSchemaItemsOnly
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
          '/resources/{id}-{composite}/resources': pathObject,
          '/resources/magic/resources': pathObject,
          '/resources/{id}/resources/{anotherId}/resources': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources': pathObject,
          '/resources/{id}/resources/magic/resources': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if a get collection 200 response is an object with items optional additionalInformation or page', async function () {
      const pathObject = {
        get: {
          responses: {
            200: {
              schema: validSchemaFull
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
          '/resources/{id}-{composite}/resources': pathObject,
          '/resources/magic/resources': pathObject,
          '/resources/{id}/resources/{anotherId}/resources': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources': pathObject,
          '/resources/{id}/resources/magic/resources': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if a post /search 200 response is an object containing an items list', async function () {
      const pathObject = {
        post: {
          responses: {
            200: {
              schema: validSchemaItemsOnly
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
          '/resources/{id}-{composite}/resources/search': pathObject,
          '/resources/magic/resources/search': pathObject,
          '/resources/{id}/resources/{anotherId}/resources/search': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources/search': pathObject,
          '/resources/{id}/resources/magic/resources/search': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if a post /search 200 response is an object with items optional additionalInformation or page', async function () {
      const pathObject = {
        post: {
          responses: {
            200: {
              schema: validSchemaFull
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
          '/resources/{id}-{composite}/resources/search': pathObject,
          '/resources/magic/resources/search': pathObject,
          '/resources/{id}/resources/{anotherId}/resources/search': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources/search': pathObject,
          '/resources/{id}/resources/magic/resources/search': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if a get collection 200 response is not an object containing an items list', async function () {
      const pathObject = {
        get: {
          responses: {
            200: {
              schema: invalidSchema
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
          '/resources/{id}-{composite}/resources': pathObject,
          '/resources/magic/resources': pathObject,
          '/resources/{id}/resources/{anotherId}/resources': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources': pathObject,
          '/resources/{id}/resources/magic/resources': pathObject
        }
      }

      const errorPaths = [
        [ 'paths', '/name/v1/resources', 'get', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/v1/resources', 'get', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources', 'get', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}/resources', 'get', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}-{composite}/resources', 'get', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/magic/resources', 'get', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}/resources/{anotherId}/resources', 'get', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}/resources/{anotherId}-{composite}/resources', 'get', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}/resources/magic/resources', 'get', 'responses', '200', 'schema', 'properties']
      ]

      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })

    it('should return an error if a post /search 200 response is not an object containing an items list', async function () {
      const pathObject = {
        post: {
          responses: {
            200: {
              schema: invalidSchema
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
          '/resources/{id}-{composite}/resources/search': pathObject,
          '/resources/magic/resources/search': pathObject,
          '/resources/{id}/resources/{anotherId}/resources/search': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources/search': pathObject,
          '/resources/{id}/resources/magic/resources/search': pathObject
        }
      }

      const errorPaths = [
        [ 'paths', '/name/v1/resources/search', 'post', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/v1/resources/search', 'post', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/search', 'post', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}/resources/search', 'post', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}-{composite}/resources/search', 'post', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/magic/resources/search', 'post', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}/resources/{anotherId}/resources/search', 'post', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}/resources/{anotherId}-{composite}/resources/search', 'post', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}/resources/magic/resources/search', 'post', 'responses', '200', 'schema', 'properties']
      ]

      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })

    it('should return an error if a get collection 200 response contains unexpected properties besides items, additionalInformation or page', async function () {
      const pathObject = {
        get: {
          responses: {
            200: {
              schema: invalidSchemaUnexpectedProperties
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
          '/resources/{id}-{composite}/resources': pathObject,
          '/resources/magic/resources': pathObject,
          '/resources/{id}/resources/{anotherId}/resources': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources': pathObject,
          '/resources/{id}/resources/magic/resources': pathObject
        }
      }

      const errorPaths = [
        [ 'paths', '/name/v1/resources', 'get', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/v1/resources', 'get', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources', 'get', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}/resources', 'get', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}-{composite}/resources', 'get', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/magic/resources', 'get', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}/resources/{anotherId}/resources', 'get', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}/resources/{anotherId}-{composite}/resources', 'get', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}/resources/magic/resources', 'get', 'responses', '200', 'schema', 'properties']
      ]

      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })

    it('should return an error if a post /search 200 response contains unexpected properties besides items, additionalInformation or page', async function () {
      const pathObject = {
        post: {
          responses: {
            200: {
              schema: invalidSchemaUnexpectedProperties
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
          '/resources/{id}-{composite}/resources/search': pathObject,
          '/resources/magic/resources/search': pathObject,
          '/resources/{id}/resources/{anotherId}/resources/search': pathObject,
          '/resources/{id}/resources/{anotherId}-{composite}/resources/search': pathObject,
          '/resources/{id}/resources/magic/resources/search': pathObject
        }
      }

      const errorPaths = [
        [ 'paths', '/name/v1/resources/search', 'post', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/v1/resources/search', 'post', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/search', 'post', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}/resources/search', 'post', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}-{composite}/resources/search', 'post', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/magic/resources/search', 'post', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}/resources/{anotherId}/resources/search', 'post', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}/resources/{anotherId}-{composite}/resources/search', 'post', 'responses', '200', 'schema', 'properties'],
        [ 'paths', '/resources/{id}/resources/magic/resources/search', 'post', 'responses', '200', 'schema', 'properties']
      ]

      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })

  })

  describe('response-collection-items-schema-is-valid', function () {
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

    const validSchemaItemsImplicitObject = {
      required: ['items'],
      properties: {
        items: {}
      }
    }

    const validSchemaItemsExplicitObject = {
      required: ['items'],
      properties: {
        items: {
          type: 'object'
        }
      }
    }

    it('should return no error get collection items is an implicit object list', async function () {
      const pathObject = {
        get: {
          responses: {
            200: {
              schema: validSchemaItemsImplicitObject
            }
          }
        }
      }

      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources': pathObject,
          '/resources/{id}/resources': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if post /search items is an implicit object list', async function () {
      const pathObject = {
        post: {
          responses: {
            200: {
              schema: validSchemaItemsImplicitObject
            }
          }
        }
      }

      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources/search': pathObject,
          '/resources/{id}/resources/search': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error get collection items is an explicit object list', async function () {
      const pathObject = {
        get: {
          responses: {
            200: {
              schema: validSchemaItemsExplicitObject
            }
          }
        }
      }

      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources': pathObject,
          '/resources/{id}/resources': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if post /search items is an explicit object list', async function () {
      const pathObject = {
        post: {
          responses: {
            200: {
              schema: validSchemaItemsExplicitObject
            }
          }
        }
      }

      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources/search': pathObject,
          '/resources/{id}/resources/search': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if a get collection 200 items is not an object list', async function () {
      const pathObject = {
        get: {
          responses: {
            200: {
              schema: invalidSchemaItems
            }
          }
        }
      }

      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources': pathObject,
          '/resources/{id}/resources': pathObject
        }
      }

      const errorPaths = [
        ['paths', '/resources', 'get', 'responses', '200', 'schema', 'properties', 'items', 'items', 'type'],
        ['paths', '/resources/{id}/resources', 'get', 'responses', '200', 'schema', 'properties', 'items', 'items', 'type']
      ]

      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })

    it('should return an error if a post /search 200 items is not an object list', async function () {
      const pathObject = {
        post: {
          responses: {
            200: {
              schema: invalidSchemaItems
            }
          }
        }
      }

      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources/search': pathObject,
          '/resources/{id}/resources/search': pathObject
        }
      }

      const errorPaths = [
        ['paths', '/resources/search', 'post', 'responses', '200', 'schema', 'properties', 'items', 'items', 'type'],
        ['paths', '/resources/{id}/resources/search', 'post', 'responses', '200', 'schema', 'properties', 'items', 'items', 'type']
      ]

      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('response-collection-additional-information-schema-is-valid', function () {
    const invalidSchemaAdditional = {
      properties: {
        additionalInformation: {
          type: 'string'
        }
      }
    }

    const validSchemaAdditionalImplicitObject = {
      properties: {
        additionalInformation: {}
      }
    }

    const validSchemaAdditionalExplicitObject = {
      properties: {
        additionalInformation: {
          type: 'object'
        }
      }
    }

    it('should return no error get collection additionalInformation is an implicit object', async function () {
      const pathObject = {
        get: {
          responses: {
            200: {
              schema: validSchemaAdditionalImplicitObject
            }
          }
        }
      }

      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources': pathObject,
          '/resources/{id}/resources': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if post /search additionalInformation is an implicit object', async function () {
      const pathObject = {
        post: {
          responses: {
            200: {
              schema: validSchemaAdditionalImplicitObject
            }
          }
        }
      }

      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources/search': pathObject,
          '/resources/{id}/resources/search': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error get collection additionalInformation is an explicit object', async function () {
      const pathObject = {
        get: {
          responses: {
            200: {
              schema: validSchemaAdditionalExplicitObject
            }
          }
        }
      }

      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources': pathObject,
          '/resources/{id}/resources': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if post /search additionalInformation is an explicit object', async function () {
      const pathObject = {
        post: {
          responses: {
            200: {
              schema: validSchemaAdditionalExplicitObject
            }
          }
        }
      }

      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources/search': pathObject,
          '/resources/{id}/resources/search': pathObject
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if a get collection 200 additionalInformation is not an object', async function () {
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
          '/resources': pathObject,
          '/resources/{id}/resources': pathObject
        }
      }

      const errorPaths = [
        ['paths', '/resources', 'get', 'responses', '200', 'schema', 'properties', 'additionalInformation', 'type'],
        ['paths', '/resources/{id}/resources', 'get', 'responses', '200', 'schema', 'properties', 'additionalInformation', 'type']
      ]

      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })

    it('should return an error if a post /search 200 additionalInformation is not an object', async function () {
      const pathObject = {
        post: {
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
          '/resources/search': pathObject,
          '/resources/{id}/resources/search': pathObject
        }
      }

      const errorPaths = [
        ['paths', '/resources/search', 'post', 'responses', '200', 'schema', 'properties', 'additionalInformation', 'type'],
        ['paths', '/resources/{id}/resources/search', 'post', 'responses', '200', 'schema', 'properties', 'additionalInformation', 'type']
      ]

      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('response-collection-page-schema-is-valid', function() {

    it('should return no error if get collection page is valid index pagination', async function () {
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
                          pageSize: { type: 'number' }
                        }
          }}}}}}},
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
            }}}}}}}
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if post /search page is valid index pagination', async function () {
      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources/search': {
            post: {
              responses: {
                200: {
                  schema: {
                    properties: {
                      page: {
                        properties: {
                          pageNumber: { type: 'number' },
                          pageSize: { type: 'number' }
                        }
            }}}}}}},
          '/resources/{id}/resources/search': {
            post: {
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
            }}}}}}}
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if get collection page is valid cursor pagination', async function () {
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
            }}}}}}},
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
            }}}}}}}
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if post /search page is valid cursor pagination', async function () {
      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources/search': {
            post: {
              responses: {
                200: {
                  schema: {
                    properties: {
                      page: {
                        properties: {
                          after: { type: 'string' }
                        }
            }}}}}}},
          '/resources/{id}/resources/search': {
            post: {
              responses: {
                200: {
                  schema: {
                    properties: {
                      page: {
                        properties: {
                          after: { type: 'string' },
                          before: { type: 'string' }
                        }
            }}}}}}}
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if get collection page is invalid', async function () {
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
            }}}}}}}
        }
      }
      const errorPaths = [
        ['paths', '/resources', 'get', 'responses', '200', 'schema', 'properties', 'page'], // due to oneOf
        ['paths', '/resources', 'get', 'responses', '200', 'schema', 'properties', 'page', 'properties']
      ]

      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })

    it('should return an error if post /search page is invalid', async function () {
      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources/search': {
            post: {
              responses: {
                200: {
                  schema: {
                    properties: {
                      page: {
                        properties: {
                          current: { type: 'number' }
                        }
            }}}}}}}
        }
      }
      const errorPaths = [
        ['paths', '/resources/search', 'post', 'responses', '200', 'schema', 'properties', 'page'], // due to oneOf
        ['paths', '/resources/search', 'post', 'responses', '200', 'schema', 'properties', 'page', 'properties']
      ]

      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })

    it('should return an error if get collection page mixes index and cursor pagination', async function () {
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
            }}}}}}}
        }
      }
      const errorPaths = [
        ['paths', '/resources', 'get', 'responses', '200', 'schema', 'properties', 'page'],
        ['paths', '/resources', 'get', 'responses', '200', 'schema', 'properties', 'page', 'properties']
      ]

      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })

    it('should return an error if post /search page mixes index and cursor pagination', async function () {
      // Note: path filter regex already tested in response-collection-schema-is-valid
      const document = {
        paths: {
          '/resources/search': {
            post: {
              responses: {
                200: {
                  schema: {
                    properties: {
                      page: {
                        properties: {
                          pageNumber: { type: 'number' },
                          after: { type: 'string' }
                        }
            }}}}}}}
        }
      }
      const errorPaths = [
        ['paths', '/resources/search', 'post', 'responses', '200', 'schema', 'properties', 'page'],
        ['paths', '/resources/search', 'post', 'responses', '200', 'schema', 'properties', 'page', 'properties']
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

const linterTestSuite = require('./common/linter-test-suite.js')

describe('security', function () {
  linterTestSuite.initialize()

  describe('security-rules-defined-oas2', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas2)

    it('should return no error if securityDefinitions is defined', async function () {
      const document = {
        securityDefinitions: {}
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if securityDefinitions is not defined', async function () {
      const document = {}
      const errorPaths = [
        []
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('security-rules-defined-oas3', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3)

    it('should return no error if securitySchemes is defined', async function () {
      const document = {
        components: {
          securitySchemes: {}
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if components is not defined', async function () {
      const document = {}
      const errorPaths = [
        []
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if components.securitySchemes is not defined', async function () {
      const document = {
        components: {}
      }
      const errorPaths = [
        ['components']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('security-types-authorized', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should check oas2 securityDefinitions', function () {
      const document = {
        securityDefinitions: {
          definition: {}
        }
      }
      const expectedPaths = [
        ['securityDefinitions', 'definition']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should check oas3 securitySchemes', function () {
      const document = {
        components: {
          securitySchemes: {
            scheme: {}
          }
        }
      }
      const expectedPaths = [
        ['components', 'securitySchemes', 'scheme']
      ]
      const givenIndex = 1
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if security type is apiKey or oauth2', async function () {
      const document = {
        components: {
          securitySchemes: {
            apiKeyScheme: {
              type: 'apiKey'
            },
            oauthScheme: {
              type: 'oauth2'
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if security type is not apiKey or oauth2', async function () {
      const document = {
        components: {
          securitySchemes: {
            scheme: {
              type: 'not apiKey or oauth2'
            }
          }
        }
      }
      const errorPaths = [
        ['components', 'securitySchemes', 'scheme', 'type']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('security-definitions-oauth-scopes-defined', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should ignore non auth2 oas2 securityDefinitions', function () {
      const document = {
        securityDefinitions: {
          definition: {
            type: 'nonOauth'
          }
        }
      }
      const givenIndex = 0
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should ignore non auth2 oas3 securitySchemes', function () {
      const document = {
        components: {
          securitySchemes: {
            scheme: {
              type: 'nonOauth'
            }
          }
        }
      }
      const givenIndex = 1
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should check oas2 oauth2 security definitions scopes', function () {
      const document = {
        securityDefinitions: {
          definition: {
            type: 'oauth2'
          }
        }
      }
      const expectedPaths = [
        ['securityDefinitions', 'definition']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should check oas2 oauth2 security definitions scopes', function () {
      const document = {
        components: {
          securitySchemes: {
            scheme: {
              type: 'oauth2',
              flows: {
                flow: {}
              }
            }
          }
        }
      }
      const expectedPaths = [
        ['components', 'securitySchemes', 'scheme', 'flows', 'flow']
      ]
      const givenIndex = 1
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if scopes is defined and not empty', async function () {
      const document = {
        components: {
          securitySchemes: {
            scheme: {
              type: 'oauth2',
              flows: {
                flow: {
                  scopes: {
                    scope: 'description'
                  }
                }
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if scopes is not defined', async function () {
      const document = {
        components: {
          securitySchemes: {
            scheme: {
              type: 'oauth2',
              flows: {
                flow: {}
              }
            }
          }
        }
      }
      const errorPaths = [
        ['components', 'securitySchemes', 'scheme', 'flows', 'flow']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if scopes is empty', async function () {
      const document = {
        components: {
          securitySchemes: {
            scheme: {
              type: 'oauth2',
              flows: {
                flow: {
                  scopes: {}
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['components', 'securitySchemes', 'scheme', 'flows', 'flow', 'scopes']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('security-no-api-level', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if API level security is not defined', async function () {
      const document = {}
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if API level security is defined', async function () {
      const document = {
        security: {}
      }
      const errorPaths = [
        ['security']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('security-operation-defined', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should ignore path parameters and x-tension', function () {
      const document = {
        paths: {
          path: {
            parameters: [],
            'x-something': {}
          }
        }
      }
      const givenIndex = undefined
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should check all HTTP methods', function () {
      const document = {
        paths: {
          path: {
            get: {},
            post: {},
            put: {},
            patch: {},
            delete: {}
          }
        }
      }
      const expectedPaths = [
        ['paths', 'path', 'get'],
        ['paths', 'path', 'post'],
        ['paths', 'path', 'put'],
        ['paths', 'path', 'patch'],
        ['paths', 'path', 'delete']
      ]
      const givenIndex = undefined
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if security is defined and not empty at operation level', async function () {
      const document = {
        paths: {
          path: {
            get: {
              security: [
                { scheme: [] }
              ]
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if security is not defined at operation level', async function () {
      const document = {
        paths: {
          path: {
            get: {}
          }
        }
      }
      const errorPaths = [
        ['paths', 'path', 'get']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if security is defined at operation level but empty', async function () {
      const document = {
        paths: {
          path: {
            get: {
              security: []
            }
          }
        }
      }
      const errorPaths = [
        ['paths', 'path', 'get', 'security']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  linterTestSuite.finalize()
})
const linterTestSuite = require('./common/linter-test-suite.js')

describe('basepath', function () {
  linterTestSuite.initialize()

  describe('basepath-defined-oas2', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas2)

    it('should ignore missing basepath in oas3 document', async function () {
      const document = {
        openapi: '3.0'
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if basepath is defined in oas2 document', async function () {
      const document = {
        swagger: '2.0',
        basePath: '/someBasePath'
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if basepath is not defined in oas2 document', async function () {
      const document = {
        swagger: '2.0'
      }
      const errorPaths = []
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('basepath-defined-oas3', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3)

    it('should ignore missing servers[0].url in oas2 document', async function () {
      const document = {
        swagger: '2.0'
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if servers[0].url is defined in oas3 document', async function () {
      const document = {
        openapi: '3.0',
        servers: [{ url: '/someBasePath' }]
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if servers[0].url is not defined in oas3 document', async function () {
      const document = {
        openapi: '3.0'
      }
      const errorPaths = []
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('basepath-valid-structure', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if oas2 basepath is /name/v2', async function () {
      const document = {
        basePath: '/name/v2'
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if oas2 basepath is /some-name/v22', async function () {
      const document = {
        basePath: '/some-name/v22'
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if oas2 basepath is /some_name/v22', async function () {
      const document = {
        basePath: '/some_name/v22'
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if oas2 basepath is /someName/v1', async function () {
      const document = {
        basePath: '/someName/v1'
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if oas2 basepath is /nameWithoutVersion', async function () {
      const document = {
        basePath: '/nameWithoutVersion'
      }
      const errorPaths = ['basePath']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if oas2 basepath is /v1', async function () {
      const document = {
        basePath: '/v1'
      }
      const errorPaths = ['basePath']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return no error if oas3 server url has a valid structure (no need to check all regex cases again)', async function () {
      const document = {
        servers: [
          { url: '/someName/v1' }
        ]
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if oas3 server url has an invalid structure (no need to check all regex cases again)', async function () {
      const document = {
        servers: [
          { url: '/nameWithoutVersion' }
        ]
      }
      const errorPaths = ['servers', '0', 'url']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('basepath-lowerCamelCased', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should not return no error if oas2 basepath is /lowerCamelCased', async function () {
      const document = {
        basePath: '/lowerCamelCased'
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should not return no error if oas2 basepath is /v1', async function () {
      const document = {
        basePath: '/v1'
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should not return no error if oas2 basepath is /lowerCamelCased/v1', async function () {
      const document = {
        basePath: '/lowerCamelCased/v1'
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if oas2 basepath is /NotLowerCamelCased', async function () {
      const document = {
        basePath: '/NotLowerCamelCased'
      }
      const errorPaths = ['basePath']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if oas2 basepath is /V1', async function () {
      const document = {
        basePath: '/V1'
      }
      const errorPaths = ['basePath']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if oas2 basepath is /NotLowerCamelCased/V1', async function () {
      const document = {
        basePath: '/NotLowerCamelCased/V1'
      }
      const errorPaths = ['basePath']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return no error if oas3 server url is lowerCamelCased (no need to check all regex cases again)', async function () {
      const document = {
        servers: [
          { url: '/lowerCamelCased/v1' }
        ]
      }

      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if oas3 server url is not lowerCamelCased (no need to check all regex cases again)', async function () {
      const document = {
        servers: [
          { url: '/NotLowerCamelCased/V1' }
        ]
      }
      const errorPaths = ['servers', '0', 'url']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('basepath-no-trailing-slash', async function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if oas2 basepath has no trailing slash', async function () {
      const document = {
        basePath: '/no-trailing-slash'
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if oas2 basepath has a trailing slash', async function () {
      const document = {
        basePath: '/forbidden-trailing-slash/'
      }
      const errorPaths = ['basePath']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if oas2 basepath is just slash', async function () {
      const document = {
        basePath: '/'
      }
      const errorPaths = ['basePath']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return no error if oas3 server url has no trailing slash', async function () {
      const document = {
        servers: [{ url: '/no-trailing-slash' }]
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if oas3 server url has a trailing slash (no need to check all regex cases again)', async function () {
      const document = {
        servers: [{ url: '/forbidden-trailing-slash/' }]
      }
      const errorPaths = ['servers', '0', 'url']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('basepath-no-api', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if oas2 basepath does not contain api', async function () {
      const document = {
        basePath: '/some/path'
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if oas2 basepath contains api', async function () {
      const document = {
        basePath: '/api/path'
      }
      const errorPaths = ['basePath']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return no error if oas3 server url does not contain api', async function () {
      const document = {
        servers: [{ url: '/some/path' }]
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if oas3 server url contains api', async function () {
      const document = {
        servers: [{ url: '/api/path' }]
      }
      const errorPaths = ['servers', '0', 'url']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('basepath-not-in-path', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if path does not contain basepath', async function () {
      const document = {
        paths: {
          '/some/path': {}
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if path contains basepath', async function () {
      const document = {
        paths: {
          '/someName/v1/some/path': {}
        }
      }
      const errorPaths = ['paths', '/someName/v1/some/path']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('basepath-version-not-in-path', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if path does not contain version', async function () {
      const document = {
        paths: {
          '/some/path': {}
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if path contains version', async function () {
      const document = {
        paths: {
          '/v1/some/path': {}
        }
      }
      const errorPaths = ['paths', '/v1/some/path']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  linterTestSuite.finalize()
})

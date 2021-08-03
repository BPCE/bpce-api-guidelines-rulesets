const linterTestSuite = require('./common/linter-test-suite.js')

describe('basepath', function () {
  linterTestSuite.initialize()

  describe('basepath-defined-oas2', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas2)

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

    it('should return no error if servers is defined and not empty', async function () {
      const document = {
        openapi: '3.0',
        servers: [{ url: '/someBasePath' }]
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if servers is not defined', async function () {
      const document = {
        openapi: '3.0'
      }
      const errorPaths = []
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if servers is empty', async function () {
      const document = {
        openapi: '3.0',
        servers: []
      }
      const errorPaths = [
        ['servers']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  function checkBasePathGivenFound () {
    it('should check oas2 basePath', function () {
      const document = {
        basePath: ''
      }
      const expectedPaths = [
        ['basePath']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should check all oas3 servers urls', function () {
      const document = {
        servers: [
          { url: '' },
          { url: '' }
        ]
      }
      const expectedPaths = [
        ['servers', '0', 'url'],
        ['servers', '1', 'url']
      ]
      const givenIndex = 1
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })
  }

  describe('basepath-valid-structure', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkBasePathGivenFound()

    it('should return no error if base path has a valid structure', async function () {
      const document = {
        servers: [
          { url: '/name/v1' },
          { url: '/someName/v1' },
          { url: '/some_name/v22' },
          { url: '/some-name/v234' },
          { url: 'http://sldcfrgos942.intranet.fr/bamMonitoring/v2' }
        ]
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if base path has invalid structure', async function () {
      const document = {
        servers: [
          { url: '/nameWithoutVersion' },
          { url: '/v1' },
          { url: '/too/many/v1' },
          { url: 'http://sldcfrgos942.intranet.fr/nameWithoutVersion' },
          { url: 'http://sldcfrgos942.intranet.fr/v2' }
        ]
      }
      const errorPaths = [
        ['servers', '0', 'url'],
        ['servers', '1', 'url'],
        ['servers', '2', 'url'],
        ['servers', '3', 'url'],
        ['servers', '4', 'url']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('basepath-lowerCamelCased', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkBasePathGivenFound()

    it('should not return no error if base path is lowerCamelCased', async function () {
      const document = {
        servers: [
          { url: '/lowerCamelCased' },
          { url: '/lower' },
          { url: '/lower/lowerCamelCased' },
          { url: 'http://sldcfrgos942.intranet.fr/bamMonitoring/v2' },
          { url: 'http://SERVER.intranet.fr/bamMonitoring/v2' }
        ]
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if base path is not lowerCamelCased', async function () {
      const document = {
        servers: [
          { url: '/NotLowerCamelCased' },
          { url: '/Not' },
          { url: '/lower/NotLowerCamelCased' },
          { url: 'http://sldcfrgos942.intranet.fr/BAMMonitoring/v2' }
        ]
      }
      const errorPaths = [
        ['servers', '0', 'url'],
        ['servers', '1', 'url'],
        ['servers', '2', 'url'],
        ['servers', '3', 'url']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('basepath-no-trailing-slash', async function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkBasePathGivenFound()

    it('should return no error if basepath has no trailing slash', async function () {
      const document = {
        basePath: '/no-trailing-slash'
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if basepath has a trailing slash', async function () {
      const document = {
        basePath: '/forbidden-trailing-slash/'
      }
      const errorPaths = ['basePath']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if basepath is just slash', async function () {
      const document = {
        basePath: '/'
      }
      const errorPaths = ['basePath']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('basepath-no-api', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkBasePathGivenFound()

    it('should return no error if base path does not contain api', async function () {
      const document = {
        basePath: '/some/path'
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if base path contains api', async function () {
      const document = {
        basePath: '/api/path'
      }
      const errorPaths = ['basePath']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  function checkGivenPath () {
    it('should check paths', function () {
      const document = {
        paths: {}
      }
      const expectedPaths = [
        ['paths']
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })
  }

  describe('basepath-not-in-path', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    checkGivenPath()

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

    checkGivenPath()

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

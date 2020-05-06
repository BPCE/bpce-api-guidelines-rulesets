const linterTestSuite = require('./common/linter-test-suite.js')

describe('info', function () {
  linterTestSuite.initialize()

  describe('info-defined', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if info is defined', async function () {
      const document = {
        info: {}
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if info is not defined', async function () {
      const document = {}
      const errorPaths = []
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('info-name-defined', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if API name is defined in info', async function () {
      const document = {
        info: {
          title: 'some API name'
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if no API name is not defined in info', async function () {
      const document = {
        info: {}
      }
      const errorPaths = ['info']
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('info-name-not-contain-api', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if the API name does not contain api', async function () {
      const document = {
        info: {
          title: 'some name'
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if the API name contains API', async function () {
      const document = {
        info: {
          title: 'Some API name'
        }
      }
      const errorPaths = ['info', 'title']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if the API name contains Api', async function () {
      const document = {
        info: {
          title: 'Some Api name'
        }
      }
      const errorPaths = ['info', 'title']
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if the API name is API', async function () {
      const document = {
        info: {
          title: 'API'
        }
      }
      const errorPaths = ['info', 'title']
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('info-description-provided', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if API description is provided', async function () {
      const document = {
        info: {
          description: 'some description'
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if the API description is not provided', async function () {
      const document = {
        info: {}
      }
      const errorPaths = ['info']
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if the API description is empty', async function () {
      const document = {
        info: {
          description: ''
        }
      }
      const errorPaths = ['info', 'description']
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('info-description-valid-content', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return an error if the API description starts with "this API"', async function () {
      const document = {
        info: {
          description: 'this API allows to do something'
        }
      }
      const errorPaths = ['info', 'description']
      const errorSeverity = linterTestSuite.SEVERITY.info
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if the API description starts with "cette API"', async function () {
      const document = {
        info: {
          description: 'Cette API permet de faire des choses'
        }
      }
      const errorPaths = ['info', 'description']
      const errorSeverity = linterTestSuite.SEVERITY.info
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if the API description starts contains "web service"', async function () {
      const document = {
        info: {
          description: 'Some description talking about web services and a few other things'
        }
      }
      const errorPaths = ['info', 'description']
      const errorSeverity = linterTestSuite.SEVERITY.info
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if the API description starts contains "API"', async function () {
      const document = {
        info: {
          description: 'Some description talking about API and a few other things'
        }
      }
      const errorPaths = ['info', 'description']
      const errorSeverity = linterTestSuite.SEVERITY.info
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  linterTestSuite.finalize()
})

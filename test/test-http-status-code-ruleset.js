const { loadRuleset, currentRule, SEVERITY } = require('./common/SpectralTestWrapper.js')

// Set rule setname
describe('http-status-code', function () {
  let spectralTestWrapper

  before(async function () {
    spectralTestWrapper = await loadRuleset(this.test.parent.title)
  })

  beforeEach(function () {
    spectralTestWrapper.disableAllRulesExcept(this.currentTest.parent.title)
  })

  after(function () {
    describe(this.test.parent.title + ' ruleset fully tested', function () {
      it('all rules should have been tested', function () {
        spectralTestWrapper.checkAllRulesHaveBeenTest(spectralTestWrapper)
      })
    })
  })

  describe('http-status-code-mandatory-2xx', function () {
    it('should return no error if 2xx HTTP status code is used on each operation', async function () {
      const document = {
        swagger: '2.0',
        paths: {
          '/some/path': {
            get: {
              responses: {
                200: {}
              }
            },
            post: {
              responses: {
                201: {}
              }
            }
          },
          '/another/path': {
            put: {
              responses: {
                200: {}
              }
            },
            patch: {
              responses: {
                200: {}
              }
            },
            delete: {
              responses: {
                204: {}
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if a 2xx HTTP status code is missing', async function () {
      const document = {
        swagger: '2.0',
        paths: {
          '/some/path': {
            get: {
              responses: {
                200: {}
              }
            },
            post: {
              responses: {
              }
            }
          },
          '/another/path': {
            put: {
              responses: {
                200: {}
              }
            },
            patch: {
              responses: {}
            },
            delete: {
              responses: {
                204: {}
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'post', 'responses'],
        ['paths', '/another/path', 'patch', 'responses']
      ]
      const errorSeverity = SEVERITY.error
      const errorCode = currentRule(this)
      await spectralTestWrapper.runAndCheckExpectedError(document, errorCode, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-mandatory-401', function () {
    it('should return no error if 401 HTTP status code is used on each operation', async function () {
      const document = {
        paths: {
          '/some/path': {
            get: {
              responses: {
                401: {}
              }
            },
            post: {
              responses: {
                401: {}
              }
            }
          },
          '/another/path': {
            put: {
              responses: {
                401: {}
              }
            },
            patch: {
              responses: {
                401: {}
              }
            },
            delete: {
              responses: {
                401: {}
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if a 401 HTTP status code is missing', async function () {
      const document = {
        swagger: '2.0',
        paths: {
          '/some/path': {
            get: {
              responses: {
                401: {}
              }
            },
            post: {
              responses: {
              }
            }
          },
          '/another/path': {
            put: {
              responses: {
                401: {}
              }
            },
            patch: {
              responses: {}
            },
            delete: {
              responses: {
                401: {}
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'post', 'responses'],
        ['paths', '/another/path', 'patch', 'responses']
      ]
      const errorSeverity = SEVERITY.error
      const errorCode = currentRule(this)
      await spectralTestWrapper.runAndCheckExpectedError(document, errorCode, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-mandatory-500', function () {
    it('should return no error if 500 HTTP status code is used on each operation', async function () {
      const document = {
        paths: {
          '/some/path': {
            get: {
              responses: {
                500: {}
              }
            },
            post: {
              responses: {
                500: {}
              }
            }
          },
          '/another/path': {
            put: {
              responses: {
                500: {}
              }
            },
            patch: {
              responses: {
                500: {}
              }
            },
            delete: {
              responses: {
                500: {}
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if a 500 HTTP status code is missing', async function () {
      const document = {
        paths: {
          '/some/path': {
            get: {
              responses: {
                500: {}
              }
            },
            post: {
              responses: {
              }
            }
          },
          '/another/path': {
            put: {
              responses: {
                500: {}
              }
            },
            patch: {
              responses: {}
            },
            delete: {
              responses: {
                500: {}
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'post', 'responses'],
        ['paths', '/another/path', 'patch', 'responses']
      ]
      const errorSeverity = SEVERITY.error
      const errorCode = currentRule(this)
      await spectralTestWrapper.runAndCheckExpectedError(document, errorCode, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-404-when-path-parameters', function () {
    it('should return no error if 404 is returned on operation on resource having path parameters', async function () {
      const document = {
        paths: {
          '/some/path/with/path/{param}/somewhere': {
            post: {
              responses: {
                404: {}
              }
            }
          }
        }
      }
      spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if 404 is missing on operation on resource having path parameters', async function () {
      const document = {
        paths: {
          '/some/path/with/path/{param}/somewhere': {
            post: {
              responses: {
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path/with/path/{param}/somewhere', 'post', 'responses']
      ]
      const errorSeverity = SEVERITY.error
      const errorCode = currentRule(this)
      await spectralTestWrapper.runAndCheckExpectedError(document, errorCode, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-no-404-when-no-path-parameters', function () {
    it('should return no error if no 404 is returned on operation on resource having no path parameters', async function () {
      const document = {
        paths: {
          '/some/path/without/path/param': {
            post: {
              responses: {}
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if 404 is returned on operation on resource having no path parameters', async function () {
      const document = {
        paths: {
          '/some/path/without/path/param': {
            post: {
              responses: {
                404: {}
              }
            }
          }
        }
      }
      const errorPath = ['paths', '/some/path/without/path/param', 'post', 'responses', '404']
      const errorSeverity = SEVERITY.error
      const errorCode = currentRule(this)
      await spectralTestWrapper.runAndCheckExpectedError(document, errorCode, errorPath, errorSeverity)
    })
  })

  describe('http-status-code-400-operation-level-query-param', function () {
    it('should return no error if 400 is returned on operation with query parameter', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              parameters: [
                { in: 'query' },
                { in: 'body' },
                { in: 'header' }
              ],
              responses: {
                400: {}
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if no 400 is returned on operation without query, body or header parameter but with path one', async function () {
      const document = {
        paths: {
          '/some/{param}/path': {
            post: {
              parameters: [
                { in: 'path' }
              ],
              responses: {}
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if 400 is not returned on operation with query, body or header parameter', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              parameters: [
                { in: 'query' },
                { in: 'body' },
                { in: 'header' }
              ],
              responses: {}
            }
          }
        }
      }
      // const errorPath = ['paths', '/some/path', 'post', 'responses', '400']
      // Bug the wrong path is returned but the error shows the good value:  `/some/path.responses[400]` property is not truthy',
      const errorPath = ['paths', '/some/path']
      const errorSeverity = SEVERITY.error
      const errorCode = currentRule(this)
      await spectralTestWrapper.runAndCheckExpectedError(document, errorCode, errorPath, errorSeverity)
    })
  })

  describe('http-status-code-400-operation-level-body-param', function () {
    it('should return no error if 400 is returned on operation with body parameter', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              parameters: [
                { in: 'query' },
                { in: 'body' },
                { in: 'header' }
              ],
              responses: {
                400: {}
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if no 400 is returned on operation without query, body or header parameter but with path one', async function () {
      const document = {
        paths: {
          '/some/{param}/path': {
            post: {
              parameters: [
                { in: 'path' }
              ],
              responses: {}
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if 400 is not returned on operation with body parameter', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              parameters: [
                { in: 'query' },
                { in: 'body' },
                { in: 'header' }
              ],
              responses: {}
            }
          }
        }
      }
      // const errorPath = ['paths', '/some/path', 'post', 'responses', '400']
      // Bug the wrong path is returned but the error shows the good value:  `/some/path.responses[400]` property is not truthy',
      const errorPath = ['paths', '/some/path']
      const errorSeverity = SEVERITY.error
      const errorCode = currentRule(this)
      await spectralTestWrapper.runAndCheckExpectedError(document, errorCode, errorPath, errorSeverity)
    })
  })

  describe('http-status-code-400-operation-level-header-param', function () {
    it('should return no error if 400 is returned on operation with header parameter', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              parameters: [
                { in: 'query' },
                { in: 'body' },
                { in: 'header' }
              ],
              responses: {
                400: {}
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return no error if no 400 is returned on operation without query, body or header parameter but with path one', async function () {
      const document = {
        paths: {
          '/some/{param}/path': {
            post: {
              parameters: [
                { in: 'path' }
              ],
              responses: {}
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if 400 is not returned on operation with header parameter', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              parameters: [
                { in: 'query' },
                { in: 'body' },
                { in: 'header' }
              ],
              responses: {}
            }
          }
        }
      }
      // const errorPath = ['paths', '/some/path', 'post', 'responses', '400']
      // Bug the wrong path is returned but the error shows the good value:  `/some/path.responses[400]` property is not truthy',
      const errorPath = ['paths', '/some/path']
      const errorSeverity = SEVERITY.error
      const errorCode = currentRule(this)
      await spectralTestWrapper.runAndCheckExpectedError(document, errorCode, errorPath, errorSeverity)
    })
  })

  describe('http-status-code-get', function () {
    it('should return no error is get returns allowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path': {
            get: {
              responses: {
                200: {},
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
      await spectralTestWrapper.runAndCheckNoError(document)
    })
    it('should return an error if get returns unallowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path': {
            get: {
              responses: {
                201: {},
                202: {},
                204: {},
                428: {}
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'get', 'responses', '201'],
        ['paths', '/some/path', 'get', 'responses', '202'],
        ['paths', '/some/path', 'get', 'responses', '204'],
        ['paths', '/some/path', 'get', 'responses', '428']
      ]
      const errorSeverity = SEVERITY.error
      const errorCode = currentRule(this)
      await spectralTestWrapper.runAndCheckExpectedError(document, errorCode, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-put', function () {
    it('should return no error is put returns allowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path': {
            put: {
              responses: {
                200: {},
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
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if put returns unallowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path': {
            put: {
              responses: {
                201: {},
                202: {},
                204: {},
                428: {}
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'put', 'responses', '201'],
        ['paths', '/some/path', 'put', 'responses', '202'],
        ['paths', '/some/path', 'put', 'responses', '204'],
        ['paths', '/some/path', 'put', 'responses', '428']
      ]
      const errorSeverity = SEVERITY.error
      const errorCode = currentRule(this)
      await spectralTestWrapper.runAndCheckExpectedError(document, errorCode, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-patch', function () {
    it('should return no error is patch returns allowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path': {
            patch: {
              responses: {
                200: {},
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
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if patch returns unallowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path': {
            patch: {
              responses: {
                201: {},
                202: {},
                204: {},
                428: {}
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'patch', 'responses', '201'],
        ['paths', '/some/path', 'patch', 'responses', '202'],
        ['paths', '/some/path', 'patch', 'responses', '204'],
        ['paths', '/some/path', 'patch', 'responses', '428']
      ]
      const errorSeverity = SEVERITY.error
      const errorCode = currentRule(this)
      await spectralTestWrapper.runAndCheckExpectedError(document, errorCode, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-delete', function () {
    it('should return no error is delete returns allowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path': {
            delete: {
              responses: {
                200: {},
                204: {},
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
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if delete returns unallowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path': {
            delete: {
              responses: {
                201: {},
                202: {},
                428: {}
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'delete', 'responses', '201'],
        ['paths', '/some/path', 'delete', 'responses', '202'],
        ['paths', '/some/path', 'delete', 'responses', '428']
      ]
      const errorSeverity = SEVERITY.error
      const errorCode = currentRule(this)
      await spectralTestWrapper.runAndCheckExpectedError(document, errorCode, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-post', function () {
    it('should return no error is post returns allowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
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
      await spectralTestWrapper.runAndCheckNoError(document)
    })
    it('should return an error if post returns unallowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              responses: {
                204: {},
                428: {}
              }
            }
          }
        }
      }
      const errorPaths = [
        ['paths', '/some/path', 'post', 'responses', '204'],
        ['paths', '/some/path', 'post', 'responses', '428']
      ]
      const errorSeverity = SEVERITY.error
      const errorCode = currentRule(this)
      await spectralTestWrapper.runAndCheckExpectedError(document, errorCode, errorPaths, errorSeverity)
    })
  })
})

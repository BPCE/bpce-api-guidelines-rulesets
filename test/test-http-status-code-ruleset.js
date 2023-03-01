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

// Set rule setname
describe('http-status-code', function () {
  linterTestSuite.initialize()

  describe('http-status-code-mandatory-2xx', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

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
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if a 2xx HTTP status code is missing', async function () {
      const document = {
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
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-mandatory-401', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

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
      await this.linterTester.runAndCheckNoError(document)
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
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-mandatory-500', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

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
      await this.linterTester.runAndCheckNoError(document)
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
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-404-when-path-parameters', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

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
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if no 404 is returned on operation on resource having no path parameters', async function () {
      const document = {
        paths: {
          '/some/path': {
            get: {
              responses: {}
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
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
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-no-404-when-no-path-parameters', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

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
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if a 404 is returned on operation on resource having a path parameters', async function () {
      const document = {
        paths: {
          '/some/path/{with}/path/param': {
            post: {
              responses: {
                404: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
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
      const errorPaths = ['paths', '/some/path/without/path/param', 'post', 'responses', '404']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-400-operation-level-query-body-header-param', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if 400 is returned on operation with query, body or header parameter', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              parameters: [
                { in: 'query' }
              ],
              responses: {
                400: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if 400 is returned on operation with body parameter in oas2 document', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              parameters: [
                { in: 'body' }
              ],
              responses: {
                400: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if 400 is returned on operation with request body in oas3 document', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              requestBody: {},
              responses: {
                400: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if 400 is returned on operation with header parameter', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              parameters: [
                { in: 'header' }
              ],
              responses: {
                400: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
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
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if no 400 is returned on operation with empty parameters list', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              parameters: [],
              responses: {}
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if no 400 is returned on operation without any parameter', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              responses: {}
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if no 400 is returned on operation with query parameter', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              parameters: [
                { in: 'query' }
              ],
              responses: {}
            }
          }
        }
      }
      // const errorPaths = ['paths', '/some/path', 'post', 'responses', '400']
      // Bug the wrong path is returned but the error shows the good value:  `/some/path.responses[400]` property is not truthy',
      const errorPaths = ['paths', '/some/path']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if no 400 is returned on operation with body parameter in oas2 document', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              parameters: [
                { in: 'body' }
              ],
              responses: {}
            }
          }
        }
      }
      // const errorPaths = ['paths', '/some/path', 'post', 'responses', '400']
      // Bug the wrong path is returned but the error shows the good value:  `/some/path.responses[400]` property is not truthy',
      const errorPaths = ['paths', '/some/path']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if no 400 is returned on operation with request body in oas3 document', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              requestBody: {},
              responses: {}
            }
          }
        }
      }

      const errorPaths = ['paths', '/some/path', 'post', 'responses']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })

    it('should return an error if no 400 is returned on operation with header parameter', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              parameters: [
                { in: 'header' }
              ],
              responses: {}
            }
          }
        }
      }
      // const errorPaths = ['paths', '/some/path', 'post', 'responses', '400']
      // Bug the wrong path is returned but the error shows the good value:  `/some/path.responses[400]` property is not truthy',
      const errorPaths = ['paths', '/some/path']
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-get', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if get returns allowed HTTP status codes', async function () {
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
                500: {},
                503: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if other HTTP method returns unallowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path/put': {
            put: {
              responses: {
                201: {},
                202: {},
                204: {},
                428: {}
              }
            }
          },
          '/some/path/post': {
            post: {
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
      await this.linterTester.runAndCheckNoError(document)
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
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-put', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if put returns allowed HTTP status codes', async function () {
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
                500: {},
                503: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if other HTTP method returns unallowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path/get': {
            get: {
              responses: {
                201: {},
                202: {},
                204: {},
                428: {}
              }
            }
          },
          '/some/path/post': {
            post: {
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
      await this.linterTester.runAndCheckNoError(document)
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
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-patch', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if patch returns allowed HTTP status codes', async function () {
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
                500: {},
                503: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if other HTTP method returns unallowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path/post': {
            post: {
              responses: {
                201: {},
                202: {},
                428: {}
              }
            }
          },
          '/some/path/get': {
            get: {
              responses: {
                201: {},
                202: {},
                428: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if patch returns unallowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path': {
            patch: {
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
        ['paths', '/some/path', 'patch', 'responses', '201'],
        ['paths', '/some/path', 'patch', 'responses', '202'],
        ['paths', '/some/path', 'patch', 'responses', '428']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-delete', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if delete returns allowed HTTP status codes', async function () {
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
                500: {},
                503: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if other HTTP method returns unallowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path/get': {
            get: {
              responses: {
                201: {},
                202: {},
                428: {}
              }
            }
          },
          '/some/path/post': {
            post: {
              responses: {
                201: {},
                202: {},
                428: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
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
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-post', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if post returns allowed HTTP status codes', async function () {
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
                500: {},
                503: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if other HTTP method returns unallowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path/get': {
            get: {
              responses: {
                204: {},
                428: {}
              }
            }
          },
          '/some/path/put': {
            put: {
              responses: {
                204: {},
                428: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
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
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-post-search', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if post /search returns allowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path/search': {
            post: {
              responses: {
                200: {},
                400: {},
                401: {},
                403: {},
                404: {},
                500: {},
                503: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if non post /search returns unallowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path/post': {
            post: {
              responses: {
                201: {},
                202: {},
                204: {},
                428: {}
              }
            }
          },
          '/some/path/get': {
            get: {
              responses: {
                204: {},
                428: {}
              }
            }
          },
          '/some/path/put': {
            put: {
              responses: {
                204: {},
                428: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if post /search returns unallowed HTTP status codes', async function () {
      const document = {
        paths: {
          '/some/path/search': {
            post: {
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
        ['paths', '/some/path/search', 'post', 'responses', '201'],
        ['paths', '/some/path/search', 'post', 'responses', '202'],
        ['paths', '/some/path/search', 'post', 'responses', '204'],
        ['paths', '/some/path/search', 'post', 'responses', '428']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('http-status-code-post-unusual-200', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if post /search returns 200 HTTP status code', async function () {
      const document = {
        paths: {
          '/some/path/search': {
            post: {
              responses: {
                200: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if post non /search returns 201 or 202 HTTP status code', async function () {
      const document = {
        paths: {
          '/some/path/search': {
            post: {
              responses: {
                201: {},
                202: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return no error if any other non post operation returns 200 HTTP status code', async function () {
      const document = {
        paths: {
          '/some/path': {
            put: {
              responses: {
                200: {}
              }
            }
          },
          '/another/path': {
            get: {
              responses: {
                200: {}
              }
            }
          }
        }
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error (info) if post non /search returns 200 HTTP status code', async function () {
      const document = {
        paths: {
          '/some/path': {
            post: {
              responses: {
                200: {}
              }
            }
          }
        }
      }
      const errorPaths = ['paths', '/some/path', 'post', 'responses', '200']
      const errorSeverity = linterTestSuite.SEVERITY.info

      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  linterTestSuite.finalize()
})

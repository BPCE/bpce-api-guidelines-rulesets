const assert = require('assert')
const path = require('@stoplight/path')
const { SpectralTestWrapper } = require('./common/SpectralTestWrapper.js')
const testHelpers = require('./common/ruleset-test-helpers')

let spectral
const ruleset = 'http-status-codes'

before(async function () {
  spectral = new SpectralTestWrapper()
  await spectral.loadRuleset(path.join(__dirname, '../rulesets/' + ruleset + '-ruleset.yaml'))
})

describe(ruleset, function () {
  // Test Works for both Swagger 2.0 and OpenAPI 3 formats
  describe('operation-2xx-response', function () {
    before(function () {
      spectral.initRuleTest('operation-2xx-response')
    })

    after(function () {
      spectral.reset()
    })

    it('should return an error if no 2xx reponse for an operation', async function () {
      const document = {
        swagger: '2.0',
        paths: {
          '/somePath': {
            get: {
              responses: {}
            },
            post: {
              responses: {}
            }
          },
          '/anotherPath': {
            put: {
              responses: {}
            },
            patch: {
              responses: {}
            },
            delete: {
              responses: {}
            }
          }
        }
      }
      const results = await spectral.run(document)
      testHelpers.checkSameTypeErrors(
        results,
        'operation-2xx-response',
        [
          ['paths', '/somePath', 'get', 'responses'],
          ['paths', '/somePath', 'post', 'responses'],
          ['paths', '/anotherPath', 'put', 'responses'],
          ['paths', '/anotherPath', 'patch', 'responses'],
          ['paths', '/anotherPath', 'delete', 'responses']
        ],
        testHelpers.SEVERITY.error
      )
    })

    it('should not return an error if at least one 2xx response is defined for an operation', async function () {
      const document = {
        paths: {
          '/somePath': {
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
          '/anotherPath': {
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
      const results = await spectral.run(document)
      testHelpers.checkNoErrors(results)
    })
  })

  describe('mandatory-http-status-codes-401', function () {
    before(function () {
      spectral.initRuleTest('mandatory-http-status-codes-401')
    })

    after(function () {
      spectral.reset()
    })

    it('should return an error if 401 response is missing', async function () {
      const document = {
        paths: {
          '/somePath': {
            get: {
              responses: {}
            },
            post: {
              responses: {}
            }
          },
          '/anotherPath': {
            put: {
              responses: {}
            },
            patch: {
              responses: {}
            },
            delete: {
              responses: {}
            }
          }
        }
      }
      const results = await spectral.run(document)
      testHelpers.checkSameTypeErrors(
        results,
        'mandatory-http-status-codes-401',
        [
          ['paths', '/somePath', 'get', 'responses'],
          ['paths', '/somePath', 'post', 'responses'],
          ['paths', '/anotherPath', 'put', 'responses'],
          ['paths', '/anotherPath', 'patch', 'responses'],
          ['paths', '/anotherPath', 'delete', 'responses']
        ],
        testHelpers.SEVERITY.error
      )
    })

    it('should not return an error if 401 response is defined', async function () {
      const document = {
        paths: {
          '/somePath': {
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
          '/anotherPath': {
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
      const results = await spectral.run(document)
      testHelpers.checkNoErrors(results)
    })
  })

  describe('mandatory-http-status-codes-500', function () {
    before(function () {
      spectral.initRuleTest('mandatory-http-status-codes-500')
    })

    after(function () {
      spectral.reset()
    })

    it('should return an error if 500 response is missing', async function () {
      const document = {
        paths: {
          '/somePath': {
            get: {
              responses: {}
            },
            post: {
              responses: {}
            }
          },
          '/anotherPath': {
            put: {
              responses: {}
            },
            patch: {
              responses: {}
            },
            delete: {
              responses: {}
            }
          }
        }
      }
      const results = await spectral.run(document)
      testHelpers.checkSameTypeErrors(
        results,
        'mandatory-http-status-codes-500',
        [
          ['paths', '/somePath', 'get', 'responses'],
          ['paths', '/somePath', 'post', 'responses'],
          ['paths', '/anotherPath', 'put', 'responses'],
          ['paths', '/anotherPath', 'patch', 'responses'],
          ['paths', '/anotherPath', 'delete', 'responses']
        ],
        testHelpers.SEVERITY.error
      )
    })

    it('should not return an error if 500 response is defined', async function () {
      const document = {
        paths: {
          '/somePath': {
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
          '/anotherPath': {
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
      const results = await spectral.run(document)
      testHelpers.checkNoErrors(results)
    })
  })

  describe('allowed-http-status-codes-get', function () {
    before(function () {
      spectral.initRuleTest('allowed-http-status-codes-get')
    })

    after(function () {
      spectral.reset()
    })

    it('should return an error if unallowed response is defined', async function () {
      const document = {
        paths: {
          '/somePath': {
            get: {
              responses: {
                204: {},
                418: {},
                500: {}
              }
            }
          },
          '/anotherPath': {
            get: {
              responses: {
                200: {},
                401: {},
                508: {}
              }
            }
          }
        }
      }
      const results = await spectral.run(document)
      testHelpers.checkSameTypeErrors(
        results,
        'allowed-http-status-codes-get',
        [
          ['paths', '/somePath', 'get', 'responses', '204'],
          ['paths', '/somePath', 'get', 'responses', '418'],
          ['paths', '/anotherPath', 'get', 'responses', '508']
        ],
        testHelpers.SEVERITY.error
      )
    })

    it('should not return an error if only allowed responses are defined', async function () {
      const document = {
        paths: {
          '/somePath': {
            get: {
              responses: {
                200: {}, 400: {}, 401: {}, 403: {}, 404: {}, 500: {}
              }
            }
          },
          '/anotherPath': {
            get: {
              responses: {
                200: {}, 400: {}, 401: {}, 403: {}, 404: {}, 500: {}
              }
            }
          }
        }
      }
      const results = await spectral.run(document)
      testHelpers.checkNoErrors(results)
    })
  })

  describe('allowed-http-status-codes-put', function () {
    before(function () {
      spectral.initRuleTest('allowed-http-status-codes-put')
    })

    after(function () {
      spectral.reset()
    })

    it('should return an error if unallowed response is defined', async function () {
      const document = {
        paths: {
          '/somePath': {
            put: {
              responses: {
                204: {},
                418: {},
                500: {}
              }
            }
          },
          '/anotherPath': {
            put: {
              responses: {
                200: {},
                401: {},
                508: {}
              }
            }
          }
        }
      }
      const results = await spectral.run(document)
      testHelpers.checkSameTypeErrors(
        results,
        'allowed-http-status-codes-put',
        [
          ['paths', '/somePath', 'put', 'responses', '204'],
          ['paths', '/somePath', 'put', 'responses', '418'],
          ['paths', '/anotherPath', 'put', 'responses', '508']
        ],
        testHelpers.SEVERITY.error
      )
    })

    it('should not return an error if only allowed responses are defined', async function () {
      const document = {
        paths: {
          '/somePath': {
            put: {
              responses: {
                200: {}, 400: {}, 401: {}, 403: {}, 404: {}, 500: {}
              }
            }
          },
          '/anotherPath': {
            put: {
              responses: {
                200: {}, 400: {}, 401: {}, 403: {}, 404: {}, 500: {}
              }
            }
          }
        }
      }
      const results = await spectral.run(document)
      testHelpers.checkNoErrors(results)
    })
  })

  describe('allowed-http-status-codes-patch', function () {
    before(function () {
      spectral.initRuleTest('allowed-http-status-codes-patch')
    })

    after(function () {
      spectral.reset()
    })

    it('should return an error if unallowed response is defined', async function () {
      const document = {
        paths: {
          '/somePath': {
            patch: {
              responses: {
                204: {}, 418: {}, 500: {}
              }
            }
          },
          '/anotherPath': {
            patch: {
              responses: {
                200: {}, 401: {}, 508: {}
              }
            }
          }
        }
      }
      const results = await spectral.run(document)
      testHelpers.checkSameTypeErrors(
        results,
        'allowed-http-status-codes-patch',
        [
          ['paths', '/somePath', 'patch', 'responses', '204'],
          ['paths', '/somePath', 'patch', 'responses', '418'],
          ['paths', '/anotherPath', 'patch', 'responses', '508']
        ],
        testHelpers.SEVERITY.error
      )
    })

    it('should not return an error if only allowed responses are defined', async function () {
      const document = {
        paths: {
          '/somePath': {
            patch: {
              responses: {
                200: {}, 400: {}, 401: {}, 403: {}, 404: {}, 500: {}
              }
            }
          },
          '/anotherPath': {
            patch: {
              responses: {
                200: {}, 400: {}, 401: {}, 403: {}, 404: {}, 500: {}
              }
            }
          }
        }
      }
      const results = await spectral.run(document)
      testHelpers.checkNoErrors(results)
    })
  })

  describe('allowed-http-status-codes-delete', function () {
    before(function () {
      spectral.initRuleTest('allowed-http-status-codes-delete')
    })

    after(function () {
      spectral.reset()
    })

    it('should return an error if unallowed response is defined', async function () {
      const document = {
        paths: {
          '/somePath': {
            delete: {
              responses: {
                204: {}, 418: {}, 500: {}
              }
            }
          },
          '/anotherPath': {
            delete: {
              responses: {
                200: {}, 401: {}, 508: {}
              }
            }
          }
        }
      }
      const results = await spectral.run(document)
      testHelpers.checkSameTypeErrors(
        results,
        'allowed-http-status-codes-delete',
        [
          ['paths', '/somePath', 'delete', 'responses', '418'],
          ['paths', '/anotherPath', 'delete', 'responses', '508']
        ],
        testHelpers.SEVERITY.error
      )
    })

    it('should not return an error if only allowed responses are defined', async function () {
      const document = {
        paths: {
          '/somePath': {
            delete: {
              responses: {
                200: {}, 204: {}, 400: {}, 401: {}, 403: {}, 404: {}, 500: {}
              }
            }
          },
          '/anotherPath': {
            delete: {
              responses: {
                200: {}, 204: {}, 400: {}, 401: {}, 403: {}, 404: {}, 500: {}
              }
            }
          }
        }
      }
      const results = await spectral.run(document)
      testHelpers.checkNoErrors(results)
    })
  })

  describe('allowed-http-status-codes-post', function () {
    before(function () {
      spectral.initRuleTest('allowed-http-status-codes-post')
    })

    after(function () {
      spectral.reset()
    })

    it('should return an error if unallowed response is defined', async function () {
      const document = {
        paths: {
          '/somePath': {
            post: {
              responses: {
                204: {}, 418: {}
              }
            }
          },
          '/anotherPath': {
            post: {
              responses: {
                200: {}, 508: {}
              }
            }
          }
        }
      }
      const results = await spectral.run(document)
      testHelpers.checkSameTypeErrors(
        results,
        'allowed-http-status-codes-post',
        [
          ['paths', '/somePath', 'post', 'responses', '204'],
          ['paths', '/somePath', 'post', 'responses', '418'],
          ['paths', '/anotherPath', 'post', 'responses', '508']
        ],
        testHelpers.SEVERITY.error
      )
    })

    it('should not return an error if only allowed responses are defined', async function () {
      const document = {
        paths: {
          '/somePath': {
            post: {
              responses: {
                200: {}, 201: {}, 202: {}, 400: {}, 401: {}, 403: {}, 404: {}, 500: {}
              }
            }
          },
          '/anotherPath': {
            post: {
              responses: {
                200: {}, 201: {}, 202: {}, 400: {}, 401: {}, 403: {}, 404: {}, 500: {}
              }
            }
          }
        }
      }
      const results = await spectral.run(document)
      testHelpers.checkNoErrors(results)
    })
  })

  describe('exhaustive tests', function () {
    it('should have tested all rules', function () {
      assert.deepStrictEqual(spectral.listUntestedRules(), [], 'some rules have not been tested')
    })
  })
})

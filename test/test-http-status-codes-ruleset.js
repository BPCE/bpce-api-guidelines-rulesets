const assert = require('assert')
const path = require('@stoplight/path')
const { Spectral, isOpenApiv2, isOpenApiv3 } = require('@stoplight/spectral')
// const { SpectralTestWrapper } = require('./common/ruleset-test-tools.js')

const ruleset = 'http-status-codes'
let spectral
let allLoadedRules

const SEVERITY = {
  off: -1,
  error: 0,
  warn: 1,
  info: 2,
  hint: 3
}

function getSubRuleSet (names, rules) {
  const subRuleSet = {}
  for (sourceName in rules) {
    if (names.includes(sourceName)) {
      subRuleSet[sourceName] = rules[sourceName]
    }
  }
  return subRuleSet
}

function checkError (error, code, path, severity) {
  assert.strictEqual(error.code, code, 'invalid error code')
  assert.deepStrictEqual(error.path, path, 'invalid path')
  assert.strictEqual(error.severity, severity, 'invalid severity')
}

function checkSameTypeErrors (errors, code, paths, severity) {
  assert.notDeepStrictEqual(errors, [], 'no error returned')
  assert.strictEqual(errors.length, paths.length, 'more errors than expected')
  for (let i = 0; i < paths.length; i++) {
    checkError(errors[i], code, paths[i], severity)
  }
}

function checkNoErrors (errors) {
  assert.deepStrictEqual(errors, [], 'unexpected error')
}

function checkAllRulesTested (testedRules, loadedRules) {
  console.log(loadedRules)
  loadedRules.forEach(function (rule, ruleName) {
    it('should have tested rule ' + ruleName, function () {
      console.log(rule)
      assert.strictEqual(testedRules.includes(rule), true, 'rule has not been tested')
    })
  })
}

function initRuleTest (ruleName, spectral, loadedRules) {
  testedRules.push(ruleName)
  spectral.rules = getSubRuleSet([ruleName], loadedRules)
}

function resetAfterRuleTest (spectral, loadedRules) {
  // Reset full ruleset for next describe('rule name')
  spectral.rules = loadedRules
}

before(async function () {
  spectral = new Spectral()
  spectral.registerFormat('oas2', isOpenApiv2)
  spectral.registerFormat('oas3', isOpenApiv3)
  await spectral.loadRuleset(
    path.join(__dirname, '../rulesets/' + ruleset + '-ruleset.yaml')
  )
  allLoadedRules = spectral.rules
})

const testedRules = []

describe(ruleset, function () {
  // Test Works for both Swagger 2.0 and OpenAPI 3 formats
  describe('operation-2xx-response', function () {
    before(function () {
      initRuleTest('operation-2xx-response', spectral, allLoadedRules)
    })

    after(function () {
      resetAfterRuleTest(spectral.rules, allLoadedRules)
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
      checkSameTypeErrors(
        results,
        'operation-2xx-response',
        [
          ['paths', '/somePath', 'get', 'responses'],
          ['paths', '/somePath', 'post', 'responses'],
          ['paths', '/anotherPath', 'put', 'responses'],
          ['paths', '/anotherPath', 'patch', 'responses'],
          ['paths', '/anotherPath', 'delete', 'responses']
        ],
        SEVERITY.error
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
      checkNoErrors(results)
    })
  })

  describe('mandatory-http-status-codes-401', function () {
    before(function () {
      initRuleTest('mandatory-http-status-codes-401', spectral, allLoadedRules)
      console.log(spectral.rules)
    })

    after(function () {
      resetAfterRuleTest(spectral.rules, allLoadedRules)
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
      checkSameTypeErrors(
        results,
        'mandatory-http-status-codes-401',
        [
          ['paths', '/somePath', 'get', 'responses'],
          ['paths', '/somePath', 'post', 'responses'],
          ['paths', '/anotherPath', 'put', 'responses'],
          ['paths', '/anotherPath', 'patch', 'responses'],
          ['paths', '/anotherPath', 'delete', 'responses']
        ],
        SEVERITY.error
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
      checkNoErrors(results)
    })
  })

  describe('mandatory-http-status-codes-500', function () {
    before(function () {
      initRuleTest('mandatory-http-status-codes-500', spectral, allLoadedRules)
    })

    after(function () {
      resetAfterRuleTest(spectral.rules, allLoadedRules)
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
      checkSameTypeErrors(
        results,
        'mandatory-http-status-codes-500',
        [
          ['paths', '/somePath', 'get', 'responses'],
          ['paths', '/somePath', 'post', 'responses'],
          ['paths', '/anotherPath', 'put', 'responses'],
          ['paths', '/anotherPath', 'patch', 'responses'],
          ['paths', '/anotherPath', 'delete', 'responses']
        ],
        SEVERITY.error
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
      checkNoErrors(results)
    })
  })

  describe('allowed-http-status-codes-get', function () {
    before(function () {
      initRuleTest('allowed-http-status-codes-get', spectral, allLoadedRules)
    })

    after(function () {
      resetAfterRuleTest(spectral.rules, allLoadedRules)
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
      checkSameTypeErrors(
        results,
        'allowed-http-status-codes-get',
        [
          ['paths', '/somePath', 'get', 'responses', '204'],
          ['paths', '/somePath', 'get', 'responses', '418'],
          ['paths', '/anotherPath', 'get', 'responses', '508']
        ],
        SEVERITY.error
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
      checkNoErrors(results)
    })
  })

  describe('allowed-http-status-codes-put', function () {
    before(function () {
      initRuleTest('allowed-http-status-codes-put', spectral, allLoadedRules)
    })

    after(function () {
      resetAfterRuleTest(spectral.rules, allLoadedRules)
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
      checkSameTypeErrors(
        results,
        'allowed-http-status-codes-put',
        [
          ['paths', '/somePath', 'put', 'responses', '204'],
          ['paths', '/somePath', 'put', 'responses', '418'],
          ['paths', '/anotherPath', 'put', 'responses', '508']
        ],
        SEVERITY.error
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
      checkNoErrors(results)
    })
  })

  describe('allowed-http-status-codes-patch', function () {
    before(function () {
      initRuleTest('allowed-http-status-codes-patch', spectral, allLoadedRules)
    })

    after(function () {
      resetAfterRuleTest(spectral.rules, allLoadedRules)
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
      checkSameTypeErrors(
        results,
        'allowed-http-status-codes-patch',
        [
          ['paths', '/somePath', 'patch', 'responses', '204'],
          ['paths', '/somePath', 'patch', 'responses', '418'],
          ['paths', '/anotherPath', 'patch', 'responses', '508']
        ],
        SEVERITY.error
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
      checkNoErrors(results)
    })
  })

  describe('exhaustive tests', function () {
    it('should have tested all rule', function () {
      const untestedRules = []
      for (const ruleName in allLoadedRules) {
        // disabled rules have -1 severity
        if (allLoadedRules[ruleName].severity >= 0 && !testedRules.includes(ruleName)) {
          untestedRules.push(ruleName)
        }
      }
      assert.strictEqual(untestedRules, [], 'some rules have not been tested')
    })
  })
})

const { loadRuleset, SEVERITY, ruleset, rule, isNotRulesetFullyTestedTestSuite, rulesetFullyTestedSuiteName } = require('./common/SpectralTestWrapper.js')

describe('model', function () {
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

  describe('schema-name-uppercamelcase', function () {
    it('should return no error if schema name is UpperCamelCased', async function () {
      const document = {
        definitions: {
          SomeSchema: {}
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if schema name is not UpperCamelCased', async function () {
      const document = {
        definitions: {
          someSchema: {},
          SOmeSchema: {},
          some_schema: {},
          SOMESCHEMA: {}
        }
      }
      const errorPaths = [
        ['definitions', 'someSchema'],
        ['definitions', 'SOmeSchema'],
        ['definitions', 'some_schema'],
        ['definitions', 'SOMESCHEMA']
      ]
      // Note: you can check multiple paths with const errorsPaths = [ ["one", "path"], ["another", "path"] ]
      // TODO The expected severity
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('schema-name-no-number', function () {
    it('should return no error if schema name contains no number', async function () {
      const document = {
        definitions: {
          SomeSchema: {}
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if schema name contains a number', async function () {
      const document = {
        definitions: {
          Some1Schema: {},
          SomeSchema1: {}
        }
      }
      const errorPaths = [
        ['definitions', 'Some1Schema'],
        ['definitions', 'SomeSchema1']
      ]
      const errorSeverity = SEVERITY.warn
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('schema-name-no-technical-prefix-suffix', function () {
    it('should return no error if model name contains no technical suffix or prefix', async function () {
      const document = {
        definitions: {
          SomeSchema: {}
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if model name contains technical suffix or prefix', async function () {
      const document = {
        definitions: {
          SomeSchemaDto: {},
          SomeSchemaDTO: {},
          SomeSchemaDtos: {},
          DtoExample: {},
          DtosExample: {}
        }
      }
      const errorPaths = [
        ['definitions', 'SomeSchemaDto'],
        ['definitions', 'SomeSchemaDTO'],
        ['definitions', 'SomeSchemaDtos'],
        ['definitions', 'DtoExample'],
        ['definitions', 'DtosExample']
      ]
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('property-name-lowercamelcase', function () {
    it('should return no error if property name is lowerCamelCased or is _links', async function () {
      const document = {
        definitions: {
          SomeSchema: {
            properties: {
              someProperty: {},
              _links: {}
            }
          },
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  anotherProperty: {},
                  _links: {}
                }
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if property name is not lowerCamelCased', async function () {
      const document = {
        definitions: {
          SomeSchema: {
            properties: {
              SomeProperty: {}
            }
          },
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  AnotherProperty: {}
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['definitions', 'SomeSchema', 'properties', 'SomeProperty'],
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'AnotherProperty']
      ]
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('property-name-no-number', function () {
    it('should return no error if property name contains no number', async function () {
      const document = {
        definitions: {
          SomeSchema: {
            properties: {
              someProperty: {},
              _links: {}
            }
          },
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  anotherProperty: {},
                  _links: {}
                }
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if property name contains a number', async function () {
      const document = {
        definitions: {
          SomeSchema: {
            properties: {
              someProperty1: {}
            }
          },
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  another1Property: {}
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['definitions', 'SomeSchema', 'properties', 'someProperty1'],
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'another1Property']
      ]
      const errorSeverity = SEVERITY.warn
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('property-name-no-technical-prefix-suffix', function () {
    it('should return no error if property name contains no technical suffix or prefix', async function () {
      const document = {
        definitions: {
          SomeSchema: {
            properties: {
              someProperty: {},
              _links: {}
            }
          },
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  anotherProperty: {},
                  _links: {}
                }
              }
            }
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if property name technical suffix or prefix', async function () {
      const document = {
        definitions: {
          SomeSchema: {
            properties: {
              somePropertyDto: {}
            }
          },
          AnotherSchema: {
            properties: {
              someProperty: {
                type: 'object',
                properties: {
                  dtoAnotherProperty: {}
                }
              }
            }
          }
        }
      }
      const errorPaths = [
        ['definitions', 'SomeSchema', 'properties', 'somePropertyDto'],
        ['definitions', 'AnotherSchema', 'properties', 'someProperty', 'properties', 'dtoAnotherProperty']
      ]
      const errorSeverity = SEVERITY.error
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  describe('model-empty-required', function () {
    it('should return no error if model has required properties', async function () {
      const document = {
        definitions: {
          SomeSchema: {
            required: [
              'someRequiredProperty'
            ]
          }
        }
      }
      await spectralTestWrapper.runAndCheckNoError(document)
    })

    it('should return an error if model has no required properties', async function () {
      const document = {
        definitions: {
          SomeSchema: {},
          AnotherSchema: {
            required: []
          }
        }
      }
      const errorPaths = [
        ['definitions', 'SomeSchema'],
        ['definitions', 'AnotherSchema', 'required']
      ]
      // Note: you can check multiple paths with const errorsPaths = [ ["one", "path"], ["another", "path"] ]
      // TODO The expected severity
      const errorSeverity = SEVERITY.info
      await spectralTestWrapper.runAndCheckExpectedError(document, rule(this), errorPaths, errorSeverity)
    })
  })

  // Checks that all rules have been tested
  describe(rulesetFullyTestedSuiteName(this), function () {
    it('all rules should have been tested', function () {
      spectralTestWrapper.checkAllRulesHaveBeenTest()
    })
  })
})

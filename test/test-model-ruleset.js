const linterTestSuite = require('./common/linter-test-suite.js')

describe('model', function () {
  linterTestSuite.initialize()

  describe('schema-name-uppercamelcase', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if schema name is UpperCamelCased', async function () {
      const document = {
        definitions: {
          SomeSchema: {}
        }
      }
      await this.linterTester.runAndCheckNoError(document)
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
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('schema-name-no-number', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if schema name contains no number', async function () {
      const document = {
        definitions: {
          SomeSchema: {}
        }
      }
      await this.linterTester.runAndCheckNoError(document)
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
      const errorSeverity = linterTestSuite.SEVERITY.warn
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('schema-name-no-technical-prefix-suffix', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

    it('should return no error if model name contains no technical suffix or prefix', async function () {
      const document = {
        definitions: {
          SomeSchema: {}
        }
      }
      await this.linterTester.runAndCheckNoError(document)
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
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('property-name-lowercamelcase', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

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
      await this.linterTester.runAndCheckNoError(document)
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
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('property-name-no-number', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

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
      await this.linterTester.runAndCheckNoError(document)
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
      const errorSeverity = linterTestSuite.SEVERITY.warn
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('property-name-no-technical-prefix-suffix', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

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
      await this.linterTester.runAndCheckNoError(document)
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
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('model-empty-required', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.all)

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
      await this.linterTester.runAndCheckNoError(document)
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
      const errorSeverity = linterTestSuite.SEVERITY.info
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  linterTestSuite.finalize()
})

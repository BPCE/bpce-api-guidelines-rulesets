// for command line arguments
const argv = require('minimist')(process.argv.slice(2))
// Load YAML or JSON files
const { readParsable } = require('./fs/reader')
const { getLocationForJsonPath } = require('@stoplight/yaml')
const { resolve } = require('path')
// Spectral linter
const { Spectral } = require('@stoplight/spectral')
// Spectral linter - Natixis rules
const { swaggerRules, swaggerFunctions } = require('./rulesets/swagger')
const { openapiRules, openapiFunctions } = require('./rulesets/openapi')
// Spectral linter - Spectral rules
const { oas2Functions, oas2Rules } = require('@stoplight/spectral/rulesets/oas2')
const { oas3Functions, oas3Rules } = require('@stoplight/spectral/rulesets/oas3')

// Lint a file, name is a filename or URL, encoding is file encoding, customOnly disable Spectral rules
// this function is called at the end of this file
async function lint (name, encoding, customOnly) {
  const spec = await readParsable(name, encoding)
  const spectral = new Spectral()

  if (spec.data.swagger) {
    console.log('Swagger file detected')
    if (!customOnly) {
      // Default Swagger rules & functions
      spectral.addFunctions(oas2Functions())
      spectral.addRules(oas2Rules())
    }
    // Natixis Swagger rules & functions
    spectral.addFunctions(swaggerFunctions())
    spectral.addRules(swaggerRules())
  } else if (spec.data.openapi) {
    console.log('OpenAPI file detected')
    if (!customOnly) {
      // Default OpenAPI rules & functions
      spectral.addFunctions(oas3Functions())
      spectral.addRules(oas3Rules())
    }
    // Natixis OpenAPI rules & functions
    spectral.addFunctions(openapiFunctions())
    spectral.addRules(openapiRules())
  } else {
    console.log('No Swagger or OpenAPI file found')
    process.exit(1)
  }

  // when document is read with readParsable it is processed by Stoplight parseWithPointers
  // so we have to use the following structure to keep our rule without modification (parsed document is put in a data field)
  // adapted from CLI : https://github.com/stoplightio/spectral/blob/master/src/cli/commands/lint.ts
  if (name.startsWith('http')) {
    source = name
  } else {
    source = resolve(process.cwd(), name)
  }
  const parsedResult = {
    source: source,
    parsed: spec,
    getLocationForJsonPath
  }

  // Actual linting
  spectral.run(parsedResult).then(results => {
    if (customOnly) {
      console.log('Spectral rules are disabled')
    }
    // TODO copy CLI output beautifying
    console.log(JSON.stringify(results, null, 4))
    process.exit(0)
  })
}

// use our custom rules + spectral rules
// node index.js <file to lint>
// only use our custom rules:
// node index.js --customOnly=true <file to lint>
const fileToLint = argv._[argv._.length - 1]
const customOnly = argv.customOnly == 'true'

lint(fileToLint, 'UTF-8', customOnly)

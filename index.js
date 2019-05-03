const argv = require('minimist')(process.argv.slice(2));
const { Spectral } = require('@stoplight/spectral');
// Natixis rules
const { swaggerRules, swaggerFunctions } = require('./rulesets/swagger');
const { openapiRules, openapiFunctions } = require('./rulesets/openapi');
// spectral rules
const { oas2Functions, oas2Rules } = require('@stoplight/spectral/rulesets/oas2');
const { oas3Functions, oas3Rules } = require('@stoplight/spectral/rulesets/oas3');

// use our custom rules + spectral rules
//node index.js <file to lint>
//only use our custom rules:
//node index.js --customOnly=true <file to lint>
const toLint = require(argv._[argv._.length-1]);
//console.log(argv);
const customOnly = argv.customOnly == 'true';

const spectral = new Spectral();

if (toLint.swagger) {
  console.log("Swagger file detected");
  if(!customOnly) {
    //Default swagger rules & functions
    spectral.addFunctions(oas2Functions());
    spectral.addRules(oas2Rules());
  }
  //Natixis swagger rules & functions
  spectral.addFunctions(swaggerFunctions());
  spectral.addRules(swaggerRules());
}
else if(toLint.openapi) {
  console.log("OpenAPI file detected");
  if(!customOnly) {
    //Default OpenAPI rules & functions
    spectral.addFunctions(oas3Functions());
    spectral.addRules(oas3Rules());
  }
  //Natixis OpenAPI rules & functions 
  spectral.addFunctions(openapiFunctions());
  spectral.addRules(openapiRules());
}
else {
  console.log("Not a Swagger nor OpenAPI file");
  process.exit(1);
}

spectral.run(toLint).then(results => {
  if (customOnly) {
    console.log("Spectral rules are disabled");
  }  
  console.log(JSON.stringify(results, null, 4));
  process.exit(0);
});
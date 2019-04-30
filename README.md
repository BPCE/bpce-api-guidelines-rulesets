# README #

Swagger/OpenAPI linter based on Spectral

# Installation

```
npm install
```

# execution 

Lint a file using our rules and functions (common + swagger + openapi) and spectral ones (oas2 + oas3)
```
node index.js <file to lint>
node index.js ./samples/openapi.json
```

Lint a file only using our rules and functions (common + swagger + openapi)
```
node index.js --customOnly=true <file to lint>
node index.js --customOnly=true ./samples/openapi.json
```

# Source code organization

- `rulesets` contains our rules and functions
- `rulesets/common` contains rules and functions that can be used for both Swagger 2.0 and OpenAPI 3.0
- `rulesets/swagger` contains Swagger 2.0 rules and functions
- `rulesets/openapi` contains OpenAPI 3.0 rules and functions

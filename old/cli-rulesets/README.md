# Spectral ruleset to use with spectral cli

# Installation

```
npm install -g @stoplight/spectral
```

# Linting

*The `spectral lint --help` command will provide more detailed information about how to use the cli.*

*Note that all commands are executed withint the cli-rulesets folder.*


## Basic linting using defaults Spectral rules

```
spectral lint samples/natixis/expected-http-error-status-all-swagger.yaml -r natixis/swagger-rules.yaml
```

## Using custom rules

Lint `samples/natixis/expected-http-error-status-all-swagger.yaml` using `natixis/swagger-rules.yaml` rules:

```
spectral lint samples/natixis/expected-http-error-status-all-swagger.yaml -r natixis/swagger-rules.yaml
```

Output:
```
Adding OpenAPI 2.0 (Swagger) functions

C:\work\dev\api-linter\cli-rulesets\samples\natixis\expected-http-error-status-all-swagger.yaml
  9:17  error  expected-http-error-status-all  Any operation must at least return a 401 and a 500 error HTTP status codes
  9:17  error  expected-http-error-status-all  Any operation must at least return a 401 and a 500 error HTTP status codes
 16:17  error  expected-http-error-status-all  Any operation must at least return a 401 and a 500 error HTTP status codes
 24:17  error  expected-http-error-status-all  Any operation must at least return a 401 and a 500 error HTTP status codes
 24:17  error  expected-http-error-status-all  Any operation must at least return a 401 and a 500 error HTTP status codes

✖ 5 problems (5 errors, 0 warnings, 0 infos)
```

## Modifying output format

Instead of default "stylish" output, you can also have json:

```
spectral lint samples/natixis/expected-http-error-status-all-swagger.yaml -r natixis/swagger-rules.yaml -f json
```

Output can also be saved into a file:

```
spectral lint samples/natixis/expected-http-error-status-all-swagger.yaml -r natixis/swagger-rules.yaml -f json -o result.json
```

## Using JQ on JSON results

```
spectral lint samples/natixis/authorized-http-methods-swagger.yaml -r natixis/swagger-rules.yaml -f json -o result.json; cat result.json | jq "map({path: .path | join(\".\"), line: .range.start.line, code: .code, message: .message})";rm result.json
```

There is a sh script example in cli-rulesets to do so (first parameter is the swagger/openapi file, second the rules file):

```
./spectral.sh samples/natixis/parameter-name-is-valid-swagger.yaml natixis/swagger-rules.yaml
```

## Useful tools

- https://goessner.net/articles/JsonPath/ to learn Json path syntax
- https://jsonpath.com/ to build "given" paths in rules
- https://regex101.com/ to test regex used in rules
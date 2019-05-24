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


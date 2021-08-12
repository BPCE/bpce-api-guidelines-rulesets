# README

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Using Stoplight's Spectral and the Natixis API Design ruleset, you can ensure that an API design (provided as a Swagger 2.0 or OpenAPI 3 JSON or YAML file) is compliant with [Natixis API Design Guidelines](https://confluence.mycloud.intranatixis.com/display/EAPI89C3R/API+REST+-+Design+Guidelines). The ruleset is a work in progress and does not check yet all of our API Design Guidelines rules.

**Linting an API description only ensures that the form of the API is compliant with our guidelines but does ensure that it is accurate, fully consistent and user friendly.**  
**That's why, even linted, an API design must always be reviewed by the Natixis 89C3R API Team.**  

## Usage
----------


### Spectral installation

Open a terminal and launch the following command line to install the spectral cli:

```sh
npm install -g @stoplight/spectral
```

See [Spectral documentation](https://stoplight.io/p/docs/gh/stoplightio/spectral/docs/getting-started/installation.md) for more information and other installation options.

### Linting a file

Checking compliance to Natixis API Design guidelines is done using the `rulesets/main-ruleset.yaml` ruleset file.

```sh
spectral lint -r <path to ruleset> <path to Swagger or OpenAPI file in JSON or YAML format>
spectral lint -r rulesets/main-ruleset.yaml samples/example-swagger.yaml
```

Output can be turned into JSON using the -f flag:

```sh
spectral lint -f json -r rulesets/main-ruleset.yaml samples/example-swagger.yaml
```

## Development
----------

### Setting up development environment

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard) [![JavaScript Style Guide](https://avatars.githubusercontent.com/u/1165674?s=55&v=4)](http://editorconfig.org/)

This project uses `mocha` for testing rules, `standard` to lint the JS code and `EditorConfig` for coding styles.

Download dependencies using the following commands in a terminal:

```sh
npm install -g mocha
npm install -g standard
npm install
```

### Source organization

- `functions`: custom function (js, not used yet)
- `rulesets`: available rulesets, `main-ruleset.yaml` is the top level ruleset which includes the other ones
- `samples`: sample Swagger 2.0 and OpenAPI 3 files to test with spectral cli
- `test`: tests for rulesets (one js mocha test file for each ruleset)

### Modifying rules

Spectral [documentation](https://stoplight.io/p/docs/gh/stoplightio/spectral/README.md) describes anything you need to define your rulesets, rules and function.  
What follows only explains how this repo works.

### Adding a ruleset

- Create a new `<ruleset name>-ruleset.yaml` file in the `rulesets` folder
- Add the matching `test-<ruleset name>-ruleset.js` test file in the `tests` folder

### Adding or modifying a rule

- Add or modify rule in the adequate ruleset file
- Add all needed tests to the adequate test file

### Testing

Run the following command to check that everything is ok

```sh
npm run test
```

You can also run a specific test file using:

```sh
mocha test/<filename>
mocha test/test-info-ruleset.js
```

<!--
 Copyright 2019-2022 Groupe BPCE

 Licensed under the Apache License, Version 2.0 (the License);
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an AS IS BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-->

# BPCE API Design Guidelines Rulesets :white_check_mark: :vs: :warning:

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Using Stoplight's Spectral and the BPCE API Design Guidelines Rulesets, you can ensure that an API design (provided as a Swagger 2.0 or OpenAPI 3, JSON or YAML file) is compliant with BPCE/Natixis API Design Guidelines.
These rulesets are a work in progress and do not check yet all of our API Design Guidelines rules.

> :red_circle: **Linting an API description only ensures that the form of the API is compliant with our guidelines but does ensure that it is accurate, fully consistent and user friendly.**  
**That's why, even linted, an API design must always be reviewed by the BPCE/Natixis API Team.**

----------

## Usage :on:

> :warning: **Spectral upgrade v5 to v6**  
> **Regarding [Migration page](https://meta.stoplight.io/docs/spectral/ZG9jOjg2MDIwMDM-spectral-v5-to-v6-migration-guide#general), we tried to upgrade our linter repository**  
> **Due to major breaking changes into Spectral-JS interface, we can't use our test cases yet.**  
> **We still need to update our rulesets to be able to use them into Stoplight Studio**  
>
> - Dependencies Management Impact
>   - @stoplight/spectral-core@^1.6.0
>   - ajv@^8.6.2

### Spectral

#### Description

Spectral is a JSON/YAML linter with out of the box support for OpenAPI 3.0 & 2.0 and AsyncAPI

#### Installation

Open a terminal and launch the following command line to install the spectral cli:

```sh
npm install -g @stoplight/spectral@5.9.2
```

or

```sh
yarn global add @stoplight/spectral@5.9.2
```

See [Spectral documentation](https://meta.stoplight.io/docs/spectral/docs/getting-started/2-installation.md) for more information and other installation options.

### Linting a file

Checking compliance to BPCE/Natixis API Design guidelines is done using the `rulesets/main-ruleset.yaml` ruleset file.

> spectral lint -r __`<path to ruleset>`__ __`<path to Swagger or OpenAPI file in JSON or YAML format>`__

```sh
spectral lint -r rulesets/main-ruleset.yaml samples/example-swagger.yaml
```

Output can be turned into JSON using the -f flag:

```sh
spectral lint -f json -r rulesets/main-ruleset.yaml samples/example-swagger.yaml
```

----------

## Development :construction_worker:

In order to add new rules or rulesets, we have test suite to ensure your Spectral rules are working as intending by providing a frame to your tests.

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

- `rulesets`: available rulesets, `main-ruleset.yaml` is the top level ruleset which includes the other ones
- `samples`: sample Swagger 2.0 and OpenAPI 3 files to test with spectral cli
- `test`: tests for rulesets (one js mocha test file for each ruleset)

### Modifying rules

[Spectral documentation](https://meta.stoplight.io/docs/spectral/docs/guides/4-custom-rulesets.md) describes anything you need to define your rulesets, rules and function.
What follows only explains how this repo works.

### Adding a ruleset

- Create a new `<ruleset name>-ruleset.yaml` file in the `rulesets` folder
- Add the matching `test-<ruleset name>-ruleset.js` test file in the `tests` folder

### Adding or modifying a rule

- Add or modify rule in the adequate ruleset file
- Add all needed tests to the adequate test file

### Testing :passport_control:

[![JavaScript Mocha Test](https://raw.githubusercontent.com/mochajs/mocha/master/assets/mocha-logo-64.png)](https://github.com/mochajs/mocha)
Run the following command to check that everything is ok

```sh
npm run test
```

You can also run a specific test file using:

> mocha __`test/<filename>`__

```sh
mocha test/test-info-ruleset.js
```

## Questions & Comments

Please contact <api-it-support@natixis.com> in case of questions.

/*
 * Copyright 2019-2022 Groupe BPCE
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

const linterTestSuite = require('./common/linter-test-suite.js')

describe('oas', function () {
  linterTestSuite.initialize()

  describe('oas3-schema', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas3, linterTestSuite.STANDARD_SPECTRAL_RULE)

    it('should return no error if document is valid oas3', async function () {
      const document = {
        openapi: '3.0.0',
        info: {
          version: '1.0.0',
          title: 'title'
        },
        paths: {}
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if document is invalid oas3', async function () {
      const document = {
        openapi: '3.0.0',
        info: {
          version: '1.0.0',
          title: 'title',
          descriptionn: 'description with typo'
        },
        paths: {}
      }
      const errorPaths = [
        ['info', 'descriptionn']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  describe('oas2-schema', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.oas2, linterTestSuite.STANDARD_SPECTRAL_RULE)

    it('should return no error if document is valid oas2', async function () {
      const document = {
        swagger: '2.0',
        info: {
          version: '1.0.0',
          title: 'title',
          description: 'description'
        },
        paths: {}
      }
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if document is invalid oas2', async function () {
      const document = {
        swagger: '2.0',
        info: {
          version: '1.0.0',
          title: 'title',
          descriptionn: 'description with typo'
        },
        paths: {}
      }
      const errorPaths = [
        ['info', 'descriptionn']
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  linterTestSuite.finalize()
})

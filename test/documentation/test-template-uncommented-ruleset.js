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

describe('{ruleset name}', function () {
  linterTestSuite.initialize()

  describe('{rule name}', function () {
    linterTestSuite.commonTests(linterTestSuite.FORMATS.xxx)

    it('should ignore {something}', function () {
      const document = {}
      const givenIndex = 0
      this.linterTester.checkGivenNotFound(document, givenIndex)
    })

    it('should check {something}', function () {
      const document = {}
      const expectedPaths = [
        []
      ]
      const givenIndex = 0
      this.linterTester.checkGivenFound(document, expectedPaths, givenIndex)
    })

    it('should return no error if {use case}', async function () {
      const document = {}
      await this.linterTester.runAndCheckNoError(document)
    })

    it('should return an error if {use case}', async function () {
      const document = {}
      const errorPaths = [
        []
      ]
      const errorSeverity = linterTestSuite.SEVERITY.error
      await this.linterTester.runAndCheckExpectedError(document, errorPaths, errorSeverity)
    })
  })

  linterTestSuite.finalize()
})

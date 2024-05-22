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


const assert = require('assert')
const path = require('path')
const fs = require('fs')

// Check that a test file exists for all rule sets
describe('exhaustive rulesets test suites', function () {
  it('should exist a test file for each ruleset', function () {
    const rulesetsFolder = path.join(__dirname, '..', 'rulesets')
    const rulesets = fs.readdirSync(rulesetsFolder)
    const untestedRulesets = []
    for (const ruleset in rulesets) {
      const rulesetTestPath = path.join(__dirname, 'test-' + rulesets[ruleset].slice(0, rulesets[ruleset].length - 5) + '.js')
      if (!fs.existsSync(rulesetTestPath)) {
        untestedRulesets.push(rulesets[ruleset])
      }
    }
    assert.deepStrictEqual(untestedRulesets, [], 'untested rulesets')
  })
})

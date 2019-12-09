
const assert = require('assert')
const path = require('path')
const fs = require('fs')

// Check that a test file exists for all rule sets
describe('checking test exists for each ruleset', function () {
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
    assert.deepStrictEqual(untestedRulesets, [], 'some rulesets have not been tested')
  })
})

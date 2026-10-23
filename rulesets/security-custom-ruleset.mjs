import { oas3 } from '@stoplight/spectral-formats'

import {
  createRulesetFunction
} from '@stoplight/spectral-core'

let DiagnosticSeverity;
(function (DiagnosticSeverity2) {
  DiagnosticSeverity2[DiagnosticSeverity2.Error = 0] = 'Error'
  DiagnosticSeverity2[DiagnosticSeverity2.Warning = 1] = 'Warning'
  DiagnosticSeverity2[DiagnosticSeverity2.Information = 2] = 'Information'
  DiagnosticSeverity2[DiagnosticSeverity2.Hint = 3] = 'Hint'
})(DiagnosticSeverity || (DiagnosticSeverity = {}))

function isScopeDefined (scopeName, securityScheme) {
  if (securityScheme == null) return false

  if (securityScheme.flows != null) {
    for (const flow of Object.values(securityScheme.flows)) {
      if (scopeName in flow.scopes) {
        return true
      }
    }
  }
  return false
}

const checkSecurityScopes = createRulesetFunction(
  {
    input: null,
    options: null
  },
  function checkSecurityScopes (input, _options, context) {
    const schemeNames = Object.keys(input)
    const document = context.document
    const path = context.path

    if (schemeNames.length === 0) return

    if (document.data == null) return
    if (document.data.components == null) return

    // This is where we are checking the existence of schemeNames
    const allDefs = document.data.components.securitySchemes
    if (allDefs == null) return

    let results

    for (const schemeName of schemeNames) {
      if (!(schemeName in allDefs)) {
        const object = path.length === 2 ? 'API' : 'Operation'
        const location = 'components.securitySchemes'
        results ??= []
        results.push({
          message: `${object} "security" values must match a scheme defined in the "${location}" object.`,
          path: [...path, schemeName]
        })
        continue
      }

      const scope = input[schemeName]
      for (let i = 0; i < scope.length; i++) {
        const scopeName = scope[i]

        if (!isScopeDefined(scopeName, allDefs[schemeName])) {
          results ??= []
          results.push({
            message: `"${scopeName}" must be listed among scopes.`,
            path: [...path, schemeName, i]
          })
        }
      }
    }
    return results
  }
)

const checkDuplicateSchemes = createRulesetFunction(
  {
    input: null,
    options: null
  },
  function checkDuplicateSchemes (input, _options, context) {
    const document = context.document
    const path = context.path

    if (document.data == null) return
    if (document.data.components == null) return

    // This is where we are checking for potential duplicates. We are only
    // interested in OAuth2 / implicit flows
    const allDefs = document.data.components.securitySchemes
    if (allDefs == null) return
    const schemeNames = Object.keys(allDefs)

    let results
    const impl = []
    const auth = []
    const cred = []

    for (const schemeName of schemeNames) {
      const currentScheme = allDefs[schemeName]

      if (currentScheme.type === 'oauth2') {
        if (currentScheme.flows != null) {
          if (currentScheme.flows.implicit != null) {
            impl.push(currentScheme)
          }
          if (currentScheme.flows.authorizationCode != null) {
            auth.push(currentScheme)
          }
          if (currentScheme.flows.clientCredentials != null) {
            cred.push(currentScheme)
          }
        }
      }
    }
    // In this array we only have OAuth2/implicit schemes.
    if (impl.length > 1) {
      results ??= []
      results.push({
        message: 'Multiple OAuth2 / Implicit declarations found. This setup increases the risk of scope misconfiguration.',
        path: [...path]
      })
    }
    // in this array we only have OAuth2/authorizationCode schemes.
    if (auth.length > 1) {
      results ??= []
      results.push({
        message: 'Multiple OAuth2 / Authorization Code declarations found. This setup increases the risk of scope misconfiguration.',
        path: [...path]
      })
    }
    // in this array we only have OAuth2/client cred schemes.
    if (cred.length > 1) {
      results ??= []
      results.push({
        message: 'Multiple OAuth2 / Client Credential declarations found. This setup increases the risk of scope misconfiguration.',
        path: [...path]
      })
    }
    return results
  }
)

// src/ruleset.ts
const rulesetDefault = {
  formats: [oas3],
  aliases: {
    PathItem: ['$.paths[*]'],
    OperationObject: ['#PathItem[get,put,post,delete,patch]'],
    SecurityRequirementObject: ['$.security[*]', '#OperationObject.security[*]']
  },
  rules: {

    /**
     * Problem Statement:
     * The Spectral built-in rule called oas3-operation-security-defined is designed to detect situations where a scope referenced in an operation security
     * scheme does not exist among the scopes declared in the security Schemes section. However, it fails to recognize situations where a scope does indeed
     * exist, but is referenced from within a securityScheme that does *not* declare the said scope. We are therefore in a grey area of the specification:
     * There is no statement prohibiting designers from declaring multiple OAuth2 security schemes, but the resulting behavior of incorrect scope declarations
     * is left to the tools: Swagger-UI filters out the invalid entry; StoplightStudio displays the value. API Gateways, depending on their behavior, may
     * flatten all scope declarations and assume that everything is fine.
     * The objective of this rule is to flag such situations.
     */
    'security-oauth2-scope-missing-reference-oas3': {
      description: 'The scope referenced does not exist in the corresponding security scheme declaration. ',
      severity: DiagnosticSeverity.Error,
      given: '#SecurityRequirementObject',
      extensions: {
        since: '2024-09-30',
        justification: 'When declaring multiple OAuth2 implicit security schemes, make sure that further references in operations declare scopes that actually exist. Operates as a bugfix rule for oas3-operation-security-defined.',
        tags: ['security', 'integrity']
      },
      then: [
        {
          function: checkSecurityScopes
        }
      ]
    },

    'security-oauth2-toomany-schemes-defined-oas3': {
      recommended: true,
      description: 'Only one OAuth2 Flow of a given type can be defined globally in a single API.',
      severity: DiagnosticSeverity.Error,
      extensions: {
        since: '2024-09-30',
        justification: 'There is no guarantee that the API Gateway will gracefully manage the case where multiple identical flows are declared in separate schemes.',
        tags: ['security', 'integrity']
      },
      given: '$.components.securitySchemes',
      then: [
        {
          function: checkDuplicateSchemes
        }
      ]
    }
  }
}
export {
  rulesetDefault as default
}

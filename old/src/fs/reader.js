// Adapted to js from https://github.com/stoplightio/spectral/blob/master/src/fs/reader.ts
const { IParserResult } = require('@stoplight/types')
const { parseWithPointers } = require('@stoplight/yaml')
const { existsSync, readFileSync } = require('fs')
// @ts-ignore
const fetch = require('node-fetch')

async function doRead (name, encoding) {
  if (name.startsWith('http')) {
    const result = await fetch(name)
    return parseWithPointers(await result.text())
  } else if (existsSync(name)) {
    try {
      return parseWithPointers(readFileSync(name, encoding))
    } catch (ex) {
      throw new Error(`Could not read ${name}: ${ex.message}`)
    }
  }
  throw new Error(`${name} does not exist`)
}

async function readParsable (name, encoding) {
  try {
    return doRead(name, encoding)
  } catch (ex) {
    throw new Error(`Could not parse ${name}: ${ex.message}`)
  }
}

module.exports = {
  readParsable: readParsable
}

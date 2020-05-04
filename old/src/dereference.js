const SwaggerParser = require('swagger-parser')
const argv = require('minimist')(process.argv.slice(2))

const dereference = async function (filename) {
  const api = await SwaggerParser.dereference(filename)
  console.log(JSON.stringify(api))
}

const fileToDereference = argv._[argv._.length - 1]
dereference(fileToDereference)

const checkPropertiesCase = (targetValue, options) => {
  const { format } = options
  const specialProperties = ['_links']
  var result = []
  var regex
  switch (format) {
    case 'lowerCamelCase':
      // TODO regex lowerCamelCase à revoir: pas sûr que ce soit la bonne
      regex = /^[a-z]+([A-Z0-9][a-z0-9]*)*$/
      break
    case 'UpperCamelCase':
      // TODO regex UperCamelCase à revoir: pas sûr que ce soit la bonne
      regex = /^[A-Z][a-z0-9]+([A-Z][a-z0-9]*)*$/
      break
    default:
      return [
        {
          message: `invalid case ${format}`
        }
      ]
  }
  Object.keys(targetValue).forEach(function (key) {
    if (!specialProperties.includes(key) && !regex.test(key)) {
      result.push({
        message: `${key} name is not in ${format}`
      })
    }
  })
  return result
}

module.exports = {
  checkPropertiesCase: checkPropertiesCase
}

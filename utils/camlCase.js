function camlCase (str) {
  if (!str || typeof str !== 'string') return str
  const strArr = str.split('_')
  // _开头的
  if (strArr[0] === '') {
    strArr.shift()
  }
  return strArr.reduce((resultStr, str, index) => {
    if (str){
    let initial = index === 0 ? str[0] : str[0].toUpperCase() 
    resultStr += (initial + str.substring(1))}
    return resultStr
  }, '')
}

function camlCaseObj(obj) {
  if (typeof obj !== 'object') return
  if (Array.isArray(obj)) {
    obj = obj.map((item) => camlCaseObj(item))
  } else {
    obj = Object.keys(obj).reduce((newObj, key) => {
      newObj[camlCase(key)] = obj[key]
      return newObj
    }, {})
  }
  return obj
}

module.exports = {camlCase, camlCaseObj}
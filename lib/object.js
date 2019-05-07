const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 *  Reset or remove a field from a plain object
 * @param {Object} obj Object for resetting/removing a field
 * @param {String} field Field name in the Object for reset
 * @param {boolean} removed Whether to remove the specified field, `true` to remove, otherwise, reset value
 * @param {any} newValue new value for the specified field when `removed` is `false`, type of `newValue` should be same as the original one
 */
const resetField = (obj, field, removed, newValue) => {
  if (!obj || !field) throw new Error('Incorrect "obj" or "field" passed in.')
  if (removed) {
    delete obj[field]
    return
  }

  const origin = obj[field]
  if ((Array.isArray(origin) && newValue && !Array.isArray(newValue))
    || (isObject(origin) && newValue && !isObject(newValue))) {
      console.warn('There is a mismatch between the type of new value and original value')
  }
  obj[field] = newValue
}

/**
 * Get a value from an object by field path
 *  e.g. `obj = { f1: 'v1', f2: 'v2', 'f3': { nest1: v3 }}`, `getValue(obj, 'f3.nest1')` should return `f3`
 * @param {*} obj
 * @param {String|[String]} fieldPath path of the field in object, e.g. 'field1.nested1', ['field1', 'nested1']
 * @param {boolean} getAll default `true`, when the field is in a nested array, will get all values from the array elements unless `getAll` set to `false`
 *
 * @returns {*} value of the field
 */
const getValue = (obj, fieldPath, getAll = true) => {
  if (!obj || !fieldPath || (Array.isArray(fieldPath) && !fieldPath.length)) {
    throw new Error('Incorrect "obj" or "fieldPath" passed in.')
  }
  let paths = Array.isArray(fieldPath) ? fieldPath : fieldPath.split('.')
  if (paths.length === 1 || paths[1] === '*') return obj[paths[0]]

  const nestedObj = obj[paths[0]]
  paths.splice(0, 1)
  let nestedVal

  if (Array.isArray(nestedObj) && getAll) {
    nestedVal = []
    nestedObj.forEach(o => {
      nestedVal.push(getValue(o, paths, getAll))
    })
  } else {
    nestedVal = getValue(nestedObj, paths, getAll)
  }
  return nestedVal
}

/**
 * Set/Remove a value from an object by field path
 *  e.g. `obj = { f1: 'v1', f2: 'v2', 'f3': { nest1: v3 }}`, `setValue(obj, 'f3.nest1', true)` will remove the `nest1`
 * @param {*} obj
 * @param {String|[String]} fieldPath path of the field in object, e.g. 'field1.nested1', ['field1', 'nested1']
 * @param {*} removed Remove that field instead of set a new value
 * @param {boolean} setAll default `true`, when the field is in a nested array, will get all values from the array elements unless `getAll` set to `false`
 *
 * @param {*} newValue value to set when `removed` is `false`
 * @param {*} setAll default `true`, set/remove all elements if the field is an array
 *
 * @returns {*} updated object
 */
const setValue = (obj, fieldPath, removed, newValue, setAll = true) => {
  if (!obj || !fieldPath || (Array.isArray(fieldPath) && !fieldPath.length)) {
    throw new Error('Incorrect "obj" or "fieldPath" passed in.')
  }
  let paths = Array.isArray(fieldPath) ? fieldPath : fieldPath.split('.')

  if (paths.length === 1 || paths[1] === '*') {
    resetField(obj, paths[0], removed, newValue)
    return obj
  }

  const nestedObj = obj[paths[0]]
  paths.splice(0, 1)
  if (Array.isArray(nestedObj) && setAll) {
    nestedObj.forEach(o => setValue(o, paths, removed, newValue, setAll))
  } else {
    setValue(nestedObj, paths, removed, newValue, setAll)
  }
  return obj
}

/**
 * Get all fields' name of an object
 * @param {*} obj Object for extracting all keys
 * @param {String} prefix Prefix to extracted keys, e.g. prefix = 'test', obj = { f1: 'va1' } => ['test.f1']
 * @param {String[]} skipKeys keys to skip from the object
 *
 * @returns {String[]} keys list
 */
const getKeys = (obj, prefix, skipKeys = []) => {
  const keys = Object.keys(obj)
  let pathPrefix = prefix ? `${prefix}.` : ''

  return keys.reduce((result, key) => {
    if (skipKeys.includes(key)) {
      return result
    }
    if (Array.isArray(obj[key])) {
      if (obj[key].length === 0) {
        result.push(pathPrefix + key)
      } else {
        pathPrefix = pathPrefix ? pathPrefix + key : key
        obj[key].forEach(val => result = isObject(val) ? result.concat(getKeys(val, pathPrefix, skipKeys)) : result)
      }
    } else {
      isObject(obj[key]) ? result = result.concat(getKeys(obj[key], pathPrefix + key, skipKeys)) : result.push(pathPrefix + key)
    }
    pathPrefix = prefix ? prefix + '.' : ''
    return result
  }, [])
}

module.exports = {
  getKeys,
  getValue,
  setValue
}

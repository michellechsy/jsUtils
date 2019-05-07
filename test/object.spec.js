const util = require('../lib/object')

describe('>> object.js', () => {
  let obj

  beforeEach(() => {
    obj = {
      name: 'Test',
      description: 'This is a testing object',
      children: {
        name: 'Nested object',
        description: 'Nested object for iterating',
        items: [{
          key: 1,
          value: 'test nested array object'
        }, {
          key: 2,
          value: ['e1', 'e2']
        }]
      },
      addresses: [
        'Shenzhen, Guangdong, China',
        'Guangzhou, Guangdong, China'
      ]
    }
  })

  it('getKeys()', () => {
    const keys = util.getKeys(obj)
    expect(keys).toContain('children.name')
    expect(keys).toContain('children.items.key')
  })

  it('getKeys() with skip items', () => {
    const keys = util.getKeys(obj, '', ['key'])
    expect(keys).not.toContain('children.items.key')
  })

  it('getKeys() with prefix', () => {
    const keys = util.getKeys(obj, 'test')
    expect(keys.every(k => /^test.*/.test(k))).toBeTruthy()
  })

  it('getValue()', () => {
    const items = util.getValue(obj, 'children.items')
    expect(items).toHaveLength(2)
    const items2 = util.getValue(obj, 'children.items.*')
    expect(items2).toEqual(items)
    const items3 = util.getValue(obj, 'children.items.1', false)
    expect(items3.key).toEqual(2)
  })

  it('getValue() return only one item of an nested array', () => {
    const items = util.getValue(obj, ['children', 'items', '0', 'key'], false)
    expect(items).toEqual(1)
  })

  it('getValue() return undefined when getting an item with incorrect path', () => {
    const items = util.getValue(obj, 'children.items.key', false)
    expect(items).toBeUndefined()
  })

  it('setValue() remove all nested "value"', () => {
    const newObj = util.setValue(obj, ['children', 'items', 'value'], true)
    const items = newObj.children.items
    expect(items.every(item => item.value === undefined)).toBeTruthy()
  })

  it('setValue() remove first "value" for nested array object', () => {
    const newObj = util.setValue(obj, ['children', 'items', 0, 'value'], true, '', false)
    const items = newObj.children.items
    expect(items[0].value).toBeUndefined()
  })

  it('setValue() reset all "value" for nested array object', () => {
    const newVal = 'test'
    const newObj = util.setValue(obj, ['children', 'items', 'value'], false, newVal)
    const items = newObj.children.items
    expect(items.every(item => item.value === newVal)).toBeTruthy()
  })

  it('setValue() reset first "value" for nested array object', () => {
    const newVal = 'test'
    const newObj = util.setValue(obj, ['children', 'items', 0, 'value'], false, newVal, false)
    const items = newObj.children.items
    expect(items[0].value).toEqual(newVal)
  })

  it('setValue() expect error for incorrect field path', () => {
    try {
      util.setValue(null)
    } catch (err) {
      expect(err.message).toEqual('Incorrect "obj" or "fieldPath" passed in.')
    }
  })
})

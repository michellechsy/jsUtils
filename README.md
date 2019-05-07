# jsUtils
Utils for JS / Node

## lib/object.js
some utilities for handling objects. For more usage, can refer to the test cases

1. get all key paths from an object, if the value of a key is an array, will skip the item index
```js
  const objUtil = require('../lib/object')
  const obj = {
      name: 'Test',
      description: 'This is a testing object',
      children: {
        name: 'Nested object',
        description: 'Nested object for iterating',
        items: {
          name: 'nested childrent object'
        }
      },
      items: [1, 2, 3, 4, 5]
  }
  objUtil.getKeys(obj) // ['name', 'description', 'children.name', 'children.description', 'children.items']
  // skip some of the keys
  objUtil.getKeys(obj, ['description']) // ['name', 'children.name', 'children.items']
```

2. get a value of deep nested field from an object
```js
  const objUtil = require('../lib/object')
  const obj = {
      name: 'Test',
      description: 'This is a testing object',
      children: {
        name: 'Nested object',
        description: 'Nested object for iterating',
        items: [{
          name: 'nested childrent object'
        }, {
          name: 'second name'
        }]
      },
      items: [1, 2, 3, 4, 5]
  }
  objUtil.getValue(obj, 'items') // [1, 2, 3, 4, 5]
  objUtil.getValue(obj, 'children.items.0.name', false) // 'nested childrent object'
```

3. remove/set a value of deep nested field from an object
```js
  const objUtil = require('../lib/object')
  const obj = {
      name: 'Test',
      description: 'This is a testing object',
      children: {
        name: 'Nested object',
        description: 'Nested object for iterating',
        items: [{
          name: 'nested childrent object'
        }, {
          name: 'second name'
        }]
      },
      items: [1, 2, 3, 4, 5]
  }
  objUtil.setValue(obj, 'children.items', true) // will remove the items of children
  objUtil.setValue(obj, 'children.items.name', true) // will remove all 'name' field from children
  objUtil.setValue(obj, 'children.items.0.name', false, 'test', false) // will change the value of the first 'name' in children items
```

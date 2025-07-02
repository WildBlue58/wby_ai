# 手写 new 的实现

- 手写 new 的原理
  - 创建一个空对象
  - 将空对象的原型指向构造函数的 prototype
  - 执行构造函数，将 this 指向新对象
  - 判断构造函数返回值：
    - 如果返回的是对象，则返回该对象
    - 如果返回的是非对象（如 null/undefined/基本类型），则返回新对象

- ES5 实现
  - 通过 `[].shift.call(arguments)` 获取构造函数
  - 用 `obj.__proto__ = Constructor.prototype` 设置原型
  - 用 `Constructor.apply(obj, arguments)` 执行构造函数

- ES6 实现
  - 用 `Object.create(Constructor.prototype)` 创建新对象
  - 用 `Constructor.apply(obj, args)` 执行构造函数
  - 判断返回值类型决定最终返回什么

- 构造函数返回对象的特殊情况
  - 如果构造函数显式返回一个对象，则 new/手写 new 返回该对象
  - 如果返回 null/undefined/基本类型，则忽略，返回新对象

- 示例代码
  - `objectFactory` 函数模拟 new 的行为
  - `Person` 构造函数和原型方法演示

## 参考

- 1.js 代码实现
- JS 原型链与构造函数机制

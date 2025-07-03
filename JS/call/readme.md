# 手写call

- 手动指定函数内部的this
- 参数 一个个 apply []
- 第一个参数是null 或 undefined this ？
  严格模式报错
- 应用场景区别
  - call apply 立即执行的，区别是参数的传递方式，可以互换使用
  - bind 延迟执行

## 手写call2

- call是属于所有函数的，Function 原型链上的方法
  greeting.call

## 包含的技能点

- 原型 Function
- 函数参数的理解
  context,rest运算符
- context 为空,null,undefined -> window
- 在 context 上挂载方法，轻松实现函数内部的 this 指向 context
  JS 动态性 污染了context
  ES6 Symbol 唯一值，不会有覆盖context的属性
  delete context 上的方法
- return 返回值

## 这篇博客待完成

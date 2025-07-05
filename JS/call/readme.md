# 手写call

## 概述
- 手动指定函数内部的this指向
- call方法参数是一个个传递，apply方法参数是数组形式
- 第一个参数是null或undefined时，this指向window（非严格模式）
- 严格模式下，第一个参数为null或undefined会报错

## 应用场景区别
- **call/apply**: 立即执行的，区别是参数的传递方式，可以互换使用
- **bind**: 延迟执行，返回一个新函数

## 手写call实现

### 核心原理
- call是属于所有函数的，Function原型链上的方法
- 通过 `greeting.call()` 调用

### 包含的技能点

#### 1. 原型链理解
- Function.prototype - 所有函数都继承自Function原型
- 在Function.prototype上添加myCall方法，所有函数都能调用

#### 2. 函数参数的理解
- **context**: 要绑定的this对象
- **rest运算符**: `...args` 收集剩余参数

#### 3. context处理
- context为空、null、undefined时 -> 指向window
- 在context上挂载方法，轻松实现函数内部的this指向context
- 利用JS动态性，但会污染context对象
- 使用ES6 Symbol创建唯一值，避免覆盖context的属性
- 执行完后删除context上的方法

#### 4. 返回值处理
- 返回函数执行的结果

## 完整实现代码

```javascript
Function.prototype.myCall = function(context, ...args) {
    // 处理context为null或undefined的情况
    if (context === null || context === undefined) {
        context = window;
    }
    
    // 检查this是否为函数
    if (typeof this !== 'function') {
        throw new TypeError('Function.prototype.myCall called on non-function');
    }
    
    // 使用Symbol创建唯一的属性名，避免污染context
    const fnKey = Symbol('fn');
    
    // 将当前函数挂载到context上
    context[fnKey] = this;
    
    // 执行函数，此时函数内部的this指向context
    const result = context[fnKey](...args);
    
    // 删除临时属性，避免污染context
    delete context[fnKey];
    
    return result;
}
```

## 使用示例

### 基础用法
```javascript
function greeting(...args) {
    console.log(args, arguments[0], arguments[1]);
    return `Hello, I am ${this.name}.`;
}

const obj = {
    name: '乡乡',
    fn: function() {}
};

// 使用手写的myCall方法
console.log(greeting.myCall(obj, 1, 2, 3));
// 输出: Hello, I am 乡乡.
```

### call、apply、bind对比
```javascript
"use strict"
var name = "Trump"

function greeting(...args) {
    console.log(args, arguments[0], arguments[1]);
    return `Hello, I am ${this.name}.`;
}

const LJ = {
    name: "雷军"
}

// call方法 - 参数一个个传递
console.log(greeting.call(LJ, 18, '抚州'));

// apply方法 - 参数以数组形式传递
console.log(greeting.apply(LJ, [18, '抚州']));

// bind方法 - 返回绑定this的新函数
const fn = greeting.bind(LJ, 18, '抚州');
console.log(fn());

// 延迟执行示例
setTimeout(() => {
    fn();
}, 1000);
```

## 关键知识点总结

1. **this绑定机制**: 通过将函数挂载到目标对象上，实现this指向的改变
2. **Symbol使用**: 避免属性名冲突，确保不会覆盖目标对象的原有属性
3. **参数处理**: 使用rest运算符收集参数，支持任意数量的参数传递
4. **内存管理**: 执行完成后及时清理临时属性，避免内存泄漏
5. **错误处理**: 检查调用者是否为函数，提供友好的错误提示

## 注意事项

- 在严格模式下，context为null或undefined会报错
- 使用Symbol确保属性名的唯一性
- 执行完成后必须删除临时属性
- 支持ES6的rest参数语法

## 这篇博客已完成

// 定义一个构造函数 Person
function Person(name, age) {
    // this 指向当前实例化的对象
    this.name = name
    this.age = age
}

// 在 Person 的原型对象上添加 sayHello 方法
// 这样所有 Person 的实例都可以共享这个方法
Person.prototype.sayHello = function () {
        console.log(`Hello,my name is ${this.name}`)
}

// 创建一个 Person 的实例
var yang = new Person('羽球扬', 19)

// 打印实例的原型对象（修改前）
console.log('修改前的原型：', yang.__proto__);

// 创建一个普通对象 a
var a = {
    name: '孔子',
    eee:'鹅',
    country: '中国'
}

// yang.__proto__ = a
// console.log(yang.__proto__);
// console.log(yang.country);

// 使用 Object.setPrototypeOf() 来修改原型
// 这个方法比直接修改 __proto__ 更安全，是推荐的方式
Object.setPrototypeOf(yang, a)

// 打印修改后的原型对象
console.log('修改后的原型：', yang.__proto__);

// 测试是否能访问 a 的属性
console.log('访问 country 属性：', yang.country);

// 打印 Person 构造函数的原型对象
console.log(Person.prototype);// 原型对象

// 验证原型对象的 constructor 属性是否正确指向 Person 构造函数
console.log(Person.prototype.constructor === Person);// true

// 测试属性访问
// yang.name 会返回实例自身的 name 属性，而不是原型链上的
// yang.eee 会返回 undefined，因为原型链被修改后，找不到这个属性
console.log(yang.eee,yang.name);// undefined 原型链的尽头是null
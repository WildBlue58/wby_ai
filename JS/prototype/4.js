function Person(name, age) {
    // this 指向当前实例化的对象
    this.name = name
    this.age = age
}
Person.prototype.sayHello = function () {
        console.log(`Hello,my name is ${this.name}`)
}
var yang = new Person('羽球扬', 19)
console.log('修改前的原型：', yang.__proto__);
var a = {
    name: '孔子',
    country: '中国'
}
// yang.__proto__ = a
// console.log(yang.__proto__);
// console.log(yang.country);
// 使用 Object.setPrototypeOf() 来修改原型
Object.setPrototypeOf(yang, a)
console.log('修改后的原型：', yang.__proto__);
// 测试是否能访问 a 的属性
console.log('访问 country 属性：', yang.country);
console.log(Person.prototype);
console.log(Person.prototype.constructor === Person);
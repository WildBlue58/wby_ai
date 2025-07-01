// 完成的功能
// function objectFactory() {
//     var obj = {};
//     // 类数组上没有shift方法，所以借用数组的shift方法
//     var Constructor = [].shift.call(arguments);// 构造函数
//     obj.__proto__ = Constructor.prototype;
//     var ret = Constructor.apply(obj, arguments);
//     // || null 的情况 仍然会返回object 构造函数 return 简单类型，忽略
//     return typeof ret === 'object' ? ret || obj : obj;
// }

// ES6 版本
const objectFactory = (Constructor, ...args) => {
    // 创建一个以 Constructor.prototype 为原型的新对象
    const obj = Object.create(Constructor.prototype);
    // 执行构造函数
    const ret = Constructor.apply(obj, args);
    // 如果构造函数返回的是对象，则用它，否则用新对象
    return (typeof ret === 'object' && ret !== null) ? ret : obj;
};


function Person(name, age) {
    this.name = name;
    this.age = age;
    return null;
    // return {
    //     name: name,
    //     age: age,
    //     label: 'person'
    // }
}

Person.prototype.sayHi = function () {
    console.log(`你好，我是${this.name},我今年${this.age}岁`);
    
}
 
let p1 = new Person("乡乡", 18);
console.log(p1);
// p.sayHi();

let p = objectFactory(Person, "乡乡", 18);
console.log(p);
p.sayHi();
console.log(p instanceof Person);



// new Person("乡乡",18) -> function [[construct]] -> {} && this -> {} -> [[call]]
// -> {}.__proto__ -> Constructor.prototype -> return {}
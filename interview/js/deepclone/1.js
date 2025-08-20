// 有两个容器，盒子A 放有 钥匙，钱包
// 盒子B 放有 耳机，充电宝

const target = { a: 1 };
const source = { b: 2 };
const source2 = { b: 3 };

// Object.assign() 方法用于将一个或多个源对象的所有属性复制到目标对象
// 并返回修改后的目标对象，常用于对象的浅拷贝和属性合并

const result = Object.assign(target, source);
console.log(result, target);
result.a = 11;
console.log(target);

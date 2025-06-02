console.log(0 / 0);

// 平方根 NaN
console.log(Math.sqrt(-1));// JS 内置的Math 对象

console.log(parseFloat('123'), parseInt('a123'), parseInt('123a'));// 123 NaN 123

console.log(Number(undefined));// NaN

console.log(NaN === NaN);// false Not a Number 的方式有很多种

console.log(isNaN(NaN));// true

console.log(typeof NaN);// number
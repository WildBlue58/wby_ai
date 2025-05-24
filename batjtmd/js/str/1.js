/**
 * @func 反转字符串
 * @param {string} str 
 * @returns string
 */
function reverseString(str) {
    // str 是什么类型？ 字符串 简单数据类型 primitive 
    return str.split('').reverse().join('')
}


// 函数表达式
// ES5 函数表达式
// const reverseString = function (str) {
//     return str.split('').reverse().join('')
// }
// ES6 箭头函数 简洁 省略function 用箭头代替
// {}也省了
// 它是返回值的时候 连return 都可以省略


const reverseString = str => str.split('').reverse().join('')
console.log(reverseString('hello'));

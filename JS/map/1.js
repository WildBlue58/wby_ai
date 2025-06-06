// NaN Not a Number
// parseInt 将字符串转换为数字 JS 前端场景
// input 输入 -> Number
// map 要接受函数
// forEach
console.log(['1', '2', '3'].map(parseInt));// 期望：[1,2,3] 实际：[1,NaN,NaN]
console.log(['1', '2', '3'].map(num => parseInt(num)));


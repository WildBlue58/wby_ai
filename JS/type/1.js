/** 
 * @func 两数之和
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
*/
// 函数编写者
// 函数调用
// 健壮性
// typeof 运算符 数据的类型 
function add(a, b) {
     // 参数的校验
    if (typeof a !== 'number' || typeof b !== 'number' || isNaN(a) || isNaN(b)) {
        throw new Error('a 和 b 必须为数字');
    }
    return a + b;
}

console.log(add(1, NaN));

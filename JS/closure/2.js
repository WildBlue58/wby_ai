/**
 * 函数对象示例
 * 这个函数展示了JavaScript中函数对象的一些重要特性
 * @param {number} a - 第一个参数
 * @param {number} b - 第二个参数
 * @param {number} c - 第三个参数
 * @returns {number} - 返回所有参数的和
 */
function add(a, b, c) {
    // arguments 函数运行时决定，参数总管
    // 下标访问第几个参数 数组
    // console.log(arguments,arguments.length,Object.prototype.toString.call(arguments),'/////');
    // 类数组，有length属性，迭代for，但是没有数组太多的方法
    // console.log(arguments.map(item => item + 1)); // 报错
    
    // 如何将类数组转成真正的数组
    // Array.from() 方法可以将类数组对象转换为真正的数组
    const args = Array.from(arguments);
    // 输出转换后数组的类型，应该是 [object Array]
    console.log(Object.prototype.toString.call(args));
    
    // 使用循环计算所有参数的和
    let result = 0
    for (let i = 0; i < arguments.length; i++) {
        // 打印每个参数的值
        console.log(arguments[i]);
        // 累加每个参数
        result += arguments[i];
    }
    // return a + b + c;
    return result;
}

// 输出函数的length属性，表示函数期望的参数数量
// 这里会输出3，因为函数定义时有3个参数
console.log(add.length);

// 调用函数并传入3个参数
// 函数会计算所有参数的和并返回
console.log(add(1, 2, 3));
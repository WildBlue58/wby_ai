/**
 * 函数柯里化的另一种实现方式
 * 使用剩余参数（Rest Parameters）和箭头函数
 * @param {...number} args - 使用剩余参数语法，可以接收任意数量的参数
 * @returns {Function} - 返回一个新的箭头函数
 */
function add(...args) { 
    // 打印第一次调用时传入的所有参数
    // args 是一个数组，包含所有传入的参数
    console.log(args);
    
    // 返回一个箭头函数，这个函数也可以接收任意数量的参数
    return(...newArgs) => {
        // 使用展开运算符（Spread Operator）将两个数组合并
        // args 是第一次调用时的参数
        // newArgs 是第二次调用时的参数
        const arr = [...args, ...newArgs]
        // 打印合并后的数组
        console.log(arr);
    }
}

// 函数调用示例
// 第一次调用 add(1,2,3) 会打印 [1, 2, 3]
// 第二次调用 (4,5,6) 会打印 [1, 2, 3, 4, 5, 6]
add(1,2,3)(4,5,6);
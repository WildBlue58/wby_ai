// add 函数，3个参数
// add.length 3  
function add(a, b, c) { 
    return a + b + c;
}

// 普通调用方式
add(1, 2, 3);

/**
 * 柯里化函数
 * 柯里化是一种将接受多个参数的函数转换成一系列使用一个参数的函数的技术
 * @param {Function} fn - 需要被柯里化的函数
 * @returns {Function} - 返回一个新的函数，可以逐步接收参数
 */
function curry(fn) {
    // fn ? 参数 最终要执行的功能，闭包中的自由变量 词法定义环境
    // curry 函数 包装fn，慢慢收集参数
    // ...args 所有的参数 自由变量
    // curry 函数
    // 递归
    // 返回一个函数
    let judge = (...args) => {
        // ES6 reset 运算符
        // 任何地方都可以访问到定义时候的fn
        
        // 判断当前收集的参数数量是否等于原函数需要的参数数量
        if (args.length == fn.length) {
            // 退出条件：如果参数数量够了，就执行原函数
            return fn(...args)
        }
        // 如果参数数量不够，返回一个新函数继续收集参数
        // 新函数会将之前收集的参数和新参数合并
        return (...newArgs) => judge(...args, ...newArgs)
    }
    return judge
}

// 柯里化 手写 curry 函数
// 将add函数柯里化，返回一个新的函数
let addCurry = curry(add);

// 逐步的去获取函数需要的参数，当到达 fn 需要的参数数量时，执行结果
// 这里展示了柯里化后的调用方式：每次只传入一个参数
console.log(addCurry(1)(2)(3)); // 输出：6
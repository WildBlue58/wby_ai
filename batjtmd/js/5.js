// 全局作用域
function fn(){// 函数作用域
    let a = 2
    if (true) {// 支持块级作用域(高级语言的特性) var 不支持块级作用域
        let b = 3
        // 如果是var b = 3 就会输出3
        // 因为var 会变量提升
        // 但是let 不会
    }
    console.log(b)
}
fn()
if (false) { // 块级作用域
    let value = 1
}
// 在全局找不到
// console.log(value)
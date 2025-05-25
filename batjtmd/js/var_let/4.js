// 全局的 JS 代码在执行之前有一个编译的过程
// 变量提升了 
console.log(value, '-----')
var value 
var a
a = 1
if (false) {
    var value = 1// 声明变量  执行阶段
    // 相当于在全局声明了一个变量value
}
// undefined 有
console.log(value)
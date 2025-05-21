showName()// 驼峰式命名
console.log(myName)

var myName = '王'// 相当于在首段代码中添加了var myName; 但是赋值并没有提升
function showName() {
    let b = 2
    console.log(myName)
    console.log('函数执行了')
}

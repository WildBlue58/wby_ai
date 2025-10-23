# 箭头函数和普通函数区别

普通函数(function)

- this 动态绑定，调用方式决定
- arguments 对象
  函数参数不固定
- 构造函数
- 有super 和 new.target
- 变量提升 函数声明会提升到顶部
  函数表达式，提升申明，不提升值
- call、apply、bind 制定this指向

箭头函数(() => {})

- 静态绑定 取决于定义位置，继承外部作用域的this
- 没有arguments 对象，使用reset 运算符 ...args
- 不能New，没有[Construct]，没有[prototype]
- 没有super 和new.target
- 只能提升申明，不能提升值
- call、apply、bind不能改变this值，但是可以传参

# 数组上的方法

## 分维度来回答，带上业务场景

- 是否修改原数组，非纯函数，有副作用，要慎用。
  push/pop/shift/unshift 栈/队列
  shift/unshift 性能差，移动元素(数组是连续)
  splice(删除/插入/替换)
  splice(start,deleteCount,item1,item2,....)
  sort 排序

- 不会修改原数组的方法，纯函数，推荐多用
  - forEach 无返回
  - map 返回新数组
  - 查找类
    ES5 提供了indexOf,lastIndexOf
    ES6 提供了find 查找满足条件的元素 第一个元素
    findIndex 查找满足条件的元素 第一个元素下标
    includes 是否含有
    在最近的新版本里 ES15 2023 findLastIndex
    JavaScript 是基于ECMAScript 脚本标准开发的
    ES5 兼容性
    ES6 新特性
    ES6+ 对新特性持续在关注
    find/findIndex/findLastIndex/findLast

    - 过滤和判定
      filter
      every
      some
      any
    - 拼接/裁剪
      concat slice
    - 扁平
      flat
    - 迭代器 iterable
      keys() values() entries()
    - join/toString() 拼接
    - 归约
      reduce 相加
    - 静态方法
      Array.isArray
      Array.from()
      Array.of
- ES6 新增方法
- 遍历/查找类/转换类/拼接类/统计类

## 更多补充

- 是否修改原数组（补充）
  - reverse 反转（变异）
  - fill 用指定值填充（变异）
  - copyWithin 局部拷贝覆盖（变异）
  - sort 排序（变异，默认按字符串比较，需提供比较函数）
  - ES2023 提供了非变异替代：toReversed/toSorted/toSpliced 不改原数组
  - ES2023 Array.prototype.with(index, value) 返回替换某一位后的新数组（非变异）

- 查找/访问（补充）
  - at 支持负索引访问
  - findLast/findLastIndex 从末尾开始找
  - indexOf/lastIndexOf/includes 的相等性：includes 使用 SameValueZero（NaN 可匹配自身）

- 过滤/映射（补充）
  - flatMap 先 map 再扁平一层
  - reduceRight 从右向左归约

- 创建/判定
  - Array.isArray 判定是否为数组（优于 instanceof）
  - Array.from 可从可迭代/类数组创建，并支持 map 回调与 thisArg
  - Array.of 用参数创建数组，避免 new Array(3) 引发的长度语义

- 遍历注意事项
  - for...of 按值迭代；for...in 遍历可枚举键（包含继承/非索引键），不建议用于数组
  - keys()/values()/entries() 提供迭代器，更安全稳定
  - 稀疏数组（有“空洞”）在 forEach/map 等中会跳过未设元素，注意结果差异

- sort 比较函数示例
  - 数字升序：(a, b) => a - b
  - 字符串本地化排序：arr.toSorted((a, b) => a.localeCompare(b, 'zh-Hans-CN'))

- 拼接/裁剪（补充）
  - slice 不变异；concat 不变异；splice 变异（删除/插入/替换）
  - join 使用分隔符拼接；toLocaleString 受本地化影响

- 性能与工程实践
  - push/pop 更快；shift/unshift 可能触发大量移动，慎用热点路径
  - 批量构造可先确定长度：new Array(len).fill(init)
  - 删除元素优先 splice，不用 delete（会留下“空洞”导致稀疏数组）
  - 展开运算符 ... 复制/合并简洁但在大数组上有额外分配成本
  - 深拷贝不要用 JSON 序列化（丢失类型/函数），可用结构化克隆或库

- 不变式写法（推荐）
  - 替换元素：arr.with(i, newVal)
  - 插入/删除：toSpliced(start, deleteCount, ...items)
  - 排序/反转：toSorted()/toReversed()

- 常见易错点
  - sort 默认是按字符串排序：['2','10'].sort() => ['10','2']
  - NaN 比较：indexOf(NaN) 为 -1，但 includes(NaN) 为 true
  - map 不改变长度；filter 可能变短；reduce 不一定返回数组
  - slice(start, end) 不包含 end；splice 的第二个参数是删除个数不是结束索引

### 简短示例

```js
// 非变异替代
const nums = [3, 1, 2]
const asc = nums.toSorted((a, b) => a - b)   // [1,2,3]，nums 不变
const rev = nums.toReversed()                 // [2,1,3] 的反例：真实为 [2,1,3]? 实际 [2,1,3] 需注意原顺序，这里示例以 API 为主

// 定位与替换
const arr = ['a','b','c']
const replaced = arr.with(1, 'B')             // ['a','B','c']，arr 不变

// 安全访问
const last = arr.at(-1)                       // 'c'

// 稀疏数组
const sp = []
sp[2] = 1 // [ <2 empty items>, 1 ]
sp.map(x => 0) // [ <2 empty items>, 0 ]
```

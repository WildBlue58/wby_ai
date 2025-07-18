# Array 的高级考点

- 怎么认识数组?
  - 可遍历的对象
- new Array(5)
  类似于 C++,固定大小的分配 V8 引擎 对 arr 设计
  - 灵活地扩展，不限类型，还有 hash 的特性
  - empty\*5 key 没有释放 for key in 不可以迭代
  - new Array(5).fill(undefined) 统一
- [] 数组字面量
  ['宗馥莉','宗继昌','宗继盛','宗捷莉',...]
- 静态方法
  - Array.of(1, 2, 3) // 已经有了数据
  - Array.from() // 转换，(类数组，填充计算)

## 补充：数组进阶知识点

### 1. 数组的遍历方式

- for 循环：经典计数遍历，适合需要索引的场景。
- for...of：ES6，直接遍历元素，语义清晰。
- for...in：遍历可枚举属性（不推荐用于数组）。
- forEach：回调遍历，无返回值，不能 break。
- map/filter/reduce/some/every：高阶函数，常用于数据处理。

### 2. 稀疏数组与类数组对象

- 稀疏数组：如 `[1, , 3]`，中间有空槽，`length` 计数包含空槽。
- 类数组对象：如 `{0: 'a', 1: 'b', length: 2}`，可用 `Array.from` 转换为数组。

### 3. 常用数组方法

- push/pop：尾部添加/删除
- unshift/shift：头部添加/删除
- splice：任意位置增删改
- slice：截取片段，返回新数组
- concat：合并数组
- join：连接为字符串
- sort/reverse：排序/反转
- find/findIndex/includes：查找元素

### 4. 数组常见面试题

- 数组去重：`[...new Set(arr)]` 或 `arr.filter((v,i)=>arr.indexOf(v)===i)`
- 数组扁平化：`arr.flat(Infinity)` 或递归 reduce
- 数组乱序：Fisher-Yates 洗牌算法

### 5. ES6+ 新特性

- 解构赋值：`const [a,b,...rest]=arr;`
- 展开运算符：`[...arr1, ...arr2]`
- flat/flatMap：数组扁平化与映射

### 6. 性能优化建议

- 批量赋值优于频繁 push
- 大数据量操作建议用原生方法

### 7. 注意事项

1. 数组是引用类型，赋值是引用传递。
2. length 属性可手动设置，影响数组内容。
3. 稀疏数组部分方法会跳过空槽。
4. 推荐函数式编程，避免直接修改原数组。

## 数组

## 1. 数组的创建和初始化

### 1.1 构造函数创建

```javascript
// 创建空数组
const arr1 = new Array();

// 创建指定长度的数组
const arr2 = new Array(5); // [empty × 5]

// 创建包含元素的数组
const arr3 = new Array(1, 2, 3); // [1, 2, 3]
```

### 1.2 字面量创建

```javascript
const arr = [1, 2, 3, 4, 5];
```

### 1.3 Array.from() 和 Array.of()

```javascript
// Array.from() - 从类数组对象或可迭代对象创建数组
const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };
const arr1 = Array.from(arrayLike); // ['a', 'b', 'c']

// Array.of() - 创建包含传入参数的数组
const arr2 = Array.of(1, 2, 3); // [1, 2, 3]
const arr3 = Array.of(3); // [3] (注意与 new Array(3) 的区别)
```

## 2. 数组的遍历方法

### 2.1 传统循环

```javascript
const arr = [1, 2, 3, 4, 5];

// for 循环
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// for...of 循环
for (const item of arr) {
  console.log(item);
}

// for...in 循环 (不推荐用于数组)
for (const index in arr) {
  console.log(arr[index]);
}
```

### 2.2 高阶函数遍历

```javascript
const arr = [1, 2, 3, 4, 5];

// forEach - 遍历数组，无返回值
arr.forEach((item, index, array) => {
  console.log(item, index, array);
});

// map - 映射数组，返回新数组
const doubled = arr.map((item) => item * 2); // [2, 4, 6, 8, 10]

// filter - 过滤数组，返回新数组
const evens = arr.filter((item) => item % 2 === 0); // [2, 4]

// reduce - 归约数组，返回单个值
const sum = arr.reduce((acc, item) => acc + item, 0); // 15

// some - 检查是否有元素满足条件
const hasEven = arr.some((item) => item % 2 === 0); // true

// every - 检查是否所有元素都满足条件
const allPositive = arr.every((item) => item > 0); // true
```

## 3. 数组的增删改查

### 3.1 添加元素

```javascript
const arr = [1, 2, 3];

// push - 末尾添加
arr.push(4); // [1, 2, 3, 4]

// unshift - 开头添加
arr.unshift(0); // [0, 1, 2, 3, 4]

// splice - 指定位置添加
arr.splice(2, 0, "new"); // [0, 1, 'new', 2, 3, 4]
```

### 3.2 删除元素

```javascript
const arr = [1, 2, 3, 4, 5];

// pop - 删除末尾元素
const last = arr.pop(); // last = 5, arr = [1, 2, 3, 4]

// shift - 删除开头元素
const first = arr.shift(); // first = 1, arr = [2, 3, 4]

// splice - 指定位置删除
arr.splice(1, 1); // arr = [2, 4]

// delete - 删除指定索引元素（不推荐）
delete arr[0]; // arr = [empty, 4]
```

### 3.3 查找元素

```javascript
const arr = [1, 2, 3, 4, 5];

// indexOf - 查找元素索引
const index = arr.indexOf(3); // 2

// lastIndexOf - 从后往前查找
const lastIndex = arr.lastIndexOf(3); // 2

// includes - 检查是否包含元素
const hasThree = arr.includes(3); // true

// find - 查找第一个满足条件的元素
const found = arr.find((item) => item > 3); // 4

// findIndex - 查找第一个满足条件的元素索引
const foundIndex = arr.findIndex((item) => item > 3); // 3
```

## 4. 数组的排序和反转

### 4.1 排序

```javascript
const arr = [3, 1, 4, 1, 5, 9];

// sort - 排序（默认字符串排序）
arr.sort(); // [1, 1, 3, 4, 5, 9]

// 数字排序
arr.sort((a, b) => a - b); // 升序
arr.sort((a, b) => b - a); // 降序

// 对象数组排序
const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 20 },
];
users.sort((a, b) => a.age - b.age);
```

### 4.2 反转

```javascript
const arr = [1, 2, 3, 4, 5];
arr.reverse(); // [5, 4, 3, 2, 1]
```

## 5. 数组的截取和连接

### 5.1 截取

```javascript
const arr = [1, 2, 3, 4, 5];

// slice - 截取数组片段
const part1 = arr.slice(1, 3); // [2, 3]
const part2 = arr.slice(-2); // [4, 5]
const part3 = arr.slice(); // 浅拷贝整个数组
```

### 5.2 连接

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// concat - 连接数组
const combined = arr1.concat(arr2); // [1, 2, 3, 4, 5, 6]

// 展开运算符
const combined2 = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]
```

## 6. 数组的高级特性

### 6.1 稀疏数组

```javascript
// 稀疏数组 - 包含空槽的数组
const sparse = [1, , 3]; // [1, empty, 3]
console.log(sparse.length); // 3
console.log(sparse[1]); // undefined

// 检查空槽
console.log(1 in sparse); // false
```

### 6.2 类数组对象

```javascript
// 类数组对象
const arrayLike = {
  0: "a",
  1: "b",
  2: "c",
  length: 3,
};

// 转换为数组
const arr = Array.from(arrayLike);
const arr2 = [...arrayLike]; // 需要实现迭代器
```

### 6.3 数组的不可变性

```javascript
const arr = [1, 2, 3];

// 创建新数组而不是修改原数组
const newArr = [...arr, 4]; // [1, 2, 3, 4]
const filtered = arr.filter((item) => item > 1); // [2, 3]
const mapped = arr.map((item) => item * 2); // [2, 4, 6]
```

## 7. 数组的性能优化

### 7.1 避免频繁的数组操作

```javascript
// 不好的做法
const arr = [];
for (let i = 0; i < 10000; i++) {
  arr.push(i); // 频繁的 push 操作
}

// 好的做法
const arr = new Array(10000);
for (let i = 0; i < 10000; i++) {
  arr[i] = i; // 直接赋值
}
```

### 7.2 使用 Set 去重

```javascript
const arr = [1, 2, 2, 3, 3, 4];

// 传统去重
const unique = arr.filter((item, index) => arr.indexOf(item) === index);

// 使用 Set 去重
const unique2 = [...new Set(arr)];
```

## 8. 常见面试题

### 8.1 数组扁平化

```javascript
const arr = [1, [2, 3], [4, [5, 6]]];

// 方法1：递归
function flatten(arr) {
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

// 方法2：使用 flat
const flattened = arr.flat(Infinity);

// 方法3：toString + split
const flattened2 = arr.toString().split(",").map(Number);
```

### 8.2 数组去重

```javascript
const arr = [1, 2, 2, 3, 3, 4];

// 方法1：Set
const unique1 = [...new Set(arr)];

// 方法2：filter + indexOf
const unique2 = arr.filter((item, index) => arr.indexOf(item) === index);

// 方法3：reduce
const unique3 = arr.reduce((acc, item) => {
  return acc.includes(item) ? acc : [...acc, item];
}, []);
```

### 8.3 数组乱序

```javascript
const arr = [1, 2, 3, 4, 5];

// Fisher-Yates 洗牌算法
function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

## 9. ES6+ 新特性

### 9.1 解构赋值

```javascript
const arr = [1, 2, 3, 4, 5];

// 基本解构
const [first, second, ...rest] = arr;
console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]

// 默认值
const [a, b, c = 10] = [1, 2];
console.log(c); // 10
```

### 9.2 展开运算符

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// 合并数组
const combined = [...arr1, ...arr2];

// 复制数组
const copy = [...arr1];

// 在指定位置插入元素
const inserted = [...arr1.slice(0, 1), "new", ...arr1.slice(1)];
```

### 9.3 Array.prototype.flat() 和 flatMap()

```javascript
const arr = [1, [2, 3], [4, [5, 6]]];

// flat - 扁平化数组
const flattened = arr.flat(2); // [1, 2, 3, 4, 5, 6]

// flatMap - 先映射再扁平化
const result = arr.flatMap((item) => (Array.isArray(item) ? item : [item]));
```

## 10. 注意事项

1. **数组是引用类型**：赋值时传递的是引用，不是值
2. **length 属性**：可以手动设置，会影响数组内容
3. **稀疏数组**：包含空槽的数组，某些方法会跳过空槽
4. **性能考虑**：频繁的数组操作会影响性能
5. **不可变性**：函数式编程中推荐创建新数组而不是修改原数组

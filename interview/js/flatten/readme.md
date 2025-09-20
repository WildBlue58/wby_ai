# 手写 扁平化数组

数组扁平化，就是把一个多维数组转成一维数组。

## 方法总结

### 1. 递归方法

**核心思想**：递归遍历数组，如果遇到数组则继续递归，否则添加到结果中。

```javascript
const flatten = (arr) => {
  let res = [];
  for (let item of arr) {
    if (Array.isArray(item)) {
      res = res.concat(flatten(item));
    } else {
      res.push(item);
    }
  }
  return res;
};
```

**关键点**：

- `Array.isArray()` 判断是否为数组
- 递归本意：抽象处理，将复杂问题分解为相同类型的子问题
- 递归出口：当 item 不是数组时，直接返回 item
- `res.concat(flatten(item))` 将递归结果合并到当前结果中

### 2. reduce 方法

**核心思想**：使用 reduce 方法累积处理，将多维数组逐步合并为一维。

```javascript
const flatten = arr =>
    arr.reduce((acc, item) => {
        return acc.concat(Array.isArray(item) ? flatten(item) : item);
    }, [])
```

**关键点**：

- reduce 方法把数组合并成一个值
- 初始值为空数组 `[]`
- 对每个元素判断是否为数组，决定递归调用还是直接添加

### 3. 栈模拟方法

**核心思想**：使用栈（LIFO）来模拟递归过程，避免函数调用栈溢出。

```javascript
function flatten(arr) {
  const result = [];
  const stack = [...arr];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      result.push(item);
    }
  }
  return result;
}
```

**关键点**：

- 使用栈来模拟递归（LIFO - Last In First Out）
- 展开运算符 `...item` 将数组元素推入栈中
- 避免了递归调用的栈溢出风险

### 4. ES6 flat() 方法

**核心思想**：使用原生数组方法，简单直接。

```javascript
// 扁平化一层
arr.flat()

// 扁平化多层（指定深度）
arr.flat(Infinity)
```

**关键点**：

- `flat()` 默认只扁平化一层
- `flat(Infinity)` 扁平化所有层级
- 最简单但需要现代浏览器支持

### 5. some() 方法

**核心思想**：使用 some 方法检查是否还有嵌套数组，循环扁平化。

```javascript
function flatten(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
```

**关键点**：

- `some()` 检查数组中是否还有嵌套数组
- 使用展开运算符 `...arr` 扁平化一层
- 循环直到没有嵌套数组为止

## 性能对比

| 方法 | 时间复杂度 | 空间复杂度 | 优点 | 缺点 |
|------|------------|------------|------|------|
| 递归 | O(n) | O(d) d为深度 | 直观易懂 | 可能栈溢出 |
| reduce | O(n) | O(d) d为深度 | 函数式编程 | 可能栈溢出 |
| 栈模拟 | O(n) | O(n) | 避免栈溢出 | 代码较复杂 |
| flat() | O(n) | O(n) | 原生支持，简单 | 浏览器兼容性 |
| some() | O(n×d) | O(n) | 避免栈溢出 | 多次遍历 |

## 使用场景

- **递归/reduce**：适合学习理解，函数式编程风格
- **栈模拟**：适合深度很大的数组，避免栈溢出
- **flat()**：适合现代项目，追求简洁
- **some()**：适合需要兼容老版本浏览器的场景

## 扩展思考

1. **深度控制**：如何只扁平化指定层数？
2. **类型处理**：如何处理非数组元素？
3. **性能优化**：如何优化大数据量的扁平化？
4. **边界情况**：如何处理 null、undefined 等特殊值？

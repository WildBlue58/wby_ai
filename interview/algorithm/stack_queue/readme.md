# 使用栈实现队列

## 题目描述

使用两个栈实现一个队列（Queue）。队列需要支持以下操作：

- `push(x)`: 将元素 x 添加到队列尾部
- `pop()`: 移除并返回队列头部的元素

**示例：**

```text
输入: push(1), push(2), push(3), pop(), pop(), pop()
输出: 1, 2, 3
```

---

## 数据结构基础

### 栈（Stack）

- **特性**: FILO（First In Last Out，先进后出）
- **操作**: 只能在一端进行操作
  - `push()`: 入栈（压入元素）
  - `pop()`: 出栈（弹出元素）

### 队列（Queue）

- **特性**: FIFO（First In First Out，先进先出）
- **操作**: 在两端进行操作
  - `push()`: 入队（在队尾添加元素）
  - `pop()`: 出队（从队头移除元素）

---

## 核心思想

使用两个栈来模拟队列的两端操作。

### 设计思路

1. **stack1（输入栈）**: 负责接收新元素（模拟队列的队尾）
2. **stack2（输出栈）**: 负责输出元素（模拟队列的队头）

### 关键操作

- **push(x)**: 直接将元素压入 `stack1`
- **pop()**:
  - 如果 `stack2` 为空，将 `stack1` 的所有元素依次弹出并压入 `stack2`
  - 然后从 `stack2` 弹出栈顶元素（即队列头部元素）

### 为什么这样设计？

- **栈的特性**: 栈只能从一端操作，无法直接实现队列的"先进先出"
- **两个栈的配合**:
  - `stack1` 接收元素（顺序：1, 2, 3）
  - 当需要出队时，将 `stack1` 的元素全部转移到 `stack2`（顺序变为：3, 2, 1）
  - 从 `stack2` 弹出，就实现了"先进先出"（1 先出）

---

## 算法步骤

### push(x) 操作

1. 直接将元素 `x` 压入 `stack1`

### pop() 操作

1. **检查 stack2 是否为空**
   - 如果 `stack2` 不为空，直接弹出 `stack2` 的栈顶元素
   - 如果 `stack2` 为空，执行步骤 2

2. **转移元素**
   - 将 `stack1` 中的所有元素依次弹出
   - 将弹出的元素依次压入 `stack2`
   - 此时 `stack2` 的栈顶就是队列的头部元素

3. **返回结果**
   - 弹出并返回 `stack2` 的栈顶元素

---

## 运行示例

假设执行以下操作：`push(1)`, `push(2)`, `push(3)`, `pop()`, `pop()`, `push(4)`, `pop()`, `pop()`

```text
操作          stack1      stack2      说明
初始状态      []          []          
push(1)      [1]         []          1 压入 stack1
push(2)      [1,2]       []          2 压入 stack1
push(3)      [1,2,3]     []          3 压入 stack1
pop()        []          [3,2]       转移 stack1 到 stack2
             []          [3]          返回 1（stack2.pop()）
pop()        []          []           返回 2（stack2.pop()）
push(4)      [4]         []          4 压入 stack1
pop()        []          [4]          stack2 为空，转移 stack1
             []          []           返回 3（stack2.pop()）
pop()        []          []           返回 4（stack2.pop()）
```

---

## 代码实现

### JavaScript 实现

```javascript
class Queue {
  constructor() {
    this.stack1 = [];  // 输入栈
    this.stack2 = [];  // 输出栈
  }

  // 入队：将元素添加到队列尾部
  push(x) {
    this.stack1.push(x);
  }

  // 出队：移除并返回队列头部的元素
  pop() {
    // 如果输出栈为空，需要从输入栈转移元素
    if (!this.stack2.length) {
      // 将 stack1 的所有元素转移到 stack2
      while (this.stack1.length) {
        this.stack2.push(this.stack1.pop());
      }
    }
    // 从 stack2 弹出栈顶元素（即队列头部）
    return this.stack2.pop();
  }

  // 获取队列头部元素（不移除）
  peek() {
    if (!this.stack2.length) {
      while (this.stack1.length) {
        this.stack2.push(this.stack1.pop());
      }
    }
    return this.stack2[this.stack2.length - 1];
  }

  // 判断队列是否为空
  empty() {
    return this.stack1.length === 0 && this.stack2.length === 0;
  }
}
```

### Python 实现

```python
class Queue:
    def __init__(self):
        self.stack1 = []  # 输入栈
        self.stack2 = []  # 输出栈

    def push(self, x: int) -> None:
        """入队：将元素添加到队列尾部"""
        self.stack1.append(x)

    def pop(self) -> int:
        """出队：移除并返回队列头部的元素"""
        # 如果输出栈为空，需要从输入栈转移元素
        if not self.stack2:
            # 将 stack1 的所有元素转移到 stack2
            while self.stack1:
                self.stack2.append(self.stack1.pop())
        # 从 stack2 弹出栈顶元素（即队列头部）
        return self.stack2.pop()

    def peek(self) -> int:
        """获取队列头部元素（不移除）"""
        if not self.stack2:
            while self.stack1:
                self.stack2.append(self.stack1.pop())
        return self.stack2[-1]

    def empty(self) -> bool:
        """判断队列是否为空"""
        return len(self.stack1) == 0 and len(self.stack2) == 0
```

---

## 复杂度分析

### 时间复杂度

- **push(x)**: O(1) - 直接压入栈
- **pop()**:
  - **均摊时间复杂度**: O(1)
  - **最坏情况**: O(n) - 当 `stack2` 为空时需要转移 n 个元素
  - **平均情况**: 每个元素最多被转移一次（从 `stack1` 到 `stack2`），所以均摊为 O(1)

### 空间复杂度

- O(n) - 需要两个栈存储元素，最多存储 n 个元素

---

## 优化说明

### 为什么均摊时间复杂度是 O(1)？

虽然单次 `pop()` 操作在最坏情况下是 O(n)，但每个元素最多只会被转移一次：

- 元素进入 `stack1` 后，最多被转移到 `stack2` 一次
- 之后直接从 `stack2` 弹出，不会再被转移

因此，对于 n 次操作，总时间复杂度是 O(n)，均摊到每次操作就是 O(1)。

---

## LeetCode 相关题目

- [232. 用栈实现队列](https://leetcode.cn/problems/implement-queue-using-stacks/)
- [225. 用队列实现栈](https://leetcode.cn/problems/implement-stack-using-queues/)（相反问题）

---

## 扩展：使用队列实现栈

**思路**: 使用一个队列，每次 `pop()` 时，将队列中除最后一个元素外的所有元素重新入队。

```javascript
class Stack {
  constructor() {
    this.queue = [];
  }

  push(x) {
    this.queue.push(x);
  }

  pop() {
    // 将队列中除最后一个元素外的所有元素重新入队
    let size = this.queue.length;
    while (size > 1) {
      this.queue.push(this.queue.shift());
      size--;
    }
    return this.queue.shift();
  }
}
```

---

## 总结

使用栈实现队列的核心思想：

- ✅ **两个栈配合**: `stack1` 负责输入，`stack2` 负责输出
- ✅ **延迟转移**: 只有当 `stack2` 为空时才转移元素，提高效率
- ✅ **均摊 O(1)**: 虽然单次操作可能 O(n)，但均摊时间复杂度是 O(1)
- ✅ **空间换时间**: 使用两个栈的空间，实现了队列的功能

**关键点**: 理解栈和队列的特性差异，通过两个栈的配合来模拟队列的两端操作。

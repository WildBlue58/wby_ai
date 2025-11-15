# 反转链表

## 算法的基础和素养

### 题目

需要把**单向**链表反转

**示例：**

```text
输入: 1 -> 2 -> 3 -> null
输出: 3 -> 2 -> 1 -> null
```

---

## 解法一：迭代法

### 复杂度分析

- **时间复杂度：** O(n)，需要遍历链表一次
- **空间复杂度：** O(1)，只使用了常数额外空间

### 核心思想

使用三指针（pre、cur、next）逐步反转链表方向。

### 算法步骤

1. 初始化三个指针：
   - `prev = null`：指向前一个节点（初始为null）
   - `cur = head`：指向当前节点
   - `next = null`：临时保存下一个节点

2. 遍历链表，对每个节点执行：
   - 保存当前节点的下一个节点：`next = cur.next`
   - 反转当前节点的指针：`cur.next = prev`
   - 移动指针：`prev = cur`，`cur = next`

3. 当 `cur` 为 `null` 时，`prev` 指向新的头节点，返回 `prev`

### 指针变化过程示例

```text
初始状态: null <- prev, 1(cur) -> 2 -> 3 -> null

第1次迭代:
  next = cur.next = 2
  cur.next = prev (1 -> null)
  prev = cur = 1
  cur = next = 2
  结果: null <- 1(prev) <- 2(cur) -> 3 -> null

第2次迭代:
  next = cur.next = 3
  cur.next = prev (2 -> 1)
  prev = cur = 2
  cur = next = 3
  结果: null <- 1 <- 2(prev) <- 3(cur) -> null

第3次迭代:
  next = cur.next = null
  cur.next = prev (3 -> 2)
  prev = cur = 3
  cur = next = null
  结果: null <- 1 <- 2 <- 3(prev), cur = null

返回 prev，即新的头节点 3
```

### 代码实现

```python
def reverseList(head):
    prev = None
    cur = head

    while cur:
        next = cur.next      # 保存下一个节点
        cur.next = prev      # 反转当前节点的指针
        prev = cur           # prev 前移
        cur = next           # cur 前移

    return prev              # 返回新的头节点
```

---

## 解法二：递归法

### 复杂度分析

- **时间复杂度：** O(n)，需要遍历链表一次
- **空间复杂度：** O(n)，递归调用栈的深度为链表长度

### 核心思想

假设子问题已经解决，利用递归回溯的特性从后往前反转链表。

### 算法步骤

1. **递归终止条件：** 如果链表为空或只有一个节点，直接返回
2. **递归调用：** 对 `head.next` 进行反转，得到反转后的新头节点 `newHead`
3. **回溯处理：**
   - 将 `head.next.next` 指向 `head`（反转当前节点和下一个节点的连接）
   - 将 `head.next` 设为 `null`（断开原来的连接）
4. **返回：** 返回 `newHead`（新的头节点）

### 递归过程示例

```text
原链表: 1 -> 2 -> 3 -> null

递归调用栈:
  reverse(1) 
    -> reverse(2)
      -> reverse(3)
        -> reverse(null) 返回 null
      <- 返回 3 (newHead)
      处理: 3.next = 2, 2.next = null
      结果: 3 -> 2 -> null
    <- 返回 3 (newHead)
    处理: 2.next.next = 2, 2.next = null
    结果: 3 -> 2 -> 1 -> null
  <- 返回 3 (newHead)
```

### 更好理解的方式

- **先递归到底：** 一直递归到最后一个节点
- **从后往前反转：** 在回溯过程中，假设后面的部分已经反转完成
- **处理当前节点：** 将当前节点与已反转的部分连接

### 代码实现

```python
def reverseList(head):
    # 递归终止条件
    if not head or not head.next:
        return head
    
    # 递归反转后面的部分
    newHead = reverseList(head.next)
    
    # 回溯：反转当前节点与下一个节点的连接
    head.next.next = head  # 下一个节点指向当前节点
    head.next = None       # 当前节点断开原来的连接
    
    return newHead         # 返回新的头节点
```

---

## 两种方法对比

| 特性 | 迭代法 | 递归法 |
|------|--------|--------|
| 时间复杂度 | O(n) | O(n) |
| 空间复杂度 | O(1) | O(n) |
| 代码复杂度 | 中等 | 较简单 |
| 适用场景 | 生产环境（空间效率高） | 理解递归思想 |
| 栈溢出风险 | 无 | 链表过长时可能溢出 |

---

## 总结

- **迭代法**：空间效率高，适合实际应用
- **递归法**：代码简洁，有助于理解递归思想，但空间开销较大
- 两种方法都需要理解指针操作的本质：改变节点之间的连接关系

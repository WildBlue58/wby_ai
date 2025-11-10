# 二叉树

## 列表转二叉树

将数组或列表转换为二叉树结构，通常使用层序遍历的方式构建。

## 问题描述

给定一个数组，按照层序遍历的方式构建一个完全二叉树或普通二叉树。数组中的 `null` 值表示该位置没有节点。

## 示例

### 示例 1：完全二叉树

```
输入: [1, 2, 3, 4, 5, 6, 7]
输出:
        1
       / \
      2   3
     / \ / \
    4  5 6  7
```

### 示例 2：包含 null 的数组

```
输入: [1, 2, 3, null, null, 4, 5]
输出:
        1
       / \
      2   3
         / \
        4   5
```

### 示例 3：单节点

```
输入: [1]
输出:
    1
```

## 数据结构定义

### JavaScript

```javascript
function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
}
```

### Python

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

### Java

```java
public class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
```

## 解题思路

1. **使用队列**：利用队列的先进先出特性，按层构建节点
2. **层序遍历**：从根节点开始，依次处理每一层的节点
3. **索引映射**：对于完全二叉树，可以使用数组索引的父子关系
   - 父节点索引：`i`
   - 左子节点索引：`2 * i + 1`
   - 右子节点索引：`2 * i + 2`

## 代码实现

### JavaScript

#### 方法一：使用队列（推荐）

```javascript
function listToTree(arr) {
    if (!arr || arr.length === 0) return null;
    
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    
    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();
        
        // 左子节点
        if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        
        // 右子节点
        if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    
    return root;
}

// 使用示例
const arr = [1, 2, 3, 4, 5, 6, 7];
const root = listToTree(arr);
```

#### 方法二：递归方法（适用于完全二叉树）

```javascript
function listToTreeRecursive(arr, index = 0) {
    if (index >= arr.length || arr[index] === null || arr[index] === undefined) {
        return null;
    }
    
    const root = new TreeNode(arr[index]);
    root.left = listToTreeRecursive(arr, 2 * index + 1);
    root.right = listToTreeRecursive(arr, 2 * index + 2);
    
    return root;
}
```

### Python

#### 方法一：使用队列（推荐）

```python
from collections import deque

def list_to_tree(arr):
    if not arr or len(arr) == 0:
        return None
    
    root = TreeNode(arr[0])
    queue = deque([root])
    i = 1
    
    while queue and i < len(arr):
        node = queue.popleft()
        
        # 左子节点
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        
        # 右子节点
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    
    return root

# 使用示例
arr = [1, 2, 3, 4, 5, 6, 7]
root = list_to_tree(arr)
```

#### 方法二：递归方法

```python
def list_to_tree_recursive(arr, index=0):
    if index >= len(arr) or arr[index] is None:
        return None
    
    root = TreeNode(arr[index])
    root.left = list_to_tree_recursive(arr, 2 * index + 1)
    root.right = list_to_tree_recursive(arr, 2 * index + 2)
    
    return root
```

### Java

```java
import java.util.*;

public class ListToTree {
    public static TreeNode listToTree(Integer[] arr) {
        if (arr == null || arr.length == 0) {
            return null;
        }
        
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int i = 1;
        
        while (!queue.isEmpty() && i < arr.length) {
            TreeNode node = queue.poll();
            
            // 左子节点
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.offer(node.left);
            }
            i++;
            
            // 右子节点
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.offer(node.right);
            }
            i++;
        }
        
        return root;
    }
    
    public static void main(String[] args) {
        Integer[] arr = {1, 2, 3, 4, 5, 6, 7};
        TreeNode root = listToTree(arr);
    }
}
```

### C++

```cpp
#include <vector>
#include <queue>
#include <iostream>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

TreeNode* listToTree(std::vector<int>& arr) {
    if (arr.empty()) return nullptr;
    
    TreeNode* root = new TreeNode(arr[0]);
    std::queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    
    while (!q.empty() && i < arr.size()) {
        TreeNode* node = q.front();
        q.pop();
        
        // 左子节点
        if (i < arr.size() && arr[i] != INT_MIN) {  // INT_MIN 表示 null
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        
        // 右子节点
        if (i < arr.size() && arr[i] != INT_MIN) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    
    return root;
}
```

## 二叉树转列表

将二叉树转换回数组形式（层序遍历）。

### JavaScript

```javascript
function treeToList(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const node = queue.shift();
        
        if (node) {
            result.push(node.val);
            queue.push(node.left);
            queue.push(node.right);
        } else {
            result.push(null);
        }
    }
    
    // 移除末尾的 null
    while (result.length > 0 && result[result.length - 1] === null) {
        result.pop();
    }
    
    return result;
}
```

### Python

```python
def tree_to_list(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        node = queue.popleft()
        
        if node:
            result.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append(None)
    
    # 移除末尾的 None
    while result and result[-1] is None:
        result.pop()
    
    return result
```

## 复杂度分析

### 列表转二叉树

- **时间复杂度**：O(n)，其中 n 是数组的长度。需要遍历数组中的每个元素
- **空间复杂度**：O(n)，队列最多存储 n/2 个节点（最后一层的节点数）

### 二叉树转列表

- **时间复杂度**：O(n)，其中 n 是树中节点的数量
- **空间复杂度**：O(n)，队列和结果数组的空间

## 应用场景

1. **LeetCode 题目**：很多二叉树题目使用数组格式输入
2. **序列化/反序列化**：将树结构存储到文件或数据库中
3. **测试用例**：方便创建和验证二叉树结构
4. **数据转换**：在不同系统间传递树结构数据

## 相关题目

- [从前序与中序遍历序列构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
- [从中序与后序遍历序列构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)
- [序列化和反序列化二叉搜索树](https://leetcode-cn.com/problems/serialize-and-deserialize-bst/)
- [二叉树的层序遍历](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)
- [二叉树的锯齿形层序遍历](https://leetcode-cn.com/problems/binary-tree-zigzag-level-order-traversal/)

## 注意事项

1. **null 值处理**：数组中 `null` 表示该位置没有节点，需要跳过
2. **边界情况**：空数组、单节点、只有左子树或只有右子树的情况
3. **完全二叉树**：如果确定是完全二叉树，可以使用索引映射方法，更高效
4. **内存管理**：在 C++ 等语言中，注意释放动态分配的内存

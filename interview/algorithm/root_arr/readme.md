# 输入 root，返回每层最大的节点值（若该层没有节点则返回 0）

## 题目描述

- **输入**: 二叉树根节点 `root`。
- **输出**: 数组，按层返回每层的最大节点值；若某层没有节点，则返回 0。
- **空树**: 若 `root` 为空，返回 `[0]`（与 `1.js` 中的实现保持一致）。

## 思路（BFS 层序遍历）

使用队列进行层序遍历：

- 每次记录当前层的节点数 `levelSize`；
- 遍历该层的所有节点，维护当前层的最大值 `max`；
- 将下一层的左右子节点加入队列；
- 一层结束后把该层的最大值加入结果数组；若该层没有节点则加入 `0`。

## 步骤

1. 若 `root` 为空，直接返回 `[0]`。
2. 初始化结果数组 `res` 与队列 `queue = [root]`。
3. 当队列非空时：
   - 令 `levelSize = queue.length`，`max = -Infinity`；
   - 循环 `levelSize` 次，依次出队：
     - 用当前节点值更新 `max`；
     - 将其左右子节点（若存在）入队；
   - 将 `max`（若仍为 `-Infinity` 则记为 `0`）推入结果数组。
4. 返回 `res`。

## 复杂度

- **时间复杂度**: O(n)，其中 n 为节点数（每个节点仅进出队一次）。
- **空间复杂度**: O(w)，其中 w 为树的最大层宽（队列最多存放某一层的节点）。

## 示例

给定二叉树（层序）：`[1, 3, 2, 5, 3, null, 9]`

- 各层最大值依次为 `1`、`3`、`9`，返回 `[1, 3, 9]`。

## 参考实现（与 1.js 同思路）

```javascript
function largestValuesPerLevel(root) {
  if (!root) return [0];
  const res = [];
  const queue = [root];
  while (queue.length) {
    let levelSize = queue.length;
    let max = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      max = Math.max(max, node.value);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(max === Number.NEGATIVE_INFINITY ? 0 : max);
  }
  return res;
}
```

> 注：`TreeNode` 结构通常形如 `value/left/right` 三个字段；使用时确保构造与读写字段名一致。

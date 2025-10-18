# diff

React diff 算法核心用最小的计算成本找到两棵树的差异，然后只更新真正变化的节点，及收集到patches
真实的DOM 树可能比较深，如果每次都做完整的树比对，时间复杂度O(n^3)，页面会卡。
diff 算法基于两个前提来优化的：

- 同级比较，如果一个结点类型不一样，直接替换，不做子树的比较
- 列表用key，快速找到元素的前后对应关系，移动或复用结点，而不是暴力删除重建。

O(n^3) -> O(n)
diff 算法的核心思想是 分层比较 + key定位 + 最小化更新
简单diff
  一个个节点来比对，去旧列表找key 一样的。找到了就看是不是在后面，不动，不是就移动到新位置，lastIndex 记录下当前比对到的位置，下一个节点比对时，只需要从lastIndex 开始比对即可。

  A B C 0 -1 -2 旧的节点 他要移动1
  B C A 新的节点 标准

  i = 0 新 B 旧 B j = 1 -> lastIndex 不移动 lastIndex = 1
  i = 1 新 C 旧 C j = 2 -> lastIndex 不移动 lastIndex = 2
  i = 3 新 A 旧 A j = 0 -> lastIndex 不移动 lastIndex = 3
  简单diff 算法 挺好

  DABC 新
  i = 0 D j = 3 -> lastIndex 不用移动 lastIndex = 3
  i = 1 A j = 0 <- lastIndex 移动 lastIndex = 1
  i = 2 B j = 1 == lastIndex 不用移动 lastIndex = 1
  i = 3 C j = 2 -> lastIndex 不用移动 lastIndex = 2
  ABCD 旧
双端diff

双端diff 详解

- 基本思想：同时维护四个指针 `oldStart`、`oldEnd`、`newStart`、`newEnd`，优先比较两端以获取最大命中率。
- 四类快速命中：
  - 头头：`old[oldStart].key === new[newStart].key` → 两端右移/左移
  - 尾尾：`old[oldEnd].key === new[newEnd].key` → 两端左移/右移
  - 头尾：`old[oldStart].key === new[newEnd].key` → 将头部节点移动到尾部
  - 尾头：`old[oldEnd].key === new[newStart].key` → 将尾部节点移动到头部
- 若四类都不命中：
  - 使用 `key -> oldIndex` 的 `Map` 快速定位旧节点位置
  - 命中则复用旧节点并移动到 `newStart` 位置
  - 未命中则在 `newStart` 位置创建新节点
- 指针推进直到一侧耗尽：
  - new 侧有剩余 → 批量插入剩余新节点
  - old 侧有剩余 → 批量删除剩余旧节点

为什么需要 LIS（最长递增子序列）

- 目标：在确定了要保留的节点后，尽量“少移动”。
- 方法：构造“新序列在旧序列中的索引数组”，对该数组求 LIS。
- 结论：处于 LIS 的那些节点“相对顺序已正确”，无需移动；其他节点按新序顺序插入/移动，整体移动次数最少。

快速例子

- 旧：A B C D
- 新：D A B C
- 索引映射（以旧序为基准）：[-1, 0, 1, 2]（-1 表示新建）
- LIS 为 [0, 1, 2] → A/B/C 保持不动，仅处理 D（插入到最前）。

常见坑与建议

- key 必须稳定、唯一、可预测；不要使用下标 index 作为 key。
- 跨层级不会做“移动 diff”，只会删除/新建；不要依赖跨层移动。
- 批量更新时尽量保持节点结构与 key 稳定，减少无意义重排。
- 复杂列表/表格/虚拟列表应优先复用节点，避免频繁卸载/挂载导致状态丢失。

参考函数：LIS（O(n log n)）

```js
function getLIS(indices) {
  // indices: 如 [2, 5, 3, 7, 11, 8, 10]，-1 或 undefined 代表新建，不参与 LIS
  const sequence = [];
  const predecessors = new Array(indices.length).fill(-1);
  const positions = []; // positions[len] = 在 sequence 长度为 len 时，结尾元素的下标

  for (let i = 0; i < indices.length; i++) {
    const value = indices[i];
    if (value == null || value < 0) continue; // 跳过新建

    // 二分查找当前 value 可以放置的位置
    let left = 0, right = sequence.length;
    while (left < right) {
      const mid = (left + right) >> 1;
      if (sequence[mid] < value) left = mid + 1;
      else right = mid;
    }

    // left 为应插入位置
    if (left >= sequence.length) sequence.push(value);
    else sequence[left] = value;

    positions[left] = i;
    predecessors[i] = left > 0 ? positions[left - 1] : -1;
  }

  // 回溯获取 LIS 下标序列（相对于 indices 的下标）
  let lisLength = sequence.length;
  const lis = new Array(lisLength);
  let k = positions[lisLength - 1];
  while (lisLength-- > 0) {
    lis[lisLength] = k;
    k = predecessors[k];
  }
  return lis; // 返回的是 indices 的下标序列；indices[lis[i]] 递增
}
```

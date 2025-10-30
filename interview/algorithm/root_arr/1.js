function TreeNode(val, left = null, right = null) {
  this.value = value;
  this.left = left;
  this.right = right;
}

function largestValuesPerLevel(root) {
  if (!root) return [0];
  const res = [];
  const queue = [root]; // FIFO bfs 队列
  while (queue.length) {
    // 每次清空队列，代表一层
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

# LRU (Least Recently Used)

## 概念

**LRU - Least Recently Used（最近最少使用）缓存淘汰算法**

当缓存空间已满时，优先淘汰最久未使用的数据，保留最近使用过的数据。

## 运行示例

假设缓存容量为 3：

```
操作          缓存状态         说明
get(A)    -> [A]            首次访问A，加入缓存
get(B)    -> [A,B]          访问B，加入缓存
get(C)    -> [A,B,C]        访问C，加入缓存（已满）
get(A)    -> [B,C,A]        访问A，A移到最前（最近使用）
get(D)    -> [C,A,D]        访问D，淘汰最久未使用的B
```

**规则：**

- 最右边是最近使用的（Most Recently Used）
- 最左边是最久未使用的（Least Recently Used）
- 缓存满时，淘汰最左边的元素

## 实现原理

**核心思想：空间换时间**

使用两种数据结构的组合：

1. **HashMap**: 实现 O(1) 时间复杂度的查找
2. **双向链表**: 实现 O(1) 时间复杂度的插入和删除

### 为什么需要双向链表？

- **快速删除**: 删除节点时需要访问前驱节点
- **快速移动**: 将访问的节点移到链表头部
- **快速淘汰**: 删除链表尾部的最久未使用节点

## JavaScript 实现

### 方法一：使用 Map（利用 Map 保持插入顺序）

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }
    
    // 将访问的元素移到最后（最新）
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }

  put(key, value) {
    // 如果已存在，先删除
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // 添加到最后
    this.cache.set(key, value);
    
    // 超出容量，删除最久未使用的（第一个）
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

// 使用示例
const lru = new LRUCache(3);
lru.put('A', 1);  // [A]
lru.put('B', 2);  // [A, B]
lru.put('C', 3);  // [A, B, C]
console.log(lru.get('A'));  // 1, [B, C, A]
lru.put('D', 4);  // [C, A, D] - B被淘汰
console.log(lru.get('B'));  // -1 (不存在)
```

### 方法二：手动实现双向链表 + HashMap

```javascript
class DLinkedNode {
  constructor(key = 0, value = 0) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
    
    // 使用伪头部和伪尾部节点
    this.head = new DLinkedNode();
    this.tail = new DLinkedNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // 移动节点到头部（最新位置）
  moveToHead(node) {
    this.removeNode(node);
    this.addToHead(node);
  }

  // 删除节点
  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  // 在头部添加节点
  addToHead(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  // 删除尾部节点
  removeTail() {
    const node = this.tail.prev;
    this.removeNode(node);
    return node;
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }
    
    const node = this.cache.get(key);
    this.moveToHead(node);
    return node.value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      // 已存在，更新值并移到头部
      const node = this.cache.get(key);
      node.value = value;
      this.moveToHead(node);
    } else {
      // 不存在，创建新节点
      const newNode = new DLinkedNode(key, value);
      this.cache.set(key, newNode);
      this.addToHead(newNode);
      
      // 超出容量，删除尾部
      if (this.cache.size > this.capacity) {
        const removed = this.removeTail();
        this.cache.delete(removed.key);
      }
    }
  }
}
```

## 复杂度分析

- **时间复杂度**:
  - get: O(1)
  - put: O(1)
  
- **空间复杂度**: O(capacity) - 最多存储 capacity 个键值对

## LeetCode 题目

[146. LRU 缓存](https://leetcode.cn/problems/lru-cache/)

```javascript
/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    if (!this.cache.has(key)) {
        return -1;
    }
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    if (this.cache.has(key)) {
        this.cache.delete(key);
    }
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
    }
};
```

## 应用场景

1. **浏览器缓存**: 缓存最近访问的网页
2. **操作系统**: 页面置换算法
3. **数据库**: 缓存热点数据
4. **CDN**: 缓存热门资源
5. **Redis**: 内存淘汰策略之一

## 相关算法

- **LFU (Least Frequently Used)**: 淘汰访问频率最低的
- **FIFO (First In First Out)**: 先进先出
- **LRU-K**: 考虑最近K次访问
- **Two Queue (2Q)**: 使用两个队列优化LRU

## 总结

LRU 是一种经典的缓存淘汰算法，通过 **HashMap + 双向链表** 实现了高效的缓存管理：

- ✅ O(1) 时间复杂度的读写操作
- ✅ 自动淘汰最久未使用的数据
- ✅ 实现简单，应用广泛
- ❌ 不考虑数据的访问频率（只看时间）
- ❌ 可能导致"缓存污染"（偶尔访问的数据替换掉常用数据）

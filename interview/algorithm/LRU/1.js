class ListNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    // 双向链表
    this.next = null;
    this.prev = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // hash表，O(1)查找节点
    this.head = new ListNode(null, null);
    this.tail = new ListNode(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  get(key) {
    if (!this.map.has(key)) {
      return -1;
    }
    const node = this.map.get(key);
    this.moveToHead(node);
    return node.value;
  }

  moveToTail(node) {
    this.removeNode(node);
    this.addNode(node);
  }
  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
  addNode(node) {
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev.next = node;
    this.tail.prev = node;
  }
  put(key, value) {
    // capacity
    if (this.map.has(key)) {
      // 修改操作
      const node = this.map.get(key);
      node.value = value;
      this.moveToTail(node);
    } else {
      const newNode = new ListNode(key, value);
      this.map.set(key, newNode);
      this.addNode(newNode);
      if (this.map.size > this.capacity) {
        const tailNode = this.tail.prev;// 旧节点
        this.removeNode(tailNode);
        this.map.delete(tailNode.key);
      }
    }
  }
}

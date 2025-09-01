// Map 和 WeakMap 实际应用示例

console.log("=== Map 和 WeakMap 实际应用示例 ===\n");

// 1. Map 应用：缓存系统
console.log("1. Map 应用：缓存系统");
const cache = new Map();

function expensiveOperation(key) {
  console.log(`执行昂贵的操作: ${key}`);
  return `结果: ${key} 的处理结果`;
}

function getCachedResult(key) {
  if (cache.has(key)) {
    console.log(`从缓存获取: ${key}`);
    return cache.get(key);
  }

  const result = expensiveOperation(key);
  cache.set(key, result);
  return result;
}

console.log(getCachedResult("user1")); // 执行操作
console.log(getCachedResult("user1")); // 从缓存获取
console.log("");

// 2. WeakMap 应用：私有属性
console.log("2. WeakMap 应用：私有属性");
const privateData = new WeakMap();

class BankAccount {
  constructor(accountNumber, balance) {
    // 使用 WeakMap 存储私有数据
    privateData.set(this, {
      accountNumber,
      balance,
      transactions: [],
    });
  }

  deposit(amount) {
    const data = privateData.get(this);
    data.balance += amount;
    data.transactions.push({
      type: "deposit",
      amount,
      timestamp: new Date(),
    });
    return data.balance;
  }

  withdraw(amount) {
    const data = privateData.get(this);
    if (data.balance >= amount) {
      data.balance -= amount;
      data.transactions.push({
        type: "withdraw",
        amount,
        timestamp: new Date(),
      });
      return data.balance;
    }
    throw new Error("余额不足");
  }

  getBalance() {
    return privateData.get(this).balance;
  }

  getAccountNumber() {
    return privateData.get(this).accountNumber;
  }

  getTransactionHistory() {
    return [...privateData.get(this).transactions];
  }
}

const account = new BankAccount("123456789", 1000);
console.log("账户号:", account.getAccountNumber());
console.log("余额:", account.getBalance());

account.deposit(500);
console.log("存款后余额:", account.getBalance());

account.withdraw(200);
console.log("取款后余额:", account.getBalance());

console.log("交易历史:", account.getTransactionHistory());

// 无法直接访问私有数据
console.log("尝试访问私有数据:", account.accountNumber); // undefined
console.log("");

// 3. WeakMap 应用：DOM 元素数据存储
console.log("3. WeakMap 应用：DOM 元素数据存储（模拟）");
const elementData = new WeakMap();

class DOMElement {
  constructor(tagName, id) {
    this.tagName = tagName;
    this.id = id;
    this.element = { tagName, id }; // 模拟 DOM 元素
  }

  setData(key, value) {
    if (!elementData.has(this.element)) {
      elementData.set(this.element, {});
    }
    const data = elementData.get(this.element);
    data[key] = value;
  }

  getData(key) {
    const data = elementData.get(this.element);
    return data ? data[key] : undefined;
  }

  remove() {
    this.element = null; // 模拟删除 DOM 元素
  }
}

const button = new DOMElement("button", "myButton");
button.setData("clickCount", 0);
button.setData("lastClick", null);

console.log("按钮数据:", button.getData("clickCount"));
console.log("按钮数据:", button.getData("lastClick"));

// 模拟点击
button.setData("clickCount", button.getData("clickCount") + 1);
button.setData("lastClick", new Date());

console.log("点击后数据:", button.getData("clickCount"));
console.log("点击后数据:", button.getData("lastClick"));

// 删除元素（模拟）
button.remove();
console.log("元素删除后，相关数据会被垃圾回收");

console.log("\n=== 总结 ===");
console.log("Map 适合：");
console.log("- 需要遍历的场景");
console.log("- 键值对映射");
console.log("- 缓存系统");
console.log("- 需要保持插入顺序");

console.log("\nWeakMap 适合：");
console.log("- 存储对象相关的元数据");
console.log("- 私有属性实现");
console.log("- DOM 元素数据存储");
console.log("- 避免内存泄漏的场景");

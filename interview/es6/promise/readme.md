# Promise.all

- MDN 定义
  Promise.all 方法接受一个promise的**iterable** 类型的输入(Array,Map,Set都属于ES6的iterable类型)，并且只返回一个Promise实例。输入的所有promise的resolve回调结果是一个数组，并按顺序存放。只要任何一个输入的reject 回调执行，就会抛出错误，Promise.all的promise 失败，catch执行。reject是第一个抛出的错误。

  如果有promise 子项失败，那么其他还没有完成的promise 会继续执行，只不过结果不重要了。

- all，race，any，allSettled
  这一组Promise 上的静态方法，带来了promise 的并行
  async await 简单，不需要then的链式调用，优雅的异步变同步，但也不能乱用，它是串行的。
  如果多个promise值前后有依赖 async/await 有优势，但如果没有呢？Promise.all并发更快
  
  如果并行业务需求，all/race/any/allSettled 更加适合且高效。

- Promise.all() 全成功才成功：所有 Promise 都 fulfilled 时，它才 fulfilled；任何一个 rejected，它就立即 rejected。
- Promise.race() 谁快听谁的：哪个 Promise 最先完成（无论 fulfilled 或 rejected），它的结果就决定了 Promise.race() 的最终状态。
- Promise.any() 首个成功即成功：只要有一个 Promise fulfilled，它就立即 fulfilled；只有当所有 Promise 都 rejected 时，它才 rejected（返回 AggregateError）。
- Promise.allSettled() 全部完成才结束：等待所有 Promise 都 settled（fulfilled 或 rejected），然后返回一个包含每个 Promise 结果（含状态和值/原因）的数组。

## 实际使用示例

### Promise.all() 示例

```javascript
// 并发请求多个API
const fetchUser = fetch('/api/user/1');
const fetchPosts = fetch('/api/posts');
const fetchComments = fetch('/api/comments');

Promise.all([fetchUser, fetchPosts, fetchComments])
  .then(([userRes, postsRes, commentsRes]) => {
    return Promise.all([
      userRes.json(),
      postsRes.json(),
      commentsRes.json()
    ]);
  })
  .then(([user, posts, comments]) => {
    console.log('用户:', user);
    console.log('文章:', posts);
    console.log('评论:', comments);
  })
  .catch(error => {
    console.error('其中一个请求失败:', error);
  });
```

### Promise.race() 示例

```javascript
// 超时控制
const timeout = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('请求超时')), 5000);
});

const fetchData = fetch('/api/data');

Promise.race([fetchData, timeout])
  .then(response => response.json())
  .then(data => console.log('数据:', data))
  .catch(error => {
    if (error.message === '请求超时') {
      console.log('请求超时，请重试');
    } else {
      console.error('请求失败:', error);
    }
  });
```

### Promise.any() 示例

```javascript
// 多个备用API，只要一个成功即可
const primaryAPI = fetch('/api/primary').catch(() => null);
const backupAPI1 = fetch('/api/backup1').catch(() => null);
const backupAPI2 = fetch('/api/backup2').catch(() => null);

Promise.any([primaryAPI, backupAPI1, backupAPI2])
  .then(response => {
    if (response) {
      return response.json();
    }
    throw new Error('所有API都失败了');
  })
  .then(data => console.log('获取到数据:', data))
  .catch(error => {
    if (error instanceof AggregateError) {
      console.error('所有API都失败了:', error.errors);
    } else {
      console.error('处理数据时出错:', error);
    }
  });
```

### Promise.allSettled() 示例

```javascript
// 批量操作，需要知道每个操作的结果
const operations = [
  Promise.resolve('操作1成功'),
  Promise.reject(new Error('操作2失败')),
  Promise.resolve('操作3成功'),
  Promise.reject(new Error('操作4失败'))
];

Promise.allSettled(operations)
  .then(results => {
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`操作${index + 1}: 成功 - ${result.value}`);
      } else {
        console.log(`操作${index + 1}: 失败 - ${result.reason.message}`);
      }
    });
  });
```

## 错误处理最佳实践

### 1. 避免 Promise.all 的"快速失败"特性

```javascript
// 不好的做法：一个失败全部失败
Promise.all([promise1, promise2, promise3])
  .catch(error => console.error('某个操作失败:', error));

// 好的做法：使用 allSettled 或包装错误
const safePromises = promises.map(p => 
  p.catch(error => ({ error, success: false }))
);

Promise.all(safePromises)
  .then(results => {
    const successes = results.filter(r => r.success !== false);
    const failures = results.filter(r => r.success === false);
    console.log('成功:', successes.length, '失败:', failures.length);
  });
```

### 2. 超时控制

```javascript
function withTimeout(promise, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`操作超时 (${timeoutMs}ms)`)), timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

// 使用
withTimeout(fetch('/api/slow'), 3000)
  .then(response => response.json())
  .catch(error => {
    if (error.message.includes('超时')) {
      console.log('请求超时，请重试');
    } else {
      console.error('其他错误:', error);
    }
  });
```

## 性能考虑

### 1. 控制并发数量

```javascript
// 限制并发数量，避免过多请求
async function limitedConcurrency(tasks, maxConcurrency = 3) {
  const results = [];
  const executing = new Set();
  
  for (const task of tasks) {
    const promise = task();
    results.push(promise);
    
    executing.add(promise);
    promise.finally(() => executing.delete(promise));
    
    if (executing.size >= maxConcurrency) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
}

// 使用示例
const tasks = [
  () => fetch('/api/1'),
  () => fetch('/api/2'),
  () => fetch('/api/3'),
  () => fetch('/api/4'),
  () => fetch('/api/5')
];

limitedConcurrency(tasks, 2)
  .then(responses => console.log('完成所有任务'))
  .catch(error => console.error('任务执行失败:', error));
```

### 2. 取消操作

```javascript
// 使用 AbortController 取消请求
const controller = new AbortController();
const { signal } = controller;

const fetchPromise = fetch('/api/data', { signal });

// 5秒后取消
setTimeout(() => controller.abort(), 5000);

fetchPromise
  .then(response => response.json())
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('请求被取消');
    } else {
      console.error('请求失败:', error);
    }
  });
```

## 常见陷阱和注意事项

1. **Promise.all 的快速失败特性**：一个 Promise 失败会导致整个操作失败
2. **内存泄漏**：未处理的 Promise 可能导致内存泄漏
3. **错误传播**：确保所有错误都被适当处理
4. **并发限制**：避免同时发起过多请求
5. **超时处理**：为长时间运行的操作设置超时

## 总结

- 使用 `Promise.all()` 当所有操作都必须成功时
- 使用 `Promise.race()` 当只需要最快的结果时
- 使用 `Promise.any()` 当只需要一个成功的结果时
- 使用 `Promise.allSettled()` 当需要知道所有操作的结果时
- 合理使用并发控制，避免资源耗尽
- 始终处理错误情况，提供良好的用户体验

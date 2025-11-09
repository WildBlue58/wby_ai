# 数组有五项，如何过滤大于2的数

## 问题描述

给定一个包含五个元素的数组，需要过滤出所有大于2的数字。

## 示例

```
输入: [1, 3, 5, 2, 4]
输出: [3, 5, 4]

输入: [0, 1, 2, 3, 4]
输出: [3, 4]

输入: [1, 2, 1, 2, 1]
输出: []
```

## 解题思路

1. **遍历数组**：遍历数组中的每个元素
2. **条件判断**：检查每个元素是否大于2
3. **收集结果**：将满足条件的元素收集到新数组中

## 代码实现

### JavaScript

#### 方法一：使用 filter() 方法（推荐）

```javascript
const arr = [1, 3, 5, 2, 4];
const result = arr.filter(num => num > 2);
console.log(result); // [3, 5, 4]
```

#### 方法二：使用 for 循环

```javascript
const arr = [1, 3, 5, 2, 4];
const result = [];
for (let i = 0; i < arr.length; i++) {
    if (arr[i] > 2) {
        result.push(arr[i]);
    }
}
console.log(result); // [3, 5, 4]
```

#### 方法三：使用 for...of 循环

```javascript
const arr = [1, 3, 5, 2, 4];
const result = [];
for (const num of arr) {
    if (num > 2) {
        result.push(num);
    }
}
console.log(result); // [3, 5, 4]
```

#### 方法四：使用 reduce() 方法

```javascript
const arr = [1, 3, 5, 2, 4];
const result = arr.reduce((acc, num) => {
    if (num > 2) {
        acc.push(num);
    }
    return acc;
}, []);
console.log(result); // [3, 5, 4]
```

### Python

#### 方法一：使用列表推导式（推荐）

```python
arr = [1, 3, 5, 2, 4]
result = [num for num in arr if num > 2]
print(result)  # [3, 5, 4]
```

#### 方法二：使用 filter() 函数

```python
arr = [1, 3, 5, 2, 4]
result = list(filter(lambda x: x > 2, arr))
print(result)  # [3, 5, 4]
```

#### 方法三：使用 for 循环

```python
arr = [1, 3, 5, 2, 4]
result = []
for num in arr:
    if num > 2:
        result.append(num)
print(result)  # [3, 5, 4]
```

### Java

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class FilterArray {
    // 方法一：使用 Stream API（推荐）
    public static List<Integer> filterWithStream(int[] arr) {
        return Arrays.stream(arr)
                .filter(num -> num > 2)
                .boxed()
                .collect(Collectors.toList());
    }
    
    // 方法二：使用传统循环
    public static List<Integer> filterWithLoop(int[] arr) {
        List<Integer> result = new ArrayList<>();
        for (int num : arr) {
            if (num > 2) {
                result.add(num);
            }
        }
        return result;
    }
    
    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 2, 4};
        System.out.println(filterWithStream(arr)); // [3, 5, 4]
    }
}
```

### C++

```cpp
#include <vector>
#include <algorithm>
#include <iostream>

// 方法一：使用 remove_if 和 erase
std::vector<int> filterArray1(std::vector<int>& arr) {
    arr.erase(std::remove_if(arr.begin(), arr.end(), 
        [](int num) { return num <= 2; }), arr.end());
    return arr;
}

// 方法二：使用循环创建新数组
std::vector<int> filterArray2(const std::vector<int>& arr) {
    std::vector<int> result;
    for (int num : arr) {
        if (num > 2) {
            result.push_back(num);
        }
    }
    return result;
}

int main() {
    std::vector<int> arr = {1, 3, 5, 2, 4};
    auto result = filterArray2(arr);
    for (int num : result) {
        std::cout << num << " ";  // 3 5 4
    }
    return 0;
}
```

## 复杂度分析

- **时间复杂度**：O(n)，其中 n 是数组的长度。需要遍历数组中的每个元素
- **空间复杂度**：O(k)，其中 k 是满足条件的元素个数。需要额外的空间存储结果数组

## 方法对比

| 方法 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| filter() / 列表推导式 | 代码简洁、可读性强 | 创建新数组 | **推荐使用**，代码简洁 |
| for 循环 | 灵活、可控制流程 | 代码较长 | 需要复杂逻辑时 |
| reduce() | 函数式编程风格 | 可读性稍差 | 需要累积操作时 |

## 扩展：通用过滤函数

### JavaScript

```javascript
// 通用过滤函数
function filterArray(arr, condition) {
    return arr.filter(condition);
}

// 使用示例
const arr = [1, 3, 5, 2, 4];
const result1 = filterArray(arr, num => num > 2);
const result2 = filterArray(arr, num => num % 2 === 0); // 过滤偶数
const result3 = filterArray(arr, num => num < 3); // 过滤小于3的数
```

### Python

```python
# 通用过滤函数
def filter_array(arr, condition):
    return [num for num in arr if condition(num)]

# 使用示例
arr = [1, 3, 5, 2, 4]
result1 = filter_array(arr, lambda x: x > 2)
result2 = filter_array(arr, lambda x: x % 2 == 0)  # 过滤偶数
result3 = filter_array(arr, lambda x: x < 3)  # 过滤小于3的数
```

## 相关题目

- [移除元素](https://leetcode-cn.com/problems/remove-element/)
- [按奇偶排序数组](https://leetcode-cn.com/problems/sort-array-by-parity/)
- [数组中的第K个最大元素](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)

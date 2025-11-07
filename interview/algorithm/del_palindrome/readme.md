# 删除回文子序列

给定一个非空字符串s, 最多删除一个字符，判断是否能成为回文字符串。

- 字符串算法
- 双指针
- 容错  用一个函数来做

## 示例

```
输入: "aba"
输出: true

输入: "abca"
输出: true
解释: 可以删除 'c' 字符

输入: "abc"
输出: false
```

## 解题思路

1. **双指针法**：使用左右两个指针从字符串两端向中间遍历
2. **容错机制**：当遇到不匹配的字符时，允许删除一个字符（跳过左边或右边的字符）
3. **辅助函数**：创建一个辅助函数来判断删除一个字符后是否为回文

### 算法步骤

1. 使用双指针 `left` 和 `right` 分别指向字符串的首尾
2. 当 `s[left] == s[right]` 时，两个指针同时向中间移动
3. 当遇到不匹配时，尝试删除左边字符或右边字符，判断剩余部分是否为回文
4. 如果两种删除方式都不满足，返回 `false`

## 代码实现

```python
def validPalindrome(s: str) -> bool:
    def isPalindrome(left: int, right: int) -> bool:
        """判断子串是否为回文"""
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True
    
    left, right = 0, len(s) - 1
    
    while left < right:
        if s[left] == s[right]:
            left += 1
            right -= 1
        else:
            # 尝试删除左边字符或右边字符
            return isPalindrome(left + 1, right) or isPalindrome(left, right - 1)
    
    return True
```

```javascript
function validPalindrome(s) {
    const isPalindrome = (left, right) => {
        while (left < right) {
            if (s[left] !== s[right]) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    };
    
    let left = 0, right = s.length - 1;
    
    while (left < right) {
        if (s[left] === s[right]) {
            left++;
            right--;
        } else {
            // 尝试删除左边字符或右边字符
            return isPalindrome(left + 1, right) || isPalindrome(left, right - 1);
        }
    }
    
    return true;
}
```

## 复杂度分析

- **时间复杂度**：O(n)，其中 n 是字符串的长度。最坏情况下需要遍历整个字符串两次
- **空间复杂度**：O(1)，只使用了常数额外空间

## 相关题目

- [验证回文串](https://leetcode-cn.com/problems/valid-palindrome/)
- [最长回文子串](https://leetcode-cn.com/problems/longest-palindromic-substring/)

---

## 设计一个支持以下两种操作的数据结构 void addWord(word)

bool search(word) search(word) 可以搜索文字或正则表达式字符串， 字符串中只包含字母 。.

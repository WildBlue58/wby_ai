# 字符串字典 Dictionary

用哈希字典（`Map`/`HashMap`）为字符串建立索引，是解决“快速查询/匹配/分组”类面试题的常见套路。核心思想是“缩小搜索空间”，让匹配在更小的候选集合上进行。

**关键词**：HashMap、索引思维、按长度分桶、正则匹配、模糊搜索、变位词分组、复杂度分析。

---

## 为什么用字典
- 常见操作（插入、查找、删除）平均复杂度接近 `O(1)`。
- 通过合适的“键”设计，能显著减少匹配时的扫描量。
- 适合解决：按规则筛词、通配符匹配、变位词分组（Anagram）、邻接构图（如 Word Ladder）等。

## 索引思维（如何设计 key）
- 按长度分桶：`Map<number, string[]>`，将同长度单词放在一起，适合做“等长匹配/通配符”。
- 按首字符分桶：`Map<string, string[]>`，适合前缀/首字母筛选。
- 变位词签名：对单词排序得到签名：`key = [...word].sort().join('')`，用于分组 Anagram。
- 组合索引：例如 `key = 首字母 + 长度`，进一步缩小候选集合。

---

## 复杂度直觉
- 插入/存在性判断：平均 `O(1)`（受哈希实现与负载因子影响）。
- 按长度匹配：近似 `O(k)`，`k` 为该长度桶的大小。
- `includes` 子串匹配：近似在所有可能长度 ≥ 子串长度的桶中线性扫描。
- 正则/通配符：将候选限定到同长度桶后再匹配，可将 `O(n)` 降到 `O(k)`。

---

## JavaScript 示例：简易字符串字典

```js
class WordDictionary {
  constructor() {
    // 以“长度”为键的分桶：Map<length, string[]>。
    this.byLen = new Map();
  }

  add(word) {
    if (typeof word !== 'string' || !word) return false;
    const w = word.normalize('NFC');
    const len = w.length;
    const bucket = this.byLen.get(len);
    if (bucket) {
      if (!bucket.includes(w)) bucket.push(w); // 去重
    } else {
      this.byLen.set(len, [w]);
    }
    return true;
  }

  remove(word) {
    const w = word.normalize('NFC');
    const len = w.length;
    const arr = this.byLen.get(len);
    if (!arr) return false;
    const i = arr.indexOf(w);
    if (i === -1) return false;
    arr.splice(i, 1);
    if (arr.length === 0) this.byLen.delete(len);
    return true;
  }

  has(word) {
    const w = word.normalize('NFC');
    const len = w.length;
    const arr = this.byLen.get(len) || [];
    return arr.includes(w);
  }

  // 获取同长度候选
  searchByLength(len) {
    return [...(this.byLen.get(len) || [])];
  }

  // 子串匹配：在长度 >= 子串长度的桶里扫描
  searchIncludes(substr) {
    const s = substr.normalize('NFC');
    const L = s.length;
    const out = [];
    for (const [len, arr] of this.byLen.entries()) {
      if (len >= L) {
        for (const w of arr) if (w.includes(s)) out.push(w);
      }
    }
    return out;
  }

  // 正则匹配：对所有桶做正则（如需提速，先按长度过滤）
  searchRegex(pattern) {
    const reg = new RegExp(String(pattern));
    const out = [];
    for (const arr of this.byLen.values()) {
      for (const w of arr) if (reg.test(w)) out.push(w);
    }
    return out;
  }

  // 通配符匹配：只支持 '.'，并且要求全词匹配（等长）
  searchWildcard(pat) {
    const len = pat.length;
    const arr = this.byLen.get(len) || [];
    // 将特殊字符转义，保留 '.' 作为任意字符
    const safe = '^' + pat
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // 先整体转义
      .replace(/\\\./g, '.') + '$';             // 仅还原 '.'
    const reg = new RegExp(safe);
    return arr.filter(w => reg.test(w));
  }
}

// 使用演示
const dict = new WordDictionary();
['code', 'cote', 'cope', 'copee', 'note', 'node'].forEach(w => dict.add(w));

console.log(dict.searchByLength(4));          // 同长度候选
console.log(dict.searchIncludes('op'));       // 子串包含
console.log(dict.searchRegex(/^co/));         // 正则前缀
console.log(dict.searchWildcard('co.e'));     // 模糊：c o 任意 e
console.log(dict.has('code'));                // true
dict.remove('code');
console.log(dict.has('code'));                // false
```

---

## 变位词（Anagram）分组示例

```js
function groupAnagrams(words) {
  const map = new Map();
  for (const raw of words) {
    const w = raw.normalize('NFC').toLowerCase();
    const key = [...w].sort().join(''); // 排序签名
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(raw);
  }
  return [...map.values()];
}

console.log(groupAnagrams(['eat','tea','ate','tan','nat']));
// => [ [ 'eat', 'tea', 'ate' ], [ 'tan', 'nat' ] ]
```

---

## 面试常见题型与思路
- 通配符搜索（如 LeetCode 211）：若仅支持`.`通配，按“长度分桶”后再匹配；若更复杂，考虑 Trie（前缀树）。
- 变位词分组（LeetCode 49）：排序签名或频次数组为键，`Map` 聚合。
- Word Ladder（LeetCode 127）：同长度、单字符差的邻接构图；可用“通配模板”索引（将每一位替换为 `*` 生成模板作为键）。

---

## 注意事项
- 大小写与语言：根据场景确定是否统一为小写；涉及多语言时注意 `Unicode` 正规化（`normalize('NFC')`）。
- 正则安全与性能：构造正则时注意特殊字符转义；长文本或复杂模式谨防性能问题。
- 去重策略：是否允许重复词；允许则用计数，或改用 `Set`。
- 负载与扩容：数据量很大时，考虑分片索引、持久化存储（如数据库/搜索引擎）。

---

## 小结
- “索引缩小候选 + 适配匹配策略”是高效字符串字典的关键。
- 面试中先明确匹配规则，再选择合适的键设计（长度/首字母/签名/组合）。
- 代码实现保持简单可读，优先保证正确性，再做针对性优化。

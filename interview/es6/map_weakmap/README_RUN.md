# 运行说明

## 文件说明

- `readme.md` - 详细的 Map 和 WeakMap 文档
- `memory_demo.js` - 内存管理演示（需要特殊参数运行）
- `practical_examples.js` - 实际应用示例
- `1.js` - 原始的内存使用示例

## 运行方式

### 1. 运行实际应用示例

```bash
node practical_examples.js
```

### 2. 运行内存管理演示（需要特殊参数）

```bash
node --expose-gc memory_demo.js
```

### 3. 运行原始示例

```bash
node 1.js
```

## 注意事项

1. **内存演示需要 `--expose-gc` 参数**：这个参数允许手动触发垃圾回收
2. **WeakMap 不可遍历**：无法获取所有键或值
3. **WeakMap 键必须是对象**：原始类型会报错
4. **浏览器环境**：某些示例在浏览器中运行效果更好（如 DOM 相关）

## 学习要点

1. **Map vs 普通对象**：
   - Map 的键可以是任何类型
   - Map 保持插入顺序
   - Map 有 size 属性

2. **WeakMap vs Map**：
   - WeakMap 键只能是对象
   - WeakMap 不可遍历
   - WeakMap 使用弱引用，避免内存泄漏

3. **使用场景**：
   - Map：缓存、映射、需要遍历的场景
   - WeakMap：私有属性、DOM 数据存储、避免内存泄漏

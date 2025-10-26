# ListToTree - 列表转树形结构算法

## 题目描述

将平铺的列表数据转换为树形结构，常用于处理省市县等层级数据。

## 数据结构示例

### 输入数据（平铺列表）

```javascript
const list = [
  { id: 1021, name: "北京市", parentId: null },
  { id: 102101, name: "体育路", parentId: 1021 },
  { id: 102102, name: "朝阳区", parentId: 1021 },
  { id: 1022, name: "上海市", parentId: null },
  { id: 102201, name: "浦东新区", parentId: 1022 },
  { id: 102202, name: "黄浦区", parentId: 1022 }
];
```

### 输出数据（树形结构）

```javascript
const tree = [
  {
    id: 1021,
    name: "北京市",
    parentId: null,
    children: [
      { id: 102101, name: "体育路", parentId: 1021, children: [] },
      { id: 102102, name: "朝阳区", parentId: 1021, children: [] }
    ]
  },
  {
    id: 1022,
    name: "上海市", 
    parentId: null,
    children: [
      { id: 102201, name: "浦东新区", parentId: 1022, children: [] },
      { id: 102202, name: "黄浦区", parentId: 1022, children: [] }
    ]
  }
];
```

## 算法实现

### 方法一：递归实现

```javascript
function listToTree(list, parentId = null) {
  return list
    .filter(item => item.parentId === parentId)
    .map(item => ({
      ...item,
      children: listToTree(list, item.id)
    }));
}
```

### 方法二：Map优化实现

```javascript
function listToTree(list) {
  const map = new Map();
  const roots = [];
  
  // 创建映射
  list.forEach(item => {
    map.set(item.id, { ...item, children: [] });
  });
  
  // 构建树形结构
  list.forEach(item => {
    if (item.parentId === null) {
      roots.push(map.get(item.id));
    } else {
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children.push(map.get(item.id));
      }
    }
  });
  
  return roots;
}
```

## 时间复杂度

- 方法一：O(n²) - 每次递归都要遍历整个列表
- 方法二：O(n) - 只需要遍历两次列表

## 应用场景

- 省市县三级联动
- 组织架构树
- 菜单权限树
- 分类目录树

## 注意事项

- 确保数据中没有循环引用
- 处理parentId为null的根节点
- 考虑大数据量时的性能优化

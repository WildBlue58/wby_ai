// 列表项在数据库中怎么存储的？比如 省，市，县...
// 树状菜单 场景题
// id       title    parent
// 86       中国      null
// 36       江西      86
// 0793     抚州      36
// 11201    临川      0793
// 2312345  体育路    11201

const sourceList = [
  {
    id: 1,
    name: "首页",
    parentId: 0,
  },
  {
    id: 2,
    name: "产品",
    parentId: 0,
  },
  {
    id: 3,
    name: "手机",
    parentId: 2,
  },
  {
    id: 4,
    name: "电脑",
    parentId: 2,
  },
  {
    id: 5,
    name: "折叠屏",
    parentId: 3,
  },
];

function listToTree(list, parentId = 0) {
  // 过滤出当前父级下的所有子项
  const children = list.filter((item) => item.parentId === parentId);

  // 为每个子项递归查找其子项
  return children.map((item) => ({
    ...item,
    children: listToTree(list, item.id),
  }));
}

const tree = listToTree(sourceList, 0);
console.log(JSON.stringify(tree, null, 2));

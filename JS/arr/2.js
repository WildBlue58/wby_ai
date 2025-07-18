// 数组是可遍历对象
// 数组是可迭代对象
// 数组是可序列化对象
// 数组是可比较对象
// 数组是可合并对象

// fill 一样的
// Array,静态方法
console.log(Array.of(1, 2, 3)); // 不同值的初始化
// 复杂的计算或转变
console.log(
  Array.from(new Array(26), (val, index) => String.fromCodePoint(index + 65))
);

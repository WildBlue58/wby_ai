const arr = [1, 2, 3, 4, 5];

// const result = arr.filter((num) => num > 2);
// console.log(result);
// 时间复杂度？O(n);
// 能优化吗？
// 但是如果再被告知已经排好序的前提下

// 二分实现
const index = arr.findIndex((num) => num > 2);
const result = arr.slice(index);
console.log(result);

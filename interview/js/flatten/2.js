// reduce [] => 1项
// 多维数组 => 1项1位数组
// reduce 方法把数组合并成一个值
const flatten = arr =>
    arr.reduce((acc, item) => {
        return acc.concat(Array.isArray(item) ? flatten(item) : item);
    }, [])

console.log(flatten([1, [2, 3], [4, [5, 6]]]));

let obj1 = {
  name: "乡乡",
  age: 20,
};

let obj2 = obj1; // 没有实现拷贝
// 不是复印,引用传递，只是换个名字，还是一个东西
obj2.age = 18;

let arr1 = [1, 2, 3];
let arr2 = arr1;
arr2.push(4);
// 怎么实现数组对象的拷贝?
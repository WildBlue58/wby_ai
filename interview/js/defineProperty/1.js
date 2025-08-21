// Object.defineProperty
var obj = {}; // 对象

// ES5 就提供的api 兼容性更好
// react 和 vue 最新版 对浏览器有要求
Object.defineProperty(obj, "num", {
  value: 1,
  // 属性描述
  configurable: true,
  writable: false,
  enumerable: true,
  //   get: function () {
  //     console.log("读取了属性");
  //     return 1;
  //   },
});
// obj.num = 2;
// console.log(obj.num);
// delete obj.num;
// console.log(obj.num);
for (let key in obj) {
  console.log(key + ":" + obj[key]);
}
console.log(Object.getOwnPropertyDescriptor(obj, "num"));
Object.defineProperty(obj, "num", {
  value: 2,
  configurable: true,
  writable: true,
  enumerable: true,
});
obj.name = "乡乡";
console.log(Object.getOwnPropertyDescriptor(obj, "name"));

for (let key in obj) {
  console.log(key, obj[key]);
}

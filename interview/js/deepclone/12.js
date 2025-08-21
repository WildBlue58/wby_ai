let arr1 = [
  {
    name: "乡乡",
    hobbies: ["散步"],
  },
  function () {
    console.log("函数拷贝不了");
  },
];

let arr2 = JSON.parse(JSON.stringify(arr1));
arr2[0].name = "博扬(深拷贝)";
arr2[0].hobbies.push("羽毛球");
console.log(arr1, arr2);

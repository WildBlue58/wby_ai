const obj = {
  name: "杜贵乡",
};

const arrow = () => console.log(this.name);
const normal = function () {
  console.log(this.name);
};

arrow.call(obj);// undefined
normal.call(obj);// 杜贵乡

console.log(arrow.prototype);
console.log(normal.prototype);

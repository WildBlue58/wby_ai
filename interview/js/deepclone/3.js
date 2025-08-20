const target = {
  a: 1,
};

const source = {
  b: {
    // 对象的嵌套
    name: "博扬",
    hobbies: ["唱歌", "羽毛球"],
  },
  c: 1,
};

// 浅拷贝
Object.assign(target, source);
target.b.name = "乡乡";
target.b.hobbies.push("画画");
target.c = 2;

console.log(source.b.name, source.b.hobbies, source.c);

// node 运行 global 顶级对象
global.gc(); // 手动触发垃圾回收
console.log(process.memoryUsage());

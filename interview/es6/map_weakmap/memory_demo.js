// 内存管理演示：Map vs WeakMap
// 需要在 Node.js 中运行，并添加 --expose-gc 参数

console.log('=== Map vs WeakMap 内存管理演示 ===\n');

// 创建测试对象
let testObj = { id: 1, name: 'test object' };

// 创建 Map 和 WeakMap
const map = new Map();
const weakMap = new WeakMap();

// 在两者中存储数据
map.set(testObj, 'map data');
weakMap.set(testObj, 'weakmap data');

console.log('1. 初始状态:');
console.log('Map size:', map.size);
console.log('Map has testObj:', map.has(testObj));
console.log('WeakMap has testObj:', weakMap.has(testObj));
console.log('');

// 删除对 testObj 的引用
console.log('2. 删除对 testObj 的引用:');
testObj = null;

// 手动触发垃圾回收
console.log('3. 手动触发垃圾回收...');
global.gc();

console.log('4. 垃圾回收后:');
console.log('Map size:', map.size); // 仍然是 1，因为 Map 保持强引用
console.log('Map has testObj:', map.has(testObj)); // false，因为 testObj 现在是 null
console.log('WeakMap has testObj:', weakMap.has(testObj)); // false

console.log('\n=== 结论 ===');
console.log('Map 保持强引用，即使对象被删除，Map 中仍然保留引用');
console.log('WeakMap 使用弱引用，当对象被垃圾回收时，WeakMap 中的条目也会被删除');
console.log('WeakMap 适合存储临时数据，避免内存泄漏');

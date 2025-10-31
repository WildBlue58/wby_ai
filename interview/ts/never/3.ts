// 类型判断机制是指编译器根据变量、函数或表达式的初始值或上下文自动推导出类型，无需显示申明
// as 类型断言 告诉编译器 我知道这个变量的类型 你不要报错
function sum(a: number, b: number): number {
  return a + b;
}

// 类型别名
type SumReturnType = ReturnType<typeof sum>;

function fetchData<T>(data: T) {
  return {
    data,
    timestamp: Date.now(),
  };
}

type FetchDataReturnType<T> = ReturnType<typeof fetchData<T>>;

const data = fetchData<string>("hello");
const data2 = fetchData<number>(123);

type A3 = FetchDataReturnType<string>;
type B3 = FetchDataReturnType<number>;

const a3: A3 = data;
const b3: B3 = data2;

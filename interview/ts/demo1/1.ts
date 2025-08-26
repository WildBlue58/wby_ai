let a: any = 1; // any 任何类型，ts新手，狂用any
a = "1"; // 不能滥用，学会用泛型
function getFirstElement(arr: any[]) {
  return arr[0];
}

// 复用性，函数参数，返回值 指定类型
const numbers = [1, 2, 3];
const firstNum = getFirstElement(numbers);
firstNum?.toFixed(2);

const strs = ["a", "b", "c"];
const firstStr = getFirstElement(strs);

// 复用这个函数的同时，传入类型参数
function getFirstElement2<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

const numbers2 = [1, 2, 3];
const firstNum2 = getFirstElement2(numbers2);
firstNum2?.toFixed(2);

const strs2 = ["a", "b", "c"];
const firstStr2 = getFirstElement2(strs2); // ts类型推导

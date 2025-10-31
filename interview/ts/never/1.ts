function neverReturn(): never {
  throw new Error("This function never returns");
}

function loopForever(): never {
  while (true) {
    console.log("This function never returns");
  }
}

// isNaN
// type 常用于类型别名
type IsNever<T> = [T] extends [never] ? true : false;

// 测试
type A = IsNever<never>; // true
type B = IsNever<string>; // false
type C = IsNever<undefined>; // false

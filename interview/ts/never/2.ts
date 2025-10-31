type IsNever1<T> = [T] extends [never] ? true : false;

// 测试
type A1 = IsNever1<never>; // true
type B1 = IsNever1<string>; // false
type C1 = IsNever1<undefined>; // false

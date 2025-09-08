interface Animal {
  name: string;
}

interface Animal {
  age: number;
}

const dragon: Animal = { name: "奶龙", age: 2 };

// 不可以重复声明
type AnimalType = { name: string } & { age: number };

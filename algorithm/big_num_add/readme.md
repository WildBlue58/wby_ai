# 大数相加

- 高精度
  JS Number 类型，不分整数，浮点数，高精度...
  JS 不太适合计算 Python 适合
  表现力强
- 大数字
  边界问题
  Infinity
  -Infinity
  Number.MAX_VALUE
  Number.MIN_VALUE
  Number.POSITIVE_INFINITY
  Number.NEGATIVE_INFINITY
  Number.NaN
  Number.EPSILON

- 字符串化
  
- ES6 bigInt 大数类型

## BigInt
   安全 (2^53 - 1) 9007199254740991 Number.MAX_SAFE_INTEGER
   JavaScript 使用 IEEE 754 双精度浮点数标准
   双精度浮点数使用 64 位来存储数字
   这 64 位被分为：
   1 位符号位（表示正负）
   11 位指数位
   52 位尾数位（实际是 53 位，因为有一个隐含的 1）
   ES6 新增的第六种简单数据类型,BigInt 类型，用于表示任意大的整数
   后面加 n
   BigInt(""),不能new
   无限大，无溢出问题（位数溢出）
   不能混合Number 和 BigInt 运算
   JS 适合大型语言项目开发

## 这篇博客已写完
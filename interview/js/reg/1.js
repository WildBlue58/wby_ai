// 正则表达式基础练习
var str = "abc345efgabcab";

console.log("原始字符串:", str);
console.log("=".repeat(50));

// 1. 去掉字符串中的a、b、c字符
console.log("1. 去掉字符串中的a、b、c字符:");
var reg1 = /[abc]/g; // 匹配a、b、c中的任意一个字符
var result1 = str.replace(reg1, "");
console.log("结果:", result1);
console.log("解释: /[abc]/g 表示匹配方括号内的任意字符，g表示全局匹配");
console.log("");

// 2. 将字符串中的数字用中括号括起来
console.log("2. 将字符串中的数字用中括号括起来:");
var reg2 = /\d+/g; // 匹配一个或多个数字
var result2 = str.replace(reg2, function (match) {
  return `[${match}]`;
});
console.log("结果:", result2);
console.log(
  "解释: /\\d+/g 表示匹配一个或多个数字，\\d表示数字，+表示一个或多个"
);
console.log("");

// 3. 将字符串中的每个数字的值分别乘以2
console.log("3. 将字符串中的每个数字的值分别乘以2:");
var reg3 = /\d+/g;
var result3 = str.replace(reg3, function (match) {
  return parseInt(match) * 2;
});
console.log("结果:", result3);
console.log("解释: 使用parseInt()将字符串转换为数字，然后乘以2");
console.log("");

// 额外练习：其他常用正则表达式
console.log("额外练习 - 其他常用正则表达式:");
console.log("=".repeat(30));

// 匹配所有字母
var reg4 = /[a-zA-Z]/g;
var result4 = str.replace(reg4, "*");
console.log("将所有字母替换为*:", result4);

// 匹配连续的数字
var reg5 = /\d{2,}/g; // 匹配2个或更多连续数字
var result5 = str.replace(reg5, "[数字]");
console.log("将2个或更多连续数字替换为[数字]:", result5);

// 匹配以a开头的单词
var reg6 = /\ba\w*/g; // \b表示单词边界，\w表示字母数字下划线
var result6 = str.replace(reg6, "[以a开头]");
console.log("将以a开头的单词替换为[以a开头]:", result6);

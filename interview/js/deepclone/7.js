// 怎么用的
// 默认值，用户会传的，Object.assign 收入囊中
// 目标对象{}空对象 合并用户传参和默认参数，合并配置文件对象
// Option 是会传入的对象
function createUser(options) {
  const defaults = {
    name: "乡乡",
    age: "20",
    isAdmin: false,
  };

  const config = Object.assign({}, defaults, options);
  console.log(config);
}

createUser({
  name: "王博扬",
  age: "19",
  isAdmin: true,
});

const baseConfig = { api: "/api", timeout: 500 };
const envConfig = { timeout: 10000, debug: true };
const finalConfig = Object.assign({}, baseConfig, envConfig);
console.log(finalConfig);

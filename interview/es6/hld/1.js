// 红绿灯
// 同步阻塞;
// sleep函数
// 显示时间;
// 轮询;

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

(async () => {
  console.log("begin");
  // 异步变同步
  await sleep(2000);
  console.log("end");
})();

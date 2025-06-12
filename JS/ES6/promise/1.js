// 读取1.html 里面的内容
// 读取完后 打印 读完了
// 使用 __dirname 获取当前文件所在目录的绝对路径

const fs = require('fs'); // 引入js 内置的文件模块
const path = require('path'); // 引入path模块处理路径
const filePath = path.join(__dirname, '1.html');
const readFilePromise = new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
  if (err) {
    console.error('读取文件出错：', err);
    return;
  }
        console.log('文件内容：', data.toString());
        resolve();
  console.log('读完了');
})
})



// fs.readFile(filePath, (err, data) => {
//   if (err) {
//     console.error('读取文件出错：', err);
//     return;
//   }
//   console.log('文件内容：', data.toString());
//   console.log('读完了');
// })

readFilePromise
    .then(() => {
        console.log('1111');
  })
console.log('1111');

// ===== 文件读取示例 =====
// 目标：读取1.html文件的内容并在读取完成后打印提示信息
// 使用 __dirname 获取当前文件所在目录的绝对路径

// 引入Node.js内置的文件系统模块，用于文件操作
const fs = require('fs'); 
// 引入path模块，用于处理文件路径
const path = require('path'); 

// 使用path.join()方法将当前目录路径和文件名拼接成完整的文件路径
const filePath = path.join(__dirname, '1.html');

// 创建一个新的Promise对象来处理文件读取
// Promise是ES6中处理异步操作的一种方式
const readFilePromise = new Promise((resolve, reject) => {
    // 使用fs.readFile异步读取文件
    // 参数1：文件路径
    // 参数2：回调函数，接收错误对象和数据
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('读取文件出错：', err);
            return;
        }
        // 将读取到的Buffer数据转换为字符串并打印
        console.log('文件内容：', data.toString());
        // 调用resolve()表示Promise成功完成
        resolve();
        // 注意：这行代码会在resolve()之后执行
        console.log('读完了');
    })
})

// 注释掉的原始回调方式代码
// fs.readFile(filePath, (err, data) => {
//   if (err) {
//     console.error('读取文件出错：', err);
//     return;
//   }
//   console.log('文件内容：', data.toString());
//   console.log('读完了');
// })

// 使用Promise的then方法处理异步操作完成后的逻辑
readFilePromise
    .then(() => {
        console.log('1111');  // 这行会在Promise完成后执行
    })

// 这行是同步代码，会立即执行
console.log('1111');

// 代码执行顺序说明：
// 1. 首先执行同步代码，打印第一个'1111'
// 2. 然后开始异步读取文件
// 3. 文件读取完成后，打印文件内容
// 4. 打印'读完了'
// 5. 最后执行then中的回调，打印第二个'1111'

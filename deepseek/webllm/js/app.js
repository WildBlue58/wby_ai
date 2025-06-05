// console.log("WebLLM 项目已启动！");
// JS 主动的去拉取http 接口
// Web 1.0 时代 HTML/CSS/JS 服务器端Java 返回的 JS 只做简单的交互
// Web 2.0 时代 JS 主动的请求后端服务器 动态页面
// fetch('https://api.github.com/users/WildBlue58/repos')
//   .then(res => res.json())
//   .then(data => {
//       //console.log(data);
//       document.querySelector('#reply').innerHTML += data.map(repo => `
//         <ul>
//           <li>${repo.name}</li>
//         </ul>
//         `).join('');
//   })


// 当LLM API 服务
// Chat 方式 AIGC 生成/完成 返回的内容
// 由OpenAI 制定的
// 请求行
const endpoint = "https://api.deepseek.com/chat/completions"
// 请求头
const headers = {
    // 内容类型
    'Content-Type': 'application/json',
    // 授权
    Authorization : `Bearer sk-20a0fdcb8551407d816d53546b5053db`
}
// 请求体
const payload = {
    model: "deepseek-chat",
    messages: [
        {
            role: "system",
            content: "You are a helpful assistant."
        },
        {
            role: "user",
            content: "你好,Deepseek"
        }
    ],
    // stream: true 流式返回
}

fetch(endpoint, {
    method: "POST",// 请求方法
    headers: headers,// 请求头
    body: JSON.stringify(payload)// 请求体
}).then(res => res.json())
.then(data => {
    console.log(data);
    document.querySelector('#reply').innerHTML +=
        data.choices[0].message.content;
})
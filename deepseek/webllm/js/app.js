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
// 命名
// WebLLM Web 底层是 http 协议
// LLM API 服务
// api.deepseek.com 二级域名 LLM服务以API的方式提供
// https 加密的http 更安全
// /chat 聊天的方式 messages 
const endpoint = "https://api.deepseek.com/chat/completions" //deepseek_url
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
        // Chat 三种方式
        // 1. 系统角色 只会出现一次 设置系统的角色 开始会话时
        // 2. 用户角色 user 提问
        // 3. 助手角色
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
    // http 请求传输只能是字符串，二进制流
    body: JSON.stringify(payload)// 请求体
    // 请求 + LLM 生成需要花时间
    // http 是基于请求相应的简单协议
    // 返回的也是文本或二进制流
}).then(res => res.json())
    // 解析返回的json 数据 也要花时间
.then(data => {
    console.log(data);
    document.querySelector('#reply').innerHTML +=
        data.choices[0].message.content;
})
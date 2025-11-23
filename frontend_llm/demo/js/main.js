// llm api 地址 
const endpoint = 'https://api.deepseek.com/chat/completions';

// 调用API的异步函数
async function callDeepSeekAPI() {
  try {
    // 请求头
    const headers = {
      'Content-Type': 'application/json',
      // api key 请求令牌
      'Authorization': 'Bearer sk-7fd4c17419044182a9e492c9800952a4'
    }
    
    // 请求体
    const payload = {
      model: 'deepseek-chat',
      messages: [
        { role: "system", content: "You are a helpful assistant."},
        { role: "user", content: "你好 DeepSeek" }
      ]
    }

    const response = await fetch(endpoint, {
      // POST 更安全 请求体
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    })

    const data = await response.json();
    console.log(data);

    document.getElementById('reply').textContent  = 
      data.choices[0].message.content;
  } catch (error) {
    console.error('调用API时发生错误:', error);
    document.getElementById('reply').textContent = '请求失败，请检查控制台';
  }
}

// 页面加载完成后调用API
callDeepSeekAPI();
# WebLLM 智能应用

一个现代化的原生 HTML/CSS/JavaScript 聊天应用，集成 **Deepseek API**，提供真实的 AI 智能对话体验。

## 🌟 特性

- **🤖 真实 AI 对话**：集成 Deepseek API，提供智能、自然的对话体验
- **🎨 现代化UI**：美观的渐变背景和毛玻璃效果
- **🌙 主题切换**：支持明暗主题切换
- **💾 数据持久化**：自动保存聊天历史和对话上下文
- **⌨️ 快捷键支持**：提供便捷的键盘操作
- **📱 响应式设计**：完美适配各种设备
- **✨ 动画效果**：流畅的交互动画
- **🔄 上下文感知**：保持对话连贯性，支持多轮对话

## 🚀 快速开始

1. **直接运行**：
   ```bash
   # 打开 index.html 文件即可运行
   open index.html
   ```

2. **或使用本地服务器**：
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 使用 Node.js
   npx http-server .
   ```

3. **访问应用**：
   在浏览器中打开 `http://localhost:8000`

## 📁 项目结构

```
webllm/
├── index.html          # 主页面
├── config.js          # 配置文件（包含 API 设置）
├── css/
│   └── style.css      # 样式文件
├── js/
│   └── app.js         # 应用逻辑（集成 Deepseek API）
└── README.md          # 项目说明
```

## 🤖 AI 功能

本应用集成了 **Deepseek API**，具备以下 AI 能力：

- **自然语言理解**：准确理解用户意图和问题
- **智能回答**：基于上下文提供有用、准确的回答
- **多轮对话**：维持对话连贯性，支持复杂的多轮交互
- **中文优化**：针对中文对话进行优化
- **实时响应**：快速的 API 调用和响应处理

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Enter` | 发送消息（单独按下） |
| `Shift + Enter` | 换行 |
| `Ctrl/Cmd + Enter` | 快速发送消息 |
| `Ctrl/Cmd + D` | 切换深色主题 |
| `Ctrl/Cmd + L` | 清空对话历史 |

## 🛠️ 技术栈

- **HTML5**：语义化结构
- **CSS3**：现代化样式和动画
- **Vanilla JavaScript**：原生 JavaScript，无依赖
- **Deepseek API**：真实的 AI 对话能力
- **LocalStorage**：本地数据存储
- **Web APIs**：现代浏览器 API

## 🎨 UI 特性

- **渐变背景**：美观的紫色渐变效果
- **毛玻璃效果**：现代化的半透明设计
- **消息气泡**：区分用户和助手消息
- **加载动画**：处理过程中的视觉反馈
- **滚动条美化**：自定义滚动条样式
- **响应式布局**：适配移动端和桌面端

## 🔧 配置说明

### API 配置

在 `config.js` 文件中可以配置 API 相关参数：

```javascript
api: {
    enabled: true,
    endpoint: 'https://api.deepseek.com/chat/completions',
    apiKey: 'your-api-key-here',
    model: 'deepseek-chat',
    temperature: 0.7,
    max_tokens: 2000
}
```

### 修改主题颜色

编辑 `css/style.css` 文件中的渐变色：

```css
body {
  background: linear-gradient(135deg, #你的颜色1 0%, #你的颜色2 100%);
}
```

### 自定义系统提示

在 `js/app.js` 的 `getRecentMessagesForAPI` 方法中修改系统角色设置：

```javascript
{
    role: "system",
    content: "你的自定义系统提示"
}
```

## 🔐 安全说明

- **API 密钥**：请妥善保管您的 Deepseek API 密钥
- **生产环境**：在生产环境中，建议通过后端服务器代理 API 调用
- **请求限制**：注意 API 的调用频率和配额限制

## 🌐 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 🎯 后续计划

- [ ] 支持文件上传
- [ ] 集成语音识别
- [ ] 添加表情符号支持
- [ ] 多语言国际化
- [ ] PWA 支持
- [ ] 云端同步
- [ ] 支持更多 AI 模型
- [ ] 流式响应支持

---

**享受与 WebLLM + Deepseek 的智能对话体验！** 🤖💬 
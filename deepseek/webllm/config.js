/**
 * WebLLM 应用配置文件
 * 可在此处修改应用的各种设置
 */

window.WebLLMConfig = {
    // 应用信息
    app: {
        name: 'WebLLM 智能应用',
        version: '1.0.0',
        description: '一个现代化的原生 HTML/CSS/JavaScript 聊天应用'
    },

    // UI 配置
    ui: {
        // 主题配置
        theme: {
            defaultDark: false,
            enableThemeToggle: true,
            customColors: {
                primary: '#667eea',
                secondary: '#764ba2',
                accent: '#3498db'
            }
        },

        // 动画配置
        animation: {
            messageSlideIn: true,
            loadingSpinner: true,
            buttonHover: true,
            duration: 300 // 毫秒
        },

        // 消息配置
        messages: {
            maxHeight: 500,
            minHeight: 400,
            showTimestamp: true,
            timeFormat: 'zh-CN',
            autoScroll: true
        }
    },

    // 功能配置
    features: {
        // 存储配置
        storage: {
            enabled: true,
            prefix: 'webllm-',
            autoSave: true
        },

        // 快捷键配置
        shortcuts: {
            enabled: true,
            sendMessage: ['Enter'],
            quickSend: ['Ctrl+Enter', 'Cmd+Enter'],
            toggleTheme: ['Ctrl+d', 'Cmd+d'],
            clearHistory: ['Ctrl+l', 'Cmd+l']
        },

        // 响应配置
        responses: {
            enabled: true,
            simulateDelay: true,
            minDelay: 1000,
            maxDelay: 3000,
            randomize: true
        }
    },

    // 消息模板
    messages: {
        welcome: `欢迎使用 **WebLLM 智能应用**！

我是您的智能助手，可以与您进行对话交流。您可以：
• 向我提问任何问题
• 使用 \`Ctrl+D\` 切换深色主题
• 使用 \`Ctrl+L\` 清空对话历史
• 使用 \`Ctrl+Enter\` 快速发送消息

请开始我们的对话吧！`,

        error: '抱歉，处理您的消息时出现了错误。请稍后再试。',
        
        loading: '正在思考中...',
        
        cleared: '好的，我已经清空了对话历史。让我们重新开始吧！'
    },

    // 预定义响应
    responses: {
        greetings: [
            '你好！我是 WebLLM 智能助手，很高兴为您服务。有什么我可以帮助您的吗？',
            '您好！欢迎使用 WebLLM 智能应用。我可以回答问题、提供建议或与您聊天。',
            '嗨！很高兴见到您。请告诉我您需要什么帮助吧！'
        ],

        time: [
            '现在的时间是：{time}'
        ],

        weather: [
            '抱歉，我目前无法获取实时天气信息。建议您查看天气应用或网站获取准确的天气预报。',
            '我无法提供实时天气数据，但您可以通过天气应用或搜索引擎查询当地天气情况。'
        ],

        capabilities: [
            `我可以与您进行对话交流、回答问题、提供建议等。当前支持的功能包括：
• 智能对话
• 消息历史记录
• 主题切换（Ctrl+D）
• 清空对话（Ctrl+L）`,
            `作为 WebLLM 智能助手，我可以帮您：
• 回答各种问题
• 进行日常对话
• 提供信息和建议
• 协助思考和分析问题`
        ],

        default: [
            '我理解您的意思。请告诉我更多详细信息，我会尽力帮助您。',
            '这是一个有趣的话题！您能详细说说吗？',
            '感谢您的消息。我正在思考最佳的回复方式...',
            '很好的问题！让我为您提供一些想法和建议。',
            '我明白了。这个话题有很多方面可以探讨，您希望从哪个角度开始？'
        ]
    },

    // API 配置（用于连接真实的 AI 服务）
    api: {
        enabled: true,
        endpoint: 'https://api.deepseek.com/chat/completions',
        apiKey: 'sk-20a0fdcb8551407d816d53546b5053db',
        model: 'deepseek-chat',
        timeout: 30000,
        temperature: 0.7,
        max_tokens: 2000,
        headers: {
            'Content-Type': 'application/json'
        }
    },

    // 开发配置
    development: {
        debug: false,
        verbose: false,
        logLevel: 'info' // 'debug', 'info', 'warn', 'error'
    }
}; 
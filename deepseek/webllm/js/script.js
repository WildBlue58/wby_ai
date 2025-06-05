/**
 * WebLLM 智能应用主程序
 * 提供聊天界面、消息管理、主题切换等功能
 */

class WebLLMApp {

    constructor() {
        this.messages = [];
        this.isLoading = false;
        this.isDarkTheme = false;
        
        // DOM 元素
        this.messageContainer = document.querySelector('.message-container');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        
        this.init();
    }

    /**
     * 初始化应用程序
     */
    init() {
        this.setupEventListeners();
        this.loadStoredMessages();
        this.loadThemePreference();
        this.displayWelcomeMessage();
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 发送按钮点击事件
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        
        // 输入框键盘事件
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        // 输入框实时调整高度
        this.messageInput.addEventListener('input', () => {
            this.adjustTextareaHeight();
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter 发送消息
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                this.handleSendMessage();
            }
            // Ctrl/Cmd + D 切换主题
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.toggleTheme();
            }
            // Ctrl/Cmd + L 清空对话
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                this.clearMessages();
            }
        });
    }

    /**
     * 处理发送消息
     */
    async handleSendMessage() {
        const messageText = this.messageInput.value.trim();
        
        if (!messageText || this.isLoading) {
            return;
        }

        // 添加用户消息
        this.addMessage(messageText, 'user');
        this.messageInput.value = '';
        this.adjustTextareaHeight();

        // 显示加载状态
        this.setLoading(true);

        // 模拟 AI 响应处理
        try {
            const response = await this.processMessage(messageText);
            this.addMessage(response, 'assistant');
        } catch (error) {
            this.addMessage('抱歉，处理您的消息时出现了错误。请稍后再试。', 'assistant');
            console.error('消息处理错误:', error);
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * 添加消息到界面
     * @param {string} text - 消息内容
     * @param {string} sender - 发送者类型 ('user' 或 'assistant')
     */
    addMessage(text, sender) {
        const message = {
            id: Date.now(),
            text,
            sender,
            timestamp: new Date()
        };

        this.messages.push(message);
        this.renderMessage(message);
        this.saveMessages();
        this.scrollToBottom();
    }

    /**
     * 渲染单条消息
     * @param {Object} message - 消息对象
     */
    renderMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender}`;
        messageDiv.setAttribute('data-id', message.id);

        const timeString = message.timestamp.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageDiv.innerHTML = `
            <div class="message-content">${this.formatMessageText(message.text)}</div>
            <div class="timestamp">${timeString}</div>
        `;

        this.messageContainer.appendChild(messageDiv);
    }

    /**
     * 格式化消息文本（支持简单的 Markdown）
     * @param {string} text - 原始文本
     * @returns {string} - 格式化后的 HTML
     */
    formatMessageText(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    /**
     * 模拟处理消息并返回响应
     * @param {string} userMessage - 用户消息
     * @returns {Promise<string>} - AI 响应
     */
    async processMessage(userMessage) {
        // 模拟网络延迟
        await this.delay(1000 + Math.random() * 2000);

        // 简单的响应逻辑
        const responses = this.getResponseForMessage(userMessage);
        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * 根据用户消息获取可能的响应
     * @param {string} message - 用户消息
     * @returns {Array<string>} - 响应数组
     */
    getResponseForMessage(message) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('你好') || lowerMessage.includes('hello')) {
            return [
                '你好！我是 WebLLM 智能助手，很高兴为您服务。有什么我可以帮助您的吗？',
                '您好！欢迎使用 WebLLM 智能应用。我可以回答问题、提供建议或与您聊天。',
                '嗨！很高兴见到您。请告诉我您需要什么帮助吧！'
            ];
        }

        if (lowerMessage.includes('时间') || lowerMessage.includes('现在几点')) {
            const now = new Date().toLocaleString('zh-CN');
            return [`现在的时间是：${now}`];
        }

        if (lowerMessage.includes('天气')) {
            return [
                '抱歉，我目前无法获取实时天气信息。建议您查看天气应用或网站获取准确的天气预报。',
                '我无法提供实时天气数据，但您可以通过天气应用或搜索引擎查询当地天气情况。'
            ];
        }

        if (lowerMessage.includes('功能') || lowerMessage.includes('能做什么')) {
            return [
                '我可以与您进行对话交流、回答问题、提供建议等。当前支持的功能包括：\n• 智能对话\n• 消息历史记录\n• 主题切换（Ctrl+D）\n• 清空对话（Ctrl+L）',
                '作为 WebLLM 智能助手，我可以帮您：\n• 回答各种问题\n• 进行日常对话\n• 提供信息和建议\n• 协助思考和分析问题'
            ];
        }

        if (lowerMessage.includes('清空') || lowerMessage.includes('清除')) {
            this.clearMessages();
            return ['好的，我已经清空了对话历史。让我们重新开始吧！'];
        }

        // 默认响应
        return [
            '我理解您的意思。请告诉我更多详细信息，我会尽力帮助您。',
            '这是一个有趣的话题！您能详细说说吗？',
            '感谢您的消息。我正在思考最佳的回复方式...',
            '很好的问题！让我为您提供一些想法和建议。',
            '我明白了。这个话题有很多方面可以探讨，您希望从哪个角度开始？'
        ];
    }

    /**
     * 设置加载状态
     * @param {boolean} loading - 是否加载中
     */
    setLoading(loading) {
        this.isLoading = loading;
        this.sendButton.disabled = loading;
        
        if (loading) {
            this.sendButton.innerHTML = '<span class="loading"></span>';
        } else {
            this.sendButton.innerHTML = '发送';
        }
    }

    /**
     * 调整文本框高度
     */
    adjustTextareaHeight() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    /**
     * 滚动到底部
     */
    scrollToBottom() {
        setTimeout(() => {
            this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
        }, 100);
    }

    /**
     * 显示欢迎消息
     */
    displayWelcomeMessage() {
        if (this.messages.length === 0) {
            setTimeout(() => {
                this.addMessage(
                    '欢迎使用 **WebLLM 智能应用**！\n\n我是您的智能助手，可以与您进行对话交流。您可以：\n• 向我提问任何问题\n• 使用 `Ctrl+D` 切换深色主题\n• 使用 `Ctrl+L` 清空对话历史\n• 使用 `Ctrl+Enter` 快速发送消息\n\n请开始我们的对话吧！',
                    'assistant'
                );
            }, 500);
        }
    }

    /**
     * 切换主题
     */
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.classList.toggle('dark-theme', this.isDarkTheme);
        localStorage.setItem('webllm-dark-theme', this.isDarkTheme);
    }

    /**
     * 加载主题偏好
     */
    loadThemePreference() {
        const saved = localStorage.getItem('webllm-dark-theme');
        if (saved === 'true') {
            this.isDarkTheme = true;
            document.body.classList.add('dark-theme');
        }
    }

    /**
     * 清空消息
     */
    clearMessages() {
        this.messages = [];
        this.messageContainer.innerHTML = '';
        localStorage.removeItem('webllm-messages');
        this.displayWelcomeMessage();
    }

    /**
     * 保存消息到本地存储
     */
    saveMessages() {
        try {
            localStorage.setItem('webllm-messages', JSON.stringify(this.messages));
        } catch (error) {
            console.warn('无法保存消息到本地存储:', error);
        }
    }

    /**
     * 从本地存储加载消息
     */
    loadStoredMessages() {
        try {
            const stored = localStorage.getItem('webllm-messages');
            if (stored) {
                this.messages = JSON.parse(stored).map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
                
                this.messages.forEach(message => this.renderMessage(message));
                this.scrollToBottom();
            }
        } catch (error) {
            console.warn('无法加载存储的消息:', error);
            this.messages = [];
        }
    }

    /**
     * 延迟函数
     * @param {number} ms - 延迟毫秒数
     * @returns {Promise}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 应用程序入口点
document.addEventListener('DOMContentLoaded', () => {
    // 初始化应用
    window.webLLMApp = new WebLLMApp();
    
    // 全局错误处理
    window.addEventListener('error', (event) => {
        console.error('应用程序错误:', event.error);
    });
    
    // 页面可见性变化处理
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // 页面重新可见时，聚焦到输入框
            window.webLLMApp.messageInput.focus();
        }
    });
    
    console.log('WebLLM 智能应用已启动！');
});


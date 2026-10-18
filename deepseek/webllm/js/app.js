/**
 * WebLLM 智能应用主程序
 * 提供聊天界面、消息管理、主题切换等功能
 * 集成 Deepseek API 进行真实的 AI 对话
 */

class WebLLMApp {

    constructor() {
        this.messages = [];
        this.isLoading = false;
        this.isDarkTheme = false;
        this.isModalOpen = false;
        
        // DOM 元素
        this.chatModal = document.getElementById('chatModal');
        this.messageContainer = document.querySelector('.message-container');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.startChatButton = document.getElementById('startChatButton');
        this.closeChatButton = document.getElementById('closeChatButton');
        this.clearChatButton = document.getElementById('clearChatButton');
        this.toggleThemeButton = document.getElementById('toggleThemeButton');
        
        // Deepseek API 配置
        this.endpoint = "https://api.deepseek.com/chat/completions";
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + ((typeof window !== 'undefined' && window.DEEPSEEK_API_KEY) || '')
        };
        
        this.init();
    }

    /**
     * 初始化应用程序
     */
    init() {
        this.setupEventListeners();
        this.loadStoredMessages();
        this.loadThemePreference();
        this.addWelcomeMessage();
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 开始对话按钮
        this.startChatButton.addEventListener('click', () => this.openChatModal());
        
        // 关闭对话按钮
        this.closeChatButton.addEventListener('click', () => this.closeChatModal());
        
        // 清空对话按钮
        this.clearChatButton.addEventListener('click', () => this.confirmClearMessages());
        
        // 主题切换按钮
        this.toggleThemeButton.addEventListener('click', () => this.toggleTheme());
        
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

        // 模态框背景点击关闭
        this.chatModal.addEventListener('click', (e) => {
            if (e.target === this.chatModal) {
                this.closeChatModal();
            }
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // ESC 关闭模态框
            if (e.key === 'Escape' && this.isModalOpen) {
                this.closeChatModal();
            }
            
            // 只在模态框打开时响应其他快捷键
            if (this.isModalOpen) {
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
                    this.confirmClearMessages();
                }
            }
        });
    }

    /**
     * 打开对话模态框
     */
    openChatModal() {
        this.isModalOpen = true;
        this.chatModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // 延迟聚焦，确保动画完成
        setTimeout(() => {
            this.messageInput.focus();
            this.scrollToBottom();
        }, 300);
    }

    /**
     * 关闭对话模态框
     */
    closeChatModal() {
        this.isModalOpen = false;
        this.chatModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * 确认清空消息
     */
    confirmClearMessages() {
        if (this.messages.length === 0) {
            this.showNotification('对话记录已经是空的了！', 'info');
            return;
        }

        const confirmed = confirm('确定要清空所有对话记录吗？此操作不可撤销。');
        if (confirmed) {
            this.clearMessages();
            this.showNotification('对话记录已清空！', 'success');
        }
    }

    /**
     * 显示通知消息
     * @param {string} message - 通知内容
     * @param {string} type - 通知类型 ('success', 'info', 'warning', 'error')
     */
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${this.getNotificationIcon(type)}</span>
            <span class="notification-text">${message}</span>
        `;
        
        // 添加样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#10B981' : 
                       type === 'error' ? '#EF4444' : 
                       type === 'warning' ? '#F59E0B' : '#4A90E2',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'slideInRight 0.3s ease-out',
            fontSize: '14px',
            fontWeight: '500'
        });

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * 获取通知图标
     * @param {string} type - 通知类型
     * @returns {string} - 图标字符
     */
    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
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

        // 调用真实的 AI API 处理
        try {
            const response = await this.processMessage(messageText);
            this.addMessage(response, 'assistant');
        } catch (error) {
            this.addMessage('抱歉，处理您的消息时出现了错误。请稍后再试。', 'assistant');
            console.error('消息处理错误:', error);
            this.showNotification('消息处理失败，请检查网络连接', 'error');
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

        const avatar = message.sender === 'user' ? '👤' : '🤖';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-body">
                <div class="message-content">${this.formatMessageText(message.text)}</div>
                <div class="timestamp">${timeString}</div>
            </div>
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
     * 调用 Deepseek API 处理消息并返回响应
     * @param {string} userMessage - 用户消息
     * @returns {Promise<string>} - AI 响应
     */
    async processMessage(userMessage) {
        try {
            // 构建对话历史，包含最近的几条消息作为上下文
            const recentMessages = this.getRecentMessagesForAPI(userMessage);
            
            const payload = {
                model: "deepseek-chat",
                messages: recentMessages,
                temperature: 0.7,
                max_tokens: 2000
            };

            const response = await fetch(this.endpoint, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.choices && data.choices.length > 0) {
                return data.choices[0].message.content;
            } else {
                throw new Error('API 返回数据格式异常');
            }
        } catch (error) {
            console.error('调用 Deepseek API 时发生错误:', error);
            // 如果 API 调用失败，返回友好的错误消息
            return `抱歉，我现在无法连接到 AI 服务。错误信息：${error.message}`;
        }
    }

    /**
     * 获取最近的消息历史用于 API 调用
     * @param {string} currentMessage - 当前用户消息
     * @returns {Array} - 格式化的消息数组
     */
    getRecentMessagesForAPI(currentMessage) {
        const messages = [
            {
                role: "system",
                content: "你是一个有用、友善、聪明的 AI 助手。请用简体中文回答问题，保持对话自然流畅。你的回答应该准确、有帮助，并且具有人性化的特点。"
            }
        ];

        // 获取最近的 8 条消息作为上下文（不包括当前消息）
        const recentMessages = this.messages.slice(-8);
        
        for (const msg of recentMessages) {
            if (msg.sender === 'user') {
                messages.push({
                    role: "user",
                    content: msg.text
                });
            } else if (msg.sender === 'assistant') {
                messages.push({
                    role: "assistant",
                    content: msg.text
                });
            }
        }

        // 添加当前用户消息
        messages.push({
            role: "user",
            content: currentMessage
        });

        return messages;
    }

    /**
     * 设置加载状态
     * @param {boolean} loading - 是否加载中
     */
    setLoading(loading) {
        this.isLoading = loading;
        this.sendButton.disabled = loading;
        
        if (loading) {
            this.sendButton.innerHTML = '<span class="loading"></span> 思考中...';
        } else {
            this.sendButton.innerHTML = '<span class="send-icon">📤</span> 发送';
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
     * 添加欢迎消息
     */
    addWelcomeMessage() {
        // 只在首次访问或消息为空时显示欢迎消息
        if (this.messages.length === 0) {
            const welcomeMessage = {
                id: Date.now(),
                text: '你好！我是由 **Deepseek** 驱动的智能助手 🤖\n\n我可以帮助您：\n• 回答各种问题\n• 进行自然对话\n• 提供信息和建议\n• 协助思考和分析问题\n\n快捷键提示：\n• `Enter` 发送消息\n• `Ctrl+Enter` 快速发送\n• `Ctrl+L` 清空对话\n• `Ctrl+D` 切换主题\n• `ESC` 关闭对话窗口\n\n请随时向我提问，让我们开始愉快的对话吧！✨',
                sender: 'assistant',
                timestamp: new Date()
            };
            
            this.messages.push(welcomeMessage);
            this.renderMessage(welcomeMessage);
            this.saveMessages();
        }
    }

    /**
     * 切换主题
     */
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.classList.toggle('dark-theme', this.isDarkTheme);
        localStorage.setItem('webllm-dark-theme', this.isDarkTheme);
        
        // 更新主题按钮图标
        this.toggleThemeButton.innerHTML = this.isDarkTheme ? 
            '<span>☀️</span>' : '<span>🌙</span>';
            
        this.showNotification(
            `已切换到${this.isDarkTheme ? '深色' : '浅色'}主题`, 
            'info'
        );
    }

    /**
     * 加载主题偏好
     */
    loadThemePreference() {
        const saved = localStorage.getItem('webllm-dark-theme');
        if (saved === 'true') {
            this.isDarkTheme = true;
            document.body.classList.add('dark-theme');
            this.toggleThemeButton.innerHTML = '<span>☀️</span>';
        }
    }

    /**
     * 清空消息
     */
    clearMessages() {
        this.messages = [];
        this.messageContainer.innerHTML = '';
        localStorage.removeItem('webllm-messages');
        this.addWelcomeMessage();
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
}

// 添加通知动画样式
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// 应用程序入口点
document.addEventListener('DOMContentLoaded', () => {
    // 初始化应用
    window.webLLMApp = new WebLLMApp();
});
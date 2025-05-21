/** 
 * @desc 页面背景切换
 * @author WildBlue
 * @date 2025-05-10 16：44：00
 */

// JS面向对象语言

// 事件监听器
// 弹窗加载完后
document.getElementById("changeColorButton").addEventListener("click", async () => {
    try {
        // 获取当前激活的标签页
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // 验证标签页URL协议，确保是网页（http/https）
        if (!tab.url?.startsWith('http')) {
            throw new Error('Cannot modify non-web pages');
        }

        // 向内容脚本发送消息，请求改变背景颜色
        const response = await chrome.tabs.sendMessage(tab.id, {
            action: "changeBackgroundColor",  // 指定操作类型
            color: "green"                   // 设置目标颜色
        });
        
        // 检查是否收到内容脚本的响应
        if (!response) {
            throw new Error('No response from content script');
        }

        // 成功日志记录
        console.log('Background changed successfully:', response);
    } catch (error) {
        // 错误日志记录
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        console.error('Connection failed:', error);
        // 显示错误提示给用户
        alert('请刷新页面后重试！\nError: ' + error.message);
    }
});
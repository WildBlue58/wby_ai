// 获取所有面板元素
const panels = document.querySelectorAll('.qq-panel');

// 为每个面板添加点击事件监听器
panels.forEach(panel => {
    // JS 是事件机制的语言
    // 每一个元素上监听
    panel.addEventListener('click', () => {
        console.log('biubiubiu');
        removeActiveClasses(); //模块化
        panel.classList.add("qq-panel_active");
    })
})

/**
 * 移除所有面板的激活状态
 * 这是一个模块化的函数，用于重置所有面板的状态
 */
function removeActiveClasses() {
    panels.forEach(panel => {
        panel.classList.remove('qq-panel_active');
    })
}
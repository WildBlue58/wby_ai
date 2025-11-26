/**
 * 孙悟空的穿越新生活 - 主程序
 * 场景管理和动画控制
 */

class WukongAnimation {
    constructor() {
        // 获取Canvas和Context
        this.canvas = document.getElementById('mainCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 场景列表
        this.scenes = [];
        this.currentSceneIndex = 0;
        
        // 动画状态
        this.isPlaying = false;
        this.autoPlay = true;
        this.lastTimestamp = 0;
        this.animationId = null;
        
        // UI元素
        this.playBtn = document.getElementById('playBtn');
        this.playIcon = document.getElementById('playIcon');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.autoPlayToggle = document.getElementById('autoPlayToggle');
        this.progressFill = document.getElementById('progressFill');
        this.sceneTitle = document.getElementById('sceneTitle');
        this.subtitleText = document.getElementById('subtitleText');
        this.indicators = document.querySelectorAll('.indicator');
        
        // 场景信息
        this.sceneNames = ['时空裂隙', '城市着陆', '地铁历险', '外卖猴王', '直播天王'];
        this.sceneSubtitles = ['第一幕', '第二幕', '第三幕', '第四幕', '第五幕'];
        
        // 初始化
        this.init();
    }

    init() {
        // 初始化场景
        this.initScenes();
        
        // 绑定事件
        this.bindEvents();
        
        // 更新UI
        this.updateUI();
        
        // 显示初始场景
        this.showSceneTitle();
        
        // 自动开始播放
        setTimeout(() => {
            this.play();
        }, 500);
    }

    initScenes() {
        // 创建所有场景实例
        this.scenes = [
            new Scene1(this.canvas, this.ctx),
            new Scene2(this.canvas, this.ctx),
            new Scene3(this.canvas, this.ctx),
            new Scene4(this.canvas, this.ctx),
            new Scene5(this.canvas, this.ctx)
        ];
    }

    bindEvents() {
        // 播放/暂停按钮
        this.playBtn.addEventListener('click', () => {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        });
        
        // 上一个场景
        this.prevBtn.addEventListener('click', () => {
            this.prevScene();
        });
        
        // 下一个场景
        this.nextBtn.addEventListener('click', () => {
            this.nextScene();
        });
        
        // 自动播放开关
        this.autoPlayToggle.addEventListener('change', (e) => {
            this.autoPlay = e.target.checked;
        });
        
        // 场景指示器点击
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToScene(index);
            });
        });
        
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    if (this.isPlaying) {
                        this.pause();
                    } else {
                        this.play();
                    }
                    break;
                case 'ArrowLeft':
                    this.prevScene();
                    break;
                case 'ArrowRight':
                    this.nextScene();
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                    this.goToScene(parseInt(e.key) - 1);
                    break;
            }
        });
    }

    play() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.playIcon.textContent = '⏸';
        this.lastTimestamp = performance.now();
        this.animate();
    }

    pause() {
        this.isPlaying = false;
        this.playIcon.textContent = '▶';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    animate() {
        if (!this.isPlaying) return;
        
        const currentTimestamp = performance.now();
        const deltaTime = currentTimestamp - this.lastTimestamp;
        this.lastTimestamp = currentTimestamp;
        
        // 获取当前场景
        const currentScene = this.scenes[this.currentSceneIndex];
        
        // 更新场景
        currentScene.update(deltaTime);
        
        // 绘制场景
        currentScene.draw();
        
        // 更新字幕
        this.updateSubtitle(currentScene.getSubtitle());
        
        // 更新进度条
        this.updateProgress(currentScene);
        
        // 检查场景是否完成
        if (currentScene.isComplete() && this.autoPlay) {
            this.nextScene();
        }
        
        // 继续动画循环
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    nextScene() {
        if (this.currentSceneIndex < this.scenes.length - 1) {
            // 重置当前场景
            this.scenes[this.currentSceneIndex].reset();
            
            // 切换到下一个场景
            this.currentSceneIndex++;
            this.updateUI();
            this.showSceneTitle();
            
            // 如果暂停状态，绘制新场景的第一帧
            if (!this.isPlaying) {
                this.scenes[this.currentSceneIndex].draw();
            }
        } else if (this.autoPlay) {
            // 循环播放：回到第一个场景
            this.goToScene(0);
        }
    }

    prevScene() {
        if (this.currentSceneIndex > 0) {
            // 重置当前场景
            this.scenes[this.currentSceneIndex].reset();
            
            // 切换到上一个场景
            this.currentSceneIndex--;
            this.updateUI();
            this.showSceneTitle();
            
            // 如果暂停状态，绘制新场景的第一帧
            if (!this.isPlaying) {
                this.scenes[this.currentSceneIndex].draw();
            }
        }
    }

    goToScene(index) {
        if (index >= 0 && index < this.scenes.length && index !== this.currentSceneIndex) {
            // 重置当前场景
            this.scenes[this.currentSceneIndex].reset();
            
            // 切换场景
            this.currentSceneIndex = index;
            this.updateUI();
            this.showSceneTitle();
            
            // 如果暂停状态，绘制新场景的第一帧
            if (!this.isPlaying) {
                this.scenes[this.currentSceneIndex].draw();
            }
        }
    }

    updateUI() {
        // 更新指示器
        this.indicators.forEach((indicator, index) => {
            indicator.classList.remove('active', 'completed');
            
            if (index === this.currentSceneIndex) {
                indicator.classList.add('active');
            } else if (index < this.currentSceneIndex) {
                indicator.classList.add('completed');
            }
        });
        
        // 更新按钮状态
        this.prevBtn.disabled = this.currentSceneIndex === 0;
        this.nextBtn.disabled = this.currentSceneIndex === this.scenes.length - 1 && !this.autoPlay;
    }

    showSceneTitle() {
        const titleOverlay = this.sceneTitle;
        const numberSpan = titleOverlay.querySelector('.scene-number');
        const nameSpan = titleOverlay.querySelector('.scene-name');
        
        numberSpan.textContent = this.sceneSubtitles[this.currentSceneIndex];
        nameSpan.textContent = this.sceneNames[this.currentSceneIndex];
        
        // 显示动画
        titleOverlay.classList.add('visible');
        
        // 3秒后隐藏
        setTimeout(() => {
            titleOverlay.classList.remove('visible');
        }, 3000);
    }

    updateSubtitle(text) {
        if (text && text !== this.subtitleText.textContent) {
            this.subtitleText.textContent = text;
            this.subtitleText.classList.add('visible');
        } else if (!text) {
            this.subtitleText.classList.remove('visible');
        }
    }

    updateProgress(scene) {
        const progress = (scene.time / scene.duration) * 100;
        
        // 计算总进度
        const sceneProgress = progress / this.scenes.length;
        const completedProgress = (this.currentSceneIndex / this.scenes.length) * 100;
        const totalProgress = completedProgress + sceneProgress;
        
        this.progressFill.style.width = `${totalProgress}%`;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 添加加载动画
    const canvasWrapper = document.querySelector('.canvas-wrapper');
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">齐天大圣驾到...</div>
    `;
    canvasWrapper.appendChild(loadingOverlay);
    
    // 模拟加载
    setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        loadingOverlay.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            loadingOverlay.remove();
            
            // 初始化动画
            window.wukongAnimation = new WukongAnimation();
        }, 500);
    }, 1500);
});

// 工具函数：为Canvas添加roundRect支持（兼容旧浏览器）
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        if (typeof radius === 'number') {
            radius = { tl: radius, tr: radius, br: radius, bl: radius };
        } else {
            radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
        }
        
        this.beginPath();
        this.moveTo(x + radius.tl, y);
        this.lineTo(x + width - radius.tr, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        this.lineTo(x + width, y + height - radius.br);
        this.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        this.lineTo(x + radius.bl, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        this.lineTo(x, y + radius.tl);
        this.quadraticCurveTo(x, y, x + radius.tl, y);
        this.closePath();
        
        return this;
    };
}

// 防止页面滚动（当使用空格键控制时）
window.addEventListener('keydown', (e) => {
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
    }
});


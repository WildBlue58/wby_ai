/**
 * 场景一：时空裂隙 - 穿越之门
 * 孙悟空被智能手机砸中，穿越时空隧道
 */

class Scene1 {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        
        // 场景信息
        this.name = '时空裂隙';
        this.subtitle = '第一幕';
        this.duration = 15000; // 15秒
        
        // 动画状态
        this.time = 0;
        this.phase = 0; // 0: 开场, 1: 手机砸中, 2: 漩涡打开, 3: 坠入漩涡
        
        // 角色
        this.wukong = new WukongCharacter(this.width / 2, this.height / 2, 0.8);
        this.wukong.setState('flying');
        this.cloud = new JinDouCloud(this.width / 2, this.height / 2 + 60, 0.8);
        
        // 漩涡参数
        this.vortexRotation = 0;
        this.vortexScale = 0;
        this.vortexOpacity = 0;
        
        // 手机参数
        this.phone = {
            x: this.width + 50,
            y: -50,
            rotation: 0,
            visible: false
        };
        
        // 粒子系统
        this.particles = [];
        this.symbols = ['☯', '龍', '鳳', '雲', '⚡', '📱', '💫', '🌟', '😱', '🔥', '💥'];
        
        // 字幕
        this.subtitles = [
            { time: 0, text: '话说齐天大圣孙悟空，正驾着筋斗云巡游天庭...' },
            { time: 3000, text: '忽然！一个闪亮的物体从天而降！' },
            { time: 5500, text: '"这是何方妖物？！"' },
            { time: 7500, text: '咔嚓！一道闪电划过，时空裂隙打开！' },
            { time: 10000, text: '"俺老孙...这是要去哪儿啊啊啊！"' },
            { time: 13000, text: '穿越开始...' }
        ];
        this.currentSubtitle = '';
    }

    // 更新场景
    update(deltaTime) {
        this.time += deltaTime;
        this.updatePhase();
        this.updateParticles(deltaTime);
        this.updateSubtitles();
        
        // 更新漩涡旋转
        this.vortexRotation += deltaTime * 0.003;
        
        // 更新角色
        this.wukong.update(deltaTime);
        this.cloud.update(deltaTime);
        
        // 根据阶段更新动画
        this.updateAnimation(deltaTime);
    }

    // 更新阶段
    updatePhase() {
        if (this.time < 3000) {
            this.phase = 0;
        } else if (this.time < 5500) {
            this.phase = 1;
        } else if (this.time < 9000) {
            this.phase = 2;
        } else {
            this.phase = 3;
        }
    }

    // 更新动画
    updateAnimation(deltaTime) {
        switch (this.phase) {
            case 0: // 开场：悟空在云上飞行
                this.wukong.setPosition(
                    this.width / 2 + Math.sin(this.time * 0.001) * 30,
                    this.height / 2 - 60 + Math.sin(this.time * 0.002) * 10
                );
                this.cloud.setPosition(
                    this.width / 2 + Math.sin(this.time * 0.001) * 30,
                    this.height / 2 + 20 + Math.sin(this.time * 0.002) * 10
                );
                break;
                
            case 1: // 手机飞来
                this.phone.visible = true;
                const phoneProgress = (this.time - 3000) / 2500;
                this.phone.x = this.width + 50 - (this.width / 2 + 100) * Math.min(phoneProgress * 1.5, 1);
                this.phone.y = -50 + (this.height / 2 - 100) * Math.min(phoneProgress * 1.5, 1);
                this.phone.rotation += deltaTime * 0.02;
                
                if (phoneProgress > 0.6) {
                    this.wukong.setState('surprised');
                    this.wukong.mouthOpen = true;
                }
                break;
                
            case 2: // 漩涡打开
                this.vortexScale = Math.min((this.time - 5500) / 2000, 1);
                this.vortexOpacity = Math.min((this.time - 5500) / 1000, 0.9);
                this.phone.visible = false;
                
                // 添加粒子
                if (Math.random() < 0.3) {
                    this.addParticle();
                }
                
                // 悟空开始被吸引
                const pullProgress = (this.time - 5500) / 3500;
                this.wukong.setPosition(
                    this.width / 2 + Math.sin(this.time * 0.005) * 20 * (1 - pullProgress),
                    this.height / 2 - 60 + pullProgress * 30
                );
                this.cloud.setPosition(
                    this.width / 2 + Math.sin(this.time * 0.005) * 20 * (1 - pullProgress),
                    this.height / 2 + 20 + pullProgress * 30
                );
                break;
                
            case 3: // 坠入漩涡
                this.wukong.setState('falling');
                const fallProgress = (this.time - 9000) / 6000;
                const scale = Math.max(0.8 - fallProgress * 0.6, 0.2);
                this.wukong.scale = scale;
                this.cloud.scale = scale;
                
                // 螺旋下落
                const spiralAngle = fallProgress * Math.PI * 4;
                const spiralRadius = 50 * (1 - fallProgress);
                this.wukong.setPosition(
                    this.width / 2 + Math.cos(spiralAngle) * spiralRadius,
                    this.height / 2 + fallProgress * 100
                );
                this.cloud.setPosition(
                    this.width / 2 + Math.cos(spiralAngle) * spiralRadius,
                    this.height / 2 + 80 + fallProgress * 100
                );
                
                // 更多粒子
                if (Math.random() < 0.5) {
                    this.addParticle();
                }
                break;
        }
    }

    // 添加粒子
    addParticle() {
        const angle = Math.random() * Math.PI * 2;
        const distance = 200 + Math.random() * 150;
        this.particles.push({
            x: this.width / 2 + Math.cos(angle) * distance,
            y: this.height / 2 + Math.sin(angle) * distance,
            symbol: this.symbols[Math.floor(Math.random() * this.symbols.length)],
            size: 15 + Math.random() * 20,
            alpha: 1,
            angle: angle,
            distance: distance,
            speed: 0.5 + Math.random() * 1,
            rotation: Math.random() * Math.PI * 2
        });
    }

    // 更新粒子
    updateParticles(deltaTime) {
        this.particles = this.particles.filter(p => {
            p.distance -= p.speed * deltaTime * 0.1;
            p.angle += deltaTime * 0.002;
            p.x = this.width / 2 + Math.cos(p.angle) * p.distance;
            p.y = this.height / 2 + Math.sin(p.angle) * p.distance;
            p.rotation += deltaTime * 0.005;
            
            if (p.distance < 50) {
                p.alpha -= 0.05;
            }
            
            return p.alpha > 0 && p.distance > 0;
        });
    }

    // 更新字幕
    updateSubtitles() {
        for (let i = this.subtitles.length - 1; i >= 0; i--) {
            if (this.time >= this.subtitles[i].time) {
                this.currentSubtitle = this.subtitles[i].text;
                break;
            }
        }
    }

    // 绘制场景
    draw() {
        const ctx = this.ctx;
        
        // 清空画布
        ctx.clearRect(0, 0, this.width, this.height);
        
        // 绘制背景
        this.drawBackground();
        
        // 绘制星空
        this.drawStars();
        
        // 绘制漩涡
        if (this.phase >= 2) {
            this.drawVortex();
        }
        
        // 绘制粒子
        this.drawParticles();
        
        // 绘制手机
        if (this.phone.visible) {
            this.drawPhone();
        }
        
        // 绘制闪电效果
        if (this.phase === 2 && this.time < 6500) {
            this.drawLightning();
        }
        
        // 绘制筋斗云和悟空
        this.cloud.draw(ctx);
        this.wukong.draw(ctx);
    }

    // 绘制背景
    drawBackground() {
        const ctx = this.ctx;
        
        // 天空渐变
        const gradient = ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, this.width
        );
        
        if (this.phase < 2) {
            // 正常天空
            gradient.addColorStop(0, '#1a0a2e');
            gradient.addColorStop(0.5, '#16213e');
            gradient.addColorStop(1, '#0a0a1a');
        } else {
            // 漩涡天空
            gradient.addColorStop(0, '#4a0080');
            gradient.addColorStop(0.3, '#1a0a2e');
            gradient.addColorStop(0.7, '#16213e');
            gradient.addColorStop(1, '#0a0a1a');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // 云层
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 5; i++) {
            const x = (this.time * 0.02 + i * 200) % (this.width + 200) - 100;
            const y = 100 + i * 80;
            ctx.beginPath();
            ctx.ellipse(x, y, 80 + i * 20, 30, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 绘制星空
    drawStars() {
        const ctx = this.ctx;
        ctx.fillStyle = '#FFFFFF';
        
        // 使用固定种子生成星星位置
        for (let i = 0; i < 100; i++) {
            const x = (i * 137.5) % this.width;
            const y = (i * 73.3) % this.height;
            const size = (Math.sin(i) + 1) * 1.5;
            const twinkle = Math.sin(this.time * 0.005 + i) * 0.5 + 0.5;
            
            ctx.globalAlpha = twinkle;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    // 绘制漩涡
    drawVortex() {
        const ctx = this.ctx;
        const cx = this.width / 2;
        const cy = this.height / 2;
        const maxRadius = 180 * this.vortexScale;
        
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(this.vortexRotation);
        
        // 多层漩涡
        for (let layer = 0; layer < 5; layer++) {
            const layerRadius = maxRadius * (1 - layer * 0.15);
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, layerRadius);
            
            const hue = (layer * 60 + this.time * 0.1) % 360;
            gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, ${this.vortexOpacity * 0.8})`);
            gradient.addColorStop(0.5, `hsla(${hue + 30}, 80%, 50%, ${this.vortexOpacity * 0.5})`);
            gradient.addColorStop(1, `hsla(${hue + 60}, 60%, 30%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            
            // 绘制螺旋
            for (let angle = 0; angle < Math.PI * 6; angle += 0.1) {
                const r = layerRadius * (1 - angle / (Math.PI * 6));
                const x = Math.cos(angle + layer * 0.5) * r;
                const y = Math.sin(angle + layer * 0.5) * r;
                
                if (angle === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.fill();
        }
        
        // 中心光芒
        const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
        centerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        centerGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.5)');
        centerGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        ctx.fillStyle = centerGradient;
        ctx.beginPath();
        ctx.arc(0, 0, 50 * this.vortexScale, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    // 绘制粒子
    drawParticles() {
        const ctx = this.ctx;
        
        this.particles.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = p.alpha;
            ctx.font = `${p.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#FFD700';
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 10;
            ctx.fillText(p.symbol, 0, 0);
            ctx.restore();
        });
    }

    // 绘制手机
    drawPhone() {
        const ctx = this.ctx;
        
        ctx.save();
        ctx.translate(this.phone.x, this.phone.y);
        ctx.rotate(this.phone.rotation);
        
        // 手机外壳
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.roundRect(-20, -35, 40, 70, 5);
        ctx.fill();
        
        // 屏幕
        ctx.fillStyle = '#4FC3F7';
        ctx.beginPath();
        ctx.roundRect(-17, -30, 34, 55, 3);
        ctx.fill();
        
        // 屏幕内容（微信图标简化）
        ctx.fillStyle = '#07C160';
        ctx.beginPath();
        ctx.arc(0, -10, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // 发光效果
        ctx.shadowColor = '#4FC3F7';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.roundRect(-17, -30, 34, 55, 3);
        ctx.stroke();
        
        ctx.restore();
    }

    // 绘制闪电
    drawLightning() {
        const ctx = this.ctx;
        const intensity = Math.random();
        
        if (intensity > 0.7) {
            ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.3})`;
            ctx.fillRect(0, 0, this.width, this.height);
            
            // 闪电线条
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 20;
            
            ctx.beginPath();
            let x = this.width / 2;
            let y = 0;
            ctx.moveTo(x, y);
            
            while (y < this.height / 2) {
                x += (Math.random() - 0.5) * 60;
                y += 30 + Math.random() * 40;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }

    // 获取当前字幕
    getSubtitle() {
        return this.currentSubtitle;
    }

    // 重置场景
    reset() {
        this.time = 0;
        this.phase = 0;
        this.particles = [];
        this.vortexRotation = 0;
        this.vortexScale = 0;
        this.vortexOpacity = 0;
        this.phone.visible = false;
        this.wukong = new WukongCharacter(this.width / 2, this.height / 2, 0.8);
        this.wukong.setState('flying');
        this.cloud = new JinDouCloud(this.width / 2, this.height / 2 + 60, 0.8);
        this.currentSubtitle = '';
    }

    // 场景是否完成
    isComplete() {
        return this.time >= this.duration;
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Scene1;
}


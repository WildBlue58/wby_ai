/**
 * 孙悟空角色类 - Canvas绘制
 * 包含多种动作状态和动画效果
 */

class WukongCharacter {
    constructor(x, y, scale = 1) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.rotation = 0;
        this.state = 'standing'; // standing, flying, surprised, squished, streaming, falling
        this.animationFrame = 0;
        this.blinkTimer = 0;
        this.isBlinking = false;
        this.mouthOpen = false;
        this.armAngle = 0;
        this.legAngle = 0;
        
        // 颜色定义
        this.colors = {
            fur: '#FFD700',           // 金色毛发
            furDark: '#DAA520',       // 深金色
            furLight: '#FFF8DC',      // 浅金色
            skin: '#FFDAB9',          // 肤色
            cape: '#DC143C',          // 红色披风
            capeDark: '#8B0000',      // 深红色
            headband: '#FFD700',      // 金箍
            headbandGem: '#FF0000',   // 金箍红宝石
            eyes: '#000000',          // 眼睛
            eyeWhite: '#FFFFFF',      // 眼白
            nose: '#CD853F',          // 鼻子
            mouth: '#8B4513',         // 嘴巴
            staff: '#8B4513',         // 金箍棒木色
            staffGold: '#FFD700',     // 金箍棒金色
            cloud: '#FFFFFF',         // 筋斗云
            cloudShadow: '#E8E8E8'    // 云影
        };
    }

    // 更新动画帧
    update(deltaTime) {
        this.animationFrame += deltaTime * 0.01;
        
        // 眨眼逻辑
        this.blinkTimer += deltaTime;
        if (this.blinkTimer > 3000 && !this.isBlinking) {
            this.isBlinking = true;
            setTimeout(() => {
                this.isBlinking = false;
                this.blinkTimer = 0;
            }, 150);
        }
        
        // 根据状态更新动画
        switch (this.state) {
            case 'flying':
                this.armAngle = Math.sin(this.animationFrame * 0.1) * 0.3;
                this.legAngle = Math.sin(this.animationFrame * 0.15) * 0.2;
                break;
            case 'falling':
                this.rotation += deltaTime * 0.005;
                this.armAngle = Math.sin(this.animationFrame * 0.3) * 0.5;
                break;
            case 'surprised':
                this.armAngle = Math.sin(this.animationFrame * 0.2) * 0.1 + 0.5;
                break;
            case 'streaming':
                this.armAngle = Math.sin(this.animationFrame * 0.08) * 0.2;
                break;
            default:
                this.armAngle = Math.sin(this.animationFrame * 0.05) * 0.1;
                this.legAngle = 0;
        }
    }

    // 主绘制方法
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        ctx.rotate(this.rotation);
        
        switch (this.state) {
            case 'squished':
                this.drawSquished(ctx);
                break;
            case 'phoneCase':
                this.drawAsPhoneCase(ctx);
                break;
            default:
                this.drawNormal(ctx);
        }
        
        ctx.restore();
    }

    // 正常状态绘制
    drawNormal(ctx) {
        // 绘制披风
        this.drawCape(ctx);
        
        // 绘制身体
        this.drawBody(ctx);
        
        // 绘制四肢
        this.drawLimbs(ctx);
        
        // 绘制头部
        this.drawHead(ctx);
        
        // 绘制金箍棒（根据状态）
        if (this.state === 'standing' || this.state === 'streaming') {
            this.drawStaff(ctx);
        }
    }

    // 绘制头部
    drawHead(ctx) {
        ctx.save();
        ctx.translate(0, -60);
        
        // 头部毛发（蓬松效果）
        ctx.fillStyle = this.colors.fur;
        ctx.beginPath();
        ctx.arc(0, 0, 35, 0, Math.PI * 2);
        ctx.fill();
        
        // 毛发纹理
        ctx.strokeStyle = this.colors.furDark;
        ctx.lineWidth = 2;
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const x1 = Math.cos(angle) * 30;
            const y1 = Math.sin(angle) * 30;
            const x2 = Math.cos(angle) * 38;
            const y2 = Math.sin(angle) * 38;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        // 脸部
        ctx.fillStyle = this.colors.skin;
        ctx.beginPath();
        ctx.ellipse(0, 5, 25, 28, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 金箍
        ctx.strokeStyle = this.colors.headband;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(0, -15, 28, Math.PI * 0.8, Math.PI * 0.2);
        ctx.stroke();
        
        // 金箍宝石
        ctx.fillStyle = this.colors.headbandGem;
        ctx.beginPath();
        ctx.arc(0, -28, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = this.colors.furDark;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // 眼睛
        this.drawEyes(ctx);
        
        // 鼻子
        ctx.fillStyle = this.colors.nose;
        ctx.beginPath();
        ctx.ellipse(0, 8, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 鼻孔
        ctx.fillStyle = '#5D4037';
        ctx.beginPath();
        ctx.ellipse(-2, 9, 2, 1.5, 0, 0, Math.PI * 2);
        ctx.ellipse(2, 9, 2, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 嘴巴
        this.drawMouth(ctx);
        
        // 耳朵
        this.drawEars(ctx);
        
        ctx.restore();
    }

    // 绘制眼睛
    drawEyes(ctx) {
        const eyeY = -2;
        const eyeSpacing = 12;
        
        // 火眼金睛效果（发光）
        if (this.state === 'streaming') {
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 15;
        }
        
        for (let side of [-1, 1]) {
            const eyeX = side * eyeSpacing;
            
            // 眼白
            ctx.fillStyle = this.colors.eyeWhite;
            ctx.beginPath();
            ctx.ellipse(eyeX, eyeY, 8, this.isBlinking ? 1 : 7, 0, 0, Math.PI * 2);
            ctx.fill();
            
            if (!this.isBlinking) {
                // 瞳孔
                ctx.fillStyle = this.state === 'streaming' ? '#FF6600' : '#8B4513';
                ctx.beginPath();
                ctx.arc(eyeX + side * 1, eyeY, 4, 0, Math.PI * 2);
                ctx.fill();
                
                // 高光
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(eyeX + side * 2, eyeY - 2, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.shadowBlur = 0;
        
        // 惊讶状态眼睛放大
        if (this.state === 'surprised') {
            ctx.strokeStyle = this.colors.furDark;
            ctx.lineWidth = 2;
            for (let side of [-1, 1]) {
                ctx.beginPath();
                ctx.arc(side * eyeSpacing, eyeY - 15, 3, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }

    // 绘制嘴巴
    drawMouth(ctx) {
        ctx.strokeStyle = this.colors.mouth;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        
        if (this.state === 'surprised' || this.mouthOpen) {
            // 张嘴
            ctx.fillStyle = '#8B0000';
            ctx.beginPath();
            ctx.ellipse(0, 20, 8, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else if (this.state === 'streaming') {
            // 微笑
            ctx.beginPath();
            ctx.arc(0, 15, 10, 0.2, Math.PI - 0.2);
            ctx.stroke();
        } else {
            // 普通嘴巴
            ctx.beginPath();
            ctx.arc(0, 18, 6, 0.3, Math.PI - 0.3);
            ctx.stroke();
        }
    }

    // 绘制耳朵
    drawEars(ctx) {
        for (let side of [-1, 1]) {
            ctx.save();
            ctx.translate(side * 32, -5);
            
            // 外耳
            ctx.fillStyle = this.colors.fur;
            ctx.beginPath();
            ctx.ellipse(0, 0, 10, 15, side * 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // 内耳
            ctx.fillStyle = this.colors.skin;
            ctx.beginPath();
            ctx.ellipse(side * 2, 0, 5, 10, side * 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }

    // 绘制身体
    drawBody(ctx) {
        // 身体
        ctx.fillStyle = this.colors.fur;
        ctx.beginPath();
        ctx.ellipse(0, 0, 25, 35, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 肚子
        ctx.fillStyle = this.colors.furLight;
        ctx.beginPath();
        ctx.ellipse(0, 5, 18, 25, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // 绘制四肢
    drawLimbs(ctx) {
        ctx.fillStyle = this.colors.fur;
        ctx.strokeStyle = this.colors.furDark;
        ctx.lineWidth = 2;
        
        // 手臂
        for (let side of [-1, 1]) {
            ctx.save();
            ctx.translate(side * 25, -10);
            ctx.rotate(side * this.armAngle);
            
            // 上臂
            ctx.fillStyle = this.colors.fur;
            ctx.beginPath();
            ctx.ellipse(side * 10, 15, 8, 20, side * 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // 手
            ctx.fillStyle = this.colors.skin;
            ctx.beginPath();
            ctx.arc(side * 15, 35, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
        
        // 腿
        for (let side of [-1, 1]) {
            ctx.save();
            ctx.translate(side * 12, 30);
            ctx.rotate(side * this.legAngle);
            
            // 腿
            ctx.fillStyle = this.colors.fur;
            ctx.beginPath();
            ctx.ellipse(0, 15, 10, 20, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 脚
            ctx.fillStyle = this.colors.skin;
            ctx.beginPath();
            ctx.ellipse(side * 3, 38, 12, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }

    // 绘制披风
    drawCape(ctx) {
        ctx.save();
        ctx.translate(0, -30);
        
        const waveOffset = Math.sin(this.animationFrame * 0.1) * 5;
        
        // 披风主体
        ctx.fillStyle = this.colors.cape;
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.quadraticCurveTo(-35 + waveOffset, 40, -30 + waveOffset, 80);
        ctx.lineTo(30 - waveOffset, 80);
        ctx.quadraticCurveTo(35 - waveOffset, 40, 20, 0);
        ctx.closePath();
        ctx.fill();
        
        // 披风阴影
        ctx.fillStyle = this.colors.capeDark;
        ctx.beginPath();
        ctx.moveTo(-15, 10);
        ctx.quadraticCurveTo(-25 + waveOffset, 50, -20 + waveOffset, 75);
        ctx.lineTo(-30 + waveOffset, 80);
        ctx.quadraticCurveTo(-35 + waveOffset, 40, -20, 0);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }

    // 绘制金箍棒
    drawStaff(ctx, length = 80) {
        ctx.save();
        ctx.translate(35, -20);
        ctx.rotate(0.3 + Math.sin(this.animationFrame * 0.05) * 0.05);
        
        // 棒身
        const gradient = ctx.createLinearGradient(0, 0, 0, length);
        gradient.addColorStop(0, this.colors.staffGold);
        gradient.addColorStop(0.1, this.colors.staff);
        gradient.addColorStop(0.9, this.colors.staff);
        gradient.addColorStop(1, this.colors.staffGold);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(-4, 0, 8, length, 4);
        ctx.fill();
        
        // 金箍装饰
        ctx.fillStyle = this.colors.staffGold;
        ctx.beginPath();
        ctx.roundRect(-6, 5, 12, 8, 2);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(-6, length - 13, 12, 8, 2);
        ctx.fill();
        
        // 发光效果
        ctx.shadowColor = this.colors.staffGold;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(-5, 5, 10, 8, 2);
        ctx.fill();
        
        ctx.restore();
    }

    // 被挤压状态
    drawSquished(ctx) {
        ctx.save();
        ctx.scale(1.8, 0.4); // 横向拉伸，纵向压扁
        
        // 扁平身体
        ctx.fillStyle = this.colors.fur;
        ctx.beginPath();
        ctx.ellipse(0, 0, 40, 30, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 扁平脸
        ctx.fillStyle = this.colors.skin;
        ctx.beginPath();
        ctx.ellipse(0, -15, 30, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 挤压的眼睛（横线）
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-15, -15);
        ctx.lineTo(-5, -15);
        ctx.moveTo(5, -15);
        ctx.lineTo(15, -15);
        ctx.stroke();
        
        // 痛苦的嘴
        ctx.beginPath();
        ctx.arc(0, -5, 8, 0.5, Math.PI - 0.5);
        ctx.stroke();
        
        ctx.restore();
    }

    // 变成手机壳状态
    drawAsPhoneCase(ctx) {
        ctx.save();
        
        // 手机壳外形
        ctx.fillStyle = this.colors.fur;
        ctx.beginPath();
        ctx.roundRect(-30, -60, 60, 120, 10);
        ctx.fill();
        
        // 悟空脸图案
        ctx.fillStyle = this.colors.skin;
        ctx.beginPath();
        ctx.ellipse(0, -10, 20, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 小眼睛
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-8, -15, 4, 0, Math.PI * 2);
        ctx.arc(8, -15, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 惊讶的嘴
        ctx.beginPath();
        ctx.arc(0, 5, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // 金箍
        ctx.strokeStyle = this.colors.headband;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, -25, 18, Math.PI * 0.7, Math.PI * 0.3);
        ctx.stroke();
        
        // 摄像头孔
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(15, -45, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    // 设置状态
    setState(state) {
        this.state = state;
        this.animationFrame = 0;
    }

    // 设置位置
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
}

// 筋斗云类
class JinDouCloud {
    constructor(x, y, scale = 1) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.animationFrame = 0;
        this.isCoughing = false;
        this.smokeParticles = [];
    }

    update(deltaTime) {
        this.animationFrame += deltaTime * 0.01;
        
        // 更新烟雾粒子
        if (this.isCoughing) {
            if (Math.random() < 0.3) {
                this.smokeParticles.push({
                    x: this.x + (Math.random() - 0.5) * 40,
                    y: this.y,
                    size: Math.random() * 10 + 5,
                    alpha: 0.8,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -Math.random() * 2 - 1
                });
            }
        }
        
        // 更新粒子
        this.smokeParticles = this.smokeParticles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.02;
            p.size += 0.5;
            return p.alpha > 0;
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        
        const wobble = Math.sin(this.animationFrame * 0.15) * 3;
        
        // 云朵阴影
        ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
        ctx.beginPath();
        ctx.ellipse(5, 5, 50, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 主云朵
        ctx.fillStyle = '#FFFFFF';
        
        // 中心
        ctx.beginPath();
        ctx.ellipse(0, wobble, 45, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 左边凸起
        ctx.beginPath();
        ctx.ellipse(-30, -5 + wobble, 25, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 右边凸起
        ctx.beginPath();
        ctx.ellipse(30, -3 + wobble, 28, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 上方小凸起
        ctx.beginPath();
        ctx.ellipse(-10, -12 + wobble, 18, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(15, -10 + wobble, 15, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.ellipse(-15, -8 + wobble, 12, 6, -0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // 绘制烟雾粒子
        this.smokeParticles.forEach(p => {
            ctx.fillStyle = `rgba(80, 80, 80, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    setCoughing(coughing) {
        this.isCoughing = coughing;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
}

// 小猴子助播类
class MiniMonkey {
    constructor(x, y, scale = 0.4) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.animationFrame = Math.random() * 100;
        this.jumpOffset = 0;
    }

    update(deltaTime) {
        this.animationFrame += deltaTime * 0.01;
        this.jumpOffset = Math.abs(Math.sin(this.animationFrame * 0.2)) * 10;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y - this.jumpOffset);
        ctx.scale(this.scale, this.scale);
        
        // 简化版悟空
        // 身体
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(0, 0, 20, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 头
        ctx.beginPath();
        ctx.arc(0, -35, 18, 0, Math.PI * 2);
        ctx.fill();
        
        // 脸
        ctx.fillStyle = '#FFDAB9';
        ctx.beginPath();
        ctx.ellipse(0, -32, 12, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-5, -35, 3, 0, Math.PI * 2);
        ctx.arc(5, -35, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 嘴巴（微笑）
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -28, 5, 0.2, Math.PI - 0.2);
        ctx.stroke();
        
        // 小手举起
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(-25, -15, 8, 12, -0.5, 0, Math.PI * 2);
        ctx.ellipse(25, -15, 8, 12, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WukongCharacter, JinDouCloud, MiniMonkey };
}


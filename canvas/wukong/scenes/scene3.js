/**
 * 场景三：地铁历险 - 早高峰大战
 * 孙悟空被挤成猴饼，变成手机壳，最后吓跑所有人
 */

class Scene3 {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        
        // 场景信息
        this.name = '地铁历险';
        this.subtitle = '第三幕';
        this.duration = 15000;
        
        // 动画状态
        this.time = 0;
        this.phase = 0; // 0: 进站, 1: 被挤, 2: 变手机壳, 3: 变回原形吓人
        
        // 角色
        this.wukong = new WukongCharacter(this.width / 2, this.height / 2 + 50, 0.6);
        this.wukong.setState('standing');
        
        // 乘客
        this.passengers = this.generatePassengers();
        
        // 地铁参数
        this.trainX = -this.width;
        this.doorOpen = 0;
        this.isTrainArrived = false;
        
        // 挤压效果
        this.squishAmount = 0;
        
        // 逃跑的人
        this.escapingPassengers = [];
        
        // 大妈角色
        this.grandma = {
            x: 300,
            y: this.height / 2 + 80,
            hasPhone: false,
            phoneWithWukong: false
        };
        
        // 字幕
        this.subtitles = [
            { time: 0, text: '悟空决定体验一下凡人的"地下飞行器"...' },
            { time: 2500, text: '地铁来了！人群开始涌入...' },
            { time: 5000, text: '"让一让！让一让！俺老孙要进去！"' },
            { time: 7000, text: '*挤* *压* *扁* "救命啊！俺的筋斗云呢？！"' },
            { time: 9000, text: '悟空使用七十二变：变成手机壳！' },
            { time: 11000, text: '大妈：哟，这手机壳挺别致！' },
            { time: 12500, text: '"俺老孙忍不了了！！！"💢' },
            { time: 14000, text: '乘客全部逃散ing...' }
        ];
        this.currentSubtitle = '';
        
        // 特效
        this.shockwaveRadius = 0;
        this.showShockwave = false;
    }

    generatePassengers() {
        const passengers = [];
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
        
        for (let i = 0; i < 15; i++) {
            passengers.push({
                x: 100 + (i % 5) * 180 + Math.random() * 50,
                y: this.height / 2 + 30 + Math.floor(i / 5) * 60 + Math.random() * 20,
                color: colors[Math.floor(Math.random() * colors.length)],
                scale: 0.5 + Math.random() * 0.3,
                targetX: 0,
                targetY: 0,
                isEscaping: false,
                escapeAngle: 0,
                escapeSpeed: 0
            });
        }
        
        return passengers;
    }

    update(deltaTime) {
        this.time += deltaTime;
        this.updatePhase();
        this.updateSubtitles();
        this.wukong.update(deltaTime);
        
        this.updateTrain(deltaTime);
        this.updatePassengers(deltaTime);
        this.updateShockwave(deltaTime);
    }

    updatePhase() {
        if (this.time < 2500) {
            this.phase = 0;
        } else if (this.time < 7000) {
            this.phase = 1;
        } else if (this.time < 11000) {
            this.phase = 2;
        } else if (this.time < 12500) {
            this.phase = 3;
        } else {
            this.phase = 4;
        }
    }

    updateTrain(deltaTime) {
        // 地铁进站
        if (this.time > 1500 && this.time < 3000) {
            const progress = (this.time - 1500) / 1500;
            this.trainX = -this.width + this.width * this.easeOutCubic(progress);
        }
        
        // 开门
        if (this.time > 3000 && this.time < 3500) {
            this.doorOpen = (this.time - 3000) / 500;
            this.isTrainArrived = true;
        }
        
        // 关门
        if (this.time > 14000) {
            this.doorOpen = Math.max(0, 1 - (this.time - 14000) / 500);
        }
    }

    updatePassengers(deltaTime) {
        const centerX = this.width / 2;
        const centerY = this.height / 2 + 50;
        
        this.passengers.forEach((p, index) => {
            if (p.isEscaping) {
                // 逃跑动画
                p.x += Math.cos(p.escapeAngle) * p.escapeSpeed * deltaTime * 0.1;
                p.y += Math.sin(p.escapeAngle) * p.escapeSpeed * deltaTime * 0.1;
                return;
            }
            
            // 挤向中心（阶段1-2）
            if (this.phase >= 1 && this.phase <= 2) {
                const dx = centerX - p.x;
                const dy = centerY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist > 30) {
                    p.x += dx * 0.002 * deltaTime * 0.1;
                    p.y += dy * 0.002 * deltaTime * 0.1;
                }
            }
            
            // 阶段4：逃跑
            if (this.phase === 4 && !p.isEscaping) {
                p.isEscaping = true;
                p.escapeAngle = Math.atan2(p.y - centerY, p.x - centerX);
                p.escapeSpeed = 5 + Math.random() * 5;
            }
        });
        
        // 更新悟空状态
        if (this.phase === 1 || this.phase === 2) {
            // 被挤压
            this.squishAmount = Math.min((this.time - 5000) / 2000, 1);
            if (this.squishAmount > 0.5) {
                this.wukong.setState('squished');
            }
        }
        
        if (this.phase === 2 && this.time > 9000) {
            // 变成手机壳
            this.wukong.setState('phoneCase');
            this.grandma.phoneWithWukong = true;
        }
        
        if (this.phase >= 3 && this.time > 12500) {
            // 变回原形
            this.wukong.setState('surprised');
            this.wukong.scale = 1;
            this.wukong.mouthOpen = true;
            
            // 触发冲击波
            if (!this.showShockwave) {
                this.showShockwave = true;
                this.shockwaveRadius = 0;
            }
        }
    }

    updateShockwave(deltaTime) {
        if (this.showShockwave) {
            this.shockwaveRadius += deltaTime * 0.5;
            if (this.shockwaveRadius > 500) {
                this.showShockwave = false;
            }
        }
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    updateSubtitles() {
        for (let i = this.subtitles.length - 1; i >= 0; i--) {
            if (this.time >= this.subtitles[i].time) {
                this.currentSubtitle = this.subtitles[i].text;
                break;
            }
        }
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
        
        // 绘制地铁站背景
        this.drawStation();
        
        // 绘制地铁
        this.drawTrain();
        
        // 绘制乘客
        this.drawPassengers();
        
        // 绘制大妈（特殊角色）
        if (this.phase >= 2) {
            this.drawGrandma();
        }
        
        // 绘制悟空
        if (this.phase < 2 || this.phase >= 3) {
            this.wukong.draw(ctx);
        }
        
        // 绘制冲击波
        if (this.showShockwave) {
            this.drawShockwave();
        }
        
        // 绘制挤压效果线
        if (this.phase === 1 && this.squishAmount > 0) {
            this.drawSquishLines();
        }
        
        // 绘制恐慌表情
        if (this.phase === 4) {
            this.drawPanicEffects();
        }
    }

    drawStation() {
        const ctx = this.ctx;
        
        // 站台背景
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#2c3e50');
        gradient.addColorStop(1, '#1a252f');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // 天花板
        ctx.fillStyle = '#34495e';
        ctx.fillRect(0, 0, this.width, 80);
        
        // 灯光
        for (let i = 0; i < 5; i++) {
            const x = 100 + i * 200;
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.ellipse(x, 60, 40, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 灯光效果
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.moveTo(x - 40, 70);
            ctx.lineTo(x - 80, this.height);
            ctx.lineTo(x + 80, this.height);
            ctx.lineTo(x + 40, 70);
            ctx.closePath();
            ctx.fill();
        }
        
        // 站台地面
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(0, this.height - 80, this.width, 80);
        
        // 安全线
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(0, this.height - 85, this.width, 5);
        
        // 站名牌
        ctx.fillStyle = '#3498db';
        ctx.fillRect(this.width - 150, 100, 130, 50);
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 18px "Noto Sans SC"';
        ctx.textAlign = 'center';
        ctx.fillText('天宫站', this.width - 85, 132);
        
        // 广告牌
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(50, 100, 150, 80);
        ctx.fillStyle = '#FFF';
        ctx.font = '14px "Noto Sans SC"';
        ctx.fillText('蟠桃特卖', 125, 135);
        ctx.fillText('买一送一！', 125, 160);
    }

    drawTrain() {
        const ctx = this.ctx;
        const trainY = 150;
        const trainHeight = this.height - 230;
        
        ctx.save();
        ctx.translate(this.trainX, 0);
        
        // 车厢主体
        ctx.fillStyle = '#95a5a6';
        ctx.beginPath();
        ctx.roundRect(50, trainY, this.width - 100, trainHeight, 10);
        ctx.fill();
        
        // 车窗
        ctx.fillStyle = '#2c3e50';
        for (let i = 0; i < 4; i++) {
            const wx = 100 + i * 220;
            ctx.beginPath();
            ctx.roundRect(wx, trainY + 30, 80, 100, 5);
            ctx.fill();
            
            // 窗户反光
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.roundRect(wx + 5, trainY + 35, 30, 40, 3);
            ctx.fill();
            ctx.fillStyle = '#2c3e50';
        }
        
        // 车门（中间位置）
        const doorX = this.width / 2 - 60;
        const doorWidth = 120;
        const openAmount = this.doorOpen * 55;
        
        // 门框
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(doorX - 5, trainY + 20, doorWidth + 10, trainHeight - 40);
        
        // 左门
        ctx.fillStyle = '#bdc3c7';
        ctx.fillRect(doorX, trainY + 25, doorWidth / 2 - openAmount, trainHeight - 50);
        
        // 右门
        ctx.fillRect(doorX + doorWidth / 2 + openAmount, trainY + 25, doorWidth / 2 - openAmount, trainHeight - 50);
        
        // 门把手
        if (this.doorOpen < 0.9) {
            ctx.fillStyle = '#34495e';
            ctx.fillRect(doorX + doorWidth / 2 - 15 - openAmount, trainY + trainHeight / 2, 10, 30);
            ctx.fillRect(doorX + doorWidth / 2 + 5 + openAmount, trainY + trainHeight / 2, 10, 30);
        }
        
        // 车厢编号
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('72', this.width / 2, trainY + 20);
        
        // 目的地显示
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(80, trainY + 10, 120, 25);
        ctx.fillStyle = '#000';
        ctx.font = '14px "Noto Sans SC"';
        ctx.fillText('→ 花果山', 140, trainY + 28);
        
        ctx.restore();
    }

    drawPassengers() {
        const ctx = this.ctx;
        
        this.passengers.forEach(p => {
            if (p.y > this.height + 50 || p.x < -50 || p.x > this.width + 50) return;
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.scale(p.scale, p.scale);
            
            // 简化的人物
            // 身体
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, 15, 25, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 头
            ctx.fillStyle = '#FFDAB9';
            ctx.beginPath();
            ctx.arc(0, -35, 12, 0, Math.PI * 2);
            ctx.fill();
            
            // 如果在逃跑，画恐惧表情
            if (p.isEscaping) {
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(-4, -37, 3, 0, Math.PI * 2);
                ctx.arc(4, -37, 3, 0, Math.PI * 2);
                ctx.fill();
                
                // 张嘴
                ctx.beginPath();
                ctx.arc(0, -30, 5, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // 普通表情
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(-4, -37, 2, 0, Math.PI * 2);
                ctx.arc(4, -37, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        });
    }

    drawGrandma() {
        const ctx = this.ctx;
        const g = this.grandma;
        
        ctx.save();
        ctx.translate(g.x, g.y);
        
        // 身体（大妈特色：圆润）
        ctx.fillStyle = '#e91e63';
        ctx.beginPath();
        ctx.ellipse(0, 0, 25, 35, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 头
        ctx.fillStyle = '#FFDAB9';
        ctx.beginPath();
        ctx.arc(0, -50, 18, 0, Math.PI * 2);
        ctx.fill();
        
        // 发髻
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.arc(0, -60, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // 眼镜
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(-8, -50, 6, 0, Math.PI * 2);
        ctx.arc(8, -50, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-2, -50);
        ctx.lineTo(2, -50);
        ctx.stroke();
        
        // 如果捡到了手机壳
        if (g.phoneWithWukong && this.phase < 4) {
            ctx.save();
            ctx.translate(30, -30);
            ctx.scale(0.4, 0.4);
            this.wukong.draw(ctx);
            ctx.restore();
            
            // 惊喜表情
            ctx.fillStyle = '#000';
            ctx.font = '16px Arial';
            ctx.fillText('!', 40, -60);
        }
        
        ctx.restore();
    }

    drawShockwave() {
        const ctx = this.ctx;
        const cx = this.width / 2;
        const cy = this.height / 2 + 50;
        
        ctx.strokeStyle = `rgba(255, 215, 0, ${1 - this.shockwaveRadius / 500})`;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(cx, cy, this.shockwaveRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // 内层冲击波
        ctx.strokeStyle = `rgba(255, 0, 0, ${1 - this.shockwaveRadius / 500})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, this.shockwaveRadius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawSquishLines() {
        const ctx = this.ctx;
        const cx = this.width / 2;
        const cy = this.height / 2 + 50;
        
        // 压力线
        ctx.strokeStyle = `rgba(255, 100, 100, ${this.squishAmount})`;
        ctx.lineWidth = 3;
        
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const innerR = 50;
            const outerR = 80 + this.squishAmount * 30;
            
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
            ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
            ctx.stroke();
        }
        
        // 痛苦文字
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 24px "Ma Shan Zheng"';
        ctx.textAlign = 'center';
        ctx.fillText('挤！', cx - 60, cy - 80);
        ctx.fillText('压！', cx + 60, cy - 80);
        ctx.fillText('扁！', cx, cy + 100);
    }

    drawPanicEffects() {
        const ctx = this.ctx;
        
        // 惊叫符号
        const exclaims = ['啊！', '妖怪！', '救命！', '跑！', '😱'];
        
        this.passengers.forEach((p, i) => {
            if (p.isEscaping && Math.random() > 0.95) {
                ctx.fillStyle = '#e74c3c';
                ctx.font = '18px "Noto Sans SC"';
                ctx.textAlign = 'center';
                ctx.fillText(exclaims[i % exclaims.length], p.x, p.y - 60);
            }
        });
    }

    getSubtitle() {
        return this.currentSubtitle;
    }

    reset() {
        this.time = 0;
        this.phase = 0;
        this.trainX = -this.width;
        this.doorOpen = 0;
        this.isTrainArrived = false;
        this.squishAmount = 0;
        this.showShockwave = false;
        this.shockwaveRadius = 0;
        this.wukong = new WukongCharacter(this.width / 2, this.height / 2 + 50, 0.6);
        this.wukong.setState('standing');
        this.passengers = this.generatePassengers();
        this.grandma.phoneWithWukong = false;
        this.currentSubtitle = '';
    }

    isComplete() {
        return this.time >= this.duration;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Scene3;
}


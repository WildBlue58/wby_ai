/**
 * 场景四：外卖猴王 - 极速配送
 * 孙悟空骑筋斗云送外卖，速度太快把外卖都吹飞了
 */

class Scene4 {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        
        // 场景信息
        this.name = '外卖猴王';
        this.subtitle = '第四幕';
        this.duration = 15000;
        
        // 动画状态
        this.time = 0;
        this.phase = 0;
        
        // 角色
        this.wukong = new WukongCharacter(100, this.height / 2, 0.6);
        this.wukong.setState('flying');
        this.cloud = new JinDouCloud(100, this.height / 2 + 50, 0.6);
        
        // 外卖箱
        this.deliveryBox = {
            attached: true,
            x: 0,
            y: 0,
            rotation: 0
        };
        
        // 飞散的食物
        this.flyingFood = [];
        this.foodTypes = ['🍜', '🍔', '🍟', '🥤', '🍕', '🍣', '🍱', '🥡', '🧋', '🍦'];
        
        // 速度线/轨迹
        this.speedLines = [];
        
        // 地球参数（暗示绕地球飞）
        this.earthAngle = 0;
        this.showEarth = false;
        this.lapCount = 0;
        
        // 客户
        this.customer = {
            x: this.width - 150,
            y: this.height - 150,
            waiting: true,
            angry: false
        };
        
        // 订单信息
        this.orderTimer = 0;
        this.deliveryTime = 0;
        
        // 字幕
        this.subtitles = [
            { time: 0, text: '悟空找到了一份工作——"闪送骑手"' },
            { time: 2500, text: '"一个筋斗十万八千里，送外卖岂不是小菜一碟！"' },
            { time: 5000, text: '接单！目的地：3公里外...' },
            { time: 6500, text: '嗖————！！！' },
            { time: 8000, text: '悟空的速度：光速的0.01%' },
            { time: 9500, text: '外卖状态：奶茶→奶茶冰沙，汤面→干拌面' },
            { time: 11500, text: '客户：我的外卖呢？？？食物都飞天上去了！' },
            { time: 13500, text: '配送时间：0.0003秒 | 食物完整度：0%' }
        ];
        this.currentSubtitle = '';
        
        // 飞行路径
        this.flightPath = [];
        this.pathIndex = 0;
    }

    update(deltaTime) {
        this.time += deltaTime;
        this.updatePhase();
        this.updateSubtitles();
        
        this.wukong.update(deltaTime);
        this.cloud.update(deltaTime);
        
        this.updateFlight(deltaTime);
        this.updateFlyingFood(deltaTime);
        this.updateSpeedLines(deltaTime);
        this.updateEarth(deltaTime);
    }

    updatePhase() {
        if (this.time < 5000) {
            this.phase = 0; // 准备接单
        } else if (this.time < 8000) {
            this.phase = 1; // 开始飞行
        } else if (this.time < 12000) {
            this.phase = 2; // 高速飞行，食物飞散
        } else {
            this.phase = 3; // 到达，客户懵逼
        }
    }

    updateFlight(deltaTime) {
        if (this.phase === 0) {
            // 待命状态
            this.wukong.setPosition(
                150 + Math.sin(this.time * 0.002) * 20,
                this.height / 2 + Math.sin(this.time * 0.003) * 10
            );
            this.cloud.setPosition(
                150 + Math.sin(this.time * 0.002) * 20,
                this.height / 2 + 50 + Math.sin(this.time * 0.003) * 10
            );
        } else if (this.phase === 1) {
            // 开始加速
            const progress = (this.time - 5000) / 3000;
            const eased = this.easeInQuad(progress);
            
            this.wukong.setPosition(
                150 + eased * (this.width - 300),
                this.height / 2 - eased * 100
            );
            this.cloud.setPosition(
                150 + eased * (this.width - 300),
                this.height / 2 + 50 - eased * 100
            );
            
            // 添加速度线
            if (Math.random() < 0.3) {
                this.addSpeedLine();
            }
        } else if (this.phase === 2) {
            // 高速飞行（绕圈）
            this.showEarth = true;
            const flyProgress = (this.time - 8000) / 4000;
            const angle = flyProgress * Math.PI * 6; // 转3圈
            
            const centerX = this.width / 2;
            const centerY = this.height / 2;
            const radius = 150 + Math.sin(flyProgress * Math.PI * 2) * 50;
            
            this.wukong.setPosition(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius * 0.5
            );
            this.cloud.setPosition(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius * 0.5 + 40
            );
            
            this.earthAngle = flyProgress * Math.PI * 4;
            this.lapCount = Math.floor(flyProgress * 3);
            
            // 食物飞散
            if (Math.random() < 0.15) {
                this.addFlyingFood();
            }
            
            // 添加速度线
            if (Math.random() < 0.5) {
                this.addSpeedLine();
            }
        } else {
            // 到达
            this.wukong.setPosition(this.width - 200, this.height - 180);
            this.cloud.setPosition(this.width - 200, this.height - 130);
            this.wukong.setState('standing');
            this.customer.angry = true;
        }
    }

    addSpeedLine() {
        this.speedLines.push({
            x: this.wukong.x - 20,
            y: this.wukong.y + Math.random() * 40 - 20,
            length: 50 + Math.random() * 100,
            alpha: 1,
            speed: 10 + Math.random() * 10
        });
    }

    addFlyingFood() {
        const food = this.foodTypes[Math.floor(Math.random() * this.foodTypes.length)];
        this.flyingFood.push({
            x: this.wukong.x,
            y: this.wukong.y,
            food: food,
            vx: (Math.random() - 0.5) * 10,
            vy: -5 - Math.random() * 5,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.3,
            alpha: 1,
            size: 20 + Math.random() * 15
        });
    }

    updateSpeedLines(deltaTime) {
        this.speedLines = this.speedLines.filter(line => {
            line.x -= line.speed;
            line.alpha -= 0.02;
            return line.alpha > 0;
        });
    }

    updateFlyingFood(deltaTime) {
        this.flyingFood = this.flyingFood.filter(food => {
            food.x += food.vx;
            food.y += food.vy;
            food.vy += 0.1; // 重力
            food.rotation += food.rotationSpeed;
            food.alpha -= 0.005;
            
            return food.alpha > 0 && food.y < this.height + 50;
        });
    }

    updateEarth(deltaTime) {
        if (this.showEarth) {
            this.earthAngle += deltaTime * 0.001;
        }
    }

    easeInQuad(t) {
        return t * t;
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
        
        // 绘制背景
        this.drawBackground();
        
        // 绘制地球（如果显示）
        if (this.showEarth) {
            this.drawEarth();
        }
        
        // 绘制城市
        this.drawCity();
        
        // 绘制速度线
        this.drawSpeedLines();
        
        // 绘制飞散的食物
        this.drawFlyingFood();
        
        // 绘制筋斗云和悟空
        this.cloud.draw(ctx);
        this.wukong.draw(ctx);
        
        // 绘制外卖箱
        this.drawDeliveryBox();
        
        // 绘制客户
        if (this.phase >= 3) {
            this.drawCustomer();
        }
        
        // 绘制UI信息
        this.drawUI();
    }

    drawBackground() {
        const ctx = this.ctx;
        
        // 天空渐变
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        
        if (this.phase < 2) {
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(0.7, '#E0F6FF');
            gradient.addColorStop(1, '#FFF');
        } else {
            // 高空/太空
            gradient.addColorStop(0, '#0a0a2e');
            gradient.addColorStop(0.3, '#1a1a4e');
            gradient.addColorStop(0.7, '#2a2a6e');
            gradient.addColorStop(1, '#4a4a8e');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // 如果是高空，添加星星
        if (this.phase >= 2) {
            ctx.fillStyle = '#FFF';
            for (let i = 0; i < 50; i++) {
                const x = (i * 137) % this.width;
                const y = (i * 73) % (this.height * 0.6);
                const size = Math.sin(this.time * 0.01 + i) * 0.5 + 1;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    drawEarth() {
        const ctx = this.ctx;
        
        ctx.save();
        ctx.translate(this.width / 2, this.height / 2 + 200);
        ctx.rotate(this.earthAngle * 0.1);
        
        // 地球
        const earthRadius = 300;
        
        // 地球主体
        const gradient = ctx.createRadialGradient(
            -50, -50, 0,
            0, 0, earthRadius
        );
        gradient.addColorStop(0, '#4FC3F7');
        gradient.addColorStop(0.5, '#2196F3');
        gradient.addColorStop(1, '#0D47A1');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, earthRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // 大陆
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.ellipse(-80, -30, 60, 40, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(50, 20, 80, 50, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(-20, 80, 40, 30, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // 云层
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 + this.earthAngle;
            const x = Math.cos(angle) * 200;
            const y = Math.sin(angle) * 200;
            ctx.beginPath();
            ctx.ellipse(x, y, 40, 20, angle, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 大气层光晕
        ctx.strokeStyle = 'rgba(135, 206, 235, 0.3)';
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.arc(0, 0, earthRadius + 10, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
        
        // 圈数显示
        if (this.lapCount > 0) {
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 24px "Ma Shan Zheng"';
            ctx.textAlign = 'center';
            ctx.fillText(`已绕地球 ${this.lapCount} 圈！`, this.width / 2, 80);
        }
    }

    drawCity() {
        const ctx = this.ctx;
        
        if (this.phase >= 2) return; // 高空时不显示城市细节
        
        // 简化的城市轮廓
        ctx.fillStyle = '#555';
        for (let i = 0; i < 10; i++) {
            const x = i * 110;
            const h = 80 + Math.sin(i * 2) * 60;
            ctx.fillRect(x, this.height - h, 90, h);
        }
        
        // 道路
        ctx.fillStyle = '#333';
        ctx.fillRect(0, this.height - 30, this.width, 30);
    }

    drawSpeedLines() {
        const ctx = this.ctx;
        
        this.speedLines.forEach(line => {
            ctx.strokeStyle = `rgba(255, 255, 255, ${line.alpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(line.x, line.y);
            ctx.lineTo(line.x - line.length, line.y);
            ctx.stroke();
        });
    }

    drawFlyingFood() {
        const ctx = this.ctx;
        
        this.flyingFood.forEach(food => {
            ctx.save();
            ctx.translate(food.x, food.y);
            ctx.rotate(food.rotation);
            ctx.globalAlpha = food.alpha;
            ctx.font = `${food.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(food.food, 0, 0);
            ctx.restore();
        });
    }

    drawDeliveryBox() {
        const ctx = this.ctx;
        
        if (this.phase >= 3) return; // 送达后不显示
        
        ctx.save();
        ctx.translate(this.wukong.x - 30, this.wukong.y - 10);
        
        // 外卖箱
        ctx.fillStyle = '#2196F3';
        ctx.beginPath();
        ctx.roundRect(-20, -25, 40, 35, 3);
        ctx.fill();
        
        // 箱子盖
        ctx.fillStyle = '#1976D2';
        ctx.beginPath();
        ctx.roundRect(-22, -30, 44, 8, 2);
        ctx.fill();
        
        // 美团/饿了么风格标志
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('筋斗', 0, -10);
        ctx.fillText('外卖', 0, 2);
        
        ctx.restore();
    }

    drawCustomer() {
        const ctx = this.ctx;
        const c = this.customer;
        
        ctx.save();
        ctx.translate(c.x, c.y);
        
        // 身体
        ctx.fillStyle = '#9C27B0';
        ctx.beginPath();
        ctx.ellipse(0, 0, 20, 30, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 头
        ctx.fillStyle = '#FFDAB9';
        ctx.beginPath();
        ctx.arc(0, -45, 18, 0, Math.PI * 2);
        ctx.fill();
        
        // 愤怒表情
        if (c.angry) {
            // 怒目
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.ellipse(-6, -47, 4, 3, -0.3, 0, Math.PI * 2);
            ctx.ellipse(6, -47, 4, 3, 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // 怒眉
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-12, -55);
            ctx.lineTo(-3, -52);
            ctx.moveTo(12, -55);
            ctx.lineTo(3, -52);
            ctx.stroke();
            
            // 张嘴抱怨
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.ellipse(0, -35, 8, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 怒气符号
            ctx.fillStyle = '#e74c3c';
            ctx.font = '24px Arial';
            ctx.fillText('💢', 25, -50);
            
            // 抱怨文字
            ctx.fillStyle = '#e74c3c';
            ctx.font = '16px "Noto Sans SC"';
            ctx.textAlign = 'center';
            ctx.fillText('我的外卖呢?!', 0, -80);
        }
        
        // 手机（看订单）
        ctx.fillStyle = '#333';
        ctx.save();
        ctx.translate(25, -20);
        ctx.fillRect(-8, -15, 16, 28);
        ctx.fillStyle = '#4FC3F7';
        ctx.fillRect(-6, -12, 12, 22);
        ctx.restore();
        
        ctx.restore();
    }

    drawUI() {
        const ctx = this.ctx;
        
        // 订单信息面板
        if (this.phase >= 1) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.beginPath();
            ctx.roundRect(20, 20, 200, 100, 10);
            ctx.fill();
            
            ctx.fillStyle = '#FFF';
            ctx.font = '14px "Noto Sans SC"';
            ctx.textAlign = 'left';
            ctx.fillText('📍 配送中...', 35, 45);
            ctx.fillText(`距离: ${this.phase < 2 ? '3km' : '已绕地球N圈'}`, 35, 70);
            ctx.fillText(`速度: ${this.phase < 2 ? '加速中...' : '∞ km/h'}`, 35, 95);
        }
        
        // 食物完整度指示
        if (this.phase >= 2) {
            const integrity = Math.max(0, 100 - this.flyingFood.length * 5);
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.beginPath();
            ctx.roundRect(this.width - 220, 20, 200, 60, 10);
            ctx.fill();
            
            ctx.fillStyle = integrity > 50 ? '#4CAF50' : '#e74c3c';
            ctx.font = 'bold 16px "Noto Sans SC"';
            ctx.textAlign = 'right';
            ctx.fillText(`食物完整度: ${integrity}%`, this.width - 35, 50);
            
            // 进度条
            ctx.fillStyle = '#333';
            ctx.fillRect(this.width - 205, 60, 170, 10);
            ctx.fillStyle = integrity > 50 ? '#4CAF50' : '#e74c3c';
            ctx.fillRect(this.width - 205, 60, 170 * (integrity / 100), 10);
        }
    }

    getSubtitle() {
        return this.currentSubtitle;
    }

    reset() {
        this.time = 0;
        this.phase = 0;
        this.wukong = new WukongCharacter(100, this.height / 2, 0.6);
        this.wukong.setState('flying');
        this.cloud = new JinDouCloud(100, this.height / 2 + 50, 0.6);
        this.flyingFood = [];
        this.speedLines = [];
        this.showEarth = false;
        this.lapCount = 0;
        this.customer.angry = false;
        this.currentSubtitle = '';
    }

    isComplete() {
        return this.time >= this.duration;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Scene4;
}


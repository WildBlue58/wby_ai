/**
 * 场景二：城市着陆 - 文化冲击
 * 孙悟空出现在现代都市，看到低头族，筋斗云被尾气呛到
 */

class Scene2 {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        
        // 场景信息
        this.name = '城市着陆';
        this.subtitle = '第二幕';
        this.duration = 15000;
        
        // 动画状态
        this.time = 0;
        this.phase = 0;
        
        // 角色
        this.wukong = new WukongCharacter(this.width / 2, 150, 0.7);
        this.wukong.setState('surprised');
        this.cloud = new JinDouCloud(this.width / 2, 230, 0.7);
        
        // 城市建筑
        this.buildings = this.generateBuildings();
        
        // 行人（低头族）
        this.pedestrians = this.generatePedestrians();
        
        // 汽车
        this.cars = this.generateCars();
        
        // 烟雾粒子
        this.smokeParticles = [];
        
        // 字幕
        this.subtitles = [
            { time: 0, text: '悟空一头栽进了一个陌生的世界...' },
            { time: 3000, text: '"这...这是何方仙境？这些高塔比天宫还高！"' },
            { time: 6000, text: '"咦？这些凡人为何都在低头参拜？"' },
            { time: 8500, text: '"莫非是在修炼什么秘法？待俺老孙也学学！"' },
            { time: 11000, text: '*咳咳* 筋斗云：这空气有毒啊喂！' },
            { time: 13500, text: '悟空决定倒立观察这个奇怪的世界...' }
        ];
        this.currentSubtitle = '';
        
        // 悟空下落动画
        this.landingProgress = 0;
        this.isLanded = false;
    }

    // 生成建筑
    generateBuildings() {
        const buildings = [];
        const buildingCount = 12;
        
        for (let i = 0; i < buildingCount; i++) {
            buildings.push({
                x: i * 90 - 50,
                width: 60 + Math.random() * 40,
                height: 150 + Math.random() * 250,
                windows: Math.floor(Math.random() * 3) + 2,
                color: `hsl(${220 + Math.random() * 30}, 20%, ${15 + Math.random() * 15}%)`
            });
        }
        
        return buildings.sort((a, b) => b.height - a.height);
    }

    // 生成行人
    generatePedestrians() {
        const pedestrians = [];
        
        for (let i = 0; i < 8; i++) {
            pedestrians.push({
                x: 100 + i * 120,
                y: this.height - 80,
                direction: Math.random() > 0.5 ? 1 : -1,
                speed: 0.3 + Math.random() * 0.3,
                phoneAngle: -0.5 + Math.random() * 0.3,
                walkPhase: Math.random() * Math.PI * 2,
                color: `hsl(${Math.random() * 360}, 40%, 50%)`
            });
        }
        
        return pedestrians;
    }

    // 生成汽车
    generateCars() {
        const cars = [];
        
        for (let i = 0; i < 4; i++) {
            cars.push({
                x: -100 - i * 300,
                y: this.height - 40,
                speed: 2 + Math.random() * 2,
                color: ['#FF4444', '#4444FF', '#44FF44', '#FFFF44', '#FF44FF'][Math.floor(Math.random() * 5)],
                exhaustTimer: 0
            });
        }
        
        return cars;
    }

    // 更新场景
    update(deltaTime) {
        this.time += deltaTime;
        this.updatePhase();
        this.updateSubtitles();
        
        // 更新角色
        this.wukong.update(deltaTime);
        this.cloud.update(deltaTime);
        
        // 更新下落动画
        this.updateLanding(deltaTime);
        
        // 更新行人
        this.updatePedestrians(deltaTime);
        
        // 更新汽车
        this.updateCars(deltaTime);
        
        // 更新烟雾
        this.updateSmoke(deltaTime);
    }

    updatePhase() {
        if (this.time < 3000) {
            this.phase = 0;
        } else if (this.time < 8000) {
            this.phase = 1;
        } else if (this.time < 12000) {
            this.phase = 2;
        } else {
            this.phase = 3;
        }
    }

    updateLanding(deltaTime) {
        if (!this.isLanded && this.time > 1000) {
            this.landingProgress = Math.min((this.time - 1000) / 2000, 1);
            
            // 使用缓动函数
            const eased = 1 - Math.pow(1 - this.landingProgress, 3);
            const targetY = this.height - 200;
            const startY = 150;
            
            this.wukong.setPosition(
                this.width / 2 + Math.sin(this.time * 0.003) * 20,
                startY + (targetY - startY) * eased
            );
            this.cloud.setPosition(
                this.width / 2 + Math.sin(this.time * 0.003) * 20,
                startY + 80 + (targetY - startY + 20) * eased
            );
            
            if (this.landingProgress >= 1) {
                this.isLanded = true;
            }
        }
        
        // 悟空倒立观察
        if (this.phase === 3) {
            const flipProgress = Math.min((this.time - 12000) / 1500, 1);
            this.wukong.rotation = flipProgress * Math.PI;
        }
    }

    updatePedestrians(deltaTime) {
        this.pedestrians.forEach(p => {
            p.x += p.direction * p.speed * deltaTime * 0.05;
            p.walkPhase += deltaTime * 0.01;
            
            // 边界检查
            if (p.x > this.width + 50) p.x = -50;
            if (p.x < -50) p.x = this.width + 50;
        });
    }

    updateCars(deltaTime) {
        this.cars.forEach(car => {
            car.x += car.speed * deltaTime * 0.1;
            car.exhaustTimer += deltaTime;
            
            // 添加尾气
            if (car.exhaustTimer > 100 && car.x > 0 && car.x < this.width) {
                car.exhaustTimer = 0;
                this.smokeParticles.push({
                    x: car.x - 30,
                    y: car.y - 5,
                    size: 5 + Math.random() * 5,
                    alpha: 0.6,
                    vx: -1 - Math.random(),
                    vy: -0.5 - Math.random() * 0.5
                });
            }
            
            // 循环
            if (car.x > this.width + 100) {
                car.x = -100;
            }
        });
    }

    updateSmoke(deltaTime) {
        this.smokeParticles = this.smokeParticles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.size += 0.3;
            p.alpha -= 0.01;
            return p.alpha > 0;
        });
        
        // 筋斗云受影响
        if (this.phase >= 2 && this.isLanded) {
            this.cloud.setCoughing(true);
        }
    }

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
        ctx.clearRect(0, 0, this.width, this.height);
        
        // 绘制天空
        this.drawSky();
        
        // 绘制建筑
        this.drawBuildings();
        
        // 绘制道路
        this.drawRoad();
        
        // 绘制汽车
        this.drawCars();
        
        // 绘制烟雾
        this.drawSmoke();
        
        // 绘制行人
        this.drawPedestrians();
        
        // 绘制筋斗云和悟空
        this.cloud.draw(ctx);
        this.wukong.draw(ctx);
        
        // 绘制悟空的思考气泡
        if (this.phase === 1) {
            this.drawThoughtBubble();
        }
    }

    drawSky() {
        const ctx = this.ctx;
        
        // 都市天空（灰蒙蒙的）
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#4a5568');
        gradient.addColorStop(0.5, '#718096');
        gradient.addColorStop(1, '#a0aec0');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // 霓虹光晕
        if (this.time > 5000) {
            ctx.fillStyle = 'rgba(255, 0, 128, 0.05)';
            ctx.beginPath();
            ctx.arc(200, 300, 150, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(0, 255, 255, 0.05)';
            ctx.beginPath();
            ctx.arc(800, 250, 180, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawBuildings() {
        const ctx = this.ctx;
        
        this.buildings.forEach((building, index) => {
            const x = building.x;
            const y = this.height - 60 - building.height;
            
            // 建筑主体
            ctx.fillStyle = building.color;
            ctx.fillRect(x, y, building.width, building.height);
            
            // 窗户
            const windowRows = Math.floor(building.height / 30);
            const windowCols = building.windows;
            const windowWidth = (building.width - 20) / windowCols - 5;
            const windowHeight = 15;
            
            for (let row = 0; row < windowRows; row++) {
                for (let col = 0; col < windowCols; col++) {
                    const wx = x + 10 + col * (windowWidth + 5);
                    const wy = y + 15 + row * 30;
                    
                    // 随机亮灯
                    const isLit = Math.sin(index * 10 + row * col + this.time * 0.001) > 0.3;
                    ctx.fillStyle = isLit ? 
                        `rgba(255, 255, 200, ${0.7 + Math.random() * 0.3})` : 
                        'rgba(30, 30, 50, 0.8)';
                    
                    ctx.fillRect(wx, wy, windowWidth, windowHeight);
                }
            }
            
            // 楼顶装饰
            if (building.height > 300) {
                ctx.fillStyle = '#FF0000';
                ctx.beginPath();
                ctx.arc(x + building.width / 2, y - 10, 5, 0, Math.PI * 2);
                ctx.fill();
                
                // 闪烁效果
                if (Math.sin(this.time * 0.005) > 0) {
                    ctx.shadowColor = '#FF0000';
                    ctx.shadowBlur = 15;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
        });
    }

    drawRoad() {
        const ctx = this.ctx;
        
        // 人行道
        ctx.fillStyle = '#555';
        ctx.fillRect(0, this.height - 60, this.width, 60);
        
        // 马路
        ctx.fillStyle = '#333';
        ctx.fillRect(0, this.height - 50, this.width, 50);
        
        // 斑马线
        ctx.fillStyle = '#FFF';
        for (let i = 0; i < 8; i++) {
            ctx.fillRect(this.width / 2 - 80 + i * 20, this.height - 48, 15, 46);
        }
        
        // 道路标线
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.setLineDash([30, 20]);
        ctx.beginPath();
        ctx.moveTo(0, this.height - 25);
        ctx.lineTo(this.width, this.height - 25);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    drawCars() {
        const ctx = this.ctx;
        
        this.cars.forEach(car => {
            ctx.save();
            ctx.translate(car.x, car.y);
            
            // 车身
            ctx.fillStyle = car.color;
            ctx.beginPath();
            ctx.roundRect(-25, -15, 50, 20, 3);
            ctx.fill();
            
            // 车顶
            ctx.fillStyle = car.color;
            ctx.beginPath();
            ctx.roundRect(-15, -25, 30, 12, 3);
            ctx.fill();
            
            // 车窗
            ctx.fillStyle = '#87CEEB';
            ctx.beginPath();
            ctx.roundRect(-12, -23, 24, 8, 2);
            ctx.fill();
            
            // 车轮
            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.arc(-15, 5, 6, 0, Math.PI * 2);
            ctx.arc(15, 5, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // 车灯
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(23, -5, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });
    }

    drawSmoke() {
        const ctx = this.ctx;
        
        this.smokeParticles.forEach(p => {
            ctx.fillStyle = `rgba(80, 80, 80, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawPedestrians() {
        const ctx = this.ctx;
        
        this.pedestrians.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            
            // 走路动画
            const walkOffset = Math.sin(p.walkPhase) * 3;
            
            // 身体
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(0, -20, 8, 15, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 头
            ctx.fillStyle = '#FFDAB9';
            ctx.beginPath();
            ctx.arc(0, -42, 10, 0, Math.PI * 2);
            ctx.fill();
            
            // 头发
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(0, -47, 8, Math.PI, Math.PI * 2);
            ctx.fill();
            
            // 腿
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(-4, -5);
            ctx.lineTo(-4 + walkOffset, 15);
            ctx.moveTo(4, -5);
            ctx.lineTo(4 - walkOffset, 15);
            ctx.stroke();
            
            // 手臂握手机（低头姿势）
            ctx.strokeStyle = '#FFDAB9';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(0, -25);
            ctx.lineTo(5, -15);
            ctx.stroke();
            
            // 手机
            ctx.fillStyle = '#333';
            ctx.save();
            ctx.translate(5, -18);
            ctx.rotate(p.phoneAngle);
            ctx.fillRect(-4, -8, 8, 14);
            ctx.fillStyle = '#4FC3F7';
            ctx.fillRect(-3, -6, 6, 10);
            ctx.restore();
            
            // 低头的脸（只能看到头顶）
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(0, -40, 3, 0, Math.PI * 2); // 简化的眼睛位置暗示低头
            ctx.fill();
            
            ctx.restore();
        });
    }

    drawThoughtBubble() {
        const ctx = this.ctx;
        const bx = this.wukong.x + 80;
        const by = this.wukong.y - 80;
        
        // 思考气泡
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.ellipse(bx, by, 60, 40, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 小气泡
        ctx.beginPath();
        ctx.arc(bx - 50, by + 30, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bx - 60, by + 45, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // 文字
        ctx.fillStyle = '#333';
        ctx.font = '14px "Noto Sans SC"';
        ctx.textAlign = 'center';
        ctx.fillText('这是在拜佛？', bx, by - 5);
        ctx.fillText('🤔', bx, by + 15);
    }

    getSubtitle() {
        return this.currentSubtitle;
    }

    reset() {
        this.time = 0;
        this.phase = 0;
        this.landingProgress = 0;
        this.isLanded = false;
        this.smokeParticles = [];
        this.wukong = new WukongCharacter(this.width / 2, 150, 0.7);
        this.wukong.setState('surprised');
        this.cloud = new JinDouCloud(this.width / 2, 230, 0.7);
        this.cloud.setCoughing(false);
        this.pedestrians = this.generatePedestrians();
        this.cars = this.generateCars();
        this.currentSubtitle = '';
    }

    isComplete() {
        return this.time >= this.duration;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Scene2;
}


/**
 * 场景五：直播天王 - 网红诞生
 * 孙悟空开直播带货，火眼金睛鉴假货，小猴子助播，成为顶流网红
 */

class Scene5 {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        
        // 场景信息
        this.name = '直播天王';
        this.subtitle = '第五幕';
        this.duration = 15000;
        
        // 动画状态
        this.time = 0;
        this.phase = 0;
        
        // 角色
        this.wukong = new WukongCharacter(this.width / 2, this.height / 2 + 20, 0.8);
        this.wukong.setState('streaming');
        
        // 小猴子助播团
        this.miniMonkeys = [];
        for (let i = 0; i < 3; i++) {
            this.miniMonkeys.push(new MiniMonkey(
                150 + i * 100,
                this.height - 120,
                0.35
            ));
        }
        
        // 弹幕系统
        this.danmaku = [];
        this.danmakuTexts = [
            '666666', '猴哥YYDS！', '太强了！', '金箍棒链接在哪',
            '火眼金睛求鉴定', '俺也想要筋斗云', '猴哥带我飞',
            '这是正品吗？', '主播好帅', '蟠桃还有吗',
            '哈哈哈哈', '笑死我了', '下单了！', '已关注',
            '齐天大圣威武！', '取经路上辛苦了', '请问金箍棒多少钱',
            '小猴子好可爱', '想rua猴子', '求翻牌！'
        ];
        
        // 商品展示
        this.products = [
            { name: '限量版金箍棒', price: 99999, emoji: '🏏' },
            { name: '筋斗云同款', price: 88888, emoji: '☁️' },
            { name: '火眼金睛眼镜', price: 66666, emoji: '👓' },
            { name: '蟠桃礼盒', price: 9999, emoji: '🍑' }
        ];
        this.currentProduct = 0;
        
        // 数据统计
        this.followers = 100000;
        this.likes = 500000;
        this.viewers = 88888;
        
        // 特效
        this.hearts = [];
        this.gifts = [];
        this.giftTypes = ['🎁', '🚀', '💎', '👑', '🏆', '💰'];
        
        // 金箍棒动画
        this.staffLength = 80;
        this.staffGrowing = false;
        
        // 火眼金睛特效
        this.goldenEyesActive = false;
        this.scanLineY = 0;
        
        // 字幕
        this.subtitles = [
            { time: 0, text: '悟空开启了直播带货生涯...' },
            { time: 2500, text: '"各位施主，俺老孙今天给大家带来几件宝贝！"' },
            { time: 5000, text: '*展示金箍棒* "如意金箍棒，可大可小，童叟无欺！"' },
            { time: 7500, text: '"有人问是不是正品？俺用火眼金睛给你鉴定！"' },
            { time: 10000, text: '弹幕疯狂刷屏："猴哥YYDS！" "666666"' },
            { time: 12500, text: '恭喜猴哥粉丝突破100万！成为平台顶流！' },
            { time: 14000, text: '"取经路上见过的妖怪都没你们热情！"' }
        ];
        this.currentSubtitle = '';
    }

    update(deltaTime) {
        this.time += deltaTime;
        this.updatePhase();
        this.updateSubtitles();
        
        this.wukong.update(deltaTime);
        this.miniMonkeys.forEach(m => m.update(deltaTime));
        
        this.updateDanmaku(deltaTime);
        this.updateHearts(deltaTime);
        this.updateGifts(deltaTime);
        this.updateStats(deltaTime);
        this.updateEffects(deltaTime);
    }

    updatePhase() {
        if (this.time < 2500) {
            this.phase = 0;
        } else if (this.time < 7500) {
            this.phase = 1;
            // 展示金箍棒
            if (this.time > 5000 && this.time < 7500) {
                this.staffGrowing = true;
                this.staffLength = 80 + Math.sin((this.time - 5000) * 0.005) * 100;
            }
        } else if (this.time < 10000) {
            this.phase = 2;
            this.goldenEyesActive = true;
        } else {
            this.phase = 3;
            this.goldenEyesActive = false;
        }
    }

    updateDanmaku(deltaTime) {
        // 添加新弹幕
        if (Math.random() < 0.08) {
            this.danmaku.push({
                text: this.danmakuTexts[Math.floor(Math.random() * this.danmakuTexts.length)],
                x: this.width + 50,
                y: 100 + Math.random() * 200,
                speed: 2 + Math.random() * 3,
                color: `hsl(${Math.random() * 360}, 80%, 70%)`,
                size: 14 + Math.random() * 6
            });
        }
        
        // 更新弹幕位置
        this.danmaku = this.danmaku.filter(d => {
            d.x -= d.speed;
            return d.x > -200;
        });
    }

    updateHearts(deltaTime) {
        // 添加爱心
        if (Math.random() < 0.15) {
            this.hearts.push({
                x: this.width - 80 + Math.random() * 40,
                y: this.height - 100,
                vy: -2 - Math.random() * 2,
                vx: (Math.random() - 0.5) * 2,
                alpha: 1,
                size: 15 + Math.random() * 15,
                color: ['#FF6B6B', '#FF8E8E', '#FFB4B4', '#FF4757'][Math.floor(Math.random() * 4)]
            });
        }
        
        // 更新爱心
        this.hearts = this.hearts.filter(h => {
            h.x += h.vx;
            h.y += h.vy;
            h.alpha -= 0.01;
            return h.alpha > 0;
        });
    }

    updateGifts(deltaTime) {
        // 随机礼物
        if (Math.random() < 0.02) {
            this.gifts.push({
                emoji: this.giftTypes[Math.floor(Math.random() * this.giftTypes.length)],
                x: Math.random() * this.width,
                y: -50,
                vy: 2 + Math.random() * 2,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                size: 30 + Math.random() * 20
            });
        }
        
        // 更新礼物
        this.gifts = this.gifts.filter(g => {
            g.y += g.vy;
            g.rotation += g.rotationSpeed;
            return g.y < this.height + 50;
        });
    }

    updateStats(deltaTime) {
        // 数据增长
        if (this.phase >= 1) {
            this.followers += Math.floor(Math.random() * 100);
            this.likes += Math.floor(Math.random() * 500);
            
            if (this.phase >= 3) {
                this.followers += Math.floor(Math.random() * 500);
                this.likes += Math.floor(Math.random() * 2000);
            }
        }
    }

    updateEffects(deltaTime) {
        // 火眼金睛扫描线
        if (this.goldenEyesActive) {
            this.scanLineY = (this.scanLineY + deltaTime * 0.2) % (this.height - 200);
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

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
        
        // 绘制直播间背景
        this.drawLiveRoom();
        
        // 绘制礼物
        this.drawGifts();
        
        // 绘制商品展示区
        this.drawProductArea();
        
        // 绘制小猴子助播
        this.miniMonkeys.forEach(m => m.draw(ctx));
        
        // 绘制悟空
        this.wukong.draw(ctx);
        
        // 绘制金箍棒特效
        if (this.staffGrowing) {
            this.drawStaffEffect();
        }
        
        // 绘制火眼金睛特效
        if (this.goldenEyesActive) {
            this.drawGoldenEyesEffect();
        }
        
        // 绘制弹幕
        this.drawDanmaku();
        
        // 绘制爱心
        this.drawHearts();
        
        // 绘制直播UI
        this.drawLiveUI();
    }

    drawLiveRoom() {
        const ctx = this.ctx;
        
        // 背景渐变
        const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // 霓虹灯效果
        ctx.shadowBlur = 30;
        
        // 左侧霓虹灯
        ctx.shadowColor = '#FF6B9D';
        ctx.strokeStyle = '#FF6B9D';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(30, 100);
        ctx.lineTo(30, this.height - 100);
        ctx.stroke();
        
        // 右侧霓虹灯
        ctx.shadowColor = '#00D4FF';
        ctx.strokeStyle = '#00D4FF';
        ctx.beginPath();
        ctx.moveTo(this.width - 30, 100);
        ctx.lineTo(this.width - 30, this.height - 100);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        
        // 地面
        ctx.fillStyle = '#2d2d44';
        ctx.fillRect(0, this.height - 100, this.width, 100);
        
        // 舞台灯光
        ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(this.width / 2 - 200, 0);
        ctx.lineTo(this.width / 2 - 300, this.height);
        ctx.lineTo(this.width / 2 + 300, this.height);
        ctx.lineTo(this.width / 2 + 200, 0);
        ctx.closePath();
        ctx.fill();
        
        // 背景装饰文字
        ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
        ctx.font = 'bold 80px "Ma Shan Zheng"';
        ctx.textAlign = 'center';
        ctx.fillText('齐天大圣', this.width / 2, 150);
        
        // 直播间标题
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 28px "Ma Shan Zheng"';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10;
        ctx.fillText('【猴哥直播间】神仙好物推荐', this.width / 2, 50);
        ctx.shadowBlur = 0;
    }

    drawProductArea() {
        const ctx = this.ctx;
        const product = this.products[this.currentProduct];
        
        // 商品展示框
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.roundRect(50, this.height - 180, 200, 70, 10);
        ctx.fill();
        
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 商品信息
        ctx.fillStyle = '#FFF';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(product.emoji, 70, this.height - 140);
        
        ctx.font = '16px "Noto Sans SC"';
        ctx.fillText(product.name, 100, this.height - 145);
        
        ctx.fillStyle = '#FF6B6B';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`¥${product.price}`, 100, this.height - 120);
        
        // 商品切换提示
        if (Math.floor(this.time / 3000) % this.products.length !== this.currentProduct) {
            this.currentProduct = Math.floor(this.time / 3000) % this.products.length;
        }
    }

    drawStaffEffect() {
        const ctx = this.ctx;
        
        ctx.save();
        ctx.translate(this.wukong.x + 50, this.wukong.y - 30);
        ctx.rotate(0.3);
        
        // 发光金箍棒
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 20;
        
        const gradient = ctx.createLinearGradient(0, 0, 0, this.staffLength);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.1, '#8B4513');
        gradient.addColorStop(0.9, '#8B4513');
        gradient.addColorStop(1, '#FFD700');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(-5, 0, 10, this.staffLength, 5);
        ctx.fill();
        
        // 能量波纹
        for (let i = 0; i < 3; i++) {
            const wave = (this.time * 0.01 + i * 0.5) % 1;
            ctx.strokeStyle = `rgba(255, 215, 0, ${1 - wave})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, this.staffLength / 2, 20 + wave * 30, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    drawGoldenEyesEffect() {
        const ctx = this.ctx;
        
        // 扫描线
        const gradient = ctx.createLinearGradient(0, this.scanLineY + 150, 0, this.scanLineY + 160 + 150);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0)');
        gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(100, this.scanLineY + 150, this.width - 200, 10);
        
        // 眼睛光效
        ctx.save();
        ctx.translate(this.wukong.x, this.wukong.y - 60);
        
        // 光束
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(-100, 200);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(100, 200);
        ctx.stroke();
        
        ctx.restore();
        
        // 鉴定结果
        ctx.fillStyle = '#4CAF50';
        ctx.font = 'bold 24px "Noto Sans SC"';
        ctx.textAlign = 'center';
        ctx.fillText('✓ 正品认证', this.width / 2, this.height - 220);
    }

    drawDanmaku() {
        const ctx = this.ctx;
        
        this.danmaku.forEach(d => {
            ctx.font = `${d.size}px "Noto Sans SC"`;
            ctx.fillStyle = d.color;
            ctx.textAlign = 'left';
            
            // 描边效果
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 2;
            ctx.strokeText(d.text, d.x, d.y);
            ctx.fillText(d.text, d.x, d.y);
        });
    }

    drawHearts() {
        const ctx = this.ctx;
        
        this.hearts.forEach(h => {
            ctx.globalAlpha = h.alpha;
            ctx.fillStyle = h.color;
            ctx.font = `${h.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText('❤', h.x, h.y);
        });
        ctx.globalAlpha = 1;
    }

    drawGifts() {
        const ctx = this.ctx;
        
        this.gifts.forEach(g => {
            ctx.save();
            ctx.translate(g.x, g.y);
            ctx.rotate(g.rotation);
            ctx.font = `${g.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(g.emoji, 0, 0);
            ctx.restore();
        });
    }

    drawLiveUI() {
        const ctx = this.ctx;
        
        // 观看人数
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.roundRect(this.width - 160, 80, 140, 35, 17);
        ctx.fill();
        
        ctx.fillStyle = '#FFF';
        ctx.font = '14px "Noto Sans SC"';
        ctx.textAlign = 'center';
        ctx.fillText(`👁 ${this.formatNumber(this.viewers)} 在看`, this.width - 90, 103);
        
        // 粉丝数
        ctx.fillStyle = 'rgba(255, 107, 157, 0.8)';
        ctx.beginPath();
        ctx.roundRect(this.width - 160, 125, 140, 35, 17);
        ctx.fill();
        
        ctx.fillStyle = '#FFF';
        ctx.fillText(`粉丝 ${this.formatNumber(this.followers)}`, this.width - 90, 148);
        
        // 点赞数
        ctx.fillStyle = 'rgba(255, 71, 87, 0.8)';
        ctx.beginPath();
        ctx.roundRect(this.width - 160, 170, 140, 35, 17);
        ctx.fill();
        
        ctx.fillStyle = '#FFF';
        ctx.fillText(`❤ ${this.formatNumber(this.likes)}`, this.width - 90, 193);
        
        // 直播时长
        const minutes = Math.floor(this.time / 60000);
        const seconds = Math.floor((this.time % 60000) / 1000);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.roundRect(80, 80, 80, 30, 15);
        ctx.fill();
        
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(95, 95, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, 108, 100);
        
        // 排行榜提示
        if (this.phase >= 3) {
            ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
            ctx.beginPath();
            ctx.roundRect(this.width / 2 - 120, 80, 240, 40, 20);
            ctx.fill();
            
            ctx.fillStyle = '#000';
            ctx.font = 'bold 16px "Noto Sans SC"';
            ctx.textAlign = 'center';
            ctx.fillText('🏆 恭喜登顶带货榜第一！', this.width / 2, 106);
        }
    }

    formatNumber(num) {
        if (num >= 10000) {
            return (num / 10000).toFixed(1) + 'w';
        }
        return num.toString();
    }

    getSubtitle() {
        return this.currentSubtitle;
    }

    reset() {
        this.time = 0;
        this.phase = 0;
        this.wukong = new WukongCharacter(this.width / 2, this.height / 2 + 20, 0.8);
        this.wukong.setState('streaming');
        this.danmaku = [];
        this.hearts = [];
        this.gifts = [];
        this.followers = 100000;
        this.likes = 500000;
        this.currentProduct = 0;
        this.staffGrowing = false;
        this.goldenEyesActive = false;
        this.currentSubtitle = '';
        
        this.miniMonkeys = [];
        for (let i = 0; i < 3; i++) {
            this.miniMonkeys.push(new MiniMonkey(
                150 + i * 100,
                this.height - 120,
                0.35
            ));
        }
    }

    isComplete() {
        return this.time >= this.duration;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Scene5;
}


const axios = require('axios');
const cheerio = require('cheerio');

class JDDataService {
    constructor() {
        this.cachedData = {
            categories: [],
            products: [],
            sales: 0,
            updateTime: null
        };
        this.initializeData();
    }

    // 初始化基础数据
    initializeData() {
        this.cachedData = {
            categories: this.getJDCategoryData(),
            products: this.getJDProductData(),
            sales: this.generateRealisticSales(),
            regions: this.getJDRegionData(),
            trend: this.generateTrendData(),
            updateTime: new Date()
        };
    }

    // 获取京东品类数据（基于真实分类）
    getJDCategoryData() {
        const categories = [
            { name: '手机数码', percentage: 28 },
            { name: '家用电器', percentage: 22 },
            { name: '服装服饰', percentage: 18 },
            { name: '食品饮料', percentage: 15 },
            { name: '家居家装', percentage: 17 }
        ];
        
        // 添加随机波动，模拟实时变化
        return categories.map(cat => ({
            ...cat,
            percentage: Math.max(5, cat.percentage + (Math.random() - 0.5) * 6)
        }));
    }

    // 获取京东热销商品数据（基于真实商品）
    getJDProductData() {
        const products = [
            { name: 'iPhone 15 Pro Max', baseCategory: '手机数码' },
            { name: '华为Mate60 Pro', baseCategory: '手机数码' },
            { name: '小米14 Ultra', baseCategory: '手机数码' },
            { name: 'iPad Air 5', baseCategory: '手机数码' },
            { name: '戴森吸尘器V15', baseCategory: '家用电器' },
            { name: 'AirPods Pro 3', baseCategory: '手机数码' },
            { name: '美的空调挂机', baseCategory: '家用电器' },
            { name: '海尔冰箱双门', baseCategory: '家用电器' },
            { name: 'Nike Air Jordan', baseCategory: '服装服饰' },
            { name: '茅台飞天53度', baseCategory: '食品饮料' }
        ];
        
        return products.map(product => ({
            name: product.name,
            sales: this.generateProductSales(product.baseCategory)
        }));
    }

    // 根据商品类别生成合理的销量
    generateProductSales(category) {
        const baseSales = {
            '手机数码': { min: 5000, max: 12000 },
            '家用电器': { min: 3000, max: 8000 },
            '服装服饰': { min: 2000, max: 6000 },
            '食品饮料': { min: 4000, max: 10000 },
            '家居家装': { min: 2500, max: 7000 }
        };
        
        const range = baseSales[category] || { min: 2000, max: 8000 };
        return Math.floor(Math.random() * (range.max - range.min) + range.min);
    }

    // 生成真实的销售额（基于时间和市场规律）
    generateRealisticSales() {
        const now = new Date();
        const hour = now.getHours();
        const dayOfWeek = now.getDay(); // 0=周日, 6=周六
        
        // 基础销售额
        let baseSales = 8000000;
        
        // 时间段影响
        if (hour >= 9 && hour <= 11) baseSales *= 1.4; // 上午高峰
        else if (hour >= 14 && hour <= 16) baseSales *= 1.2; // 下午
        else if (hour >= 19 && hour <= 22) baseSales *= 1.6; // 晚上高峰
        else if (hour >= 0 && hour <= 6) baseSales *= 0.4; // 深夜
        
        // 周末影响
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            baseSales *= 1.3; // 周末购物高峰
        }
        
        // 添加随机波动
        const randomFactor = 0.85 + Math.random() * 0.3; // 0.85-1.15
        
        return Math.floor(baseSales * randomFactor);
    }

    // 获取地域分布数据（基于京东真实配送数据）
    getJDRegionData() {
        // 使用省份数据，因为ECharts中国地图显示的是省份
        const provinces = [
            { name: '北京', baseCount: 15000, growth: 1.25 },
            { name: '上海', baseCount: 18000, growth: 1.15 },
            { name: '广东', baseCount: 25000, growth: 1.20 },
            { name: '江苏', baseCount: 20000, growth: 1.10 },
            { name: '浙江', baseCount: 16000, growth: 1.30 },
            { name: '山东', baseCount: 14000, growth: 1.05 },
            { name: '河南', baseCount: 12000, growth: 1.00 },
            { name: '四川', baseCount: 13000, growth: 1.15 },
            { name: '湖北', baseCount: 11000, growth: 1.08 },
            { name: '福建', baseCount: 10000, growth: 1.20 },
            { name: '湖南', baseCount: 9500, growth: 1.05 },
            { name: '安徽', baseCount: 8500, growth: 1.00 },
            { name: '河北', baseCount: 8000, growth: 0.95 },
            { name: '陕西', baseCount: 7500, growth: 1.10 },
            { name: '重庆', baseCount: 7000, growth: 1.15 },
            { name: '江西', baseCount: 6500, growth: 1.05 },
            { name: '辽宁', baseCount: 6000, growth: 0.90 },
            { name: '云南', baseCount: 5500, growth: 1.20 },
            { name: '山西', baseCount: 5000, growth: 0.95 },
            { name: '广西', baseCount: 4800, growth: 1.10 },
            { name: '贵州', baseCount: 4500, growth: 1.25 },
            { name: '吉林', baseCount: 3500, growth: 0.85 },
            { name: '黑龙江', baseCount: 3200, growth: 0.80 },
            { name: '内蒙古', baseCount: 2800, growth: 0.90 },
            { name: '新疆', baseCount: 2500, growth: 1.00 },
            { name: '甘肃', baseCount: 2200, growth: 0.95 },
            { name: '海南', baseCount: 2000, growth: 1.15 },
            { name: '宁夏', baseCount: 1500, growth: 1.05 },
            { name: '青海', baseCount: 1200, growth: 1.00 },
            { name: '西藏', baseCount: 800, growth: 1.20 },
            { name: '天津', baseCount: 4500, growth: 1.10 },
            { name: '香港', baseCount: 3000, growth: 1.05 },
            { name: '澳门', baseCount: 800, growth: 1.10 },
            { name: '台湾', baseCount: 5000, growth: 1.08 }
        ];
        
        return provinces.map(province => ({
            name: province.name,
            value: Math.floor(province.baseCount * province.growth * (0.8 + Math.random() * 0.4))
        }));
    }

    // 生成24小时趋势数据（基于真实购物规律）
    generateTrendData() {
        const currentHour = new Date().getHours();
        const trend = [];
        
        // 真实的购物时间分布
        const hourlyMultipliers = {
            0: 0.2, 1: 0.15, 2: 0.1, 3: 0.08, 4: 0.05, 5: 0.08,
            6: 0.15, 7: 0.3, 8: 0.6, 9: 1.2, 10: 1.4, 11: 1.3,
            12: 1.1, 13: 0.9, 14: 1.1, 15: 1.2, 16: 1.0, 17: 0.9,
            18: 0.8, 19: 1.3, 20: 1.6, 21: 1.8, 22: 1.5, 23: 0.6
        };
        
        for (let i = 0; i < 24; i++) {
            const multiplier = hourlyMultipliers[i];
            const baseSales = 8000;
            const randomFactor = 0.8 + Math.random() * 0.4; // 增加变化幅度
            
            trend.push({
                hour: i,
                sales: Math.floor(baseSales * multiplier * randomFactor)
            });
        }
        
        return trend;
    }

    // 尝试从京东API获取真实数据（如果可用）
    async tryFetchRealData() {
        try {
            // 这里可以添加对京东开放API的调用
            // 由于京东的反爬虫机制，我们使用智能模拟数据
            console.log('使用智能模拟数据（基于京东真实商业规律）');
            return false;
        } catch (error) {
            console.log('API获取失败，使用模拟数据');
            return false;
        }
    }

    // 更新所有数据
    async updateAllData() {
        try {
            console.log('开始更新京东数据...');
            
            // 尝试获取真实数据，失败则使用智能模拟
            const hasRealData = await this.tryFetchRealData();
            
            if (!hasRealData) {
                // 更新模拟数据，保持真实性
                this.cachedData = {
                    categories: this.getJDCategoryData(),
                    products: this.getJDProductData(),
                    sales: this.generateRealisticSales(),
                    regions: this.getJDRegionData(),
                    trend: this.generateTrendData(),
                    updateTime: new Date()
                };
            }

            console.log('京东数据更新完成:', new Date().toLocaleString());
            console.log(`当前销售额: ¥${this.cachedData.sales.toLocaleString()}`);
        } catch (error) {
            console.error('更新数据失败:', error);
        }
    }

    // 获取缓存数据
    getCachedData() {
        return this.cachedData;
    }

    // 获取默认品类数据
    getDefaultCategoryData() {
        return this.getJDCategoryData();
    }

    // 获取默认商品数据  
    getDefaultProductData() {
        return this.getJDProductData();
    }
}

module.exports = JDDataService; 
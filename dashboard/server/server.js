const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const JDDataService = require('./jdDataService');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 创建京东数据服务实例
const jdService = new JDDataService();

// 生成随机数据（备用方案）
function generateRandomData() {
    return {
        total: Math.floor(Math.random() * 1000000) + 500000,
        categories: [
            { name: '手机数码', percentage: 35 },
            { name: '家用电器', percentage: 25 },
            { name: '服装服饰', percentage: 20 },
            { name: '食品饮料', percentage: 15 },
            { name: '其他', percentage: 5 }
        ],
        trend: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            sales: Math.floor(Math.random() * 10000) + 5000
        })),
        top10: Array.from({ length: 10 }, (_, i) => ({
            name: `商品${i + 1}`,
            sales: Math.floor(Math.random() * 1000) + 500
        })),
        distribution: [
            { city: '北京', count: 1000 },
            { city: '上海', count: 2000 },
            { city: '广州', count: 1500 },
            { city: '深圳', count: 1800 },
            { city: '杭州', count: 1200 }
        ]
    };
}

// 初始化数据
async function initializeData() {
    console.log('正在初始化京东数据服务...');
    await jdService.updateAllData();
    console.log('数据初始化完成');
}

// API路由 - 实时销售额
app.get('/api/sales/total', (req, res) => {
    try {
        const cachedData = jdService.getCachedData();
        const total = cachedData.sales || Math.floor(Math.random() * 2000000) + 3000000;
        res.json({ total });
    } catch (error) {
        console.error('获取销售总额失败:', error);
        const data = generateRandomData();
        res.json({ total: data.total });
    }
});

// API路由 - 品类销售占比
app.get('/api/sales/categories', (req, res) => {
    try {
        const cachedData = jdService.getCachedData();
        const categories = cachedData.categories && cachedData.categories.length > 0 
            ? cachedData.categories 
            : jdService.getDefaultCategoryData();
        res.json(categories);
    } catch (error) {
        console.error('获取品类数据失败:', error);
        const data = generateRandomData();
        res.json(data.categories);
    }
});

// API路由 - 24小时销售趋势
app.get('/api/sales/trend', (req, res) => {
    try {
        const cachedData = jdService.getCachedData();
        const trend = cachedData.trend || jdService.generateTrendData();
        res.json(trend);
    } catch (error) {
        console.error('获取趋势数据失败:', error);
        const data = generateRandomData();
        res.json(data.trend);
    }
});

// API路由 - 热销商品TOP10
app.get('/api/products/top10', (req, res) => {
    try {
        const cachedData = jdService.getCachedData();
        const products = cachedData.products && cachedData.products.length > 0 
            ? cachedData.products 
            : jdService.getDefaultProductData();
        res.json(products);
    } catch (error) {
        console.error('获取TOP10数据失败:', error);
        const data = generateRandomData();
        res.json(data.top10);
    }
});

// API路由 - 用户地域分布
app.get('/api/users/distribution', (req, res) => {
    try {
        const cachedData = jdService.getCachedData();
        console.log('获取地域分布数据，缓存数据keys:', Object.keys(cachedData));
        
        // 尝试从缓存获取数据，如果没有则重新生成
        let regions = cachedData.regions;
        if (!regions || regions.length === 0) {
            console.log('缓存中无地域数据，重新生成...');
            regions = jdService.getJDRegionData();
        }
        
        console.log(`返回地域数据，共${regions.length}个省份，样本:`, regions.slice(0, 3));
        res.json(regions);
    } catch (error) {
        console.error('获取地域分布数据失败:', error);
        // 备用方案：使用预设数据
        const backupData = [
            { name: '北京', value: 15000 },
            { name: '上海', value: 18000 },
            { name: '广东', value: 25000 },
            { name: '江苏', value: 20000 },
            { name: '浙江', value: 16000 }
        ];
        res.json(backupData);
    }
});

// 数据状态接口
app.get('/api/status', (req, res) => {
    const cachedData = jdService.getCachedData();
    res.json({
        lastUpdate: cachedData.updateTime,
        hasData: {
            categories: cachedData.categories && cachedData.categories.length > 0,
            products: cachedData.products && cachedData.products.length > 0,
            sales: cachedData.sales > 0
        }
    });
});

// 手动刷新数据接口
app.post('/api/refresh', async (req, res) => {
    try {
        console.log('手动刷新数据请求...');
        await jdService.updateAllData();
        res.json({ 
            success: true, 
            message: '数据刷新成功',
            updateTime: new Date().toLocaleString()
        });
    } catch (error) {
        console.error('手动刷新失败:', error);
        res.status(500).json({ 
            success: false, 
            message: '数据刷新失败: ' + error.message 
        });
    }
});

// 设置定时任务，每10分钟更新一次数据
cron.schedule('*/10 * * * *', async () => {
    console.log('定时更新京东数据...');
    await jdService.updateAllData();
});

// 设置定时任务，每小时更新一次趋势数据
cron.schedule('0 * * * *', async () => {
    console.log('更新销售趋势数据...');
    const cachedData = jdService.getCachedData();
    cachedData.trend = jdService.generateTrendData();
});

// 程序退出时清理资源
process.on('SIGINT', async () => {
    console.log('正在关闭服务器...');
    await jdService.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('正在关闭服务器...');
    await jdService.close();
    process.exit(0);
});

app.listen(port, async () => {
    console.log(`服务器运行在 http://localhost:${port}`);
    console.log('开始初始化京东数据...');
    
    // 启动时初始化数据
    await initializeData();
    
    console.log('========================================');
    console.log('京东数据大屏服务已启动！');
    console.log('数据更新频率：每10分钟');
    console.log('趋势数据更新：每小时');
    console.log('手动刷新接口：POST /api/refresh');
    console.log('========================================');
}); 
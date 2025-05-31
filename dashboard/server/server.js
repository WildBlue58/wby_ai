const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 生成随机数据
function generateRandomData() {
    return {
        total: Math.floor(Math.random() * 1000000) + 500000,
        categories: [
            { name: '服装', percentage: 35 },
            { name: '电子', percentage: 25 },
            { name: '食品', percentage: 20 },
            { name: '家居', percentage: 15 },
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

// API路由
app.get('/api/sales/total', (req, res) => {
    const data = generateRandomData();
    res.json({ total: data.total });
});

app.get('/api/sales/categories', (req, res) => {
    const data = generateRandomData();
    res.json(data.categories);
});

app.get('/api/sales/trend', (req, res) => {
    const data = generateRandomData();
    res.json(data.trend);
});

app.get('/api/products/top10', (req, res) => {
    const data = generateRandomData();
    res.json(data.top10);
});

app.get('/api/users/distribution', (req, res) => {
    const data = generateRandomData();
    res.json(data.distribution);
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
}); 
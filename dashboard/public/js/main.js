const { createApp, ref, onMounted } = Vue;

const app = createApp({
    setup() {
        const currentTime = ref('');
        const totalSales = ref(0);
        const orderCount = ref(0);
        const activeUsers = ref(0);
        const categoryData = ref([]);
        const trendData = ref([]);
        const top10Data = ref([]);
        const mapData = ref([]);
        const dataStatus = ref({
            lastUpdate: null,
            isLoading: false,
            hasData: false
        });
        
        // 检测是否为生产环境
        const isProduction = window.location.hostname !== 'localhost';
        const API_BASE_URL = isProduction ? '/api' : 'http://localhost:3000/api';
        
        // 省份名称映射表
        const provinceNameMap = {
            '北京': ['北京', '北京市', '北京市市辖区'],
            '上海': ['上海', '上海市', '上海市市辖区'],
            '天津': ['天津', '天津市', '天津市市辖区'],
            '重庆': ['重庆', '重庆市', '重庆市市辖区'],
            '广东': ['广东', '广东省'],
            '江苏': ['江苏', '江苏省'],
            '浙江': ['浙江', '浙江省'],
            '山东': ['山东', '山东省'],
            '河南': ['河南', '河南省'],
            '四川': ['四川', '四川省'],
            '湖北': ['湖北', '湖北省'],
            '湖南': ['湖南', '湖南省'],
            '福建': ['福建', '福建省'],
            '安徽': ['安徽', '安徽省'],
            '河北': ['河北', '河北省'],
            '陕西': ['陕西', '陕西省'],
            '江西': ['江西', '江西省'],
            '辽宁': ['辽宁', '辽宁省'],
            '云南': ['云南', '云南省'],
            '山西': ['山西', '山西省'],
            '广西': ['广西', '广西壮族自治区'],
            '贵州': ['贵州', '贵州省'],
            '吉林': ['吉林', '吉林省'],
            '黑龙江': ['黑龙江', '黑龙江省'],
            '内蒙古': ['内蒙古', '内蒙古自治区'],
            '新疆': ['新疆', '新疆维吾尔自治区'],
            '甘肃': ['甘肃', '甘肃省'],
            '海南': ['海南', '海南省'],
            '宁夏': ['宁夏', '宁夏回族自治区'],
            '青海': ['青海', '青海省'],
            '西藏': ['西藏', '西藏自治区']
        };
        
        let actualProvinceNames = [];
        
        // 加载中国地图数据
        const loadChinaMap = async () => {
            try {
                const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json');
                const geoJSON = await response.json();
                
                if (geoJSON.features) {
                    actualProvinceNames = geoJSON.features.map(feature => {
                        return feature.properties?.name || feature.properties?.NAME || '未知';
                    });
                    console.log('🗺️ 地图加载成功，省份数量:', actualProvinceNames.length);
                }
                
                echarts.registerMap('china', geoJSON);
                return true;
            } catch (error) {
                console.error('❌ 地图数据加载失败:', error);
                return false;
            }
        };
        
        // 智能省份名称匹配
        const matchProvinceName = (ourName) => {
            if (!actualProvinceNames || actualProvinceNames.length === 0) {
                return ourName;
            }
            
            // 直接匹配
            if (actualProvinceNames.includes(ourName)) {
                return ourName;
            }
            
            // 映射表匹配
            if (provinceNameMap[ourName]) {
                for (const mappedName of provinceNameMap[ourName]) {
                    if (actualProvinceNames.includes(mappedName)) {
                        return mappedName;
                    }
                }
            }
            
            // 模糊匹配
            for (const actualName of actualProvinceNames) {
                if (actualName.includes(ourName) || ourName.includes(actualName)) {
                    return actualName;
                }
            }
            
            return ourName;
        };
        
        // 更新时间
        const updateTime = () => {
            const now = new Date();
            currentTime.value = now.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
        };
        
        // 更新页面状态
        const updateStatus = (status, message = '') => {
            const statusElement = document.getElementById('serverStatus');
            const lastUpdateElement = document.getElementById('lastUpdate');
            
            if (statusElement) {
                statusElement.textContent = status;
                statusElement.className = `status-value ${status.toLowerCase()}`;
            }
            
            if (lastUpdateElement) {
                lastUpdateElement.textContent = new Date().toLocaleTimeString('zh-CN');
            }
        };
        
        // 获取数据
        const fetchData = async (endpoint) => {
            try {
                const response = await fetch(`${API_BASE_URL}${endpoint}`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error(`获取${endpoint}数据失败:`, error);
                return null;
            }
        };
        
        // 更新销售数据
        const updateSalesData = async () => {
            const data = await fetchData('/sales');
            if (data) {
                totalSales.value = data.totalSales || 12850000;
                orderCount.value = data.orderCount || 45678;
                activeUsers.value = data.activeUsers || 23456;
                
                // 更新页面显示
                const totalSalesEl = document.getElementById('totalSales');
                const orderCountEl = document.getElementById('orderCount');
                const activeUsersEl = document.getElementById('activeUsers');
                
                if (totalSalesEl) totalSalesEl.textContent = formatNumber(totalSales.value);
                if (orderCountEl) orderCountEl.textContent = orderCount.value.toLocaleString();
                if (activeUsersEl) activeUsersEl.textContent = activeUsers.value.toLocaleString();
            }
        };
        
        // 格式化数字
        const formatNumber = (num) => {
            return new Intl.NumberFormat('zh-CN', {
                style: 'currency',
                currency: 'CNY'
            }).format(num);
        };
        
        // 初始化图表
        const initCharts = async () => {
            // 加载地图
            await loadChinaMap();
            
            // 获取API数据
            const [categoryResponse, trendResponse, top10Response, mapResponse] = await Promise.all([
                fetchData('/categories'),
                fetchData('/trends'),
                fetchData('/top10'),
                fetchData('/map')
            ]);
            
            // 处理数据，如果API失败则使用默认数据
            categoryData.value = categoryResponse?.data || [
                { value: 35, name: '电子产品' },
                { value: 25, name: '服装配饰' },
                { value: 18, name: '家居用品' },
                { value: 12, name: '食品饮料' },
                { value: 10, name: '其他' }
            ];
            
            trendData.value = trendResponse?.data || [
                { time: '00:00', value: 1200000 },
                { time: '02:00', value: 800000 },
                { time: '04:00', value: 600000 },
                { time: '06:00', value: 900000 },
                { time: '08:00', value: 1500000 },
                { time: '10:00', value: 2100000 },
                { time: '12:00', value: 1800000 },
                { time: '14:00', value: 2300000 },
                { time: '16:00', value: 1950000 },
                { time: '18:00', value: 2800000 },
                { time: '20:00', value: 3200000 },
                { time: '22:00', value: 2600000 }
            ];
            
            top10Data.value = top10Response?.data || [
                { name: 'iPhone 15 Pro Max', value: 8520 },
                { name: '华为Mate60 Pro', value: 7340 },
                { name: '小米14 Ultra', value: 6890 },
                { name: 'MacBook Pro M3', value: 5670 },
                { name: '戴森吸尘器V15', value: 4320 },
                { name: 'AirPods Pro 2', value: 3890 },
                { name: '联想拯救者Y9000P', value: 3540 },
                { name: '海尔冰箱BCD-520', value: 2890 },
                { name: '茅台飞天53度', value: 2340 },
                { name: '耐克Air Jordan', value: 1980 }
            ];
            
            mapData.value = mapResponse?.data || [
                { name: '北京', value: 25000 },
                { name: '上海', value: 28000 },
                { name: '广东', value: 35000 },
                { name: '江苏', value: 22000 },
                { name: '浙江', value: 20000 },
                { name: '山东', value: 18000 },
                { name: '河南', value: 15000 },
                { name: '四川', value: 12000 },
                { name: '湖北', value: 10000 },
                { name: '湖南', value: 9000 },
                { name: '福建', value: 8500 },
                { name: '安徽', value: 8000 },
                { name: '河北', value: 7500 },
                { name: '陕西', value: 7000 },
                { name: '重庆', value: 6500 },
                { name: '江西', value: 6000 },
                { name: '辽宁', value: 5500 },
                { name: '云南', value: 5000 },
                { name: '山西', value: 4500 },
                { name: '广西', value: 4000 },
                { name: '贵州', value: 3500 },
                { name: '吉林', value: 3000 },
                { name: '黑龙江', value: 2500 },
                { name: '内蒙古', value: 2200 },
                { name: '新疆', value: 2000 },
                { name: '甘肃', value: 1800 },
                { name: '海南', value: 1600 },
                { name: '宁夏', value: 1400 },
                { name: '青海', value: 1200 },
                { name: '西藏', value: 1000 },
                { name: '天津', value: 4800 }
            ];
            
            // 处理地图数据名称匹配
            const processedMapData = mapData.value.map(item => ({
                name: matchProvinceName(item.name),
                value: item.value
            }));
            
            // 初始化图表
            initCategoryChart();
            initTrendChart();
            initTop10Chart();
            initMapChart(processedMapData);
            
            updateStatus('在线', '数据加载完成');
        };
        
        // 品类销售占比饼图
        const initCategoryChart = () => {
            const chart = echarts.init(document.getElementById('categoryChart'));
            chart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c}%'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    textStyle: { color: '#fff' }
                },
                series: [{
                    type: 'pie',
                    radius: ['40%', '70%'],
                    data: categoryData.value,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    animationType: 'expansion',
                    animationDuration: 1000
                }],
                color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
            });
            
            window.addEventListener('resize', () => chart.resize());
        };
        
        // 24小时销售趋势
        const initTrendChart = () => {
            const chart = echarts.init(document.getElementById('trendChart'));
            chart.setOption({
                tooltip: {
                    trigger: 'axis',
                    formatter: '{b}: ¥{c}'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: trendData.value.map(item => item.time),
                    axisLabel: { color: '#fff' }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { color: '#fff' }
                },
                series: [{
                    data: trendData.value.map(item => item.value),
                    type: 'line',
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3,
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: '#45B7D1' },
                                { offset: 1, color: 'rgba(69, 183, 209, 0.1)' }
                            ]
                        }
                    },
                    lineStyle: { color: '#45B7D1', width: 3 },
                    itemStyle: { color: '#45B7D1' }
                }]
            });
            
            window.addEventListener('resize', () => chart.resize());
        };
        
        // TOP10商品
        const initTop10Chart = () => {
            const chart = echarts.init(document.getElementById('top10Chart'));
            chart.setOption({
                tooltip: {
                    trigger: 'axis',
                    formatter: '{b}: {c}件'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    axisLabel: { color: '#fff' }
                },
                yAxis: {
                    type: 'category',
                    data: top10Data.value.map(item => item.name),
                    axisLabel: { color: '#fff' }
                },
                series: [{
                    type: 'bar',
                    data: top10Data.value.map(item => item.value),
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 1, y2: 0,
                            colorStops: [
                                { offset: 0, color: '#FF6B6B' },
                                { offset: 1, color: '#FFE66D' }
                            ]
                        }
                    },
                    barWidth: '60%',
                    animationDelay: (idx) => idx * 100
                }]
            });
            
            window.addEventListener('resize', () => chart.resize());
        };
        
        // 地域分布地图
        const initMapChart = (data) => {
            const chart = echarts.init(document.getElementById('mapChart'));
            chart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        const value = params.value || 0;
                        return `${params.name}: ${value.toLocaleString()}人`;
                    },
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    borderColor: '#4ECDC4',
                    borderWidth: 1,
                    textStyle: { color: '#fff' }
                },
                visualMap: {
                    min: 0,
                    max: Math.max(...data.map(d => d.value)),
                    left: 'left',
                    top: 'bottom',
                    text: ['高', '低'],
                    calculable: true,
                    inRange: {
                        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                    },
                    textStyle: { color: '#fff' }
                },
                series: [{
                    name: '用户分布',
                    type: 'map',
                    map: 'china',
                    data: data,
                    roam: false,
                    zoom: 1.2,
                    center: [104, 35],
                    itemStyle: {
                        borderColor: '#404a59',
                        borderWidth: 0.5,
                        areaColor: '#323c48'
                    },
                    emphasis: {
                        itemStyle: {
                            areaColor: '#4ECDC4',
                            shadowBlur: 20,
                            shadowColor: 'rgba(78, 205, 196, 0.5)',
                            borderColor: '#4ECDC4',
                            borderWidth: 2
                        }
                    }
                }]
            });
            
            window.addEventListener('resize', () => chart.resize());
        };
        
        // 手动刷新
        const refreshData = async () => {
            updateStatus('刷新中...');
            try {
                await updateSalesData();
                await initCharts();
                updateStatus('在线');
            } catch (error) {
                console.error('刷新失败:', error);
                updateStatus('离线');
            }
        };
        
        // 生命周期
        onMounted(async () => {
            updateTime();
            setInterval(updateTime, 1000);
            
            updateStatus('连接中...');
            
            // 初始化
            await updateSalesData();
            await initCharts();
            
            // 绑定刷新按钮
            const refreshBtn = document.getElementById('refreshBtn');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', refreshData);
            }
            
            // 定期更新
            setInterval(updateSalesData, 30000); // 30秒更新一次销售数据
            setInterval(initCharts, 300000); // 5分钟更新一次图表
        });
        
        return {
            currentTime,
            totalSales,
            orderCount,
            activeUsers,
            formatNumber
        };
    }
});

// 挂载应用
app.mount('#app'); 
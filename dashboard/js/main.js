const { createApp, ref, onMounted } = Vue;

const app = createApp({
    setup() {
        const currentTime = ref('');
        const totalSales = ref(0);
        const categoryData = ref([]);
        const trendData = ref([]);
        const top10Data = ref([]);
        const mapData = ref([]);
        
        const API_BASE_URL = 'http://localhost:3000/api';
        
        // 更新当前时间
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

        // 格式化数字
        const formatNumber = (num) => {
            return new Intl.NumberFormat('zh-CN', {
                style: 'currency',
                currency: 'CNY'
            }).format(num);
        };

        // 获取实时销售额
        const fetchTotalSales = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/sales/total`);
                const data = await response.json();
                totalSales.value = data.total;
            } catch (error) {
                console.error('获取销售额失败:', error);
            }
        };

        // 获取品类销售数据
        const fetchCategoryData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/sales/categories`);
                const data = await response.json();
                categoryData.value = data.map(item => ({
                    value: item.percentage,
                    name: item.name
                }));
            } catch (error) {
                console.error('获取品类数据失败:', error);
            }
        };

        // 获取24小时销售趋势
        const fetchTrendData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/sales/trend`);
                const data = await response.json();
                trendData.value = data.map(item => ({
                    time: item.hour + ':00',
                    value: item.sales
                }));
            } catch (error) {
                console.error('获取趋势数据失败:', error);
            }
        };

        // 获取TOP10商品数据
        const fetchTop10Data = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products/top10`);
                const data = await response.json();
                top10Data.value = data.map(item => ({
                    name: item.name,
                    value: item.sales
                }));
            } catch (error) {
                console.error('获取TOP10数据失败:', error);
            }
        };

        // 获取地域分布数据
        const fetchMapData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users/distribution`);
                const data = await response.json();
                mapData.value = data.map(item => ({
                    name: item.city,
                    value: item.count
                }));
            } catch (error) {
                console.error('获取地域分布数据失败:', error);
            }
        };

        // 初始化图表
        const initCharts = () => {
            // 品类销售占比饼图
            const categoryChart = echarts.init(document.getElementById('categoryChart'));
            categoryChart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c}%'
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
                    }
                }]
            });

            // 24小时销售趋势折线图
            const trendChart = echarts.init(document.getElementById('trendChart'));
            trendChart.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: trendData.value.map(item => item.time)
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: trendData.value.map(item => item.value),
                    type: 'line',
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3
                    }
                }]
            });

            // TOP10商品柱状图
            const top10Chart = echarts.init(document.getElementById('top10Chart'));
            top10Chart.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    data: top10Data.value.map(item => item.name)
                },
                series: [{
                    type: 'bar',
                    data: top10Data.value.map(item => item.value)
                }]
            });

            // 地域分布地图
            const mapChart = echarts.init(document.getElementById('mapChart'));
            mapChart.setOption({
                tooltip: {
                    trigger: 'item'
                },
                visualMap: {
                    min: 0,
                    max: Math.max(...mapData.value.map(item => item.value)),
                    text: ['高', '低'],
                    realtime: false,
                    calculable: true,
                    inRange: {
                        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8']
                    }
                },
                series: [{
                    name: '用户分布',
                    type: 'map',
                    map: 'china',
                    data: mapData.value
                }]
            });

            // 监听窗口大小变化
            window.addEventListener('resize', () => {
                categoryChart.resize();
                trendChart.resize();
                top10Chart.resize();
                mapChart.resize();
            });
        };

        // 更新所有数据
        const updateAllData = async () => {
            await Promise.all([
                fetchTotalSales(),
                fetchCategoryData(),
                fetchTrendData(),
                fetchTop10Data(),
                fetchMapData()
            ]);
            initCharts();
        };

        onMounted(() => {
            updateTime();
            setInterval(updateTime, 1000);
            updateAllData();
            // 每5秒更新一次数据
            setInterval(updateAllData, 5000);
        });

        return {
            currentTime,
            totalSales,
            formatNumber
        };
    }
});

app.mount('#app'); 
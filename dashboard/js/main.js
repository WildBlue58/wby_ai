const { createApp, ref, onMounted } = Vue;

const app = createApp({
    setup() {
        const currentTime = ref('');
        const totalSales = ref(0);
        const categoryData = ref([]);
        const trendData = ref([]);
        const top10Data = ref([]);
        const mapData = ref([]);
        const dataStatus = ref({
            lastUpdate: null,
            isLoading: false,
            hasData: false
        });
        
        const API_BASE_URL = 'http://localhost:3000/api';
        
        // 省份名称映射表 - 解决地图中的省份名称与我们数据不匹配的问题
        const provinceNameMap = {
            // 我们的名称 -> 地图中可能的名称
            '北京': ['北京', '北京市', '北京市市辖区'],
            '上海': ['上海', '上海市', '上海市市辖区'],
            '天津': ['天津', '天津市', '天津市市辖区'],
            '重庆': ['重庆', '重庆市', '重庆市市辖区'],
            '广东': ['广东', '广东省', '广东'],
            '江苏': ['江苏', '江苏省', '江苏'],
            '浙江': ['浙江', '浙江省', '浙江'],
            '山东': ['山东', '山东省', '山东'],
            '河南': ['河南', '河南省', '河南'],
            '四川': ['四川', '四川省', '四川'],
            '湖北': ['湖北', '湖北省', '湖北'],
            '湖南': ['湖南', '湖南省', '湖南'],
            '福建': ['福建', '福建省', '福建'],
            '安徽': ['安徽', '安徽省', '安徽'],
            '河北': ['河北', '河北省', '河北'],
            '陕西': ['陕西', '陕西省', '陕西'],
            '江西': ['江西', '江西省', '江西'],
            '辽宁': ['辽宁', '辽宁省', '辽宁'],
            '云南': ['云南', '云南省', '云南'],
            '山西': ['山西', '山西省', '山西'],
            '广西': ['广西', '广西壮族自治区', '广西省'],
            '贵州': ['贵州', '贵州省', '贵州'],
            '吉林': ['吉林', '吉林省', '吉林'],
            '黑龙江': ['黑龙江', '黑龙江省', '黑龙江'],
            '内蒙古': ['内蒙古', '内蒙古自治区', '内蒙古省'],
            '新疆': ['新疆', '新疆维吾尔自治区', '新疆省'],
            '甘肃': ['甘肃', '甘肃省', '甘肃'],
            '海南': ['海南', '海南省', '海南'],
            '宁夏': ['宁夏', '宁夏回族自治区', '宁夏省'],
            '青海': ['青海', '青海省', '青海'],
            '西藏': ['西藏', '西藏自治区', '西藏省'],
            '香港': ['香港', '香港特别行政区', '香港市'],
            '澳门': ['澳门', '澳门特别行政区', '澳门市'],
            '台湾': ['台湾', '台湾省', '台湾市']
        };
        
        // 中国地图GeoJSON数据（简化版）
        const chinaGeoJSON = {
            "type": "FeatureCollection",
            "features": [
                // 这里会在加载时从CDN获取完整的中国地图数据
            ]
        };
        
        // 存储地图中实际的省份名称
        let actualProvinceNames = [];
        
        // 加载中国地图数据
        const loadChinaMap = async () => {
            try {
                const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json');
                const geoJSON = await response.json();
                
                // 提取地图中实际的省份名称
                if (geoJSON.features) {
                    actualProvinceNames = geoJSON.features.map(feature => {
                        const name = feature.properties?.name || feature.properties?.NAME || '未知';
                        return name;
                    });
                    console.log('🗺️ 地图中实际省份名称:', actualProvinceNames.slice(0, 10));
                }
                
                echarts.registerMap('china', geoJSON);
                console.log('✅ 中国地图数据加载成功，共', actualProvinceNames.length, '个地理特征');
                return true;
            } catch (error) {
                console.error('❌ 中国地图数据加载失败:', error);
                // 使用备用方案：注册简化的地图数据
                echarts.registerMap('china', {
                    type: "FeatureCollection",
                    features: []
                });
                return false;
            }
        };
        
        // 智能省份名称匹配
        const matchProvinceName = (ourName) => {
            // 0. 防护：如果actualProvinceNames还没有加载，先返回原名称，避免无限循环
            if (!actualProvinceNames || actualProvinceNames.length === 0) {
                console.log(`⚠️ 地图数据尚未加载，暂时使用原名称: ${ourName}`);
                return ourName;
            }
            
            // 1. 直接匹配
            if (actualProvinceNames.includes(ourName)) {
                console.log(`✅ 直接匹配: ${ourName}`);
                return ourName;
            }
            
            // 2. 使用映射表匹配
            if (provinceNameMap[ourName]) {
                for (const mappedName of provinceNameMap[ourName]) {
                    if (actualProvinceNames.includes(mappedName)) {
                        console.log(`📍 名称映射: ${ourName} -> ${mappedName}`);
                        return mappedName;
                    }
                }
            }
            
            // 3. 模糊匹配
            for (const actualName of actualProvinceNames) {
                if (actualName.includes(ourName) || ourName.includes(actualName)) {
                    console.log(`🔍 模糊匹配: ${ourName} -> ${actualName}`);
                    return actualName;
                }
            }
            
            // 4. 特殊处理
            const specialMap = {
                '北京': '北京市',
                '上海': '上海市', 
                '天津': '天津市',
                '重庆': '重庆市'
            };
            
            if (specialMap[ourName] && actualProvinceNames.includes(specialMap[ourName])) {
                console.log(`🎯 特殊映射: ${ourName} -> ${specialMap[ourName]}`);
                return specialMap[ourName];
            }
            
            console.warn(`⚠️ 无法匹配省份名称: ${ourName}`);
            return ourName; // 返回原名称
        };
        
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

        // 格式化时间
        const formatTime = (timeStr) => {
            if (!timeStr) return '从未更新';
            const time = new Date(timeStr);
            return time.toLocaleString('zh-CN');
        };

        // 获取数据状态
        const fetchDataStatus = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/status`);
                const data = await response.json();
                dataStatus.value = {
                    lastUpdate: data.lastUpdate,
                    isLoading: false,
                    hasData: data.hasData
                };
            } catch (error) {
                console.error('获取数据状态失败:', error);
            }
        };

        // 手动刷新数据
        const refreshData = async () => {
            try {
                dataStatus.value.isLoading = true;
                const response = await fetch(`${API_BASE_URL}/refresh`, {
                    method: 'POST'
                });
                const result = await response.json();
                
                if (result.success) {
                    console.log('数据刷新成功:', result.message);
                    // 刷新成功后重新获取所有数据
                    await updateAllData();
                    await fetchDataStatus();
                } else {
                    console.error('数据刷新失败:', result.message);
                }
            } catch (error) {
                console.error('手动刷新失败:', error);
            } finally {
                dataStatus.value.isLoading = false;
            }
        };

        // 获取实时销售额
        const fetchTotalSales = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/sales/total`);
                const data = await response.json();
                totalSales.value = data.total;
            } catch (error) {
                console.error('获取销售额失败:', error);
                totalSales.value = 0;
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
                categoryData.value = [];
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
                trendData.value = [];
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
                top10Data.value = [];
            }
        };

        // 获取地域分布数据
        const fetchMapData = async () => {
            console.log('🗺️ 开始获取地域分布数据...');
            
            // 立即使用本地数据，确保地图有数据显示
            const localData = getLocalMapData();
            mapData.value = localData;
            console.log('✅ 本地地域数据已设置，共', mapData.value.length, '个省份');
            console.log('📊 数据样本:', mapData.value.slice(0, 5));
            
            // 验证数据有效性
            const hasValidData = mapData.value.every(item => item.value > 0);
            console.log('✅ 数据有效性检查:', hasValidData ? '全部有效' : '存在无效数据');
            
            // 异步尝试从API获取数据（可选的增强）
            try {
                const response = await fetch(`${API_BASE_URL}/users/distribution`);
                if (response.ok) {
                    const apiData = await response.json();
                    console.log('🌐 API响应成功，数据条数:', apiData.length);
                    
                    // 验证API数据是否有效
                    if (apiData && apiData.length > 0 && !apiData.every(item => item.value === 0)) {
                        const validApiData = apiData.filter(item => item.value > 0);
                        if (validApiData.length > 20) { // 至少要有20个有效省份
                            mapData.value = apiData.map(item => ({
                                name: matchProvinceName(item.name), // 使用智能名称匹配
                                value: item.value
                            }));
                            console.log('🔄 已更新为API数据');
                        } else {
                            console.log('⚠️ API数据质量不佳，继续使用本地数据');
                        }
                    } else {
                        console.log('⚠️ API数据无效，继续使用本地数据');
                    }
                } else {
                    console.log('⚠️ API响应失败，状态码:', response.status, '，使用本地数据');
                }
            } catch (error) {
                console.log('⚠️ API请求失败:', error.message, '，使用本地数据');
            }
        };
        
        // 本地测试数据 - 使用智能名称匹配
        const getLocalMapData = () => {
            // 基础数据（模拟京东用户真实分布）
            const baseData = [
                { name: '北京', base: 18000, factor: 1.2 },
                { name: '上海', base: 20000, factor: 1.1 },
                { name: '广东', base: 28000, factor: 1.15 },
                { name: '江苏', base: 21000, factor: 1.05 },
                { name: '浙江', base: 19500, factor: 1.25 },
                { name: '山东', base: 14200, factor: 1.0 },
                { name: '河南', base: 11800, factor: 0.95 },
                { name: '四川', base: 13500, factor: 1.1 },
                { name: '湖北', base: 11200, factor: 1.05 },
                { name: '福建', base: 11500, factor: 1.15 },
                { name: '湖南', base: 9800, factor: 1.0 },
                { name: '安徽', base: 8200, factor: 0.98 },
                { name: '河北', base: 7500, factor: 0.92 },
                { name: '陕西', base: 8000, factor: 1.08 },
                { name: '重庆', base: 7800, factor: 1.12 },
                { name: '江西', base: 6500, factor: 1.02 },
                { name: '辽宁', base: 5200, factor: 0.88 },
                { name: '云南', base: 6200, factor: 1.18 },
                { name: '山西', base: 4500, factor: 0.95 },
                { name: '广西', base: 5100, factor: 1.08 },
                { name: '贵州', base: 5300, factor: 1.22 },
                { name: '吉林', base: 2800, factor: 0.85 },
                { name: '黑龙江', base: 2400, factor: 0.78 },
                { name: '内蒙古', base: 2300, factor: 0.88 },
                { name: '新疆', base: 2200, factor: 0.98 },
                { name: '甘肃', base: 1900, factor: 0.92 },
                { name: '海南', base: 2100, factor: 1.12 },
                { name: '宁夏', base: 1400, factor: 1.05 },
                { name: '青海', base: 1100, factor: 1.0 },
                { name: '西藏', base: 850, factor: 1.15 },
                { name: '天津', base: 4600, factor: 1.08 }
            ];
            
            // 添加时间和随机因素，模拟实时变化
            const hour = new Date().getHours();
            const timeMultiplier = hour >= 19 && hour <= 22 ? 1.2 : 
                                  hour >= 9 && hour <= 11 ? 1.1 : 
                                  hour >= 0 && hour <= 6 ? 0.8 : 1.0;
            
            const result = baseData.map(province => {
                // 检查地图数据是否已加载
                let matchedName = province.name;
                if (actualProvinceNames && actualProvinceNames.length > 0) {
                    matchedName = matchProvinceName(province.name);
                } else {
                    console.log(`⏳ 地图数据未加载，使用原始省份名称: ${province.name}`);
                }
                
                const value = Math.floor(province.base * province.factor * timeMultiplier * (0.85 + Math.random() * 0.3));
                
                return {
                    name: matchedName,
                    value: value
                };
            });
            
            console.log('🎯 生成地图数据:', result.slice(0, 5));
            
            // 验证数据
            const validCount = result.filter(item => item.value > 0).length;
            console.log(`📊 有效数据统计: ${validCount}/${result.length} 个省份有数据`);
            
            return result;
        };

        // 重新匹配已有的地图数据
        const rematchMapData = () => {
            if (mapData.value && mapData.value.length > 0 && actualProvinceNames && actualProvinceNames.length > 0) {
                console.log('🔄 重新匹配地图数据...');
                
                // 重新生成数据以使用正确的省份名称
                mapData.value = getLocalMapData();
                
                console.log('✅ 地图数据重新匹配完成，样本:', mapData.value.slice(0, 3));
                
                // 重新初始化地图图表
                setTimeout(() => {
                    initCharts();
                }, 100);
            }
        };

        // 初始化图表
        const initCharts = async () => {
            // 确保地图数据已加载
            const mapLoaded = await loadChinaMap();
            
            // 如果地图加载成功，重新匹配数据
            if (mapLoaded) {
                rematchMapData();
            }

            // 品类销售占比饼图
            const categoryChart = echarts.init(document.getElementById('categoryChart'));
            categoryChart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c}%'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    textStyle: {
                        color: '#fff'
                    }
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

            // 24小时销售趋势折线图
            const trendChart = echarts.init(document.getElementById('trendChart'));
            trendChart.setOption({
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
                    axisLabel: {
                        color: '#fff'
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        color: '#fff'
                    }
                },
                series: [{
                    data: trendData.value.map(item => item.value),
                    type: 'line',
                    smooth: true,
                    areaStyle: {
                        opacity: 0.3,
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#45B7D1'
                            }, {
                                offset: 1, color: 'rgba(69, 183, 209, 0.1)'
                            }]
                        }
                    },
                    lineStyle: {
                        color: '#45B7D1',
                        width: 3
                    },
                    itemStyle: {
                        color: '#45B7D1'
                    }
                }]
            });

            // TOP10商品柱状图
            const top10Chart = echarts.init(document.getElementById('top10Chart'));
            top10Chart.setOption({
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
                    axisLabel: {
                        color: '#fff'
                    }
                },
                yAxis: {
                    type: 'category',
                    data: top10Data.value.map(item => item.name),
                    axisLabel: {
                        color: '#fff'
                    }
                },
                series: [{
                    type: 'bar',
                    data: top10Data.value.map(item => item.value),
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [{
                                offset: 0, color: '#FF6B6B'
                            }, {
                                offset: 1, color: '#FFE66D'
                            }]
                        }
                    },
                    barWidth: '60%',
                    animationDelay: (idx) => idx * 100
                }]
            });

            // 地域分布地图
            const mapChart = echarts.init(document.getElementById('mapChart'));
            
            // 确保我们有有效的地图数据
            if (mapData.value.length === 0) {
                console.warn('⚠️ mapData为空，强制使用本地数据');
                mapData.value = getLocalMapData();
            }
            
            // 验证数据有效性
            const validData = mapData.value.filter(item => item.value > 0);
            console.log('✅ 有效地图数据:', validData.length, '个省份');
            console.log('📊 数据样本:', validData.slice(0, 5));
            
            if (validData.length === 0) {
                console.error('❌ 所有地图数据都无效，重新生成');
                mapData.value = getLocalMapData();
            }
            
            const maxValue = Math.max(...mapData.value.map(item => item.value), 1);
            const minValue = Math.min(...mapData.value.map(item => item.value), 0);
            console.log(`📈 地图数据范围: ${minValue} - ${maxValue}`);
            
            mapChart.setOption({
                title: {
                    text: '用户地域分布',
                    left: 'center',
                    top: 'top',
                    textStyle: {
                        color: '#fff',
                        fontSize: 16
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        const value = params.value || 0;
                        return `${params.name}: ${value.toLocaleString()}人`;
                    },
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    borderColor: '#4ECDC4',
                    borderWidth: 1,
                    textStyle: {
                        color: '#fff',
                        fontSize: 14
                    }
                },
                visualMap: {
                    min: 0,
                    max: maxValue,
                    left: 'left',
                    top: 'bottom',
                    text: ['高', '低'],
                    calculable: true,
                    inRange: {
                        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                    },
                    textStyle: {
                        color: '#fff'
                    },
                    itemWidth: 15,
                    itemHeight: 200,
                    show: true
                },
                series: [{
                    name: '用户分布',
                    type: 'map',
                    map: 'china',
                    data: mapData.value,
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
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowBlur: 20,
                            shadowColor: 'rgba(78, 205, 196, 0.5)',
                            borderColor: '#4ECDC4',
                            borderWidth: 2
                        }
                    },
                    label: {
                        show: false,
                        color: '#fff'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            color: '#fff'
                        }
                    }
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
            // 先立即设置本地地图数据，确保地图有数据显示
            mapData.value = getLocalMapData();
            console.log('🚀 强制设置本地地图数据:', mapData.value.length, '个省份');
            
            await Promise.all([
                fetchTotalSales(),
                fetchCategoryData(),
                fetchTrendData(),
                fetchTop10Data(),
                fetchMapData()
            ]);
            await initCharts();
        };

        onMounted(async () => {
            updateTime();
            setInterval(updateTime, 1000);
            
            // 初始化数据
            await updateAllData();
            await fetchDataStatus();
            
            // 每30秒更新一次数据
            setInterval(updateAllData, 30000);
            
            // 每分钟更新一次状态
            setInterval(fetchDataStatus, 60000);
        });

        return {
            currentTime,
            totalSales,
            dataStatus,
            formatNumber,
            formatTime,
            refreshData
        };
    }
});

app.mount('#app'); 
const http = require('http');

function testAPI() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/users/distribution',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                console.log('✅ API响应成功！');
                console.log(`📊 数据条数: ${jsonData.length}`);
                console.log('🗺️ 前5个省份:');
                jsonData.slice(0, 5).forEach(item => {
                    console.log(`   ${item.name}: ${item.value}人`);
                });
                
                const maxValue = Math.max(...jsonData.map(item => item.value));
                const minValue = Math.min(...jsonData.map(item => item.value));
                console.log(`📈 数据范围: ${minValue} - ${maxValue}`);
                
                // 检查是否有0值
                const zeroValues = jsonData.filter(item => item.value === 0);
                if (zeroValues.length > 0) {
                    console.log(`⚠️ 发现${zeroValues.length}个0值省份:`, zeroValues.map(item => item.name));
                } else {
                    console.log('✅ 所有省份都有有效数据');
                }
                
            } catch (error) {
                console.error('❌ JSON解析失败:', error.message);
                console.log('原始响应:', data);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ API请求失败:', error.message);
    });

    req.end();
}

console.log('🔍 测试地域分布API...');
testAPI(); 
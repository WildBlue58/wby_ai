/**
 * 随机红包算法
 * @param {number} total 总金额（单位：元）
 * @param {number} num 红包个数
 * @returns {number[]} 每个红包的金额数组
 */
function hongbao(total, num) {
    // 将金额转换为分，避免浮点数计算
    let remainMoney = total * 100;
    let remainNum = num;
    const arr = [];

    // 确保每个人至少能分到1分钱
    for (let i = 0; i < num - 1; i++) {
        // 计算当前可分配的最大金额
        // 剩余金额 - (剩余人数-1) 确保每个人至少能分到1分
        const max = remainMoney - (remainNum - 1);
        // 随机分配金额，范围是[1, max]
        const money = Math.floor(Math.random() * max) + 1;
        
        // 将分转换为元并保留两位小数
        arr.push(money / 100);
        
        // 更新剩余金额和人数
        remainMoney -= money;
        remainNum--;
    }
    
    // 最后一个红包获得剩余所有金额
    arr.push(remainMoney / 100);
    
    return arr;
}

// 测试代码
console.log(hongbao(100, 10)); // 100元分给10个人 
/**
 * 大数相加 - 字符串方式实现
 * @param {string} num1 第一个大数
 * @param {string} num2 第二个大数
 * @returns {string} 相加结果
 */
function bigNumAdd(num1, num2) {
    // 将两个数字字符串转换为数组，并反转以便从个位开始计算
    let arr1 = num1.split('').reverse();
    let arr2 = num2.split('').reverse();
    
    // 结果数组
    let result = [];
    // 进位值
    let carry = 0;
    
    // 获取较长的数组长度
    const maxLength = Math.max(arr1.length, arr2.length);
    
    // 从个位开始逐位相加
    for (let i = 0; i < maxLength; i++) {
        // 获取当前位的数字，如果不存在则默认为0
        const digit1 = parseInt(arr1[i] || '0');
        const digit2 = parseInt(arr2[i] || '0');
        
        // 计算当前位的和（包括进位）
        const sum = digit1 + digit2 + carry;
        
        // 计算新的进位值
        carry = Math.floor(sum / 10);
        
        // 将当前位的值（个位数）加入结果数组
        result.push(sum % 10);
    }
    
    // 如果最后还有进位，添加到结果中
    if (carry > 0) {
        result.push(carry);
    }
    
    // 将结果数组反转并转换为字符串
    return result.reverse().join('');
}

// 测试用例
console.log(bigNumAdd('123456789', '987654321')); // 输出: '1111111110'
console.log(bigNumAdd('999999999', '1')); // 输出: '1000000000'
console.log(bigNumAdd('123', '456')); // 输出: '579' 
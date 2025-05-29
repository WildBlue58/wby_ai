/**
 * @param {string} num1 
 * @param {string} num2 
 * @return {string}
 */

function addLargeNumber(num1, num2) {
    let result = '';// 存储最终结果
    let carry = 0;// 存储进位值
    let i = num1.length - 1;// 指向第一个数字的末尾
    let j = num2.length - 1;// 指向第二个数字的末尾

    // 当还有数字需要处理或者还有进位时，继续循环
    while (i >= 0 || j >= 0 || carry > 0) {
        // 获取当前位的数字，如果已经处理完则取0
        const digit1 = i >= 0 ? parseInt(num1[i]): 0;
        const digit2 = j >= 0 ? parseInt(num2[j]): 0;

        // 计算当前位的和（包括进位）
        const sum = digit1 + digit2 + carry;
        
        // 将当前位的计算结果（个位数）添加到结果的前面
        result = (sum % 10) + result;
        
        // 计算新的进位值
        carry = Math.floor(sum / 10);
        
        // 移动指针到前一位
        i--;
        j--;
    }
    return result;
}


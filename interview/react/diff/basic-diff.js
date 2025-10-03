/**
 * 基础Diff算法实现
 * 包含LCS算法、编辑距离计算、简单差异检测等基础功能
 */

/**
 * 1. 最长公共子序列 (LCS) 算法
 * 时间复杂度: O(m*n)
 * 空间复杂度: O(m*n)
 */
class LCSDiff {
    constructor() {
        this.dp = [];
    }

    /**
     * 计算两个字符串的最长公共子序列长度
     * @param {string} s1 第一个字符串
     * @param {string} s2 第二个字符串
     * @returns {number} LCS长度
     */
    lcsLength(s1, s2) {
        const m = s1.length;
        const n = s2.length;
        
        // 初始化DP表
        this.dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
        
        // 填充DP表
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (s1[i-1] === s2[j-1]) {
                    this.dp[i][j] = this.dp[i-1][j-1] + 1;
                } else {
                    this.dp[i][j] = Math.max(this.dp[i-1][j], this.dp[i][j-1]);
                }
            }
        }
        
        return this.dp[m][n];
    }

    /**
     * 获取LCS序列
     * @param {string} s1 第一个字符串
     * @param {string} s2 第二个字符串
     * @returns {string} LCS序列
     */
    getLCS(s1, s2) {
        if (this.dp.length === 0) {
            this.lcsLength(s1, s2);
        }
        
        let i = s1.length;
        let j = s2.length;
        let lcs = '';
        
        while (i > 0 && j > 0) {
            if (s1[i-1] === s2[j-1]) {
                lcs = s1[i-1] + lcs;
                i--;
                j--;
            } else if (this.dp[i-1][j] > this.dp[i][j-1]) {
                i--;
            } else {
                j--;
            }
        }
        
        return lcs;
    }
}

/**
 * 2. 编辑距离算法 (Levenshtein Distance)
 * 计算将一个字符串转换为另一个字符串所需的最少操作数
 */
class EditDistance {
    /**
     * 计算编辑距离
     * @param {string} s1 源字符串
     * @param {string} s2 目标字符串
     * @returns {number} 编辑距离
     */
    static calculate(s1, s2) {
        const m = s1.length;
        const n = s2.length;
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
        
        // 初始化边界条件
        for (let i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        for (let j = 0; j <= n; j++) {
            dp[0][j] = j;
        }
        
        // 填充DP表
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (s1[i-1] === s2[j-1]) {
                    dp[i][j] = dp[i-1][j-1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i-1][j] + 1,     // 删除
                        dp[i][j-1] + 1,     // 插入
                        dp[i-1][j-1] + 1    // 替换
                    );
                }
            }
        }
        
        return dp[m][n];
    }

    /**
     * 获取编辑操作序列
     * @param {string} s1 源字符串
     * @param {string} s2 目标字符串
     * @returns {Array} 操作序列
     */
    static getOperations(s1, s2) {
        const m = s1.length;
        const n = s2.length;
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
        
        // 计算DP表
        for (let i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        for (let j = 0; j <= n; j++) {
            dp[0][j] = j;
        }
        
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (s1[i-1] === s2[j-1]) {
                    dp[i][j] = dp[i-1][j-1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i-1][j] + 1,
                        dp[i][j-1] + 1,
                        dp[i-1][j-1] + 1
                    );
                }
            }
        }
        
        // 回溯获取操作序列
        const operations = [];
        let i = m, j = n;
        
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && s1[i-1] === s2[j-1]) {
                operations.unshift({ type: 'KEEP', char: s1[i-1] });
                i--;
                j--;
            } else if (i > 0 && (j === 0 || dp[i-1][j] < dp[i][j-1])) {
                operations.unshift({ type: 'DELETE', char: s1[i-1] });
                i--;
            } else if (j > 0) {
                operations.unshift({ type: 'INSERT', char: s2[j-1] });
                j--;
            }
        }
        
        return operations;
    }
}

/**
 * 3. 简单差异检测器
 * 检测两个字符串之间的差异并生成差异报告
 */
class SimpleDiff {
    /**
     * 生成差异报告
     * @param {string} oldText 原始文本
     * @param {string} newText 新文本
     * @returns {Object} 差异报告
     */
    static generateDiff(oldText, newText) {
        const oldLines = oldText.split('\n');
        const newLines = newText.split('\n');
        
        const diff = {
            added: [],
            removed: [],
            modified: [],
            unchanged: []
        };
        
        // 简单的逐行比较
        const maxLines = Math.max(oldLines.length, newLines.length);
        
        for (let i = 0; i < maxLines; i++) {
            const oldLine = oldLines[i] || '';
            const newLine = newLines[i] || '';
            
            if (oldLine === newLine) {
                diff.unchanged.push({
                    line: i + 1,
                    content: oldLine
                });
            } else if (oldLine === '') {
                diff.added.push({
                    line: i + 1,
                    content: newLine
                });
            } else if (newLine === '') {
                diff.removed.push({
                    line: i + 1,
                    content: oldLine
                });
            } else {
                diff.modified.push({
                    line: i + 1,
                    oldContent: oldLine,
                    newContent: newLine
                });
            }
        }
        
        return diff;
    }
}

/**
 * 4. 字符级差异检测
 * 检测两个字符串在字符级别的差异
 */
class CharacterDiff {
    /**
     * 生成字符级差异
     * @param {string} s1 第一个字符串
     * @param {string} s2 第二个字符串
     * @returns {Array} 差异数组
     */
    static generate(s1, s2) {
        const diff = [];
        let i = 0, j = 0;
        
        while (i < s1.length || j < s2.length) {
            if (i < s1.length && j < s2.length && s1[i] === s2[j]) {
                diff.push({ type: 'EQUAL', char: s1[i] });
                i++;
                j++;
            } else if (i < s1.length && (j >= s2.length || s1[i] !== s2[j])) {
                diff.push({ type: 'DELETE', char: s1[i] });
                i++;
            } else {
                diff.push({ type: 'INSERT', char: s2[j] });
                j++;
            }
        }
        
        return diff;
    }
}

/**
 * 5. 性能测试工具
 */
class DiffPerformanceTest {
    /**
     * 测试不同算法的性能
     * @param {string} s1 测试字符串1
     * @param {string} s2 测试字符串2
     * @param {number} iterations 迭代次数
     */
    static runPerformanceTest(s1, s2, iterations = 1000) {
        console.log('开始性能测试...');
        console.log(`字符串长度: ${s1.length} vs ${s2.length}`);
        console.log(`迭代次数: ${iterations}`);
        
        // 测试LCS算法
        const lcsStart = performance.now();
        for (let i = 0; i < iterations; i++) {
            const lcs = new LCSDiff();
            lcs.lcsLength(s1, s2);
        }
        const lcsTime = performance.now() - lcsStart;
        
        // 测试编辑距离算法
        const editStart = performance.now();
        for (let i = 0; i < iterations; i++) {
            EditDistance.calculate(s1, s2);
        }
        const editTime = performance.now() - editStart;
        
        // 测试字符级差异
        const charStart = performance.now();
        for (let i = 0; i < iterations; i++) {
            CharacterDiff.generate(s1, s2);
        }
        const charTime = performance.now() - charStart;
        
        console.log('\n性能测试结果:');
        console.log(`LCS算法: ${lcsTime.toFixed(2)}ms`);
        console.log(`编辑距离: ${editTime.toFixed(2)}ms`);
        console.log(`字符级差异: ${charTime.toFixed(2)}ms`);
    }
}

// 导出所有类
module.exports = {
    LCSDiff,
    EditDistance,
    SimpleDiff,
    CharacterDiff,
    DiffPerformanceTest
};

// 使用示例
if (require.main === module) {
    console.log('=== 基础Diff算法示例 ===\n');
    
    // 示例1: LCS算法
    console.log('1. LCS算法示例:');
    const lcs = new LCSDiff();
    const s1 = 'ABCDGH';
    const s2 = 'AEDFHR';
    const lcsLength = lcs.lcsLength(s1, s2);
    const lcsSequence = lcs.getLCS(s1, s2);
    console.log(`字符串1: ${s1}`);
    console.log(`字符串2: ${s2}`);
    console.log(`LCS长度: ${lcsLength}`);
    console.log(`LCS序列: ${lcsSequence}\n`);
    
    // 示例2: 编辑距离
    console.log('2. 编辑距离示例:');
    const editDist = EditDistance.calculate('kitten', 'sitting');
    const operations = EditDistance.getOperations('kitten', 'sitting');
    console.log(`编辑距离: ${editDist}`);
    console.log('操作序列:', operations);
    console.log();
    
    // 示例3: 简单差异检测
    console.log('3. 简单差异检测示例:');
    const oldText = 'Hello\nWorld\nTest';
    const newText = 'Hello\nBeautiful\nWorld\nTest';
    const diff = SimpleDiff.generateDiff(oldText, newText);
    console.log('差异报告:', JSON.stringify(diff, null, 2));
    console.log();
    
    // 示例4: 字符级差异
    console.log('4. 字符级差异示例:');
    const charDiff = CharacterDiff.generate('abc', 'axc');
    console.log('字符级差异:', charDiff);
    console.log();
    
    // 示例5: 性能测试
    console.log('5. 性能测试:');
    const testS1 = 'This is a test string for performance testing';
    const testS2 = 'This is a modified test string for performance testing';
    DiffPerformanceTest.runPerformanceTest(testS1, testS2, 100);
}

/**
 * Diff算法示例运行脚本
 * 演示如何使用各种diff算法
 */

// 导入算法实现
const { LCSDiff, EditDistance, SimpleDiff, CharacterDiff } = require('./basic-diff');
const { MyersDiff, HuntMcIlroyDiff, PatienceDiff } = require('./advanced-diff');
const { ReactDiff, ReactDiffUtils } = require('./react-diff');

/**
 * 示例运行器
 */
class DiffExampleRunner {
    constructor() {
        this.examples = [
            {
                name: '基础LCS算法',
                old: 'ABCDGH',
                new: 'AEDFHR',
                algorithm: 'lcs'
            },
            {
                name: '编辑距离算法',
                old: 'kitten',
                new: 'sitting',
                algorithm: 'edit-distance'
            },
            {
                name: '简单差异检测',
                old: 'Hello\nWorld\nTest',
                new: 'Hello\nBeautiful\nWorld\nTest',
                algorithm: 'simple-diff'
            },
            {
                name: '字符级差异',
                old: 'abc',
                new: 'axc',
                algorithm: 'character-diff'
            },
            {
                name: 'Myers算法',
                old: ['A', 'B', 'C'],
                new: ['A', 'D', 'C'],
                algorithm: 'myers'
            },
            {
                name: 'Hunt-McIlroy算法',
                old: ['line1', 'line2', 'line3'],
                new: ['line1', 'line4', 'line3'],
                algorithm: 'hunt-mcilroy'
            },
            {
                name: 'Patience Diff算法',
                old: ['A', 'B', 'C', 'D'],
                new: ['A', 'E', 'C', 'F'],
                algorithm: 'patience'
            }
        ];
    }

    /**
     * 运行所有示例
     */
    runAllExamples() {
        console.log('=== Diff算法示例演示 ===\n');
        
        this.examples.forEach((example, index) => {
            console.log(`${index + 1}. ${example.name}`);
            console.log('='.repeat(50));
            
            try {
                const result = this.runExample(example);
                this.displayResult(example, result);
            } catch (error) {
                console.log(`❌ 错误: ${error.message}`);
            }
            
            console.log('\n');
        });
    }

    /**
     * 运行单个示例
     * @param {Object} example 示例对象
     * @returns {*} 算法结果
     */
    runExample(example) {
        const { algorithm, old, new: newText } = example;
        
        switch (algorithm) {
            case 'lcs':
                const lcs = new LCSDiff();
                const lcsLength = lcs.lcsLength(old, newText);
                const lcsSequence = lcs.getLCS(old, newText);
                return { length: lcsLength, sequence: lcsSequence };
                
            case 'edit-distance':
                const distance = EditDistance.calculate(old, newText);
                const operations = EditDistance.getOperations(old, newText);
                return { distance, operations };
                
            case 'simple-diff':
                return SimpleDiff.generateDiff(old, newText);
                
            case 'character-diff':
                return CharacterDiff.generate(old, newText);
                
            case 'myers':
                const myers = new MyersDiff();
                return myers.diff(old, newText);
                
            case 'hunt-mcilroy':
                const huntMcIlroy = new HuntMcIlroyDiff();
                return huntMcIlroy.diff(old, newText);
                
            case 'patience':
                const patience = new PatienceDiff();
                return patience.diff(old, newText);
                
            default:
                throw new Error(`未知算法: ${algorithm}`);
        }
    }

    /**
     * 显示结果
     * @param {Object} example 示例对象
     * @param {*} result 算法结果
     */
    displayResult(example, result) {
        console.log(`输入1: ${JSON.stringify(example.old)}`);
        console.log(`输入2: ${JSON.stringify(example.new)}`);
        console.log('结果:');
        
        if (example.algorithm === 'lcs') {
            console.log(`  LCS长度: ${result.length}`);
            console.log(`  LCS序列: ${result.sequence}`);
        } else if (example.algorithm === 'edit-distance') {
            console.log(`  编辑距离: ${result.distance}`);
            console.log('  操作序列:');
            result.operations.forEach((op, index) => {
                console.log(`    ${index + 1}. ${op.type}: ${op.char}`);
            });
        } else if (Array.isArray(result)) {
            result.forEach((item, index) => {
                console.log(`  ${index + 1}. ${JSON.stringify(item)}`);
            });
        } else {
            console.log(`  ${JSON.stringify(result, null, 2)}`);
        }
    }

    /**
     * 运行性能测试
     */
    runPerformanceTest() {
        console.log('=== 性能测试 ===\n');
        
        const testData = {
            small: {
                old: 'Hello World\nThis is a test',
                new: 'Hello Beautiful World\nThis is a modified test'
            },
            medium: {
                old: Array(50).fill(0).map((_, i) => `Line ${i + 1}`).join('\n'),
                new: Array(50).fill(0).map((_, i) => `Modified Line ${i + 1}`).join('\n')
            }
        };
        
        const algorithms = [
            { name: 'LCS', fn: () => new LCSDiff().lcsLength(testData.small.old, testData.small.new) },
            { name: 'Edit Distance', fn: () => EditDistance.calculate(testData.small.old, testData.small.new) },
            { name: 'Simple Diff', fn: () => SimpleDiff.generateDiff(testData.small.old, testData.small.new) },
            { name: 'Character Diff', fn: () => CharacterDiff.generate(testData.small.old, testData.small.new) }
        ];
        
        algorithms.forEach(algorithm => {
            const iterations = 1000;
            const times = [];
            
            // 预热
            for (let i = 0; i < 10; i++) {
                algorithm.fn();
            }
            
            // 测试
            for (let i = 0; i < iterations; i++) {
                const start = performance.now();
                algorithm.fn();
                const end = performance.now();
                times.push(end - start);
            }
            
            const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
            const minTime = Math.min(...times);
            const maxTime = Math.max(...times);
            
            console.log(`${algorithm.name}:`);
            console.log(`  平均时间: ${avgTime.toFixed(4)}ms`);
            console.log(`  最小时间: ${minTime.toFixed(4)}ms`);
            console.log(`  最大时间: ${maxTime.toFixed(4)}ms`);
            console.log('');
        });
    }

    /**
     * 运行交互式演示
     */
    runInteractiveDemo() {
        console.log('=== 交互式Diff演示 ===\n');
        console.log('请输入两个字符串进行比较:');
        console.log('(输入 "exit" 退出)');
        
        // 这里可以添加交互式输入逻辑
        // 由于这是示例脚本，我们使用预设的测试数据
        const testCases = [
            { old: 'Hello World', new: 'Hello Beautiful World' },
            { old: 'abc', new: 'axc' },
            { old: 'kitten', new: 'sitting' }
        ];
        
        testCases.forEach((testCase, index) => {
            console.log(`\n测试用例 ${index + 1}:`);
            console.log(`原始: "${testCase.old}"`);
            console.log(`修改: "${testCase.new}"`);
            
            // 运行多种算法
            const algorithms = [
                { name: 'LCS', result: new LCSDiff().lcsLength(testCase.old, testCase.new) },
                { name: '编辑距离', result: EditDistance.calculate(testCase.old, testCase.new) },
                { name: '字符差异', result: CharacterDiff.generate(testCase.old, testCase.new) }
            ];
            
            algorithms.forEach(alg => {
                console.log(`${alg.name}: ${JSON.stringify(alg.result)}`);
            });
        });
    }
}

/**
 * 可视化差异显示器
 */
class DiffVisualizer {
    /**
     * 显示差异对比
     * @param {string} old 原始文本
     * @param {string} newText 新文本
     * @param {Array} diff 差异结果
     */
    static displayDiff(old, newText, diff) {
        console.log('\n=== 差异对比 ===');
        console.log('原始版本:');
        console.log(old);
        console.log('\n修改版本:');
        console.log(newText);
        console.log('\n差异分析:');
        
        diff.forEach((item, index) => {
            const prefix = item.type === 'added' ? '+' : 
                          item.type === 'removed' ? '-' : ' ';
            console.log(`${prefix} ${index + 1}. ${item.content || item.char || JSON.stringify(item)}`);
        });
    }

    /**
     * 生成差异统计
     * @param {Array} diff 差异结果
     * @returns {Object} 统计信息
     */
    static generateStats(diff) {
        const stats = {
            total: diff.length,
            added: 0,
            removed: 0,
            unchanged: 0
        };
        
        diff.forEach(item => {
            if (item.type === 'added' || item.type === 'INSERT') {
                stats.added++;
            } else if (item.type === 'removed' || item.type === 'DELETE') {
                stats.removed++;
            } else if (item.type === 'unchanged' || item.type === 'EQUAL') {
                stats.unchanged++;
            }
        });
        
        return stats;
    }
}

// 主函数
function main() {
    const runner = new DiffExampleRunner();
    
    console.log('Diff算法示例演示程序');
    console.log('==================\n');
    
    // 运行所有示例
    runner.runAllExamples();
    
    // 运行性能测试
    runner.runPerformanceTest();
    
    // 运行交互式演示
    runner.runInteractiveDemo();
    
    console.log('\n演示完成！');
    console.log('更多详细信息请查看各个算法文件。');
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

// 导出类和函数
module.exports = {
    DiffExampleRunner,
    DiffVisualizer
};

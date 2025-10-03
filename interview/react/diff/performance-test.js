/**
 * Diff算法性能测试脚本
 * 测试不同算法的性能表现
 */

const fs = require('fs');
const path = require('path');

// 导入算法实现
const { LCSDiff, EditDistance, SimpleDiff, CharacterDiff } = require('./basic-diff');
const { MyersDiff, HuntMcIlroyDiff, PatienceDiff, ThreeWayMerge, DiffOptimizer } = require('./advanced-diff');
const { ReactDiff, ReactDiffUtils } = require('./react-diff');

/**
 * 性能测试工具类
 */
class PerformanceTester {
    constructor() {
        this.results = new Map();
        this.testData = this.generateTestData();
    }

    /**
     * 生成测试数据
     * @returns {Object} 测试数据
     */
    generateTestData() {
        return {
            small: {
                old: 'Hello World\nThis is a test\nEnd of file',
                new: 'Hello Beautiful World\nThis is a modified test\nEnd of file'
            },
            medium: {
                old: this.generateRandomText(100),
                new: this.generateRandomText(100)
            },
            large: {
                old: this.generateRandomText(1000),
                new: this.generateRandomText(1000)
            },
            veryLarge: {
                old: this.generateRandomText(5000),
                new: this.generateRandomText(5000)
            }
        };
    }

    /**
     * 生成随机文本
     * @param {number} lineCount 行数
     * @returns {string} 随机文本
     */
    generateRandomText(lineCount) {
        const lines = [];
        const words = ['hello', 'world', 'test', 'example', 'code', 'function', 'variable', 'class', 'method', 'object'];
        
        for (let i = 0; i < lineCount; i++) {
            const lineLength = Math.floor(Math.random() * 10) + 1;
            const line = Array(lineLength).fill(0).map(() => 
                words[Math.floor(Math.random() * words.length)]
            ).join(' ');
            lines.push(line);
        }
        
        return lines.join('\n');
    }

    /**
     * 运行性能测试
     * @param {string} algorithm 算法名称
     * @param {Object} testData 测试数据
     * @param {number} iterations 迭代次数
     * @returns {Object} 测试结果
     */
    async runTest(algorithm, testData, iterations = 100) {
        const { old, new: newText } = testData;
        const times = [];
        const memoryUsage = [];
        
        console.log(`测试算法: ${algorithm}`);
        console.log(`数据大小: ${old.length} 字符`);
        console.log(`迭代次数: ${iterations}`);
        
        for (let i = 0; i < iterations; i++) {
            // 记录内存使用
            const memBefore = process.memoryUsage();
            
            // 执行算法
            const startTime = performance.now();
            await this.executeAlgorithm(algorithm, old, newText);
            const endTime = performance.now();
            
            // 记录内存使用
            const memAfter = process.memoryUsage();
            
            times.push(endTime - startTime);
            memoryUsage.push(memAfter.heapUsed - memBefore.heapUsed);
            
            // 强制垃圾回收
            if (global.gc) {
                global.gc();
            }
        }
        
        const result = {
            algorithm,
            dataSize: old.length,
            iterations,
            avgTime: times.reduce((a, b) => a + b, 0) / times.length,
            minTime: Math.min(...times),
            maxTime: Math.max(...times),
            medianTime: this.calculateMedian(times),
            avgMemory: memoryUsage.reduce((a, b) => a + b, 0) / memoryUsage.length,
            maxMemory: Math.max(...memoryUsage),
            times,
            memoryUsage
        };
        
        this.results.set(algorithm, result);
        return result;
    }

    /**
     * 执行算法
     * @param {string} algorithm 算法名称
     * @param {string} old 旧文本
     * @param {string} newText 新文本
     */
    async executeAlgorithm(algorithm, old, newText) {
        switch (algorithm) {
            case 'basic-lcs':
                const lcs = new LCSDiff();
                lcs.lcsLength(old, newText);
                break;
                
            case 'edit-distance':
                EditDistance.calculate(old, newText);
                break;
                
            case 'simple-diff':
                SimpleDiff.generateDiff(old, newText);
                break;
                
            case 'character-diff':
                CharacterDiff.generate(old, newText);
                break;
                
            case 'myers':
                const myers = new MyersDiff();
                myers.diff(old.split('\n'), newText.split('\n'));
                break;
                
            case 'hunt-mcilroy':
                const huntMcIlroy = new HuntMcIlroyDiff();
                huntMcIlroy.diff(old.split('\n'), newText.split('\n'));
                break;
                
            case 'patience':
                const patience = new PatienceDiff();
                patience.diff(old.split('\n'), newText.split('\n'));
                break;
                
            case 'react-diff':
                const reactDiff = new ReactDiff();
                reactDiff.diff(
                    { type: 'div', props: {}, children: old.split('\n') },
                    { type: 'div', props: {}, children: newText.split('\n') }
                );
                break;
                
            default:
                throw new Error(`未知算法: ${algorithm}`);
        }
    }

    /**
     * 计算中位数
     * @param {Array} numbers 数字数组
     * @returns {number} 中位数
     */
    calculateMedian(numbers) {
        const sorted = [...numbers].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 
            ? (sorted[mid - 1] + sorted[mid]) / 2 
            : sorted[mid];
    }

    /**
     * 运行所有测试
     * @param {Array} algorithms 算法列表
     * @param {Array} dataSizes 数据大小列表
     * @returns {Promise<Object>} 测试结果
     */
    async runAllTests(algorithms = [], dataSizes = []) {
        if (algorithms.length === 0) {
            algorithms = [
                'basic-lcs',
                'edit-distance', 
                'simple-diff',
                'character-diff',
                'myers',
                'hunt-mcilroy',
                'patience',
                'react-diff'
            ];
        }
        
        if (dataSizes.length === 0) {
            dataSizes = ['small', 'medium', 'large'];
        }
        
        console.log('开始性能测试...\n');
        
        for (const dataSize of dataSizes) {
            console.log(`\n=== 测试数据大小: ${dataSize} ===`);
            const testData = this.testData[dataSize];
            
            for (const algorithm of algorithms) {
                try {
                    const result = await this.runTest(algorithm, testData, 50);
                    console.log(`✓ ${algorithm}: ${result.avgTime.toFixed(2)}ms (平均), ${result.medianTime.toFixed(2)}ms (中位数)`);
                } catch (error) {
                    console.log(`✗ ${algorithm}: 错误 - ${error.message}`);
                }
            }
        }
        
        return this.generateReport();
    }

    /**
     * 生成测试报告
     * @returns {Object} 测试报告
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {},
            details: {}
        };
        
        // 按算法分组结果
        for (const [algorithm, result] of this.results) {
            if (!report.summary[algorithm]) {
                report.summary[algorithm] = {
                    avgTime: 0,
                    avgMemory: 0,
                    testCount: 0
                };
            }
            
            report.summary[algorithm].avgTime += result.avgTime;
            report.summary[algorithm].avgMemory += result.avgMemory;
            report.summary[algorithm].testCount++;
            
            report.details[algorithm] = result;
        }
        
        // 计算平均值
        for (const algorithm in report.summary) {
            const summary = report.summary[algorithm];
            summary.avgTime /= summary.testCount;
            summary.avgMemory /= summary.testCount;
        }
        
        return report;
    }

    /**
     * 保存报告到文件
     * @param {string} filename 文件名
     */
    saveReport(filename = 'performance-report.json') {
        const report = this.generateReport();
        const filepath = path.join(__dirname, filename);
        
        fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
        console.log(`\n报告已保存到: ${filepath}`);
    }

    /**
     * 生成性能对比图表数据
     * @returns {Object} 图表数据
     */
    generateChartData() {
        const chartData = {
            algorithms: [],
            datasets: {
                time: [],
                memory: []
            }
        };
        
        for (const [algorithm, result] of this.results) {
            chartData.algorithms.push(algorithm);
            chartData.datasets.time.push(result.avgTime);
            chartData.datasets.memory.push(result.avgMemory);
        }
        
        return chartData;
    }

    /**
     * 运行基准测试
     * @param {string} algorithm 算法名称
     * @param {Object} testData 测试数据
     * @param {number} warmupRuns 预热运行次数
     * @param {number} testRuns 测试运行次数
     * @returns {Object} 基准测试结果
     */
    async runBenchmark(algorithm, testData, warmupRuns = 10, testRuns = 100) {
        console.log(`运行基准测试: ${algorithm}`);
        
        // 预热运行
        for (let i = 0; i < warmupRuns; i++) {
            await this.executeAlgorithm(algorithm, testData.old, testData.new);
        }
        
        // 测试运行
        const times = [];
        for (let i = 0; i < testRuns; i++) {
            const startTime = performance.now();
            await this.executeAlgorithm(algorithm, testData.old, testData.new);
            const endTime = performance.now();
            times.push(endTime - startTime);
        }
        
        return {
            algorithm,
            warmupRuns,
            testRuns,
            times,
            avgTime: times.reduce((a, b) => a + b, 0) / times.length,
            minTime: Math.min(...times),
            maxTime: Math.max(...times),
            medianTime: this.calculateMedian(times),
            stdDev: this.calculateStandardDeviation(times)
        };
    }

    /**
     * 计算标准差
     * @param {Array} numbers 数字数组
     * @returns {number} 标准差
     */
    calculateStandardDeviation(numbers) {
        const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
        const variance = numbers.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / numbers.length;
        return Math.sqrt(variance);
    }
}

/**
 * 内存使用监控器
 */
class MemoryMonitor {
    constructor() {
        this.measurements = [];
    }

    /**
     * 开始监控
     */
    start() {
        this.measurements = [];
        this.measure();
    }

    /**
     * 测量内存使用
     */
    measure() {
        const memUsage = process.memoryUsage();
        this.measurements.push({
            timestamp: Date.now(),
            rss: memUsage.rss,
            heapTotal: memUsage.heapTotal,
            heapUsed: memUsage.heapUsed,
            external: memUsage.external
        });
    }

    /**
     * 停止监控
     * @returns {Object} 内存使用报告
     */
    stop() {
        if (this.measurements.length === 0) {
            return null;
        }

        const first = this.measurements[0];
        const last = this.measurements[this.measurements.length - 1];
        
        return {
            duration: last.timestamp - first.timestamp,
            measurements: this.measurements.length,
            rssIncrease: last.rss - first.rss,
            heapIncrease: last.heapUsed - first.heapUsed,
            peakHeap: Math.max(...this.measurements.map(m => m.heapUsed)),
            avgHeap: this.measurements.reduce((sum, m) => sum + m.heapUsed, 0) / this.measurements.length
        };
    }
}

/**
 * 测试数据生成器
 */
class TestDataGenerator {
    /**
     * 生成代码差异测试数据
     * @param {number} fileCount 文件数量
     * @returns {Array} 测试数据数组
     */
    static generateCodeDiffData(fileCount = 10) {
        const data = [];
        const codeTemplates = [
            'function ${name}() {\n    return ${value};\n}',
            'class ${name} {\n    constructor() {\n        this.value = ${value};\n    }\n}',
            'const ${name} = ${value};\n\nexport default ${name};',
            'if (${condition}) {\n    console.log("${message}");\n}'
        ];
        
        for (let i = 0; i < fileCount; i++) {
            const template = codeTemplates[Math.floor(Math.random() * codeTemplates.length)];
            const name = `item${i}`;
            const value = Math.random() * 100;
            const condition = Math.random() > 0.5;
            const message = `Message ${i}`;
            
            const oldCode = template
                .replace('${name}', name)
                .replace('${value}', value)
                .replace('${condition}', condition)
                .replace('${message}', message);
            
            const newCode = template
                .replace('${name}', name)
                .replace('${value}', value + Math.random() * 10)
                .replace('${condition}', !condition)
                .replace('${message}', `Modified ${message}`);
            
            data.push({ old: oldCode, new: newCode });
        }
        
        return data;
    }

    /**
     * 生成文本差异测试数据
     * @param {number} textCount 文本数量
     * @param {number} lineCount 每文本行数
     * @returns {Array} 测试数据数组
     */
    static generateTextDiffData(textCount = 10, lineCount = 50) {
        const data = [];
        const words = ['hello', 'world', 'test', 'example', 'code', 'function', 'variable'];
        
        for (let i = 0; i < textCount; i++) {
            const oldLines = [];
            const newLines = [];
            
            for (let j = 0; j < lineCount; j++) {
                const line = Array(Math.floor(Math.random() * 5) + 1)
                    .fill(0)
                    .map(() => words[Math.floor(Math.random() * words.length)])
                    .join(' ');
                
                oldLines.push(line);
                
                // 随机修改一些行
                if (Math.random() > 0.7) {
                    const modifiedLine = line + ' modified';
                    newLines.push(modifiedLine);
                } else {
                    newLines.push(line);
                }
            }
            
            data.push({
                old: oldLines.join('\n'),
                new: newLines.join('\n')
            });
        }
        
        return data;
    }
}

// 导出所有类
module.exports = {
    PerformanceTester,
    MemoryMonitor,
    TestDataGenerator
};

// 命令行使用示例
if (require.main === module) {
    const tester = new PerformanceTester();
    
    // 运行所有测试
    tester.runAllTests()
        .then(report => {
            console.log('\n=== 性能测试报告 ===');
            console.log(JSON.stringify(report, null, 2));
            
            // 保存报告
            tester.saveReport();
        })
        .catch(error => {
            console.error('测试失败:', error);
        });
}

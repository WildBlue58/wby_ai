/**
 * 高级Diff算法实现
 * 包含Myers算法、Hunt-McIlroy算法、Patience Diff等高级算法
 */

/**
 * 1. Myers算法实现
 * 基于图的最短路径算法，时间复杂度O(ND)
 */
class MyersDiff {
    constructor() {
        this.a = [];
        this.b = [];
        this.N = 0;
        this.M = 0;
        this.MAX = 0;
        this.V = [];
        this.V1 = [];
        this.V2 = [];
    }

    /**
     * 执行Myers差异算法
     * @param {Array} a 第一个序列
     * @param {Array} b 第二个序列
     * @returns {Array} 差异操作序列
     */
    diff(a, b) {
        this.a = a;
        this.b = b;
        this.N = a.length;
        this.M = b.length;
        this.MAX = this.N + this.M;
        
        // 初始化V数组
        this.V = new Array(2 * this.MAX + 1);
        for (let i = 0; i < this.V.length; i++) {
            this.V[i] = -1;
        }
        
        const snake = [];
        const path = [];
        
        // 执行算法
        for (let d = 0; d <= this.MAX; d++) {
            for (let k = -d; k <= d; k += 2) {
                let x;
                if (k === -d || (k !== d && this.V[k - 1] < this.V[k + 1])) {
                    x = this.V[k + 1];
                } else {
                    x = this.V[k - 1] + 1;
                }
                
                let y = x - k;
                
                // 沿着对角线移动
                while (x < this.N && y < this.M && this.a[x] === this.b[y]) {
                    x++;
                    y++;
                }
                
                this.V[k] = x;
                
                if (x >= this.N && y >= this.M) {
                    // 找到路径，回溯构建差异
                    return this.buildDiff(path);
                }
            }
        }
        
        return [];
    }

    /**
     * 构建差异操作序列
     * @param {Array} path 路径
     * @returns {Array} 操作序列
     */
    buildDiff(path) {
        const operations = [];
        let i = 0, j = 0;
        
        for (const step of path) {
            if (step.type === 'EQUAL') {
                operations.push({ type: 'EQUAL', content: this.a[i] });
                i++;
                j++;
            } else if (step.type === 'DELETE') {
                operations.push({ type: 'DELETE', content: this.a[i] });
                i++;
            } else if (step.type === 'INSERT') {
                operations.push({ type: 'INSERT', content: this.b[j] });
                j++;
            }
        }
        
        return operations;
    }
}

/**
 * 2. Hunt-McIlroy算法实现
 * 基于LCS的改进算法，内存使用更少
 */
class HuntMcIlroyDiff {
    constructor() {
        this.oldLines = [];
        this.newLines = [];
        this.oldHash = new Map();
        this.newHash = new Map();
    }

    /**
     * 执行Hunt-McIlroy差异算法
     * @param {Array} oldLines 旧行数组
     * @param {Array} newLines 新行数组
     * @returns {Array} 差异结果
     */
    diff(oldLines, newLines) {
        this.oldLines = oldLines;
        this.newLines = newLines;
        
        // 构建哈希表
        this.buildHashTables();
        
        // 找到公共子序列
        const common = this.findCommonSubsequence();
        
        // 生成差异
        return this.generateDiff(common);
    }

    /**
     * 构建哈希表
     */
    buildHashTables() {
        this.oldHash.clear();
        this.newHash.clear();
        
        this.oldLines.forEach((line, index) => {
            if (!this.oldHash.has(line)) {
                this.oldHash.set(line, []);
            }
            this.oldHash.get(line).push(index);
        });
        
        this.newLines.forEach((line, index) => {
            if (!this.newHash.has(line)) {
                this.newHash.set(line, []);
            }
            this.newHash.get(line).push(index);
        });
    }

    /**
     * 找到公共子序列
     * @returns {Array} 公共子序列
     */
    findCommonSubsequence() {
        const common = [];
        const oldIndices = new Set();
        const newIndices = new Set();
        
        // 找到所有公共行
        for (const [line, oldPositions] of this.oldHash) {
            if (this.newHash.has(line)) {
                const newPositions = this.newHash.get(line);
                for (const oldPos of oldPositions) {
                    for (const newPos of newPositions) {
                        if (!oldIndices.has(oldPos) && !newIndices.has(newPos)) {
                            common.push({ oldPos, newPos, line });
                            oldIndices.add(oldPos);
                            newIndices.add(newPos);
                        }
                    }
                }
            }
        }
        
        // 按位置排序
        common.sort((a, b) => a.oldPos - b.oldPos);
        
        return common;
    }

    /**
     * 生成差异
     * @param {Array} common 公共子序列
     * @returns {Array} 差异结果
     */
    generateDiff(common) {
        const result = [];
        let oldIndex = 0;
        let newIndex = 0;
        let commonIndex = 0;
        
        while (oldIndex < this.oldLines.length || newIndex < this.newLines.length) {
            // 处理删除的行
            while (oldIndex < this.oldLines.length && 
                   (commonIndex >= common.length || oldIndex < common[commonIndex].oldPos)) {
                result.push({
                    type: 'DELETE',
                    line: oldIndex + 1,
                    content: this.oldLines[oldIndex]
                });
                oldIndex++;
            }
            
            // 处理插入的行
            while (newIndex < this.newLines.length && 
                   (commonIndex >= common.length || newIndex < common[commonIndex].newPos)) {
                result.push({
                    type: 'INSERT',
                    line: newIndex + 1,
                    content: this.newLines[newIndex]
                });
                newIndex++;
            }
            
            // 处理相等的行
            if (commonIndex < common.length) {
                const commonItem = common[commonIndex];
                result.push({
                    type: 'EQUAL',
                    oldLine: commonItem.oldPos + 1,
                    newLine: commonItem.newPos + 1,
                    content: commonItem.line
                });
                oldIndex = commonItem.oldPos + 1;
                newIndex = commonItem.newPos + 1;
                commonIndex++;
            }
        }
        
        return result;
    }
}

/**
 * 3. Patience Diff算法实现
 * 基于最长递增子序列，产生更直观的差异结果
 */
class PatienceDiff {
    constructor() {
        this.oldLines = [];
        this.newLines = [];
    }

    /**
     * 执行Patience差异算法
     * @param {Array} oldLines 旧行数组
     * @param {Array} newLines 新行数组
     * @returns {Array} 差异结果
     */
    diff(oldLines, newLines) {
        this.oldLines = oldLines;
        this.newLines = newLines;
        
        // 找到唯一匹配
        const uniqueMatches = this.findUniqueMatches();
        
        // 构建最长递增子序列
        const lcs = this.buildLCS(uniqueMatches);
        
        // 生成差异
        return this.generateDiff(lcs);
    }

    /**
     * 找到唯一匹配
     * @returns {Array} 唯一匹配数组
     */
    findUniqueMatches() {
        const oldHash = new Map();
        const newHash = new Map();
        
        // 构建哈希表
        this.oldLines.forEach((line, index) => {
            if (!oldHash.has(line)) {
                oldHash.set(line, []);
            }
            oldHash.get(line).push(index);
        });
        
        this.newLines.forEach((line, index) => {
            if (!newHash.has(line)) {
                newHash.set(line, []);
            }
            newHash.get(line).push(index);
        });
        
        // 找到唯一匹配
        const uniqueMatches = [];
        for (const [line, oldPositions] of oldHash) {
            if (newHash.has(line)) {
                const newPositions = newHash.get(line);
                if (oldPositions.length === 1 && newPositions.length === 1) {
                    uniqueMatches.push({
                        oldPos: oldPositions[0],
                        newPos: newPositions[0],
                        line: line
                    });
                }
            }
        }
        
        return uniqueMatches;
    }

    /**
     * 构建最长递增子序列
     * @param {Array} matches 匹配数组
     * @returns {Array} LCS
     */
    buildLCS(matches) {
        if (matches.length === 0) return [];
        
        // 按oldPos排序
        matches.sort((a, b) => a.oldPos - b.oldPos);
        
        // 构建LIS
        const lis = [];
        const prev = new Array(matches.length).fill(-1);
        
        for (let i = 0; i < matches.length; i++) {
            let left = 0, right = lis.length;
            while (left < right) {
                const mid = Math.floor((left + right) / 2);
                if (matches[lis[mid]].newPos < matches[i].newPos) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            
            if (left < lis.length) {
                lis[left] = i;
            } else {
                lis.push(i);
            }
            
            if (left > 0) {
                prev[i] = lis[left - 1];
            }
        }
        
        // 重建LCS
        const lcs = [];
        let current = lis[lis.length - 1];
        while (current !== -1) {
            lcs.unshift(matches[current]);
            current = prev[current];
        }
        
        return lcs;
    }

    /**
     * 生成差异
     * @param {Array} lcs 最长公共子序列
     * @returns {Array} 差异结果
     */
    generateDiff(lcs) {
        const result = [];
        let oldIndex = 0;
        let newIndex = 0;
        let lcsIndex = 0;
        
        while (oldIndex < this.oldLines.length || newIndex < this.newLines.length) {
            // 处理删除的行
            while (oldIndex < this.oldLines.length && 
                   (lcsIndex >= lcs.length || oldIndex < lcs[lcsIndex].oldPos)) {
                result.push({
                    type: 'DELETE',
                    line: oldIndex + 1,
                    content: this.oldLines[oldIndex]
                });
                oldIndex++;
            }
            
            // 处理插入的行
            while (newIndex < this.newLines.length && 
                   (lcsIndex >= lcs.length || newIndex < lcs[lcsIndex].newPos)) {
                result.push({
                    type: 'INSERT',
                    line: newIndex + 1,
                    content: this.newLines[newIndex]
                });
                newIndex++;
            }
            
            // 处理相等的行
            if (lcsIndex < lcs.length) {
                const lcsItem = lcs[lcsIndex];
                result.push({
                    type: 'EQUAL',
                    oldLine: lcsItem.oldPos + 1,
                    newLine: lcsItem.newPos + 1,
                    content: lcsItem.line
                });
                oldIndex = lcsItem.oldPos + 1;
                newIndex = lcsItem.newPos + 1;
                lcsIndex++;
            }
        }
        
        return result;
    }
}

/**
 * 4. 三路合并算法
 * 处理三个版本的合并，解决合并冲突
 */
class ThreeWayMerge {
    constructor() {
        this.base = [];
        this.ours = [];
        this.theirs = [];
    }

    /**
     * 执行三路合并
     * @param {Array} base 基础版本
     * @param {Array} ours 我们的版本
     * @param {Array} theirs 他们的版本
     * @returns {Object} 合并结果
     */
    merge(base, ours, theirs) {
        this.base = base;
        this.ours = ours;
        this.theirs = theirs;
        
        const result = {
            merged: [],
            conflicts: [],
            success: true
        };
        
        // 找到所有版本的交集
        const common = this.findCommonLines();
        
        // 生成合并结果
        this.generateMergeResult(common, result);
        
        return result;
    }

    /**
     * 找到公共行
     * @returns {Array} 公共行数组
     */
    findCommonLines() {
        const common = [];
        const baseHash = new Map();
        const oursHash = new Map();
        const theirsHash = new Map();
        
        // 构建哈希表
        this.base.forEach((line, index) => {
            if (!baseHash.has(line)) {
                baseHash.set(line, []);
            }
            baseHash.get(line).push(index);
        });
        
        this.ours.forEach((line, index) => {
            if (!oursHash.has(line)) {
                oursHash.set(line, []);
            }
            oursHash.get(line).push(index);
        });
        
        this.theirs.forEach((line, index) => {
            if (!theirsHash.has(line)) {
                theirsHash.set(line, []);
            }
            theirsHash.get(line).push(index);
        });
        
        // 找到三路公共行
        for (const [line, basePositions] of baseHash) {
            if (oursHash.has(line) && theirsHash.has(line)) {
                const oursPositions = oursHash.get(line);
                const theirsPositions = theirsHash.get(line);
                
                for (const basePos of basePositions) {
                    for (const oursPos of oursPositions) {
                        for (const theirsPos of theirsPositions) {
                            common.push({
                                basePos,
                                oursPos,
                                theirsPos,
                                line
                            });
                        }
                    }
                }
            }
        }
        
        return common;
    }

    /**
     * 生成合并结果
     * @param {Array} common 公共行数组
     * @param {Object} result 结果对象
     */
    generateMergeResult(common, result) {
        let baseIndex = 0;
        let oursIndex = 0;
        let theirsIndex = 0;
        let commonIndex = 0;
        
        while (baseIndex < this.base.length || 
               oursIndex < this.ours.length || 
               theirsIndex < this.theirs.length) {
            
            // 处理冲突检测
            if (this.hasConflict(baseIndex, oursIndex, theirsIndex, common)) {
                const conflict = this.resolveConflict(baseIndex, oursIndex, theirsIndex);
                result.conflicts.push(conflict);
                result.success = false;
                return;
            }
            
            // 处理合并
            this.processMerge(baseIndex, oursIndex, theirsIndex, result);
            
            // 更新索引
            baseIndex++;
            oursIndex++;
            theirsIndex++;
        }
    }

    /**
     * 检测冲突
     * @param {number} baseIndex 基础索引
     * @param {number} oursIndex 我们的索引
     * @param {number} theirsIndex 他们的索引
     * @param {Array} common 公共行数组
     * @returns {boolean} 是否有冲突
     */
    hasConflict(baseIndex, oursIndex, theirsIndex, common) {
        // 简化的冲突检测逻辑
        return this.ours[oursIndex] !== this.theirs[theirsIndex] && 
               this.base[baseIndex] !== this.ours[oursIndex] && 
               this.base[baseIndex] !== this.theirs[theirsIndex];
    }

    /**
     * 解决冲突
     * @param {number} baseIndex 基础索引
     * @param {number} oursIndex 我们的索引
     * @param {number} theirsIndex 他们的索引
     * @returns {Object} 冲突信息
     */
    resolveConflict(baseIndex, oursIndex, theirsIndex) {
        return {
            baseLine: baseIndex + 1,
            oursLine: oursIndex + 1,
            theirsLine: theirsIndex + 1,
            baseContent: this.base[baseIndex],
            oursContent: this.ours[oursIndex],
            theirsContent: this.theirs[theirsIndex]
        };
    }

    /**
     * 处理合并
     * @param {number} baseIndex 基础索引
     * @param {number} oursIndex 我们的索引
     * @param {number} theirsIndex 他们的索引
     * @param {Object} result 结果对象
     */
    processMerge(baseIndex, oursIndex, theirsIndex, result) {
        // 简化的合并逻辑
        if (this.ours[oursIndex] === this.theirs[theirsIndex]) {
            result.merged.push({
                type: 'EQUAL',
                content: this.ours[oursIndex]
            });
        } else if (this.base[baseIndex] === this.ours[oursIndex]) {
            result.merged.push({
                type: 'THEIRS',
                content: this.theirs[theirsIndex]
            });
        } else if (this.base[baseIndex] === this.theirs[theirsIndex]) {
            result.merged.push({
                type: 'OURS',
                content: this.ours[oursIndex]
            });
        } else {
            result.merged.push({
                type: 'BOTH',
                ours: this.ours[oursIndex],
                theirs: this.theirs[theirsIndex]
            });
        }
    }
}

/**
 * 5. 性能优化工具
 */
class DiffOptimizer {
    /**
     * 空间优化的LCS算法
     * @param {string} s1 第一个字符串
     * @param {string} s2 第二个字符串
     * @returns {number} LCS长度
     */
    static optimizedLCS(s1, s2) {
        const m = s1.length;
        const n = s2.length;
        
        // 使用滚动数组优化空间
        let prev = new Array(n + 1).fill(0);
        let curr = new Array(n + 1).fill(0);
        
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (s1[i-1] === s2[j-1]) {
                    curr[j] = prev[j-1] + 1;
                } else {
                    curr[j] = Math.max(prev[j], curr[j-1]);
                }
            }
            [prev, curr] = [curr, prev];
        }
        
        return prev[n];
    }

    /**
     * 并行差异计算
     * @param {Array} files 文件数组
     * @returns {Promise<Array>} 差异结果数组
     */
    static async parallelDiff(files) {
        const promises = files.map(file => 
            new Promise(resolve => {
                // 模拟异步差异计算
                setTimeout(() => {
                    const result = this.calculateDiff(file.old, file.new);
                    resolve(result);
                }, Math.random() * 100);
            })
        );
        
        return Promise.all(promises);
    }

    /**
     * 计算差异
     * @param {string} old 旧内容
     * @param {string} new 新内容
     * @returns {Object} 差异结果
     */
    static calculateDiff(old, new_) {
        // 简化的差异计算
        return {
            old,
            new: new_,
            changes: Math.abs(old.length - new_.length)
        };
    }
}

// 导出所有类
module.exports = {
    MyersDiff,
    HuntMcIlroyDiff,
    PatienceDiff,
    ThreeWayMerge,
    DiffOptimizer
};

// 使用示例
if (require.main === module) {
    console.log('=== 高级Diff算法示例 ===\n');
    
    // 示例1: Myers算法
    console.log('1. Myers算法示例:');
    const myers = new MyersDiff();
    const myersResult = myers.diff(['A', 'B', 'C'], ['A', 'D', 'C']);
    console.log('Myers差异结果:', myersResult);
    console.log();
    
    // 示例2: Hunt-McIlroy算法
    console.log('2. Hunt-McIlroy算法示例:');
    const huntMcIlroy = new HuntMcIlroyDiff();
    const huntResult = huntMcIlroy.diff(
        ['line1', 'line2', 'line3'],
        ['line1', 'line4', 'line3']
    );
    console.log('Hunt-McIlroy差异结果:', huntResult);
    console.log();
    
    // 示例3: Patience Diff算法
    console.log('3. Patience Diff算法示例:');
    const patience = new PatienceDiff();
    const patienceResult = patience.diff(
        ['A', 'B', 'C', 'D'],
        ['A', 'E', 'C', 'F']
    );
    console.log('Patience差异结果:', patienceResult);
    console.log();
    
    // 示例4: 三路合并
    console.log('4. 三路合并示例:');
    const threeWay = new ThreeWayMerge();
    const mergeResult = threeWay.merge(
        ['base1', 'base2', 'base3'],
        ['ours1', 'ours2', 'ours3'],
        ['theirs1', 'theirs2', 'theirs3']
    );
    console.log('三路合并结果:', mergeResult);
    console.log();
    
    // 示例5: 性能优化
    console.log('5. 性能优化示例:');
    const optimizedLCS = DiffOptimizer.optimizedLCS('ABCDGH', 'AEDFHR');
    console.log(`优化后的LCS长度: ${optimizedLCS}`);
    console.log();
    
    // 示例6: 并行差异计算
    console.log('6. 并行差异计算示例:');
    const files = [
        { old: 'file1_old', new: 'file1_new' },
        { old: 'file2_old', new: 'file2_new' },
        { old: 'file3_old', new: 'file3_new' }
    ];
    
    DiffOptimizer.parallelDiff(files).then(results => {
        console.log('并行差异计算结果:', results);
    });
}

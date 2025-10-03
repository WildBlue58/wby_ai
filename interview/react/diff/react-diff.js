/**
 * React Diff算法实现
 * 包含Virtual DOM diff、Fiber算法、组件diff等React核心算法
 */

/**
 * 1. Virtual DOM节点表示
 */
class VNode {
    constructor(type, props, children) {
        this.type = type;
        this.props = props || {};
        this.children = children || [];
        this.key = props?.key;
        this.ref = props?.ref;
    }

    /**
     * 创建虚拟DOM节点
     * @param {string|Function} type 节点类型
     * @param {Object} props 属性
     * @param {...any} children 子节点
     * @returns {VNode} 虚拟DOM节点
     */
    static createElement(type, props, ...children) {
        return new VNode(type, props, children);
    }

    /**
     * 渲染为真实DOM
     * @returns {HTMLElement} 真实DOM元素
     */
    render() {
        if (typeof this.type === 'string') {
            const element = document.createElement(this.type);
            
            // 设置属性
            for (const [key, value] of Object.entries(this.props)) {
                if (key === 'key' || key === 'ref') continue;
                if (key === 'className') {
                    element.className = value;
                } else if (key.startsWith('on')) {
                    element.addEventListener(key.slice(2).toLowerCase(), value);
                } else {
                    element.setAttribute(key, value);
                }
            }
            
            // 渲染子节点
            this.children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof VNode) {
                    element.appendChild(child.render());
                }
            });
            
            return element;
        } else if (typeof this.type === 'function') {
            // 函数组件
            const component = new this.type(this.props);
            return component.render();
        }
    }
}

/**
 * 2. React Diff算法核心
 */
class ReactDiff {
    constructor() {
        this.operations = [];
    }

    /**
     * 执行React Diff算法
     * @param {VNode} oldVNode 旧的虚拟DOM
     * @param {VNode} newVNode 新的虚拟DOM
     * @returns {Array} 操作序列
     */
    diff(oldVNode, newVNode) {
        this.operations = [];
        this.diffNode(oldVNode, newVNode, 0);
        return this.operations;
    }

    /**
     * 比较两个节点
     * @param {VNode} oldNode 旧节点
     * @param {VNode} newNode 新节点
     * @param {number} index 节点索引
     */
    diffNode(oldNode, newNode, index) {
        // 节点类型不同，直接替换
        if (oldNode.type !== newNode.type) {
            this.operations.push({
                type: 'REPLACE',
                index,
                oldNode,
                newNode
            });
            return;
        }

        // 文本节点比较
        if (typeof oldNode === 'string' && typeof newNode === 'string') {
            if (oldNode !== newNode) {
                this.operations.push({
                    type: 'TEXT',
                    index,
                    oldText: oldNode,
                    newText: newNode
                });
            }
            return;
        }

        // 属性比较
        this.diffProps(oldNode.props, newNode.props, index);

        // 子节点比较
        this.diffChildren(oldNode.children, newNode.children, index);
    }

    /**
     * 比较属性
     * @param {Object} oldProps 旧属性
     * @param {Object} newProps 新属性
     * @param {number} index 节点索引
     */
    diffProps(oldProps, newProps, index) {
        const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);
        
        for (const key of allKeys) {
            if (key === 'key' || key === 'ref') continue;
            
            const oldValue = oldProps[key];
            const newValue = newProps[key];
            
            if (oldValue !== newValue) {
                this.operations.push({
                    type: 'PROP',
                    index,
                    key,
                    oldValue,
                    newValue
                });
            }
        }
    }

    /**
     * 比较子节点
     * @param {Array} oldChildren 旧子节点
     * @param {Array} newChildren 新子节点
     * @param {number} parentIndex 父节点索引
     */
    diffChildren(oldChildren, newChildren, parentIndex) {
        const oldMap = this.createKeyMap(oldChildren);
        const newMap = this.createKeyMap(newChildren);
        
        let lastIndex = 0;
        const newChildrenWithIndex = [];
        
        // 处理新子节点
        for (let i = 0; i < newChildren.length; i++) {
            const newChild = newChildren[i];
            const key = this.getKey(newChild);
            
            if (key && oldMap.has(key)) {
                const oldChild = oldMap.get(key);
                const oldIndex = oldChildren.indexOf(oldChild);
                
                if (oldIndex < lastIndex) {
                    this.operations.push({
                        type: 'MOVE',
                        from: oldIndex,
                        to: i,
                        node: newChild
                    });
                }
                
                lastIndex = Math.max(lastIndex, oldIndex);
                this.diffNode(oldChild, newChild, i);
                newChildrenWithIndex.push(newChild);
            } else {
                this.operations.push({
                    type: 'INSERT',
                    index: i,
                    node: newChild
                });
                newChildrenWithIndex.push(newChild);
            }
        }
        
        // 处理删除的节点
        for (const [key, oldChild] of oldMap) {
            if (!newMap.has(key)) {
                this.operations.push({
                    type: 'DELETE',
                    index: oldChildren.indexOf(oldChild),
                    node: oldChild
                });
            }
        }
    }

    /**
     * 创建key映射
     * @param {Array} children 子节点数组
     * @returns {Map} key映射
     */
    createKeyMap(children) {
        const map = new Map();
        children.forEach(child => {
            const key = this.getKey(child);
            if (key) {
                map.set(key, child);
            }
        });
        return map;
    }

    /**
     * 获取节点key
     * @param {VNode} node 节点
     * @returns {string} key值
     */
    getKey(node) {
        if (node && typeof node === 'object' && node.key) {
            return node.key;
        }
        return null;
    }
}

/**
 * 3. Fiber算法实现
 * 基于时间片的增量渲染
 */
class FiberNode {
    constructor(type, props, key) {
        this.type = type;
        this.props = props;
        this.key = key;
        this.child = null;
        this.sibling = null;
        this.return = null;
        this.alternate = null;
        this.effectTag = null;
        this.expirationTime = 0;
    }
}

class FiberScheduler {
    constructor() {
        this.workInProgress = null;
        this.current = null;
        this.nextUnitOfWork = null;
        this.pendingCommit = null;
    }

    /**
     * 开始渲染
     * @param {VNode} element 虚拟DOM元素
     * @param {HTMLElement} container 容器元素
     */
    render(element, container) {
        this.workInProgress = {
            type: 'div',
            props: {},
            children: [element]
        };
        
        this.nextUnitOfWork = this.workInProgress;
        this.scheduleWork();
    }

    /**
     * 调度工作
     */
    scheduleWork() {
        requestIdleCallback(this.performWork.bind(this));
    }

    /**
     * 执行工作
     * @param {Object} deadline 时间片
     */
    performWork(deadline) {
        while (this.nextUnitOfWork && deadline.timeRemaining() > 1) {
            this.nextUnitOfWork = this.performUnitOfWork(this.nextUnitOfWork);
        }
        
        if (this.nextUnitOfWork) {
            this.scheduleWork();
        } else {
            this.commitRoot();
        }
    }

    /**
     * 执行工作单元
     * @param {FiberNode} fiber 当前fiber节点
     * @returns {FiberNode} 下一个工作单元
     */
    performUnitOfWork(fiber) {
        // 开始工作
        this.beginWork(fiber);
        
        // 如果有子节点，返回子节点
        if (fiber.child) {
            return fiber.child;
        }
        
        // 否则返回兄弟节点或父节点
        let nextFiber = fiber;
        while (nextFiber) {
            this.completeWork(nextFiber);
            
            if (nextFiber.sibling) {
                return nextFiber.sibling;
            }
            
            nextFiber = nextFiber.return;
        }
        
        return null;
    }

    /**
     * 开始工作
     * @param {FiberNode} fiber 当前fiber节点
     */
    beginWork(fiber) {
        // 简化的beginWork实现
        if (fiber.type === 'div') {
            // 处理div元素
        } else if (typeof fiber.type === 'function') {
            // 处理函数组件
        }
    }

    /**
     * 完成工作
     * @param {FiberNode} fiber 当前fiber节点
     */
    completeWork(fiber) {
        // 简化的completeWork实现
        if (fiber.effectTag) {
            this.pendingCommit = fiber;
        }
    }

    /**
     * 提交根节点
     */
    commitRoot() {
        if (this.pendingCommit) {
            this.commitWork(this.pendingCommit);
            this.pendingCommit = null;
        }
    }

    /**
     * 提交工作
     * @param {FiberNode} fiber 当前fiber节点
     */
    commitWork(fiber) {
        // 简化的commitWork实现
        if (fiber.effectTag === 'PLACEMENT') {
            // 插入节点
        } else if (fiber.effectTag === 'UPDATE') {
            // 更新节点
        } else if (fiber.effectTag === 'DELETION') {
            // 删除节点
        }
    }
}

/**
 * 4. 组件Diff算法
 */
class ComponentDiff {
    constructor() {
        this.componentMap = new Map();
    }

    /**
     * 注册组件
     * @param {string} name 组件名称
     * @param {Function} component 组件函数
     */
    registerComponent(name, component) {
        this.componentMap.set(name, component);
    }

    /**
     * 比较组件
     * @param {Object} oldComponent 旧组件
     * @param {Object} newComponent 新组件
     * @returns {Array} 差异结果
     */
    diffComponent(oldComponent, newComponent) {
        const diff = [];
        
        // 比较组件类型
        if (oldComponent.type !== newComponent.type) {
            diff.push({
                type: 'COMPONENT_TYPE_CHANGE',
                oldType: oldComponent.type,
                newType: newComponent.type
            });
        }
        
        // 比较props
        const propsDiff = this.diffProps(oldComponent.props, newComponent.props);
        if (propsDiff.length > 0) {
            diff.push({
                type: 'PROPS_CHANGE',
                changes: propsDiff
            });
        }
        
        // 比较state（如果有的话）
        if (oldComponent.state && newComponent.state) {
            const stateDiff = this.diffState(oldComponent.state, newComponent.state);
            if (stateDiff.length > 0) {
                diff.push({
                    type: 'STATE_CHANGE',
                    changes: stateDiff
                });
            }
        }
        
        return diff;
    }

    /**
     * 比较props
     * @param {Object} oldProps 旧props
     * @param {Object} newProps 新props
     * @returns {Array} props差异
     */
    diffProps(oldProps, newProps) {
        const diff = [];
        const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);
        
        for (const key of allKeys) {
            if (oldProps[key] !== newProps[key]) {
                diff.push({
                    key,
                    oldValue: oldProps[key],
                    newValue: newProps[key]
                });
            }
        }
        
        return diff;
    }

    /**
     * 比较state
     * @param {Object} oldState 旧state
     * @param {Object} newState 新state
     * @returns {Array} state差异
     */
    diffState(oldState, newState) {
        const diff = [];
        const allKeys = new Set([...Object.keys(oldState), ...Object.keys(newState)]);
        
        for (const key of allKeys) {
            if (oldState[key] !== newState[key]) {
                diff.push({
                    key,
                    oldValue: oldState[key],
                    newValue: newState[key]
                });
            }
        }
        
        return diff;
    }
}

/**
 * 5. 批量更新算法
 */
class BatchUpdater {
    constructor() {
        this.updateQueue = [];
        this.isBatching = false;
        this.callbacks = [];
    }

    /**
     * 批量更新
     * @param {Function} updateFn 更新函数
     * @param {Function} callback 回调函数
     */
    batchUpdate(updateFn, callback) {
        this.updateQueue.push(updateFn);
        if (callback) {
            this.callbacks.push(callback);
        }
        
        if (!this.isBatching) {
            this.isBatching = true;
            this.flushUpdates();
        }
    }

    /**
     * 刷新更新
     */
    flushUpdates() {
        // 执行所有更新
        this.updateQueue.forEach(updateFn => {
            try {
                updateFn();
            } catch (error) {
                console.error('批量更新错误:', error);
            }
        });
        
        // 清空更新队列
        this.updateQueue = [];
        
        // 执行回调
        this.callbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('批量更新回调错误:', error);
            }
        });
        
        this.callbacks = [];
        this.isBatching = false;
    }
}

/**
 * 6. 性能优化工具
 */
class ReactDiffOptimizer {
    constructor() {
        this.memoCache = new Map();
        this.shouldComponentUpdateCache = new Map();
    }

    /**
     * 记忆化组件
     * @param {Function} component 组件函数
     * @param {Function} areEqual 比较函数
     * @returns {Function} 记忆化组件
     */
    memo(component, areEqual) {
        return (props) => {
            const cacheKey = JSON.stringify(props);
            
            if (this.memoCache.has(cacheKey)) {
                return this.memoCache.get(cacheKey);
            }
            
            const result = component(props);
            this.memoCache.set(cacheKey, result);
            
            return result;
        };
    }

    /**
     * 检查组件是否需要更新
     * @param {Object} component 组件实例
     * @param {Object} nextProps 新的props
     * @param {Object} nextState 新的state
     * @returns {boolean} 是否需要更新
     */
    shouldComponentUpdate(component, nextProps, nextState) {
        const componentKey = component.constructor.name;
        
        if (this.shouldComponentUpdateCache.has(componentKey)) {
            const cached = this.shouldComponentUpdateCache.get(componentKey);
            return cached(nextProps, nextState);
        }
        
        // 默认的浅比较
        const shouldUpdate = this.shallowCompare(component.props, nextProps) ||
                           this.shallowCompare(component.state, nextState);
        
        this.shouldComponentUpdateCache.set(componentKey, () => shouldUpdate);
        return shouldUpdate;
    }

    /**
     * 浅比较
     * @param {Object} obj1 对象1
     * @param {Object} obj2 对象2
     * @returns {boolean} 是否相等
     */
    shallowCompare(obj1, obj2) {
        if (obj1 === obj2) return true;
        if (!obj1 || !obj2) return false;
        
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        
        if (keys1.length !== keys2.length) return false;
        
        for (const key of keys1) {
            if (obj1[key] !== obj2[key]) return false;
        }
        
        return true;
    }

    /**
     * 防抖更新
     * @param {Function} updateFn 更新函数
     * @param {number} delay 延迟时间
     * @returns {Function} 防抖函数
     */
    debounce(updateFn, delay = 100) {
        let timeoutId;
        
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                updateFn.apply(this, args);
            }, delay);
        };
    }

    /**
     * 节流更新
     * @param {Function} updateFn 更新函数
     * @param {number} limit 限制时间
     * @returns {Function} 节流函数
     */
    throttle(updateFn, limit = 100) {
        let inThrottle;
        
        return (...args) => {
            if (!inThrottle) {
                updateFn.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

/**
 * 7. React Diff工具类
 */
class ReactDiffUtils {
    /**
     * 创建虚拟DOM
     * @param {string|Function} type 类型
     * @param {Object} props 属性
     * @param {...any} children 子节点
     * @returns {VNode} 虚拟DOM节点
     */
    static createElement(type, props, ...children) {
        return VNode.createElement(type, props, ...children);
    }

    /**
     * 渲染虚拟DOM
     * @param {VNode} vnode 虚拟DOM节点
     * @param {HTMLElement} container 容器元素
     */
    static render(vnode, container) {
        const element = vnode.render();
        container.appendChild(element);
    }

    /**
     * 比较两个虚拟DOM
     * @param {VNode} oldVNode 旧虚拟DOM
     * @param {VNode} newVNode 新虚拟DOM
     * @returns {Array} 差异操作
     */
    static diff(oldVNode, newVNode) {
        const diff = new ReactDiff();
        return diff.diff(oldVNode, newVNode);
    }

    /**
     * 应用差异操作
     * @param {HTMLElement} element 目标元素
     * @param {Array} operations 操作序列
     */
    static applyDiff(element, operations) {
        operations.forEach(operation => {
            switch (operation.type) {
                case 'REPLACE':
                    this.replaceNode(element, operation);
                    break;
                case 'TEXT':
                    this.updateText(element, operation);
                    break;
                case 'PROP':
                    this.updateProp(element, operation);
                    break;
                case 'INSERT':
                    this.insertNode(element, operation);
                    break;
                case 'DELETE':
                    this.deleteNode(element, operation);
                    break;
                case 'MOVE':
                    this.moveNode(element, operation);
                    break;
            }
        });
    }

    /**
     * 替换节点
     * @param {HTMLElement} element 目标元素
     * @param {Object} operation 操作
     */
    static replaceNode(element, operation) {
        // 实现节点替换逻辑
    }

    /**
     * 更新文本
     * @param {HTMLElement} element 目标元素
     * @param {Object} operation 操作
     */
    static updateText(element, operation) {
        // 实现文本更新逻辑
    }

    /**
     * 更新属性
     * @param {HTMLElement} element 目标元素
     * @param {Object} operation 操作
     */
    static updateProp(element, operation) {
        // 实现属性更新逻辑
    }

    /**
     * 插入节点
     * @param {HTMLElement} element 目标元素
     * @param {Object} operation 操作
     */
    static insertNode(element, operation) {
        // 实现节点插入逻辑
    }

    /**
     * 删除节点
     * @param {HTMLElement} element 目标元素
     * @param {Object} operation 操作
     */
    static deleteNode(element, operation) {
        // 实现节点删除逻辑
    }

    /**
     * 移动节点
     * @param {HTMLElement} element 目标元素
     * @param {Object} operation 操作
     */
    static moveNode(element, operation) {
        // 实现节点移动逻辑
    }
}

// 导出所有类
module.exports = {
    VNode,
    ReactDiff,
    FiberScheduler,
    ComponentDiff,
    BatchUpdater,
    ReactDiffOptimizer,
    ReactDiffUtils
};

// 使用示例
if (require.main === module) {
    console.log('=== React Diff算法示例 ===\n');
    
    // 示例1: 创建虚拟DOM
    console.log('1. 创建虚拟DOM示例:');
    const vnode = ReactDiffUtils.createElement('div', { className: 'container' },
        ReactDiffUtils.createElement('h1', { key: 'title' }, 'Hello World'),
        ReactDiffUtils.createElement('p', { key: 'content' }, 'This is a React diff example')
    );
    console.log('虚拟DOM:', vnode);
    console.log();
    
    // 示例2: React Diff算法
    console.log('2. React Diff算法示例:');
    const oldVNode = ReactDiffUtils.createElement('div', { className: 'old' },
        ReactDiffUtils.createElement('span', { key: '1' }, 'Old content')
    );
    const newVNode = ReactDiffUtils.createElement('div', { className: 'new' },
        ReactDiffUtils.createElement('span', { key: '1' }, 'New content'),
        ReactDiffUtils.createElement('span', { key: '2' }, 'Additional content')
    );
    
    const diff = ReactDiffUtils.diff(oldVNode, newVNode);
    console.log('差异结果:', diff);
    console.log();
    
    // 示例3: 组件Diff
    console.log('3. 组件Diff示例:');
    const componentDiff = new ComponentDiff();
    const oldComponent = { type: 'Button', props: { text: 'Click me' }, state: { clicked: false } };
    const newComponent = { type: 'Button', props: { text: 'Click me now' }, state: { clicked: true } };
    
    const componentDiffResult = componentDiff.diffComponent(oldComponent, newComponent);
    console.log('组件差异:', componentDiffResult);
    console.log();
    
    // 示例4: 批量更新
    console.log('4. 批量更新示例:');
    const batchUpdater = new BatchUpdater();
    batchUpdater.batchUpdate(() => {
        console.log('执行更新1');
    });
    batchUpdater.batchUpdate(() => {
        console.log('执行更新2');
    });
    console.log();
    
    // 示例5: 性能优化
    console.log('5. 性能优化示例:');
    const optimizer = new ReactDiffOptimizer();
    const memoizedComponent = optimizer.memo((props) => {
        console.log('渲染组件:', props);
        return props.value;
    });
    
    memoizedComponent({ value: 'test' });
    memoizedComponent({ value: 'test' }); // 应该从缓存中获取
    console.log();
}

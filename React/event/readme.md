# react 事件机制

## JS 事件机制基础

### 事件监听方式

- **DOM0 事件**：直接在HTML元素上绑定事件

  ```html
  <a onclick="doSomething()"></a>
  ```

  缺点：HTML和JS耦合，不好维护

- **DOM2 事件**：使用addEventListener()方法

  ```javascript
  element.addEventListener(type, listener, useCapture)
  ```

  优点：统一管理，可以添加多个监听器

### 事件流机制

- **useCapture 参数**：默认为false（冒泡阶段）
  - `true`：捕获阶段执行
  - `false`：冒泡阶段执行

- **事件流三个阶段**：
  1. **捕获阶段**：从document到目标元素
  2. **目标阶段**：事件到达目标元素
  3. **冒泡阶段**：从目标元素回到document

```javascript
// 捕获阶段示例
document.getElementById('parent').addEventListener('click', function(e){
    console.log('父元素clicked - 捕获阶段');
}, true);

document.getElementById('child').addEventListener('click', function(e){
    console.log('子元素clicked - 捕获阶段');
}, true);
```

### 事件对象属性

- **event.target**：事件发生的目标元素
- **event.currentTarget**：当前处理事件的元素
- **event.type**：事件类型

## 事件委托（Event Delegation）

### 性能优化原理

- 避免为每个子元素单独绑定事件
- 将事件委托给父元素处理
- 减少内存占用和事件监听器数量

### 传统方式 vs 事件委托

```javascript
// 传统方式 - 性能差
const lis = document.querySelectorAll('ul#myList li');
for(let item of lis){
    item.addEventListener('click', function(e){
        console.log(e.target.innerText);
    }, false)
}

// 事件委托 - 性能好
document.getElementById('myList').addEventListener('click', function(e){
    console.log(e.target.innerText);
}, false)
```

### 动态节点处理

事件委托可以有效处理动态添加的元素：

```javascript
// 动态添加节点，无需重新绑定事件
document.getElementById('btn').addEventListener('click', function(e){
    const newLi = document.createElement('li');
    newLi.appendChild(document.createTextNode('item-new'));
    document.getElementById('myList').appendChild(newLi);
    // 新添加的li元素自动具有点击事件处理能力
});
```

## 事件控制方法

### event.preventDefault()

阻止元素的默认行为：

```javascript
// 阻止链接跳转
closeInside.addEventListener('click', function(e){
    e.preventDefault();
    alert('Menu button clicked');
});
```

### event.stopPropagation()

阻止事件冒泡：

```javascript
// 阻止事件冒泡到父元素
toggleBtn.addEventListener('click', function(e){
    e.stopPropagation();
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});
```

### 实际应用场景

```javascript
// 点击页面任何地方关闭菜单
document.addEventListener('click', function(e){
    menu.style.display = 'none';
});

// 菜单内部点击不关闭
closeInside.addEventListener('click', function(e){
    e.preventDefault();
    e.stopPropagation(); // 阻止冒泡到document
    alert('Menu button clicked');
});
```

## 事件委托优势

- **性能优化**
  - 极致将事件委托给最外层元素
  - React大型项目开发中常用
  - 给事件节点event.target添加唯一属性（如data-item）

- **动态节点的事件处理**
  - 滚动到底部，一次新增一堆新元素
  - 事件委托可以有效解决

- **内存管理**
  - 减少事件监听器数量
  - 避免内存泄漏

## React中的事件机制

### SyntheticEvent 合成事件

- **委托到#root**
  - 性能优化框架帮我们做
  - 所有React事件都委托到根节点

- **事件池 Event pooling**
  - 事件对象的回收利用
  - 大型密集交互的应用
  - 最近的版本中又可以安全使用了

### 事件处理最佳实践

- 使用事件委托减少事件监听器
- 合理使用preventDefault和stopPropagation
- 为动态元素添加唯一标识符
- 避免在循环中直接绑定事件
  
## 这篇博客已完成

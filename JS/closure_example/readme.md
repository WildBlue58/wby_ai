# 防抖节流

- 闭包有哪些应用场景?

  - 记忆函数
  - 柯里化
  - 函数防抖
  - 函数节流
  - 私有变量
  - 偏函数

- 类的封装

  - 函数里面返回了对象
  - 对象里面还有方法(public)、属性(public)
  - 其他的函数、变量 在返回对象上不可以直接访问,但在内部可以直接访问 private

- 防抖 debounce
  某段时间内只执行一次，其次的都会被干掉

- 节流 throttle
  每隔单位时间内只执行一次
  onscroll 减少执行次数,一段时间间隔内一定执行一次
  没有必要 scroll 频率去触发，重绘重排触发太多次，页面卡顿
- 类是对象的模板
  - 封装了属性和方法
    - 对内 private 隐私 隐藏业务的复杂性
    - 对外 public 公开的 API 完成工作
  - 抽象的概念
  - new 实例化 一批的对象

## 闭包

- 防抖 debounce
  一段时间内只执行一次
  频繁触发时间 > delay 要停下来，最后一次
  宝
- 节流 throttle
  每隔单位时间内一定执行一次
  技能? FPS
  scroll
- 绑定上下文
  3 种
  - 箭头函数
  - bind
  - that = this
- 事件监听器
- 记忆函数
- 柯里化
- 立即执行函数

## 示例补充

### 1. 防抖 debounce 示例

**基本实现与应用（1.html）**

```js
function debounce(fn, delay) {
  let id = null;
  return function (args) {
    clearTimeout(fn.id);
    fn.id = setTimeout(() => {
      fn(args);
    }, delay);
  };
}

let debounceAjax = debounce(ajax, 200);
inputB.addEventListener("keyup", function (event) {
  debounceAjax(event.target.value);
});
```

**this 指向问题（2.html）**

```js
function debounce(fn, delay) {
  var that = this;
  return function (args) {
    clearTimeout(fn.id);
    fn.id = setTimeout(() => {
      fn.call(that, args);
    }, delay);
  };
}

let obj = {
  count: 0,
  inc: debounce(function (val) {
    console.log((this.count += val));
  }, 500),
};
obj.inc(2);
```

### 2. 节流 throttle 示例（4.html）

```js
function throttle(fn, delay) {
  let last, deferTimer;
  return function (...args) {
    let that = this;
    let now = +new Date();
    if (last && now < last + delay) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(that, args);
      }, delay);
    } else {
      last = now;
      fn.apply(that, args);
    }
  };
}

let throttleAjax = throttle(ajax, 2000);
inputC.addEventListener("keyup", function (e) {
  throttleAjax(e.target.value);
});
```

### 3. 闭包实现私有变量与类封装

**对象工厂模式（1.js）**

```js
function CreateCounter(num) {
  let count = 0;
  return {
    num: num,
    increment: () => {
      count++;
    },
    decrement: () => {
      count--;
    },
    getCount: () => {
      return count;
    },
  };
}
const counter = CreateCounter(1);
counter.increment();
console.log(counter.getCount());
```

**构造函数私有属性（3.html）**

```js
function Book(title, author, year) {
  let _title = title;
  let _author = author;
  let _year = year;
  this.getTitle = () => _title;
  this.getFullInfo = () => `${_title} by ${_author}, published in ${_year}`;
  this.getAuthor = () => _author;
  this.getYear = () => _year;
  this.updateYear = (newYear) => {
    if (typeof newYear === "number" && newYear > 0) {
      _year = newYear;
    }
  };
}
let book = new Book("JavaScript高级程序设计", "Nicholas C. Zakas", 2011);
book.updateYear(2025);
console.log(book.getYear());
```

**闭包工厂函数（7.html）**

```js
const Counter = (function () {
  let count = 0;
  function increment() {
    count++;
    return count;
  }
  function reset() {
    count = 0;
  }
  return function () {
    return {
      getCount: function () {
        return count;
      },
      increment: function () {
        return increment();
      },
      reset: function () {
        reset();
      },
    };
  };
})();
const counter1 = Counter();
const counter2 = Counter();
counter1.increment();
console.log(counter2.getCount());
```

### 4. 闭包与事件监听、this 绑定

**事件监听器中的闭包（5.html）**

```js
const obj = {
  message: "Hello from the object!",
  init: function () {
    const button = document.getElementById("myButton");
    const that = this;
    button.addEventListener("click", function () {
      console.log(that.message);
    });
  },
};
obj.init();
```

**this 绑定的三种方式（6.html）**

```js
const person = {
  name: "Allen",
  sayHello: function () {
    setTimeout(
      function () {
        console.log(`${this.name} say hello!`);
      }.bind(this),
      1000
    );
  },
};
person.sayHello();
```

## 这篇博客已完成
